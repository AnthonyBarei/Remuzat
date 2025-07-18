import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/fr';

import { BookingInfo, BookingDetails, WeekInfo, GapDetails } from './interfaces';
import { useAuth } from '../../context/hooks/useAuth';

// Set French locale for moment
moment.locale('fr');

interface BookingTableProps {
    week: WeekInfo[];
    bookings: BookingInfo[];
    loading?: boolean;
    onBookingDeleted?: () => void;
}

const BookingTable: React.FC<BookingTableProps> = ({...props}) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [bookingDetails, setBookingDetails] = useState<(BookingDetails|GapDetails)[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);

    useEffect(() => {
        generateBookingDetails();
    }, [props.bookings]);

    // Check if current user can modify this booking
    const canModifyBooking = (booking: BookingDetails): boolean => {
        // Only pending bookings can be modified
        if (booking.status !== 'pending') {
            return false;
        }
        
        // User can only modify their own bookings
        const currentUserId = (user as any)?.id;
        return booking.added_by === currentUserId;
    };

    // Check if current user owns this booking (for any interaction)
    const isOwnBooking = (booking: BookingDetails): boolean => {
        const currentUserId = (user as any)?.id;
        return booking.added_by === currentUserId;
    };

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
            
            // Calculate margin_left based on actual date difference from week start
            // instead of using start_day which is day-of-year
            const daysFromWeekStart = bookingStart.diff(weekStart, 'days');
            let margin_left: string = Math.max(0, daysFromWeekStart) / 7 * 100 + '%';
            
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
                userColor: booking.user?.color_preference || getFallbackColor(booking.user?.id || booking.added_by || 0),
                user: booking.user,
                added_by: booking.added_by,
            };

            detailedBookings.push(details);

            // Remove gap display - gaps should be invisible
            // if (booking.gap > 0 && !bookingEnd.isSameOrAfter(weekEnd) && bookingIndex !== props.bookings.length - 1) {
            //     const gapSize = booking.gap / 7 * 100 + '%';
            //     
            //     const gapDetails: GapDetails = {
            //         gapSize: gapSize,
            //         isGap: true,
            //     };

            //     detailedBookings.push(gapDetails);
            // }
        });

        setBookingDetails(detailedBookings);
    };

    // Generate a color based on user ID if no color preference is set
    const getFallbackColor = (userId: number): string => {
        const colors = [
            '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336',
            '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#009688',
            '#E91E63', '#673AB7', '#795548', '#607D8B', '#FFC107'
        ];
        return colors[userId % colors.length];
    };

    const handleBookingClick = (booking: BookingDetails) => {
        setSelectedBooking(booking);
        setActionDialogOpen(true);
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
        setActionDialogOpen(false);
        setSelectedBooking(null);
    };

    const handleModifyBooking = () => {
        // TODO: Implement booking modification
        alert('Modification de réservation à implémenter');
        setActionDialogOpen(false);
        setSelectedBooking(null);
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
            // Use user's color preference with transparency for pending bookings
            return { 
                bg: userColor + '20', // 20% opacity
                border: userColor, 
                pattern: 'pending',
                text: theme.palette.text.primary
            };
        }
        
        // Approved bookings - use user's color preference
        return { 
            bg: userColor, 
            border: userColor, 
            pattern: 'approved',
            text: theme.palette.background.default
        };
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'approved':
                return 'Approuvée';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    const formatFrenchDate = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY');
    };
    
    return (
        <Paper elevation={2} sx={{ 
            bgcolor: 'paper.main', 
            borderRadius: 3, 
            p: 3, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            border: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease-in-out'
        }}>
            <Box sx={{
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%', 
                border: `1px solid ${theme.palette.divider}`, 
                borderRadius: 2, 
                overflow: 'hidden', 
                position: 'relative',
                transition: 'all 0.3s ease-in-out'
            }}>
                {/* Centered loading overlay */}
                {props.loading && (
                    <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        bgcolor: 'rgba(255,255,255,0.8)', 
                        zIndex: 10,
                        borderRadius: 2
                    }}>
                        <CircularProgress size={40} sx={{color: 'primary.main'}} />
                    </Box>
                )}

                <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                    {props.week && props.week.map((day, index) => (
                        <Box key={index} sx={{flex: 1, textAlign: 'center', borderLeft: index !== 0 ? `1px solid ${theme.palette.divider}` : ''}}>
                            <Box sx={{borderBottom: `1px solid ${theme.palette.divider}`, p: 1, bgcolor: 'paper.main'}}>
                                <Typography variant={"body2"} sx={{textTransform: 'capitalize', fontWeight: 600, color: 'text.primary'}}>{day.day_of_the_week}</Typography>
                                <Typography variant={"body1"} sx={{color: 'text.primary'}}>{day.day_of_the_month}</Typography>
                            </Box>

                            <Box sx={{height: 500, p: 1, bgcolor: 'paper.main'}}>
                                {/* Removed individual column loading */}
                            </Box>
                        </Box>
                    ))}

                    <Box sx={{ width: '100%', position: 'absolute', top: 70}}>
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            {bookingDetails.map((e, idx) => {
                                if (e.isGap) {
                                    // Don't render gaps - they should be invisible
                                    return null;
                                }
                                
                                const booking = e as BookingDetails;
                                // Use user's color preference or generate a fallback color based on user ID
                                const userColor = booking.userColor || getFallbackColor(booking.user?.id || booking.added_by || 0);
                                const colorInfo = getBookingColor(booking.type || 'booking', booking.status || 'pending', userColor);
                                const canModify = canModifyBooking(booking);
                                const isOwn = isOwnBooking(booking);
                                
                                return (
                                    <Grid key={idx} container sx={{
                                        ml: booking.margin_left, 
                                        flexBasis: booking.size, 
                                        maxWidth: booking.size, 
                                        px: 1, 
                                        mb: 1,
                                        transition: 'all 0.3s ease-in-out'
                                    }}>
                                        <Grid item sx={{
                                            backgroundColor: colorInfo.bg, 
                                            border: `2px solid ${colorInfo.border}`, 
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
                                            justifyContent: 'center',
                                            backgroundImage: booking.status === 'cancelled' ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)' : 'none',
                                            backgroundSize: '4px 4px',
                                            opacity: booking.status === 'cancelled' ? 0.6 : 1,
                                            cursor: isOwn ? 'pointer' : 'default',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': isOwn ? {
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                            } : {}
                                        }}
                                        onClick={() => isOwn && handleBookingClick(booking)}
                                        >
                                            <Box sx={{ 
                                                color: colorInfo.text, 
                                                fontSize: '0.75rem',
                                                fontWeight: booking.status === 'pending' ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                lineHeight: 1.2
                                            }}>
                                                <Box sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {booking.user?.firstname} {booking.user?.lastname}
                                                    {isOwn && (
                                                        <Box component="span" sx={{ 
                                                            fontSize: '0.6rem', 
                                                            ml: 0.5, 
                                                            opacity: 0.8,
                                                            fontStyle: 'italic'
                                                        }}>
                                                            (vous)
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                                                    {booking.duration} jour{booking.duration > 1 ? 's' : ''}
                                                </Box>
                                                <Box sx={{ fontSize: '0.65rem', opacity: 0.8, fontStyle: 'italic' }}>
                                                    {getStatusText(booking.status || 'pending')}
                                                </Box>
                                                {(booking.isStartOutOfWeek || booking.isEndOutOfWeek) && (
                                                    <Box sx={{ fontSize: '0.6rem', opacity: 0.7 }}>
                                                        {booking.isStartOutOfWeek && '←'} {booking.isEndOutOfWeek && '→'}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Action Dialog */}
            <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Gérer la réservation
                </DialogTitle>
                <DialogContent>
                    {selectedBooking && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Client:</strong> {selectedBooking.user?.firstname} {selectedBooking.user?.lastname}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Durée:</strong> {selectedBooking.duration} jour{selectedBooking.duration > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Statut:</strong> {getStatusText(selectedBooking.status || 'pending')}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Période:</strong> {formatFrenchDate(selectedBooking.start)} - {formatFrenchDate(selectedBooking.end)}
                            </Typography>
                            {isOwnBooking(selectedBooking) && (
                                <Typography variant="body2" sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText' }}>
                                    ✓ Cette réservation vous appartient.
                                    {selectedBooking.status === 'pending' && ' Vous pouvez la modifier ou l\'annuler.'}
                                    {selectedBooking.status === 'approved' && ' Elle a été approuvée.'}
                                    {selectedBooking.status === 'cancelled' && ' Elle a été annulée.'}
                                </Typography>
                            )}
                            {!isOwnBooking(selectedBooking) && (
                                <Typography variant="body2" sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1, color: 'warning.contrastText' }}>
                                    ⚠ Cette réservation appartient à {selectedBooking.user?.firstname} {selectedBooking.user?.lastname}.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialogOpen(false)}>
                        Fermer
                    </Button>
                    {selectedBooking && isOwnBooking(selectedBooking) && selectedBooking.status === 'pending' && (
                        <>
                            <Button onClick={handleModifyBooking} color="primary">
                                Modifier
                            </Button>
                            <Button onClick={() => selectedBooking.id && handleDeleteBooking(selectedBooking.id)} color="error">
                                Annuler
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BookingTable;
