import React, { useState, useRef } from 'react';
import { Button, Box, Grid, FormControl, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputLabel, MenuItem, Select } from '@mui/material';
import moment from 'moment';

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
            setError('Please select both start and end dates');
            setLoading(false);
            return;
        }

        if (startDate > endDate) {
            setError('End date must be after start date');
            setLoading(false);
            return;
        }

        try {
            // get form data
            const formData = new FormData(event.currentTarget);

            // convert form data to json
            const data = Object.fromEntries(formData.entries());

            const params = {
                start_date: moment(startDate).format('YYYY-MM-DD'),
                end_date: moment(endDate).format('YYYY-MM-DD'),
                type: data.type,
            };

            const response = await window.axios.post('/api/bookings', params);
            
            if (response.data.success) {
                setError(null); // Clear any existing error message
                setSuccess('Booking created successfully!');
                // Reset form
                setStartDate(null);
                setEndDate(null);
                formRef.current?.reset();
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
                
                // Call callback to refresh bookings immediately
                if (onBookingCreated) {
                    onBookingCreated();
                }
            } else {
                setSuccess(null); // Clear any existing success message
                setError(response.data.message || 'Failed to create booking');
            }
        } catch (error: any) {
            console.error('Error creating booking:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create booking';
            setError(errorMessage);
            setSuccess(null); // Clear any existing success message
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        // Clear any existing error messages
        setError(null);
        // Reset end date if it's before the new start date
        if (date && endDate && date > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        // Clear any existing error messages
        setError(null);
    };

    return (
        <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={{width: '100%', mb: 3}}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            <Grid container spacing={2} alignItems={'center'}>
                <Grid item>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        slotProps={{textField: {size: 'small'}}}
                        format='DD-MM-YYYY'
                        name="start_date"
                        disabled={loading}
                    />
                </Grid>

                <Grid item>
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        slotProps={{textField: {size: 'small'}}}
                        format='DD-MM-YYYY'
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
                        variant="outlined"
                        disabled={loading || !startDate || !endDate}
                    >
                        {loading ? 'Creating...' : 'Add Booking'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingAddForm;
