import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';

import { BookingInfo, BookingDetails, WeekInfo, GapDetails } from './interfaces';

interface BookingTableProps {
    week: WeekInfo[];
    bookings: BookingInfo[];
    loading?: boolean;
    onBookingDeleted?: () => void;
}

const BookingTable: React.FC<BookingTableProps> = ({...props}) => {
    const theme = useTheme();
    const [bookingDetails, setBookingDetails] = useState<(BookingDetails|GapDetails)[]>([]);    

    useEffect(() => {
        generateBookingDetails();
    }, [props.bookings]);

    // generate booking elements
    const generateBookingDetails = () => {
        const detailedBookings: (BookingDetails|GapDetails)[] = [];

        props.bookings.forEach((booking, bookingIndex) => {
            // condition to check if booking is in the same week using week state
            const weekStart = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").startOf('isoWeek');
            const weekEnd = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").endOf('isoWeek');
            const bookingStart = moment(booking.start, "YYYY-MM-DD");
            const bookingEnd = moment(booking.end, "YYYY-MM-DD").set({hour: 23, minute: 59, second: 59, millisecond: 999});
            
            // Check if booking overlaps with current week
            if (bookingEnd.isBefore(weekStart) || bookingStart.isAfter(weekEnd)) {
                return;
            }

            let start: string = booking.start;
            let end: string = booking.end;
            let duration: number = booking.duration;            
            let size: string = duration / 7 * 100 + '%';
            let margin_left: string = booking.start_day / 7 * 100 + '%';
            let bookingMode: boolean = false;
            let isEndOutOfWeek: boolean = false;
            let isStartOutOfWeek: boolean = false;            

            // Adjust for bookings that start before the current week
            if (bookingStart.isBefore(weekStart)) {
                const daysInWeek = bookingEnd.diff(weekStart, 'days') + 1;
                duration = Math.min(daysInWeek, 7); // Max 7 days for display
                size = duration / 7 * 100 + '%';
                margin_left = 0 + '%';
                isStartOutOfWeek = true;
            }

            // Check if booking extends beyond current week
            if (bookingEnd.isAfter(weekEnd)) {
                isEndOutOfWeek = true;
                const daysInWeek = weekEnd.diff(bookingStart.isBefore(weekStart) ? weekStart : bookingStart, 'days') + 1;
                duration = Math.min(daysInWeek, 7);
                size = duration / 7 * 100 + '%';
            }

            const details: BookingDetails = {
                id: booking.id,
                start: start,
                end: end,
                start_day: booking.start_day,
                end_day: booking.end_day,
                duration: duration,
                size: size,
                margin_left: margin_left,
                bookingMode: bookingMode,
                isEndOutOfWeek: isEndOutOfWeek,
                isStartOutOfWeek: isStartOutOfWeek,
                isGap: false,
                type: booking.type,
                status: booking.status,
                userColor: booking.user?.color_preference || theme.palette.primary.main,
            };

            detailedBookings.push(details);

            // Add gap if booking doesn't extend to end of week and there are more bookings
            if (booking.gap > 0 && !bookingEnd.isSameOrAfter(weekEnd) && bookingIndex !== props.bookings.length - 1) {
                const gapSize = booking.gap / 7 * 100 + '%';
                
                const gapDetails: GapDetails = {
                    gapSize: gapSize,
                    isGap: true,
                };

                detailedBookings.push(gapDetails);
            }
        });

        setBookingDetails(detailedBookings);
    };

    const handleDeleteBooking = async (bookingId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            return;
        }

        try {
            const response = await window.axios.delete(`/api/reservations/${bookingId}`);
            if (response.data.success) {
                if (props.onBookingDeleted) {
                    props.onBookingDeleted();
                }
            } else {
                alert('Échec de l\'annulation de la réservation');
            }
        } catch (error: any) {
            console.error('Erreur lors de l\'annulation de la réservation :', error);
            alert(error.response?.data?.message || 'Échec de l\'annulation de la réservation');
        }
    };

    const getBookingColor = (type: string, status: string, userColor: string) => {
        if (status === 'cancelled') {
            return { 
                bg: 'transparent', 
                border: theme.palette.error.main, 
                pattern: 'cancelled',
                text: theme.palette.error.main
            };
        }
        
        if (status === 'pending') {
            return { 
                bg: theme.palette.primary.main + '30', 
                border: theme.palette.primary.main, 
                pattern: 'pending',
                text: theme.palette.text.primary
            };
        }
        
        // Approved bookings - all are booking type
        return { 
            bg: theme.palette.success.main, 
            border: theme.palette.text.primary, 
            pattern: 'approved',
            text: theme.palette.background.default
        };
    };
    
    return (
        <Paper elevation={2} sx={{ bgcolor: 'paper.main', borderRadius: 3, p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden'}}>
                <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                    {props.week && props.week.map((day, index) => (
                        <Box key={index} sx={{flex: 1, textAlign: 'center', borderLeft: index !== 0 ? `1px solid ${theme.palette.divider}` : ''}}>
                            <Box sx={{borderBottom: `1px solid ${theme.palette.divider}`, p: 1, bgcolor: 'paper.main'}}>
                                <Typography variant={"body2"} sx={{textTransform: 'capitalize', fontWeight: 600, color: 'text.primary'}}>{day.day_of_the_week}</Typography>
                                <Typography variant={"body1"} sx={{color: 'text.primary'}}>{day.day_of_the_month}</Typography>
                            </Box>

                            <Box sx={{height: 500, p: 1, bgcolor: 'paper.main'}}>
                                {props.loading && index === 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress size={24} sx={{color: 'primary.main'}} />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}

                    <Box sx={{ width: '100%', position: 'absolute', top: 70}}>
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            {bookingDetails.map((e, idx) => {
                                if (e.isGap) {
                                    return (
                                        <Grid key={idx} container sx={{flexBasis: e.gapSize, maxWidth: e.gapSize, px: 1, mb: 1}}>
                                            <Grid item sx={{backgroundColor: 'background.default', border: `2px solid ${theme.palette.divider}`, width: '100%', px: 1, borderRadius: 1}}></Grid>
                                        </Grid>
                                    );
                                }
                                
                                const booking = e as BookingDetails;
                                return (
                                    <Grid key={idx} container sx={{ml: booking.margin_left, flexBasis: booking.size, maxWidth: booking.size, px: 1, mb: 1}}>
                                        <Grid item sx={{
                                            backgroundColor: getBookingColor(booking.type || 'booking', booking.status || 'pending', booking.userColor || theme.palette.primary.main).bg, 
                                            border: `2px solid ${getBookingColor(booking.type || 'booking', booking.status || 'pending', booking.userColor || theme.palette.primary.main).border}`, 
                                            width: '100%', 
                                            px: 1, 
                                            borderRadius: 1, 
                                            borderTopLeftRadius: booking.isStartOutOfWeek ? 0 : '4px', 
                                            borderBottomLeftRadius: booking.isStartOutOfWeek ? 0 : '4px',
                                            borderTopRightRadius: booking.isEndOutOfWeek ? 0 : '4px', 
                                            borderBottomRightRadius: booking.isEndOutOfWeek ? 0 : '4px',
                                            position: 'relative',
                                            minHeight: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundImage: booking.status === 'cancelled' ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)' : 'none',
                                            backgroundSize: '4px 4px',
                                            opacity: booking.status === 'cancelled' ? 0.6 : 1
                                        }}>
                                            <Box sx={{ 
                                                color: getBookingColor(booking.type || 'booking', booking.status || 'pending', booking.userColor || theme.palette.primary.main).text, 
                                                fontSize: '0.8rem',
                                                fontWeight: booking.status === 'pending' ? 'bold' : 'normal'
                                            }}>
                                                {booking.type} ({booking.duration}j) {booking.status === 'pending' && '(En attente)'}
                                                {booking.isStartOutOfWeek && ' ←'}
                                                {booking.isEndOutOfWeek && ' →'}
                                            </Box>
                                            {booking.status === 'pending' && booking.id && (
                                                <Tooltip title="Annuler la réservation">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteBooking(booking.id!)}
                                                        sx={{ 
                                                            color: 'inherit', 
                                                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                                                            p: 0.5
                                                        }}
                                                    >
                                                        <CancelIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default BookingTable;
