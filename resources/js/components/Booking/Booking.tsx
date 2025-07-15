import React, { useState, useEffect } from 'react';
import Navigation from './BookingNavigation';
import BookingTable from './BookingTable';
import MainLayout from '../Layouts/Main';
import { WeekInfo, BookingInfo } from './interfaces';
import { getCurrentWeekDays, getNextWeekDays, getPreviousWeekDays } from './utils';
import BookingAddForm from './BookingAdd';

const week = getCurrentWeekDays();

const Booking: React.FC = () => {
    const [currentWeek, setCurrentWeek] = useState<WeekInfo[]>(week);
    const [bookings, setBookings] = useState<BookingInfo[]>([]);
    const [displayBookingForm, setDisplayBookingForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getBookings();
    }, [currentWeek]);

    const getBookings = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Get the start and end dates of the current week
            // Convert from DD/MM/YYYY to YYYY-MM-DD format
            const weekStartParts = currentWeek[0].ddmmyyyy.split('/');
            const weekEndParts = currentWeek[6].ddmmyyyy.split('/');
            
            const weekStart = `${weekStartParts[2]}-${weekStartParts[1].padStart(2, '0')}-${weekStartParts[0].padStart(2, '0')}`;
            const weekEnd = `${weekEndParts[2]}-${weekEndParts[1].padStart(2, '0')}-${weekEndParts[0].padStart(2, '0')}`;
            

            
            const response = await window.axios.get('/api/bookings', {
                params: {
                    start_date: weekStart,
                    end_date: weekEnd
                }
            });
            
            if (response.data.success) {
                // Transform API data to match frontend interface
                const transformedBookings: BookingInfo[] = response.data.data.map((booking: any) => ({
                    id: booking.id,
                    start: booking.start.split(' ')[0], // Extract date part only
                    end: booking.end.split(' ')[0], // Extract date part only
                    start_day: booking.start_day,
                    end_day: booking.end_day,
                    gap: booking.gap,
                    duration: booking.duration,
                    type: booking.type,
                    status: booking.status,
                    added_by: booking.added_by,
                    validated_by: booking.validated_by,
                    user: booking.user
                }));
                
                setBookings(transformedBookings);
            } else {
                setError('Failed to fetch bookings');
            }
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            setError(error.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
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

    const onBookingCreated = () => {
        // Refresh bookings after a new booking is created
        getBookings();
        setDisplayBookingForm(false);
    };

    return (
        <MainLayout>
            <Navigation 
                week={currentWeek} 
                onPrevWeek={onPrevWeek} 
                onNextWeek={onNextWeek} 
                onToday={onToday} 
                onBook={onBook} 
                displayBookingForm={displayBookingForm}
            />
            {displayBookingForm && (
                <BookingAddForm onBookingCreated={onBookingCreated} />
            )}
            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
            <BookingTable 
                week={currentWeek} 
                bookings={bookings} 
                loading={loading}
                onBookingDeleted={getBookings}
            />
        </MainLayout>
    );
};

export default Booking;


