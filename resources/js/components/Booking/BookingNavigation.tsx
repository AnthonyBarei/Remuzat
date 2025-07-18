import React from 'react';
import { Box, Typography, Stack, IconButton, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import moment from 'moment';
import 'moment/locale/fr';
import { WeekInfo } from './interfaces';

// Set French locale for moment
moment.locale('fr');

const BookingNavigation: React.FC<{week: WeekInfo[], onPrevWeek: () => void, onNextWeek: () => void, onToday: () => void, onBook: () => void, displayBookingForm: boolean}> 
= ({week, onPrevWeek, onNextWeek, onToday, onBook, displayBookingForm}) => {
    const theme = useTheme();
    
    // Format the week range in French
    const formatWeekRange = () => {
        const startDate = moment(week[0].ddmmyyyy, "DD/MM/YYYY");
        const endDate = moment(week[6].ddmmyyyy, "DD/MM/YYYY");
        
        // If same month and year
        if (startDate.month() === endDate.month() && startDate.year() === endDate.year()) {
            return `Semaine du ${startDate.format('D')} au ${endDate.format('D MMMM YYYY')}`;
        }
        // If different months but same year
        else if (startDate.year() === endDate.year()) {
            return `Semaine du ${startDate.format('D MMMM')} au ${endDate.format('D MMMM YYYY')}`;
        }
        // If different years
        else {
            return `Semaine du ${startDate.format('D MMMM YYYY')} au ${endDate.format('D MMMM YYYY')}`;
        }
    };
    
    return (
        <Paper elevation={2} sx={{ 
            bgcolor: 'paper.main', 
            borderRadius: 3, 
            p: 3, 
            mb: 3, 
            mt: 3, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            border: `1px solid ${theme.palette.divider}` 
        }}>
            <Typography component="h6" variant="h6" gutterBottom sx={{
                mb: 3, 
                color: 'text.primary', 
                fontWeight: 600
            }}>
                {formatWeekRange()}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                <Stack spacing={2} direction="row">
                    <IconButton 
                        color="primary" 
                        onClick={onPrevWeek} 
                        sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'primary.contrastText', 
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        <ArrowBackIosNewIcon fontSize="small"/>
                    </IconButton>
                    <Button 
                        variant="outlined" 
                        onClick={onToday} 
                        sx={{ 
                            borderColor: 'primary.main', 
                            color: 'primary.main', 
                            fontWeight: 600, 
                            borderRadius: 2, 
                            bgcolor: 'background.default', 
                            '&:hover': { 
                                bgcolor: 'primary.main', 
                                color: 'primary.contrastText', 
                                borderColor: 'primary.main' 
                            } 
                        }}
                    >
                        Aujourd'hui
                    </Button>
                    <IconButton 
                        color="primary" 
                        onClick={onNextWeek} 
                        sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'primary.contrastText', 
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="small"/>
                    </IconButton>
                </Stack>
                <Button 
                    variant={displayBookingForm ? 'outlined' : 'contained'} 
                    onClick={onBook}
                    sx={{
                        bgcolor: displayBookingForm ? 'transparent' : 'primary.main',
                        color: displayBookingForm ? 'primary.main' : 'primary.contrastText',
                        borderColor: 'primary.main',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            color: 'primary.contrastText',
                            borderColor: 'primary.dark'
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
