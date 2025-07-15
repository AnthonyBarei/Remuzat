import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
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
                // Adjust duration to show only the part within this week
                const daysInWeek = weekEnd.diff(bookingStart.isBefore(weekStart) ? weekStart : bookingStart, 'days') + 1;
                duration = Math.max(1, daysInWeek);
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
                isStartOutOfWeek: isStartOutOfWeek,
                isEndOutOfWeek: isEndOutOfWeek,
                isGap: false,
                type: booking.type,
                status: booking.status,
                userColor: booking.user?.color_preference || '#2196F3',
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
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await window.axios.delete(`/api/bookings/${bookingId}`);
            if (response.data.success) {
                if (props.onBookingDeleted) {
                    props.onBookingDeleted();
                }
            } else {
                alert('Failed to cancel booking');
            }
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getBookingColor = (type: string, status: string, userColor: string) => {
        if (status === 'cancelled') {
            return { bg: 'transparent', border: userColor, pattern: 'cancelled' };
        }
        
        if (status === 'pending') {
            return { bg: userColor + '20', border: userColor, pattern: 'pending' };
        }
        
        // Approved bookings - all are booking type
        return { bg: '#FF9800', border: '#F57C00', pattern: 'approved' };
    };
    
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid grey', borderRadius: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                {props.week && props.week.map((day, index) => (
                    <Box key={index} sx={{flex: 1, textAlign: 'center', borderLeft: index !== 0 ? '1px solid grey' : ''}}>
                        <Box sx={{borderBottom: '1px solid grey', p: 1}}>
                            <Typography variant={"body2"} sx={{textTransform: 'capitalize'}}>{day.day_of_the_week}</Typography>
                            <Typography variant={"body1"}>{day.day_of_the_month}</Typography>
                        </Box>

                        <Box sx={{height: 500, p: 1}}>
                            {props.loading && index === 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress size={24} />
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
                                        <Grid item sx={{backgroundColor: 'grey', border: '2px solid grey', width: '100%', px: 1, borderRadius: 1}}></Grid>
                                    </Grid>
                                );
                            }
                            
                            const booking = e as BookingDetails;
                            return (
                                <Grid key={idx} container sx={{ml: booking.margin_left, flexBasis: booking.size, maxWidth: booking.size, px: 1, mb: 1}}>
                                    <Grid item sx={{
                                        backgroundColor: getBookingColor(booking.type || 'booking', booking.status || 'pending', booking.userColor || '#2196F3').bg, 
                                        border: `2px solid ${getBookingColor(booking.type || 'booking', booking.status || 'pending', booking.userColor || '#2196F3').border}`, 
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
                                            color: booking.status === 'pending' ? 'inherit' : 'white', 
                                            fontSize: '0.8rem',
                                            fontWeight: booking.status === 'pending' ? 'bold' : 'normal'
                                        }}>
                                            {booking.type} ({booking.duration}d) {booking.status === 'pending' && '(Pending)'}
                                            {booking.isStartOutOfWeek && ' ←'}
                                            {booking.isEndOutOfWeek && ' →'}
                                        </Box>
                                        {booking.status === 'pending' && booking.id && (
                                            <Tooltip title="Cancel booking">
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
    );
};

export default BookingTable;
