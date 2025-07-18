import React, { useState, useEffect } from 'react';
import { Alert, Box } from '@mui/material';
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
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    useEffect(() => {
        getBookings();
    }, [currentWeek]);

    const getBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const weekStartParts = currentWeek[0].ddmmyyyy.split('/');
            const weekEndParts = currentWeek[6].ddmmyyyy.split('/');
            const weekStart = `${weekStartParts[2]}-${weekStartParts[1].padStart(2, '0')}-${weekStartParts[0].padStart(2, '0')}`;
            const weekEnd = `${weekEndParts[2]}-${weekEndParts[1].padStart(2, '0')}-${weekEndParts[0].padStart(2, '0')}`;
            const response = await window.axios.get('/api/reservations', {
                params: {
                    start_date: weekStart,
                    end_date: weekEnd
                }
            });
            if (response.data.success) {
                const transformedBookings: BookingInfo[] = response.data.data.map((booking: any) => ({
                    id: booking.id,
                    start: booking.start.split(' ')[0],
                    end: booking.end.split(' ')[0],
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
                setError('Impossible de récupérer les réservations.');
            }
        } catch (error: any) {
            console.error('Erreur lors de la récupération des réservations :', error);
            setError(error.response?.data?.message || 'Impossible de récupérer les réservations.');
        } finally {
            setLoading(false);
            setIsTransitioning(false);
        }
    };

    const onPrevWeek = () => {
        setIsTransitioning(true);
        const previousWeek = getPreviousWeekDays(currentWeek);
        setCurrentWeek(previousWeek);
    };

    const onNextWeek = () => {
        setIsTransitioning(true);
        const nextWeek = getNextWeekDays(currentWeek);
        setCurrentWeek(nextWeek);
    };

    const onToday = () => {
        setIsTransitioning(true);
        const week = getCurrentWeekDays();
        setCurrentWeek(week);
    };

    const onBook = () => {
        setDisplayBookingForm((displayBookingForm) => !displayBookingForm);
    };

    const onBookingCreated = () => {
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
                <Box sx={{ mb: 2 }}>
                    <Alert severity="error" sx={{ fontWeight: 600 }}>
                        {error}
                    </Alert>
                </Box>
            )}
            <Box sx={{ 
                transition: 'all 0.3s ease-in-out',
                opacity: isTransitioning ? 0.7 : 1,
                transform: isTransitioning ? 'scale(0.98)' : 'scale(1)'
            }}>
                <BookingTable 
                    week={currentWeek} 
                    bookings={bookings} 
                    loading={loading}
                    onBookingDeleted={getBookings}
                />
            </Box>
        </MainLayout>
    );
};

export default Booking;


