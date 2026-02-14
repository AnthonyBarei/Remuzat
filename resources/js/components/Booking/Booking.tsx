import React, { useState, useEffect } from 'react';
import { Alert, Box, Typography, Chip, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Navigation from './BookingNavigation';
import BookingTable from './BookingTable';
import MainLayout from '../Layouts/Main';
import { WeekInfo, BookingInfo } from './interfaces';
import { getCurrentWeekDays, getNextWeekDays, getPreviousWeekDays, getWeekForDate } from './utils';
import BookingAddForm from './BookingAdd';
import Footer from '../common/Footer';
import moment from 'moment';

const week = getCurrentWeekDays();

const Booking: React.FC = () => {
    const theme = useTheme();
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
                params: { start_date: weekStart, end_date: weekEnd }
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
            setError(error.response?.data?.message || 'Impossible de récupérer les réservations.');
        } finally {
            setLoading(false);
            setIsTransitioning(false);
        }
    };

    const onPrevWeek = () => { setIsTransitioning(true); setCurrentWeek(getPreviousWeekDays(currentWeek)); };
    const onNextWeek = () => { setIsTransitioning(true); setCurrentWeek(getNextWeekDays(currentWeek)); };
    const onToday = () => { setIsTransitioning(true); setCurrentWeek(getCurrentWeekDays()); };
    const onWeekSelected = (date: moment.Moment) => { setIsTransitioning(true); setCurrentWeek(getWeekForDate(date.format('YYYY-MM-DD'))); };
    const onBook = () => setDisplayBookingForm(prev => !prev);
    const onBookingCreated = () => { getBookings(); setDisplayBookingForm(false); };

    return (
        <MainLayout>
            {/* Page header */}
            <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: 2.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: `${theme.palette.primary.main}14`,
                        color: theme.palette.primary.dark,
                    }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{
                            fontWeight: 700, color: 'text.primary',
                            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                            lineHeight: 1.2,
                        }}>
                            Réservations
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: 'text.secondary', fontSize: '0.82rem', mt: 0.25,
                        }}>
                            Consultez et gérez les réservations de la semaine
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Navigation 
                week={currentWeek} 
                onPrevWeek={onPrevWeek} 
                onNextWeek={onNextWeek} 
                onToday={onToday} 
                onBook={onBook} 
                displayBookingForm={displayBookingForm}
                onWeekSelected={onWeekSelected}
            />
            
            {displayBookingForm && (
                <BookingAddForm onBookingCreated={onBookingCreated} />
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ 
                transition: 'all 0.3s ease-in-out',
                opacity: isTransitioning ? 0.6 : 1,
                transform: isTransitioning ? 'scale(0.99)' : 'scale(1)',
            }}>
                <BookingTable 
                    week={currentWeek} 
                    bookings={bookings} 
                    loading={loading}
                    onBookingDeleted={getBookings}
                />
            </Box>

            <Box sx={{ mt: 'auto', pt: { xs: 4, sm: 6 }, mx: { xs: -2, sm: -3 }, mb: { xs: -2, sm: -3 } }}>
                <Footer />
            </Box>
        </MainLayout>
    );
};

export default Booking;
