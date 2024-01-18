import React, { useState } from 'react';
import { Button, Box, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const BookingAddForm: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.target);

        // get form data
        const formData = new FormData(event.currentTarget);

        // convert form data to json
        const data = Object.fromEntries(formData.entries());

        const params = {
            start_date: data.start_date,
            end_date: data.end_date,
        };

        window.axios.post('/api/bookings', params)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{width: '100%', mb: 3}}>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid item>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        slotProps={{textField: {size: 'small'}}}
                        format='DD-MM-YYYY'
                        name="start_date"
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
                    />
                </Grid>

                <Grid item>
                    <Button type="submit" variant="outlined">
                        Add Booking
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingAddForm;
