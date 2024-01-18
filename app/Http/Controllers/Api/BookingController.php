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
            $start = date('Y-m-d', strtotime($request->input('start_date')));
            $end = date('Y-m-d', strtotime($request->input('end_date')));
            $end = date('Y-m-d 23:59:59', strtotime($end)); // make sure end is at 23:59:59

            // get the day number of start date
            $start_day = date('N', strtotime($start));

            // get the number of days between start and end
            $gap = date_diff(date_create($start), date_create($end))->format('%a');

            // duration is the number of days between start and end + 1
            $duration = $gap + 1;

            $type = $request->input('type'); // should be 'vacation' or 'meeting'

            // get the user id of the user who added the booking
            $added_by = auth()->user()->id;


            // TODO : verify previous values definition


            $booking = new Booking;
            $booking->start = $request->input('start');
            $booking->end = $request->input('end');
            $booking->start_day = $request->input('start_day');
            $booking->gap = $request->input('gap');
            $booking->duration = $request->input('duration');
            $booking->type = $request->input('type');
            $booking->added_by = $request->input('added_by');
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
