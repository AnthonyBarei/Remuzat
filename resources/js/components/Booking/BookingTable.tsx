import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, Chip, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';

import { BookingInfo, BookingDetails, WeekInfo, GapDetails } from './interfaces';
import { toFrenchDay, toFrenchDayFirstLetter } from './utils';
import { useAuth } from '../../context/hooks/useAuth';

interface BookingTableProps {
    week: WeekInfo[];
    bookings: BookingInfo[];
    loading?: boolean;
    onBookingDeleted?: () => void;
}

const BookingTable: React.FC<BookingTableProps> = ({...props}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { user } = useAuth();
    const [bookingDetails, setBookingDetails] = useState<(BookingDetails|GapDetails)[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);

    React.useEffect(() => {
        generateBookingDetails();
    }, [props.week, props.bookings]);

    const canModifyBooking = (booking: BookingDetails): boolean => {
        if (booking.status !== 'pending') return false;
        return booking.added_by === user?.id;
    };

    const isOwnBooking = (booking: BookingDetails): boolean => {
        return booking.added_by === user?.id;
    };

    const generateBookingDetails = () => {
        const detailedBookings: (BookingDetails|GapDetails)[] = [];

        props.bookings.forEach((booking) => {
            const weekStart = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").startOf('isoWeek');
            const weekEnd = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").endOf('isoWeek');
            const bookingStart = moment(booking.start, "YYYY-MM-DD");
            const bookingEnd = moment(booking.end, "YYYY-MM-DD");
            
            if (bookingEnd.isBefore(weekStart) || bookingStart.isAfter(weekEnd)) return;

            const visibleStart = bookingStart.isBefore(weekStart) ? weekStart : bookingStart;
            const visibleEnd = bookingEnd.isAfter(weekEnd) ? weekEnd : bookingEnd;
            const visibleDuration = visibleEnd.diff(visibleStart, 'days') + 1;
            const daysFromWeekStart = visibleStart.diff(weekStart, 'days');
            const marginLeft = (daysFromWeekStart / 7) * 100;
            const size = (visibleDuration / 7) * 100;
            const isStartOutOfWeek = bookingStart.isBefore(weekStart);
            const isEndOutOfWeek = bookingEnd.isAfter(weekEnd);

            const details: BookingDetails = {
                id: booking.id,
                start: booking.start,
                end: booking.end,
                start_day: booking.start_day,
                end_day: booking.end_day,
                duration: booking.duration,
                size: `${size}%`,
                margin_left: `${marginLeft}%`,
                bookingMode: false,
                isEndOutOfWeek,
                isStartOutOfWeek,
                isGap: false,
                type: booking.type,
                status: booking.status,
                userColor: booking.user?.color_preference || getFallbackColor(booking.user?.id || booking.added_by || 0),
                user: booking.user,
                added_by: booking.added_by,
            };

            detailedBookings.push(details);
        });

        setBookingDetails(detailedBookings);
    };

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
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

        try {
            const response = await window.axios.delete(`/api/reservations/${bookingId}`);
            if (response.data.success) {
                props.onBookingDeleted?.();
            } else {
                alert('Échec de l\'annulation de la réservation');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Échec de l\'annulation de la réservation');
        }
        setActionDialogOpen(false);
        setSelectedBooking(null);
    };

    const handleModifyBooking = () => {
        alert('Modification de réservation à implémenter');
        setActionDialogOpen(false);
        setSelectedBooking(null);
    };

    const getBookingColor = (type: string, status: string, userColor: string) => {
        if (status === 'cancelled') {
            return { bg: `${theme.palette.error.light}15`, border: theme.palette.error.main, text: theme.palette.error.dark };
        }
        if (status === 'pending') {
            return { bg: userColor + '20', border: userColor, text: theme.palette.text.primary };
        }
        return { bg: userColor, border: userColor, text: '#fff' };
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'approved': return 'Approuvée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const formatFrenchDate = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    // Get bookings for a specific day (for mobile view)
    const getBookingsForDay = (day: WeekInfo): BookingDetails[] => {
        const dayDate = moment(day.ddmmyyyy, "DD/MM/YYYY");
        return bookingDetails
            .filter(b => !b.isGap)
            .map(b => b as BookingDetails)
            .filter(booking => {
                const start = moment(booking.start, "YYYY-MM-DD");
                const end = moment(booking.end, "YYYY-MM-DD");
                return dayDate.isBetween(start, end, 'day', '[]');
            });
    };

    const isToday = (day: WeekInfo): boolean => {
        return moment(day.ddmmyyyy, "DD/MM/YYYY").isSame(moment(), 'day');
    };

    // ==================== MOBILE LIST VIEW ====================
    const renderMobileView = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {props.week.map((day, dayIndex) => {
                const dayBookings = getBookingsForDay(day);
                const today = isToday(day);

                return (
                    <Box key={dayIndex} sx={{
                        borderRadius: 2,
                        border: `1.5px solid ${today ? theme.palette.primary.main : theme.palette.divider}`,
                        bgcolor: today ? `${theme.palette.primary.main}08` : 'transparent',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                    }}>
                        {/* Day header */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1,
                            bgcolor: today ? `${theme.palette.primary.main}12` : `${theme.palette.background.default}`,
                            borderBottom: dayBookings.length > 0 ? `1px solid ${theme.palette.divider}` : 'none',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    textTransform: 'capitalize',
                                    color: today ? 'primary.dark' : 'text.primary',
                                }}>
                                    {day.day_of_the_week}
                                </Typography>
                                <Typography sx={{
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    color: today ? 'primary.dark' : 'text.secondary',
                                }}>
                                    {day.day_of_the_month}
                                </Typography>
                            </Box>
                            {today && (
                                <Chip 
                                    label="Aujourd'hui" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'primary.main', 
                                        color: '#fff', 
                                        fontWeight: 600, 
                                        fontSize: '0.65rem',
                                        height: 22
                                    }} 
                                />
                            )}
                            {!today && dayBookings.length === 0 && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.7rem' }}>
                                    Libre
                                </Typography>
                            )}
                        </Box>

                        {/* Bookings list */}
                        {dayBookings.length > 0 && (
                            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                {dayBookings.map((booking, i) => {
                                    const userColor = booking.userColor || getFallbackColor(booking.user?.id || booking.added_by || 0);
                                    const colorInfo = getBookingColor(booking.type || 'booking', booking.status || 'pending', userColor);
                                    const isOwn = isOwnBooking(booking);

                                    return (
                                        <Box
                                            key={`${booking.id}-${i}`}
                                            onClick={() => isOwn && handleBookingClick(booking)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                px: 1.5,
                                                py: 1,
                                                borderRadius: 1.5,
                                                bgcolor: colorInfo.bg,
                                                border: `1.5px solid ${colorInfo.border}`,
                                                cursor: isOwn ? 'pointer' : 'default',
                                                opacity: booking.status === 'cancelled' ? 0.7 : 1,
                                                transition: 'all 0.15s ease',
                                                minHeight: 48,
                                                '&:active': isOwn ? { transform: 'scale(0.98)' } : {},
                                            }}
                                        >
                                            {/* Color dot */}
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                                bgcolor: colorInfo.border,
                                            }} />

                                            {/* Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Typography sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        color: booking.status === 'cancelled' ? 'text.secondary' : 'text.primary',
                                                        textDecoration: booking.status === 'cancelled' ? 'line-through' : 'none',
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {booking.user?.firstname} {booking.user?.lastname}
                                                    </Typography>
                                                    {isOwn && (
                                                        <Typography component="span" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                                            (vous)
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.3 }}>
                                                    {booking.duration} jour{booking.duration > 1 ? 's' : ''}
                                                    {' \u2022 '}
                                                    {formatFrenchDate(booking.start)} - {formatFrenchDate(booking.end)}
                                                </Typography>
                                            </Box>

                                            {/* Status chip */}
                                            <Chip
                                                label={getStatusText(booking.status || 'pending')}
                                                size="small"
                                                color={getStatusColor(booking.status || 'pending') as any}
                                                variant="outlined"
                                                sx={{ fontSize: '0.6rem', height: 22, fontWeight: 600, flexShrink: 0 }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );

    // ==================== DESKTOP GRID VIEW ====================
    const gridHeight = isTablet ? 400 : 500;
    const rowHeight = isTablet ? 50 : 70;
    const rowSpacing = Math.max(5, Math.floor(rowHeight * 0.15));

    const renderDesktopView = () => (
        <Box sx={{
            display: 'flex', flexDirection: 'column', width: '100%',
            border: `1px solid ${theme.palette.divider}`, borderRadius: 2.5,
            overflow: 'hidden', position: 'relative',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                {props.week.map((day, index) => {
                    const today = isToday(day);
                    return (
                        <Box key={index} sx={{
                            flex: 1, textAlign: 'center',
                            borderLeft: index !== 0 ? `1px solid ${theme.palette.divider}` : '',
                            position: 'relative', minWidth: 0,
                            bgcolor: today ? `${theme.palette.primary.main}05` : 'transparent',
                        }}>
                            <Box sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                py: 1, px: 0.5,
                                bgcolor: today ? `${theme.palette.primary.main}10` : theme.palette.background.default,
                            }}>
                                {/* Full day name - desktop */}
                                <Typography variant="body2" sx={{
                                    textTransform: 'capitalize', fontWeight: 500, 
                                    color: today ? 'primary.dark' : 'text.secondary',
                                    display: { sm: 'none', md: 'block' }, fontSize: '0.78rem',
                                }}>
                                    {day.day_of_the_week}
                                </Typography>
                                {/* Abbreviated - tablet */}
                                <Typography variant="body2" sx={{
                                    fontWeight: 500, color: today ? 'primary.dark' : 'text.secondary',
                                    display: { xs: 'none', sm: 'block', md: 'none' },
                                    fontSize: '0.72rem', textTransform: 'capitalize',
                                }}>
                                    {day.day_of_the_week?.substring(0, 3)}
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: today ? 'primary.dark' : 'text.primary',
                                    fontSize: { sm: '0.9rem', md: '1.05rem' }, 
                                    fontWeight: today ? 700 : 600,
                                    lineHeight: 1.3,
                                }}>
                                    {day.day_of_the_month}
                                </Typography>
                            </Box>
                            <Box sx={{ height: gridHeight, position: 'relative' }} />
                        </Box>
                    );
                })}

                {/* Booking overlay */}
                <Box sx={{ position: 'absolute', top: 70, left: 0, right: 0, height: gridHeight, pointerEvents: 'none' }}>
                    <Box sx={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
                        {(() => {
                            const rows: BookingDetails[][] = [];
                            bookingDetails.forEach((e) => {
                                if (e.isGap) return;
                                const booking = e as BookingDetails;
                                let placed = false;
                                for (let ri = 0; ri < rows.length; ri++) {
                                    const canPlace = rows[ri].every(eb => {
                                        return moment(booking.end, "YYYY-MM-DD").isBefore(moment(eb.start, "YYYY-MM-DD"))
                                            || moment(booking.start, "YYYY-MM-DD").isAfter(moment(eb.end, "YYYY-MM-DD"));
                                    });
                                    if (canPlace) { rows[ri].push(booking); placed = true; break; }
                                }
                                if (!placed) rows.push([booking]);
                            });

                            return rows.map((row, rowIndex) => (
                                <Box key={rowIndex} sx={{
                                    position: 'absolute', top: `${rowIndex * (rowHeight + rowSpacing)}px`,
                                    left: 0, right: 0, height: `${rowHeight}px`,
                                    display: 'flex', alignItems: 'center',
                                }}>
                                    {row.map((booking, bi) => {
                                        const userColor = booking.userColor || getFallbackColor(booking.user?.id || booking.added_by || 0);
                                        const colorInfo = getBookingColor(booking.type || 'booking', booking.status || 'pending', userColor);
                                        const isOwn = isOwnBooking(booking);

                                        return (
                                            <Box key={bi} sx={{
                                                position: 'absolute', left: booking.margin_left, width: booking.size,
                                                height: `${rowHeight - 6}px`, px: 0.5, zIndex: 1,
                                            }}>
                                                <Box sx={{
                                                    backgroundColor: colorInfo.bg,
                                                    border: `2px solid ${colorInfo.border}`,
                                                    width: '100%', height: '100%',
                                                    px: 1.5, py: 0.5, borderRadius: 1.5,
                                                    borderTopLeftRadius: booking.isStartOutOfWeek ? 0 : 6,
                                                    borderBottomLeftRadius: booking.isStartOutOfWeek ? 0 : 6,
                                                    borderTopRightRadius: booking.isEndOutOfWeek ? 0 : 6,
                                                    borderBottomRightRadius: booking.isEndOutOfWeek ? 0 : 6,
                                                    position: 'relative', display: 'flex', alignItems: 'center',
                                                    opacity: booking.status === 'cancelled' ? 0.7 : 1,
                                                    cursor: isOwn ? 'pointer' : 'default',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': isOwn ? {
                                                        transform: 'scale(1.02)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 2,
                                                    } : {},
                                                }}
                                                onClick={() => isOwn && handleBookingClick(booking)}
                                                >
                                                    <Box sx={{
                                                        color: colorInfo.text,
                                                        fontWeight: booking.status === 'pending' ? 'bold' : 'normal',
                                                        textAlign: 'left', lineHeight: 1.2, width: '100%',
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                    }}>
                                                        <Box sx={{
                                                            fontWeight: 600, mb: 0.3,
                                                            fontSize: { sm: '0.7rem', md: '0.8rem' },
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            display: 'flex', alignItems: 'center', gap: 0.5,
                                                        }}>
                                                            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {booking.user?.firstname} {booking.user?.lastname}
                                                                {isOwn && (
                                                                    <Box component="span" sx={{ fontSize: '0.6rem', ml: 0.5, opacity: 0.8, fontStyle: 'italic' }}>
                                                                        (vous)
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            <Box component="span" sx={{ fontSize: { sm: '0.6rem', md: '0.7rem' }, opacity: 0.9, fontWeight: 'normal', flexShrink: 0 }}>
                                                                {booking.duration}j
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{
                                                            fontSize: { sm: '0.6rem', md: '0.65rem' }, opacity: 0.8, fontStyle: 'italic',
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {getStatusText(booking.status || 'pending')}
                                                        </Box>
                                                    </Box>
                                                    {booking.status === 'cancelled' && (
                                                        <Box sx={{
                                                            position: 'absolute', top: -2, right: -2, width: 14, height: 14,
                                                            borderRadius: '50%', backgroundColor: theme.palette.error.main,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.5rem', color: 'white', fontWeight: 'bold',
                                                        }}>
                                                            ✕
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ));
                        })()}
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    // ==================== MAIN RENDER ====================
    return (
        <Paper elevation={0} sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: { xs: 1.5, sm: 2, md: 2.5 },
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 2px 12px rgba(84,73,65,0.05)',
            position: 'relative',
        }}>
            {/* Loading overlay */}
            {props.loading && (
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    bgcolor: 'rgba(255,255,255,0.8)', zIndex: 10, borderRadius: 3,
                }}>
                    <CircularProgress size={36} sx={{ color: 'primary.main' }} />
                </Box>
            )}

            {/* Conditional render: mobile list vs desktop grid */}
            {isMobile ? renderMobileView() : renderDesktopView()}

            {/* Action Dialog */}
            <Dialog
                open={actionDialogOpen}
                onClose={() => setActionDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Gérer la réservation
                </DialogTitle>
                <DialogContent>
                    {selectedBooking && (
                        <Stack spacing={1.5} sx={{ mt: 1 }}>
                            <Typography variant="body1">
                                <strong>Client:</strong> {selectedBooking.user?.firstname} {selectedBooking.user?.lastname}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Durée:</strong> {selectedBooking.duration} jour{selectedBooking.duration > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Statut:</strong>{' '}
                                <Chip
                                    label={getStatusText(selectedBooking.status || 'pending')}
                                    size="small"
                                    color={getStatusColor(selectedBooking.status || 'pending') as any}
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Typography>
                            <Typography variant="body1">
                                <strong>Période:</strong> {formatFrenchDate(selectedBooking.start)} - {formatFrenchDate(selectedBooking.end)}
                            </Typography>
                            {isOwnBooking(selectedBooking) && (
                                <Box sx={{ p: 1.5, bgcolor: `${theme.palette.info.main}12`, borderRadius: 2, border: `1px solid ${theme.palette.info.main}30` }}>
                                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                        Cette réservation vous appartient.
                                        {selectedBooking.status === 'pending' && ' Vous pouvez la modifier ou l\'annuler.'}
                                        {selectedBooking.status === 'approved' && ' Elle a été approuvée. Vous pouvez l\'annuler.'}
                                        {selectedBooking.status === 'cancelled' && ' Elle a été annulée.'}
                                    </Typography>
                                </Box>
                            )}
                            {!isOwnBooking(selectedBooking) && (
                                <Box sx={{ p: 1.5, bgcolor: `${theme.palette.warning.main}12`, borderRadius: 2, border: `1px solid ${theme.palette.warning.main}30` }}>
                                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                        Cette réservation appartient à {selectedBooking.user?.firstname} {selectedBooking.user?.lastname}.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button onClick={() => setActionDialogOpen(false)} fullWidth={isMobile} sx={{ order: { xs: 3, sm: 0 } }}>
                        Fermer
                    </Button>
                    {selectedBooking && isOwnBooking(selectedBooking) && ['pending', 'approved'].includes(selectedBooking.status || '') && (
                        <>
                            {selectedBooking.status === 'pending' && (
                                <Button onClick={handleModifyBooking} color="primary" variant={isMobile ? 'outlined' : 'text'} fullWidth={isMobile}>
                                    Modifier
                                </Button>
                            )}
                            <Button
                                onClick={() => selectedBooking.id && handleDeleteBooking(selectedBooking.id)}
                                color="error"
                                variant={isMobile ? 'contained' : 'text'}
                                fullWidth={isMobile}
                            >
                                Annuler la réservation
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BookingTable;
