import React, { useState } from 'react';
import Navigation from './BookingNavigation';
import BookingTable from './BookingTable';
import MainLayout from '../Layouts/Main';
import { generateBookings, getCurrentWeekDays, BookingInfo, WeekInfo } from './utils';

const week = getCurrentWeekDays();
const random_bookings = generateBookings();

const Booking: React.FC = () => {
    const [currentWeek, setCurrentWeek] = useState<WeekInfo[]>(week); // Array of 7 Date objects
    const [bookings, setBookings] = useState<BookingInfo[]>(random_bookings);

    const onPrevWeek = () => {
        // Logic to update currentWeek to previous week
    };

    const onNextWeek = () => {
        // Logic to update currentWeek to next week
    };

    const onToday = () => {
        // Logic to update currentWeek to the current week
    };

    return (
        <MainLayout>
            <Navigation week={currentWeek} onPrevWeek={onPrevWeek} onNextWeek={onNextWeek} onToday={onToday}/>
            <BookingTable week={currentWeek} bookings={bookings}/>
        </MainLayout>
    );
};

export default Booking;


