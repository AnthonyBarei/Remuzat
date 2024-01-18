import React from 'react';
import { Box, Typography, Stack, IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { WeekInfo } from './interfaces';

const BookingNavigation: React.FC<{week: WeekInfo[], onPrevWeek: () => void, onNextWeek: () => void, onToday: () => void, onBook: () => void, displayBookingForm: boolean}> 
= ({week, onPrevWeek, onNextWeek, onToday, onBook, displayBookingForm}) => {    
    return (
        <Box sx={{width: '100%'}}>
            <Typography component="h6" variant="h6" gutterBottom sx={{mb: 3}}>
                La semaine du {week[0].day} au {week[6].day} {week[6].month_name} {week[6].year}
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                <Stack spacing={2} direction="row">
                    <IconButton color="primary" onClick={onPrevWeek}><ArrowBackIosNewIcon fontSize="small"/></IconButton>
                    <Button variant="outlined" onClick={onToday}>Aujourd'hui</Button>
                    <IconButton color="primary" onClick={onNextWeek}><ArrowForwardIosIcon fontSize="small"/></IconButton>
                </Stack>

                <Button variant="outlined" onClick={onBook}>{!displayBookingForm ? 'Réserver' : 'Annuler'}</Button>
            </Box>
        </Box>
    );
};

export default BookingNavigation;
