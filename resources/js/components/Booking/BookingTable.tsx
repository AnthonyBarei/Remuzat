import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';

import { BookingInfo, BookingDetails, WeekInfo, GapDetails } from './interfaces';

interface BookingTableProps {
    week: WeekInfo[];
    bookings: BookingInfo[];
}

const BookingTable: React.FC<BookingTableProps> = ({...props}) => {
    const [bookingDetails, setBookingDetails] = useState<(BookingDetails|GapDetails)[]>([]);    

    useEffect(() => {
        generateBookingDetails();
    }, [props.bookings]);

    // generate booking elements
    const generateBookingDetails = () => {
        const detailedBookings: (BookingDetails|GapDetails)[] = [];
        
        props.bookings.forEach((booking, bookingIndex) => {
            // condition to check if booking is in the same week using week state
            const weekStart = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").startOf('isoWeek');
            const weekEnd = moment(props.week[0].ddmmyyyy, "DD/MM/YYYY").endOf('isoWeek');
            const bookingStart = moment(booking.start, "YYYY-MM-DD");
            const bookingEnd = moment(booking.end, "YYYY-MM-DD").set({hour: 23, minute: 59, second: 59, millisecond: 999});
            
            if (bookingEnd.isSameOrBefore(weekStart) || bookingStart.isAfter(weekEnd)) {
                return;
            }

            let start: string = booking.start;
            let end: string = booking.end;
            let duration: number = booking.duration;            
            let size: string = duration / 7 * 100 + '%';
            let margin_left: string = booking.start_day / 7 * 100 + '%';
            let bookingMode: boolean = false;
            let isEndOutOfWeek: boolean = false;
            let isStartOutOfWeek: boolean = false;            
            
            if (bookingStart.isBefore(weekStart)) {
                duration = bookingEnd.diff(weekStart, 'days') + 1;
                size = duration / 7 * 100 + '%';
                margin_left = 0 + '%';
                isStartOutOfWeek = true;
            }

            if (bookingEnd.isAfter(weekEnd)) {
                isEndOutOfWeek = true;
            }
            
            const details = {
                start: start,
                end: end,
                start_day: booking.start_day,
                end_day: booking.end_day,
                duration: duration,
                size: size,
                margin_left: margin_left,
                bookingMode: bookingMode,
                isStartOutOfWeek: isStartOutOfWeek,
                isEndOutOfWeek: isEndOutOfWeek,
                isGap: false,
            };

            detailedBookings.push(details);

            // is not last booking
            if (booking.gap > 0 && !bookingEnd.isSameOrAfter(weekEnd) && bookingIndex !== props.bookings.length - 1) {
                const gapSize = booking.gap / 7 * 100 + '%';
                
                const details = {
                    gapSize: gapSize,
                    isGap: true,
                };

                detailedBookings.push(details);
            }
        });

        setBookingDetails(detailedBookings);
    };
    
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid grey', borderRadius: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                {props.week && props.week.map((day, index) => (
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
                                <React.Fragment key={idx}>
                                    {e.isGap && (
                                        <Grid container sx={{flexBasis: e.gapSize, maxWidth: e.gapSize, px: 1, mb: 1}}>
                                            <Grid item sx={{backgroundColor: 'grey', border: '2px solid grey', width: '100%', px: 1, borderRadius: 1}}></Grid>
                                        </Grid>
                                    )}
                                    {!e.isGap && ( 
                                        <Grid container sx={{ml: e.margin_left, flexBasis: e.size, maxWidth: e.size, px: 1, mb: 1}}>
                                            <Grid item sx={{backgroundColor: 'darkgreen', border: '2px solid green', width: '100%', px: 1, borderRadius: 1, 
                                            borderTopLeftRadius: e.isStartOutOfWeek ? 0 : '4px', borderBottomLeftRadius: e.isStartOutOfWeek ? 0 : '4px',
                                            borderTopRightRadius: e.isEndOutOfWeek ? 0 : '4px', borderBottomRightRadius: e.isEndOutOfWeek ? 0 : '4px'}}>
                                                {e.start} | {e.end} | {e.duration} | {e.size} | {e.margin_left}
                                            </Grid>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
            </Box>
        </Box>
    );
};

export default BookingTable;
