import React, { useState, useEffect } from 'react';
import Navigation from './BookingNavigation';
import BookingTable from './BookingTable';
import MainLayout from '../Layouts/Main';
import { WeekInfo, BookingInfo } from './interfaces';
import { generateBookings, getCurrentWeekDays, getNextWeekDays, getPreviousWeekDays } from './utils';
import BookingAddForm from './BookingAdd';

const week = getCurrentWeekDays();
const random_bookings = generateBookings();

const Booking: React.FC = () => {
    const [currentWeek, setCurrentWeek] = useState<WeekInfo[]>(week); // Array of 7 Date objects
    const [bookings, setBookings] = useState<BookingInfo[]>(random_bookings);
    const [displayBookingForm, setDisplayBookingForm] = useState<boolean>(false);

    useEffect(() => {
        getBookings();
    }, [currentWeek]);

    const getBookings = () => {
        // fetch bookings from API
        const bookings = generateBookings();
        setBookings(bookings);
    };

    const onPrevWeek = () => {
        const previousWeek = getPreviousWeekDays(currentWeek);
        setCurrentWeek(previousWeek);
    };

    const onNextWeek = () => {
        const nextWeek = getNextWeekDays(currentWeek);
        setCurrentWeek(nextWeek);
    };

    const onToday = () => {
        const week = getCurrentWeekDays();
        setCurrentWeek(week);
    };

    const onBook = () => {
        setDisplayBookingForm((displayBookingForm) => !displayBookingForm);
    };

    return (
        <MainLayout>
            <Navigation week={currentWeek} onPrevWeek={onPrevWeek} onNextWeek={onNextWeek} onToday={onToday} onBook={onBook} displayBookingForm={displayBookingForm}/>
            {displayBookingForm && (
                <BookingAddForm/>
            )}
            <BookingTable week={currentWeek} bookings={bookings}/>
        </MainLayout>
    );
};

export default Booking;


