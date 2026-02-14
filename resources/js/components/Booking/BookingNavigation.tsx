import React from 'react';
import { Box, Typography, Stack, IconButton, Button, Paper, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { WeekInfo } from './interfaces';
import { toFrenchMonth } from './utils';
import CalendarSelector from './CalendarSelector';

const BookingNavigation: React.FC<{week: WeekInfo[], onPrevWeek: () => void, onNextWeek: () => void, onToday: () => void, onBook: () => void, displayBookingForm: boolean, onWeekSelected: (date: moment.Moment) => void}> 
= ({week, onPrevWeek, onNextWeek, onToday, onBook, displayBookingForm, onWeekSelected}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const formatWeekRange = () => {
        const startDate = moment(week[0].ddmmyyyy, "DD/MM/YYYY");
        const endDate = moment(week[6].ddmmyyyy, "DD/MM/YYYY");
        
        if (startDate.month() === endDate.month() && startDate.year() === endDate.year()) {
            return `${startDate.format('D')} – ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        } else if (startDate.year() === endDate.year()) {
            return `${startDate.format('D')} ${toFrenchMonth(startDate.format('MMMM'))} – ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        } else {
            return `${startDate.format('D')} ${toFrenchMonth(startDate.format('MMMM'))} ${startDate.format('YYYY')} – ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        }
    };

    const isCurrentWeek = () => {
        const today = moment();
        const weekStart = moment(week[0].ddmmyyyy, "DD/MM/YYYY");
        const weekEnd = moment(week[6].ddmmyyyy, "DD/MM/YYYY");
        return today.isBetween(weekStart, weekEnd, 'day', '[]');
    };

    const navButtonSx = {
        width: 36, height: 36, borderRadius: 2,
        bgcolor: 'transparent',
        color: 'text.secondary',
        border: `1.5px solid ${theme.palette.divider}`,
        transition: 'all 0.15s ease',
        '&:hover': {
            bgcolor: `${theme.palette.primary.main}10`,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.dark,
        },
    };
    
    return (
        <Paper elevation={0} sx={{ 
            bgcolor: '#fff',
            borderRadius: 3, 
            p: { xs: 2, sm: 2.5 }, 
            mb: 2, 
            mt: 2, 
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 2px 12px rgba(84,73,65,0.05)',
        }}>
            <Box sx={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
            }}>
                {/* Left side: navigation controls */}
                <Box sx={{ 
                    display: 'flex', alignItems: 'center', gap: 1,
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                }}>
                    <IconButton onClick={onPrevWeek} sx={navButtonSx} size="small">
                        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    <Box sx={{ 
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: { xs: 1, sm: 1.5 },
                    }}>
                        <Typography sx={{
                            fontWeight: 600, color: 'text.primary',
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            whiteSpace: 'nowrap',
                        }}>
                            {formatWeekRange()}
                        </Typography>
                        {isCurrentWeek() && (
                            <Chip
                                label="Cette semaine"
                                size="small"
                                sx={{
                                    bgcolor: `${theme.palette.primary.main}12`,
                                    color: theme.palette.primary.dark,
                                    fontWeight: 600, fontSize: '0.65rem',
                                    height: 22, display: { xs: 'none', sm: 'flex' },
                                }}
                            />
                        )}
                    </Box>

                    <IconButton onClick={onNextWeek} sx={navButtonSx} size="small">
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    {!isCurrentWeek() && (
                        <Button
                            variant="text" onClick={onToday} size="small"
                            sx={{
                                color: 'primary.dark', fontWeight: 600, fontSize: '0.78rem',
                                minWidth: 'auto', px: 1.5, borderRadius: 2,
                                '&:hover': { bgcolor: `${theme.palette.primary.main}10` },
                            }}
                        >
                            Aujourd'hui
                        </Button>
                    )}

                    <CalendarSelector 
                        onWeekSelected={onWeekSelected}
                        currentWeek={moment(week[0].ddmmyyyy, "DD/MM/YYYY")}
                    />
                </Box>

                {/* Right side: book button */}
                <Button 
                    variant={displayBookingForm ? 'outlined' : 'contained'} 
                    onClick={onBook}
                    startIcon={displayBookingForm ? <CloseIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        bgcolor: displayBookingForm ? 'transparent' : 'primary.main',
                        color: displayBookingForm ? 'text.secondary' : '#fff',
                        borderColor: displayBookingForm ? theme.palette.divider : 'primary.main',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        fontSize: '0.85rem',
                        boxShadow: displayBookingForm ? 'none' : `0 2px 8px ${theme.palette.primary.main}30`,
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                            bgcolor: displayBookingForm ? `${theme.palette.error.main}08` : 'primary.dark',
                            color: displayBookingForm ? 'error.main' : '#fff',
                            borderColor: displayBookingForm ? theme.palette.error.main : 'primary.dark',
                            boxShadow: displayBookingForm ? 'none' : `0 4px 16px ${theme.palette.primary.main}40`,
                        }
                    }}
                >
                    {displayBookingForm ? 'Annuler' : 'Nouvelle réservation'}
                </Button>
            </Box>
        </Paper>
    );
};

export default BookingNavigation;
