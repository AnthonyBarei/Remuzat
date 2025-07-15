<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Support\Facades\Auth;

class BookingController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $query = Booking::with(['user', 'validatedBy']);
            
            // Filter by date range if provided - load bookings that overlap with the week
            if ($request->has('start_date') && $request->has('end_date')) {
                $weekStart = $request->input('start_date') . ' 00:00:00';
                $weekEnd = $request->input('end_date') . ' 23:59:59';
                
                $query->where(function($q) use ($weekStart, $weekEnd) {
                    // Bookings that start within the week
                    $q->whereBetween('start', [$weekStart, $weekEnd])
                      // OR bookings that end within the week
                      ->orWhereBetween('end', [$weekStart, $weekEnd])
                      // OR bookings that span the entire week (start before and end after)
                      ->orWhere(function($subQ) use ($weekStart, $weekEnd) {
                          $subQ->where('start', '<=', $weekStart)
                               ->where('end', '>=', $weekEnd);
                      });
                });
            }
            
            // Filter by user if provided
            if ($request->has('user_id')) {
                $query->where('added_by', $request->input('user_id'));
            }
            
            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->input('type'));
            }
            
            $bookings = $query->orderBy('start', 'asc')->get();
            
            return $this->sendResponse($bookings, 'Bookings retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve bookings.', [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // validate incoming request
        $this->validate($request, [
            'start_date' => 'required|string',
            'end_date' => 'required|string|after_or_equal:start_date',
            'type' => 'required|string|in:booking',
        ]);

        try {
            // start with start date at midnight
            $start = date('Y-m-d 00:00:00', strtotime($request->input('start_date')));
            $end = date('Y-m-d 23:59:59', strtotime($request->input('end_date')));

            // Check for overlapping bookings
            $overlapping = Booking::where(function($query) use ($start, $end) {
                $query->whereBetween('start', [$start, $end])
                      ->orWhereBetween('end', [$start, $end])
                      ->orWhere(function($q) use ($start, $end) {
                          $q->where('start', '<=', $start)
                            ->where('end', '>=', $end);
                      });
            })->exists();

            if ($overlapping) {
                return $this->sendError('Booking overlaps with existing booking.', [], 422);
            }

            // get the day number of start date (1=Monday, 7=Sunday)
            $start_day = date('N', strtotime($start));
            $end_day = date('N', strtotime($end));

            // duration of the booking in days
            $duration = floor((strtotime($end) - strtotime($start)) / (60 * 60 * 24)) + 1;

            // gap between end date and next monday
            $gap = 7 - date('N', strtotime($end));

            $type = $request->input('type');

            // get the user id of the user who added the booking
            $added_by = Auth::user()->id;

            $booking = new Booking;
            $booking->start = $start;
            $booking->end = $end;
            $booking->start_day = $start_day;
            $booking->end_day = $end_day;
            $booking->gap = $gap;
            $booking->duration = $duration;
            $booking->type = $type;
            $booking->status = 'pending';
            $booking->added_by = $added_by;
            $booking->save();

            // Load relationships for response
            $booking->load(['user', 'validatedBy']);

            // return successful response
            return $this->sendResponse($booking, 'Booking created successfully.');
        } catch (\Exception $e) {
            // return error message
            return $this->sendError('Booking creation failed.', [], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function show(Booking $booking)
    {
        try {
            $booking->load(['user', 'validatedBy']);
            return $this->sendResponse($booking, 'Booking retrieved successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking.', [], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Booking $booking)
    {
        // Check if user can update this booking
        if ($booking->added_by !== Auth::user()->id && !Auth::user()->is_admin) {
            return $this->sendError('Unauthorized to update this booking.', [], 403);
        }

        // validate incoming request
        $this->validate($request, [
            'start_date' => 'sometimes|required|string',
            'end_date' => 'sometimes|required|string|after_or_equal:start_date',
            'type' => 'sometimes|required|string|in:booking',
        ]);

        try {
            $updateData = [];

            if ($request->has('start_date')) {
                $start = date('Y-m-d 00:00:00', strtotime($request->input('start_date')));
                $updateData['start'] = $start;
                $updateData['start_day'] = date('N', strtotime($start));
            }

            if ($request->has('end_date')) {
                $end = date('Y-m-d 23:59:59', strtotime($request->input('end_date')));
                $updateData['end'] = $end;
                $updateData['end_day'] = date('N', strtotime($end));
                $updateData['gap'] = 7 - date('N', strtotime($end));
            }

            if ($request->has('start_date') || $request->has('end_date')) {
                $start = $updateData['start'] ?? $booking->start;
                $end = $updateData['end'] ?? $booking->end;
                $updateData['duration'] = floor((strtotime($end) - strtotime($start)) / (60 * 60 * 24)) + 1;
            }

            if ($request->has('type')) {
                $updateData['type'] = $request->input('type');
            }

            // Check for overlapping bookings (excluding current booking)
            if (isset($updateData['start']) || isset($updateData['end'])) {
                $start = $updateData['start'] ?? $booking->start;
                $end = $updateData['end'] ?? $booking->end;
                
                $overlapping = Booking::where('id', '!=', $booking->id)
                    ->where(function($query) use ($start, $end) {
                        $query->whereBetween('start', [$start, $end])
                              ->orWhereBetween('end', [$start, $end])
                              ->orWhere(function($q) use ($start, $end) {
                                  $q->where('start', '<=', $start)
                                    ->where('end', '>=', $end);
                              });
                    })->exists();

                if ($overlapping) {
                    return $this->sendError('Booking overlaps with existing booking.', [], 422);
                }
            }

            $booking->update($updateData);
            $booking->load(['user', 'validatedBy']);

            return $this->sendResponse($booking, 'Booking updated successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Booking update failed.', [], 500);
        }
    }

    /**
     * Cancel the specified booking.
     *
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function destroy(Booking $booking)
    {
        try {
            // Check if user can cancel this booking
            if ($booking->added_by !== Auth::user()->id && !Auth::user()->is_admin) {
                return $this->sendError('Unauthorized to cancel this booking.', [], 403);
            }

            // Only allow cancellation of pending bookings
            if ($booking->status !== 'pending') {
                return $this->sendError('Only pending bookings can be cancelled.', [], 422);
            }

            $booking->status = 'cancelled';
            $booking->save();
            
            $booking->load(['user', 'validatedBy']);
            return $this->sendResponse($booking, 'Booking cancelled successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Booking cancellation failed.', [], 500);
        }
    }
}
