import React from 'react';
import { Box, Typography, Stack, IconButton, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import moment from 'moment';
import { WeekInfo } from './interfaces';
import { toFrenchMonth } from './utils';
import CalendarSelector from './CalendarSelector';

const BookingNavigation: React.FC<{week: WeekInfo[], onPrevWeek: () => void, onNextWeek: () => void, onToday: () => void, onBook: () => void, displayBookingForm: boolean, onWeekSelected: (date: moment.Moment) => void}> 
= ({week, onPrevWeek, onNextWeek, onToday, onBook, displayBookingForm, onWeekSelected}) => {
    const theme = useTheme();
    
    // Format the week range in French
    const formatWeekRange = () => {
        const startDate = moment(week[0].ddmmyyyy, "DD/MM/YYYY");
        const endDate = moment(week[6].ddmmyyyy, "DD/MM/YYYY");
        
        // If same month and year
        if (startDate.month() === endDate.month() && startDate.year() === endDate.year()) {
            return `Semaine du ${startDate.format('D')} au ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        }
        // If different months but same year
        else if (startDate.year() === endDate.year()) {
            return `Semaine du ${startDate.format('D')} ${toFrenchMonth(startDate.format('MMMM'))} au ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        }
        // If different years
        else {
            return `Semaine du ${startDate.format('D')} ${toFrenchMonth(startDate.format('MMMM'))} ${startDate.format('YYYY')} au ${endDate.format('D')} ${toFrenchMonth(endDate.format('MMMM'))} ${endDate.format('YYYY')}`;
        }
    };
    
    return (
        <Paper elevation={2} sx={{ 
            bgcolor: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 3, 
            p: 3, 
            mb: 3, 
            mt: 3, 
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)', 
            border: `1px solid ${theme.palette.divider}` 
        }}>
            <Typography component="h6" variant="h6" gutterBottom sx={{
                mb: 3, 
                color: 'secondary.main', 
                fontWeight: 700
            }}>
                {formatWeekRange()}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                <Stack spacing={2} direction="row">
                    <IconButton 
                        color="secondary" 
                        onClick={onPrevWeek} 
                        sx={{ 
                            bgcolor: 'secondary.main', 
                            color: 'secondary.contrastText', 
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'secondary.dark'
                            }
                        }}
                    >
                        <ArrowBackIosNewIcon fontSize="small"/>
                    </IconButton>
                    <Button 
                        variant="outlined" 
                        onClick={onToday} 
                        sx={{ 
                            borderColor: 'secondary.main', 
                            color: 'secondary.main', 
                            fontWeight: 600, 
                            borderRadius: 2, 
                            bgcolor: 'transparent', 
                            '&:hover': { 
                                bgcolor: 'secondary.main', 
                                color: 'secondary.contrastText', 
                                borderColor: 'secondary.main' 
                            } 
                        }}
                    >
                        Aujourd'hui
                    </Button>
                    <IconButton 
                        color="secondary" 
                        onClick={onNextWeek} 
                        sx={{ 
                            bgcolor: 'secondary.main', 
                            color: 'secondary.contrastText', 
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'secondary.dark'
                            }
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="small"/>
                    </IconButton>
                    <CalendarSelector 
                        onWeekSelected={onWeekSelected}
                        currentWeek={moment(week[0].ddmmyyyy, "DD/MM/YYYY")}
                    />
                </Stack>
                <Button 
                    variant={displayBookingForm ? 'outlined' : 'contained'} 
                    onClick={onBook}
                    sx={{
                        bgcolor: displayBookingForm ? 'transparent' : 'secondary.main',
                        color: displayBookingForm ? 'secondary.main' : 'secondary.contrastText',
                        borderColor: 'secondary.main',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                            bgcolor: displayBookingForm ? 'secondary.main' : 'secondary.dark',
                            color: 'secondary.contrastText',
                            borderColor: displayBookingForm ? 'secondary.main' : 'secondary.dark'
                        }
                    }}
                >
                    {!displayBookingForm ? 'Réserver' : 'Annuler'}
                </Button>
            </Box>
        </Paper>
    );
};

export default BookingNavigation;
