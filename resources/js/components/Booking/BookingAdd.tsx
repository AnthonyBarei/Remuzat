import React, { useState, useRef } from 'react';
import { Button, Box, Grid, FormControl, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputLabel, MenuItem, Select } from '@mui/material';
import moment from 'moment';
import 'moment/locale/fr';

// Set French locale for moment
moment.locale('fr');

// Extend Window interface to include axios
declare global {
    interface Window {
        axios: any;
    }
}

interface BookingAddFormProps {
    onBookingCreated?: () => void;
}

const BookingAddForm: React.FC<BookingAddFormProps> = ({ onBookingCreated }) => {
    const theme = useTheme();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validate dates
        if (!startDate || !endDate) {
            setError('Veuillez sélectionner une date de début et de fin.');
            setLoading(false);
            return;
        }

        if (startDate > endDate) {
            setError('La date de fin doit être après la date de début.');
            setLoading(false);
            return;
        }

        try {
            // get form data
            const formData = new FormData(event.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const params = {
                start_date: moment(startDate).format('YYYY-MM-DD'),
                end_date: moment(endDate).format('YYYY-MM-DD'),
                type: data.type,
            };
            const response = await window.axios.post('/api/reservations', params);
            if (response.data.success) {
                console.log('Booking created successfully:', response.data);
                setError(null);
                setSuccess('Réservation créée avec succès !');
                setStartDate(null);
                setEndDate(null);
                formRef.current?.reset();
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
                if (onBookingCreated) {
                    onBookingCreated();
                }
            } else {
                setSuccess(null);
                setError(response.data.message || 'Échec de la création de la réservation.');
            }
        } catch (error: any) {
            console.error('Erreur lors de la création :', error);
            const errorMessage = error.response?.data?.message || 'Échec de la création de la réservation.';
            setError(errorMessage);
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        setError(null);
        if (date && endDate && date > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        setError(null);
    };

    return (
        <Paper elevation={2} sx={{ 
            bgcolor: 'paper.main', 
            borderRadius: 3, 
            p: 3, 
            mb: 3, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            border: `1px solid ${theme.palette.divider}` 
        }}>
            <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={{width: '100%'}}>
                {error && (
                    <Alert severity="error" sx={{ 
                        mb: 2, 
                        bgcolor: 'error.main' + '10', 
                        color: 'error.main', 
                        border: `1px solid ${theme.palette.error.main}30` 
                    }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ 
                        mb: 2, 
                        bgcolor: 'success.main' + '10', 
                        color: 'success.main', 
                        border: `1px solid ${theme.palette.success.main}30` 
                    }}>
                        {success}
                    </Alert>
                )}
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item>
                        <DatePicker
                            label="Date de début"
                            value={startDate}
                            onChange={handleStartDateChange}
                            slotProps={{textField: {size: 'small'}}}
                            format='DD/MM/YYYY'
                            name="start_date"
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="Date de fin"
                            value={endDate}
                            onChange={handleEndDateChange}
                            slotProps={{textField: {size: 'small'}}}
                            format='DD/MM/YYYY'
                            name="end_date"
                            disabled={loading}
                            minDate={startDate || undefined}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="booking-type-select-label">Type</InputLabel>
                            <Select
                                labelId="booking-type-select-label"
                                id="booking-type-select"
                                label="Type"
                                name="type"
                                disabled={loading}
                                defaultValue="booking"
                            >
                                <MenuItem value="booking">Réservation</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={loading || !startDate || !endDate}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    color: 'primary.contrastText'
                                }
                            }}
                        >
                            {loading ? 'Création...' : 'Ajouter'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default BookingAddForm;
