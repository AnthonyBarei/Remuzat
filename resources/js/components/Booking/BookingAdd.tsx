import React, { useState, useRef } from 'react';
import { Button, Box, Grid, FormControl, Alert, Paper, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputLabel, MenuItem, Select } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

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
            const formData = new FormData(event.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const params = {
                start_date: moment(startDate).format('YYYY-MM-DD'),
                end_date: moment(endDate).format('YYYY-MM-DD'),
                type: data.type,
            };
            const response = await window.axios.post('/api/reservations', params);
            if (response.data.success) {
                setError(null);
                setSuccess('Réservation créée avec succès !');
                setStartDate(null);
                setEndDate(null);
                formRef.current?.reset();
                setTimeout(() => setSuccess(null), 3000);
                if (onBookingCreated) onBookingCreated();
            } else {
                setSuccess(null);
                setError(response.data.message || 'Échec de la création de la réservation.');
            }
        } catch (error: any) {
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
        if (date && endDate && date > endDate) setEndDate(null);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        setError(null);
    };

    const duration = startDate && endDate
        ? moment(endDate).diff(moment(startDate), 'days') + 1
        : null;

    return (
        <Paper elevation={0} sx={{ 
            bgcolor: `${theme.palette.primary.main}06`,
            borderRadius: 3, 
            p: { xs: 2, sm: 2.5 }, 
            mb: 2, 
            border: `1px solid ${theme.palette.primary.main}25`,
        }}>
            <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 600, color: 'primary.dark', fontSize: '0.85rem',
                    }}>
                        Nouvelle réservation
                        {duration && duration > 0 && (
                            <Typography component="span" sx={{
                                ml: 1, fontWeight: 500, color: 'text.secondary', fontSize: '0.78rem',
                            }}>
                                ({duration} jour{duration > 1 ? 's' : ''})
                            </Typography>
                        )}
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md="auto">
                            <DatePicker
                                label="Date d'arrivée"
                                value={startDate}
                                onChange={handleStartDateChange}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                format='DD/MM/YYYY'
                                name="start_date"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md="auto">
                            <DatePicker
                                label="Date de départ"
                                value={endDate}
                                onChange={handleEndDateChange}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                format='DD/MM/YYYY'
                                name="end_date"
                                disabled={loading}
                                minDate={startDate || undefined}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md="auto">
                            <FormControl variant="outlined" size="small" fullWidth>
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
                        <Grid item xs={12} sm={6} md="auto">
                            <Button 
                                type="submit" 
                                variant="contained"
                                fullWidth
                                disabled={loading || !startDate || !endDate}
                                startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: '#fff',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 3,
                                    boxShadow: `0 2px 8px ${theme.palette.primary.main}25`,
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                        boxShadow: `0 4px 12px ${theme.palette.primary.main}35`,
                                    }
                                }}
                            >
                                {loading ? 'Création...' : 'Réserver'}
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </Paper>
    );
};

export default BookingAddForm;
