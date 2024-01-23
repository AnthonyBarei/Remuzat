<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;

class BookingController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
            'end_date' => 'required|string',
            'type' => 'required|string',
        ]);

        try {
            // start with start date at midnigth
            $start = date('Y-m-d 00:00:00', strtotime($request->input('start_date')));
            $end = date('Y-m-d 23:59:59', strtotime($request->input('end_date')));

            // get the day number of start date
            $start_day = date('N', strtotime($start));

            // duration of the booking in days
            $duration = floor((strtotime($end) - strtotime($start)) / (60 * 60 * 24)) + 1;

            // gap between end date and next monday
            $gap = 7 - date('N', strtotime($end));

            $type = $request->input('type'); // should be 'vacation' or 'meeting'

            // get the user id of the user who added the booking
            $added_by = auth()->user()->id;

            $booking = new Booking;
            $booking->start = $start;
            $booking->end = $end;
            $booking->start_day = $start_day;
            $booking->gap = $gap;
            $booking->duration = $duration;
            $booking->type = $type;
            $booking->added_by = $added_by;
            $booking->save();

            // return successful response
            return $this->sendResponse($booking->toArray(), 'Booking created successfully.');
        } catch (\Exception $e) {
            // return error message
            return $this->sendError('Booking creation failed.');
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
