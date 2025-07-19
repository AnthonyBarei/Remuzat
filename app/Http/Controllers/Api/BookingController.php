<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

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
            
            return $this->sendResponse($bookings, 'Réservations récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Impossible de récupérer les réservations.', [], 500);
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

            // get the user id of the user who added the booking
            $added_by = Auth::user()->id;

            // Check for overlapping bookings
            $overlapping = Booking::where('status', '!=', 'cancelled') // Don't check against cancelled bookings
                ->where(function($query) use ($start, $end) {
                    $query->whereBetween('start', [$start, $end])
                          ->orWhereBetween('end', [$start, $end])
                          ->orWhere(function($q) use ($start, $end) {
                              $q->where('start', '<=', $start)
                                ->where('end', '>=', $end);
                          });
                })->get();

            if ($overlapping->isNotEmpty()) {
                // Check if any overlapping bookings are from the same user
                $sameUserOverlap = $overlapping->where('added_by', $added_by)->first();
                if ($sameUserOverlap) {
                    return $this->sendError('Vous ne pouvez pas créer une réservation qui chevauche vos propres réservations.', [], 422);
                }

                // If overlapping with other users, allow but warn admin
                $overlappingUsers = $overlapping->map(function($booking) {
                    return $booking->user->firstname . ' ' . $booking->user->lastname;
                })->implode(', ');

                // Set status to pending for admin validation
                $status = 'pending';
            } else {
                $status = 'pending';
            }

            // get the day number of start date (1=Monday, 7=Sunday)
            $start_day = date('N', strtotime($start));
            $end_day = date('N', strtotime($end));

            // duration of the booking in days
            $duration = floor((strtotime($end) - strtotime($start)) / (60 * 60 * 24)) + 1;

            // gap between end date and next monday
            $gap = 7 - date('N', strtotime($end));

            $type = $request->input('type');

            $booking = new Booking;
            $booking->start = $start;
            $booking->end = $end;
            $booking->start_day = $start_day;
            $booking->end_day = $end_day;
            $booking->gap = $gap;
            $booking->duration = $duration;
            $booking->type = $type;
            $booking->status = $status;
            $booking->added_by = $added_by;
            $booking->save();

            // Load relationships for response
            $booking->load(['user', 'validatedBy']);

            // Check if there was an overlap warning
            if ($overlapping->isNotEmpty()) {
                return $this->sendResponse([
                    'booking' => $booking,
                    'overlap_warning' => true,
                    'overlapping_users' => $overlappingUsers,
                    'message' => 'Attention: Cette réservation chevauche les réservations de: ' . $overlappingUsers . '. La réservation sera en attente de validation.'
                ], 'Réservation créée avec chevauchement détecté.');
            }

            // return successful response
            return $this->sendResponse($booking, 'Réservation créée avec succès.');
        } catch (\Exception $e) {
            // return error message
            return $this->sendError('Échec de la création de la réservation.', [], 500);
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
            return $this->sendResponse($booking, 'Réservation récupérée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Impossible de récupérer la réservation.', [], 500);
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
            return $this->sendError('Non autorisé à modifier cette réservation.', [], 403);
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
                    return $this->sendError('La réservation chevauche une réservation existante.', [], 422);
                }
            }

            $booking->update($updateData);
            $booking->load(['user', 'validatedBy']);

            return $this->sendResponse($booking, 'Réservation mise à jour avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Échec de la mise à jour de la réservation.', [], 500);
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
                return $this->sendError('Non autorisé à annuler cette réservation.', [], 403);
            }

            // Allow cancellation of pending and approved bookings
            if (!in_array($booking->status, ['pending', 'approved'])) {
                return $this->sendError('Seules les réservations en attente ou approuvées peuvent être annulées.', [], 422);
            }

            $booking->status = 'cancelled';
            $booking->save();
            
            $booking->load(['user', 'validatedBy']);
            return $this->sendResponse($booking, 'Réservation annulée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Échec de l\'annulation de la réservation.', [], 500);
        }
    }

    /**
     * Update the specified resource in storage (admin version).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function adminUpdate(Request $request, Booking $booking)
    {
        if (Gate::denies('update', $booking)) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        // validate incoming request
        $this->validate($request, [
            'start_date' => 'sometimes|required|string',
            'end_date' => 'sometimes|required|string|after_or_equal:start_date',
            'type' => 'sometimes|required|string|in:booking',
            'status' => 'sometimes|required|string|in:pending,approved,cancelled',
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

            if ($request->has('status')) {
                $updateData['status'] = $request->input('status');
                // If status is being changed to approved, set validated_by
                if ($request->input('status') === 'approved' && $booking->status !== 'approved') {
                    $updateData['validated_by'] = Auth::user()->id;
                }
            }

            // Check for overlapping bookings (excluding current booking)
            if (isset($updateData['start']) || isset($updateData['end'])) {
                $start = $updateData['start'] ?? $booking->start;
                $end = $updateData['end'] ?? $booking->end;
                
                $overlapping = Booking::where('id', '!=', $booking->id)
                    ->where('status', '!=', 'cancelled') // Don't check against cancelled bookings
                    ->where(function($query) use ($start, $end) {
                        $query->whereBetween('start', [$start, $end])
                              ->orWhereBetween('end', [$start, $end])
                              ->orWhere(function($q) use ($start, $end) {
                                  $q->where('start', '<=', $start)
                                    ->where('end', '>=', $end);
                              });
                    })->get();

                if ($overlapping->isNotEmpty()) {
                    // Check if any overlapping bookings are from the same user
                    $sameUserOverlap = $overlapping->where('added_by', $booking->added_by)->first();
                    if ($sameUserOverlap) {
                        return $this->sendError('Vous ne pouvez pas créer une réservation qui chevauche vos propres réservations.', [], 422);
                    }

                    // If overlapping with other users, allow but warn admin
                    $overlappingUsers = $overlapping->map(function($booking) {
                        return $booking->user->firstname . ' ' . $booking->user->lastname;
                    })->implode(', ');

                    return $this->sendResponse([
                        'booking' => $booking,
                        'overlap_warning' => true,
                        'overlapping_users' => $overlappingUsers,
                        'message' => 'Attention: Cette réservation chevauche les réservations de: ' . $overlappingUsers . '. La réservation sera en attente de validation.'
                    ], 'Réservation modifiée avec chevauchement détecté.');
                }
            }

            $booking->update($updateData);
            $booking->load(['user', 'validatedBy']);

            return $this->sendResponse($booking, 'Réservation modifiée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Échec de la mise à jour de la réservation.', [], 500);
        }
    }

    /**
     * Get all reservations for admin panel with filtering and pagination.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function adminIndex(Request $request)
    {
        if (Gate::denies('viewAny', Booking::class)) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            $query = Booking::with(['user', 'validatedBy']);

            // Filter by status
            if ($request->has('status') && $request->input('status') !== '') {
                $query->where('status', $request->input('status'));
            }

            // Filter by search term (guest name or email)
            if ($request->has('search') && $request->input('search') !== '') {
                $search = $request->input('search');
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                      ->orWhere('lastname', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by date range
            if ($request->has('start_date') && $request->input('start_date')) {
                $query->where('start', '>=', $request->input('start_date') . ' 00:00:00');
            }

            if ($request->has('end_date') && $request->input('end_date')) {
                $query->where('end', '<=', $request->input('end_date') . ' 23:59:59');
            }

            // Get paginated results
            $perPage = $request->input('per_page', 10);
            $bookings = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Check for overlaps for each booking
            $bookings->getCollection()->transform(function ($booking) {
                $overlapping = Booking::where('id', '!=', $booking->id)
                    ->where('status', '!=', 'cancelled')
                    ->where(function($query) use ($booking) {
                        $query->whereBetween('start', [$booking->start, $booking->end])
                              ->orWhereBetween('end', [$booking->start, $booking->end])
                              ->orWhere(function($q) use ($booking) {
                                  $q->where('start', '<=', $booking->start)
                                    ->where('end', '>=', $booking->end);
                              });
                    })->exists();

                $booking->has_overlap = $overlapping;
                return $booking;
            });

            // Filter by overlaps if requested
            if ($request->has('show_overlaps') && $request->input('show_overlaps') === 'true') {
                $bookings->setCollection($bookings->getCollection()->filter(function ($booking) {
                    return $booking->has_overlap;
                }));
            }

            return $this->sendResponse($bookings, 'Réservations récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Impossible de récupérer les réservations.', [], 500);
        }
    }

    /**
     * Approve a reservation (admin only).
     *
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function approve(Booking $booking)
    {
        if (Gate::denies('update', $booking)) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            if ($booking->status !== 'pending') {
                return $this->sendError('Seules les réservations en attente peuvent être approuvées.', [], 422);
            }

            $booking->status = 'approved';
            $booking->validated_by = Auth::user()->id;
            $booking->save();

            $booking->load(['user', 'validatedBy']);
            return $this->sendResponse($booking, 'Réservation approuvée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Échec de l\'approbation de la réservation.', [], 500);
        }
    }

    /**
     * Reject a reservation (admin only).
     *
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function reject(Booking $booking)
    {
        if (Gate::denies('update', $booking)) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            if ($booking->status !== 'pending') {
                return $this->sendError('Seules les réservations en attente peuvent être rejetées.', [], 422);
            }

            $booking->status = 'cancelled';
            $booking->validated_by = Auth::user()->id;
            $booking->save();

            $booking->load(['user', 'validatedBy']);
            return $this->sendResponse($booking, 'Réservation rejetée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Échec du rejet de la réservation.', [], 500);
        }
    }

    /**
     * Get reservation statistics for admin dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function statistics()
    {
        if (Gate::denies('viewAny', Booking::class)) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            $stats = [
                'pending' => Booking::where('status', 'pending')->count(),
                'approved' => Booking::where('status', 'approved')->count(),
                'cancelled' => Booking::where('status', 'cancelled')->count(),
                'total' => Booking::count(),
            ];

            return $this->sendResponse($stats, 'Statistiques récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Impossible de récupérer les statistiques.', [], 500);
        }
    }
}
