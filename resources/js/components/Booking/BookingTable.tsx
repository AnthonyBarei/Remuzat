import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';

import { BookingInfo, BookingDetails, WeekInfo } from './utils';

interface BookingTableProps {
    week: WeekInfo[];
    bookings: BookingInfo[];
}

const BookingTable: React.FC<BookingTableProps> = ({...props}) => {
    const [week, setWeek] = useState<WeekInfo[]>(props.week);
    const [bookings, setBookings] = useState<BookingInfo[]>(props.bookings);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails[]>([]);    

    useEffect(() => {
        generateBookingDetails();
    }, []);

    // generate booking elements
    const generateBookingDetails = () => {
        console.log('-------------------------');
        const detailedBookings: BookingDetails[] = [];
        let previousBooking: BookingInfo;

        console.log(bookings);
        

        bookings.forEach((booking, bookingIndex) => {
            // condition to check if booking is in the same week using week state
            const weekStart = week[0].moment.startOf('week');
            const weekEnd = week[0].moment.endOf('week');

            console.log(weekStart, '|', weekEnd, '|', booking.moment_start, '|', booking.moment_end);
            

            if (!(booking.moment_start.isSameOrAfter(weekStart) && booking.moment_start.isSameOrBefore(weekEnd)) && // Booking starts during the week
                !(booking.moment_end.isSameOrAfter(weekStart) && booking.moment_end.isSameOrBefore(weekEnd)) && // Booking ends during the week
                !(booking.moment_start.isBefore(weekStart) && booking.moment_end.isAfter(weekEnd))) { // Booking starts before and ends after the week
                // The booking should not be displayed this week
                return;
            }

            let start: string = booking.start;
            let end: string = booking.end;
            let duration: number = booking.duration;
            let size: string = duration / 7 * 100 + '%';
            let margin_left: string = booking.gap * 100 / 7 + '%';
            let bookingMode: boolean = false;
            let isEndOutOfWeek: boolean = false;
            let isStartOutOfWeek: boolean = false;            


            if (moment(start).isBefore(week[0].moment.startOf('week'))) {
                duration = moment(end).diff(week[0].moment.startOf('week'), 'days');
                size = duration / 7 * 100 + '%';
                margin_left = 0 + '%';
                isStartOutOfWeek = true;
            }

            // if (moment(end).isAfter(week[0].moment.endOf('week'))) {
            //     isEndOutOfWeek = true;
            // }
            
            console.log(
                start, '|',
                end, '|',
                'start_day: ' + booking.start_day, '|',
                'gap: ' + booking.gap, '|',
                'duration: ' + duration, '|',
                'size: ' + size, '|',
                'marginl: ' + margin_left, '|',
                'isStartOutOfWeek: ' + isStartOutOfWeek, '|',
                'isEndOutOfWeek: ' + isEndOutOfWeek, '|',
            );
            
            previousBooking = booking;

            detailedBookings.push({
                start: start,
                end: end,
                duration: duration,
                size: size,
                margin_left: margin_left,
                bookingMode: bookingMode,
                isStartOutOfWeek: isStartOutOfWeek,
                isEndOutOfWeek: isEndOutOfWeek,
            });
        });

        setBookingDetails(detailedBookings);
    };
    
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid grey', borderRadius: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                {week && week.map((day, index) => (
                    <Box key={index} sx={{flex: 1, textAlign: 'center', borderLeft: index !== 0 ? '1px solid grey' : ''}}>
                        <Box sx={{borderBottom: '1px solid grey', p: 1}}>
                            <Typography variant={"body2"} sx={{textTransform: 'capitalize'}}>{day.day_of_the_week}</Typography>
                            <Typography variant={"body1"}>{day.day_of_the_month}</Typography>
                        </Box>

                        <Box sx={{height: 500, p: 1}}></Box>
                    </Box>
                ))}

                    <Box sx={{ width: '100%', position: 'absolute', top: 70}}>
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            {bookingDetails.map((e, idx) => (
                                <Grid container sx={{ml: e.margin_left, flexBasis: e.size, maxWidth: e.size, px: 1, mb: 1}} key={idx}>
                                    <Grid item sx={{backgroundColor: 'lightgreen', border: '2px solid green', width: '100%', px: 1, borderRadius: 1, 
                                    borderTopLeftRadius: e.isStartOutOfWeek ? 0 : '4px', borderBottomLeftRadius: e.isStartOutOfWeek ? 0 : '4px',
                                    borderTopRightRadius: e.isEndOutOfWeek ? 0 : '4px', borderBottomRightRadius: e.isEndOutOfWeek ? 0 : '4px'}}>
                                        {e.start} | {e.end} | {e.duration} | {e.size} | {e.margin_left}
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Box>
            </Box>
        </Box>
    );
};

export default BookingTable;
