import moment from "moment";

interface WeekInfo {
    moment: moment.Moment;
    ddmmyyyy: string;
    day: number;
    month: number;
    month_name: string;
    year: number;
    day_of_the_week: string;
    day_of_the_month: number;
};

// get current week days TODO : fix monday is wrong date :/
const getCurrentWeekDays = (): WeekInfo[] => {
    const days: string[] = [];
    const date = moment();
    const monday = moment(date).startOf('isoWeek').add(1, 'day'); // Adjust to start on Monday

    let week: WeekInfo[] = [];

    for (let i = 0; i < 7; i++) {        
        const nextDay = moment(monday).add(i, 'days');
        days.push(nextDay.format('L'));

        const day: WeekInfo = {
            moment: nextDay,
            ddmmyyyy: nextDay.format('DD/MM/YYYY'),
            day: nextDay.date(),
            month: nextDay.month() + 1,
            month_name: nextDay.format('MMMM'),
            year: nextDay.year(),
            day_of_the_week: nextDay.format('dddd'),
            day_of_the_month: nextDay.date(),
        };

        week.push(day);
    }
    return week;
};

// Define a type for the booking information
interface BookingInfo {
    moment_start: moment.Moment;
    moment_end: moment.Moment;
    start: string;
    end: string;
    start_day: number;
    gap: number;
    duration: number;
    type: string;
};

// Generate random booking data for this week
const generateBookings = (): BookingInfo[] => {
    const bookings: BookingInfo[] = []; // Initialize bookings as an empty array

    for (let i = 0; i < 5; i++) {
        // Generate random start date with moment.js
        // const start = moment().add(Math.floor(Math.random() * 7), 'days'); // Random start date within the next week

        // random start date within the next week or before
        const start = moment().add(Math.floor(Math.random() * 7) - 7, 'days'); // Random start date within the next week

        // Generate random end date that's at least a day after the start date
        const end = moment(start).add(Math.floor(Math.random() * 7) + 1, 'days'); // Random end date within the next week

        // Get the start day from start date out of 7 days
        const startDay = start.day();

        // get the gap between start of the week and start day ou of 7 days
        const gap = startDay - 1;
        
        // Generate random booking information
        const booking: BookingInfo = {
            moment_start: start,
            moment_end: end,
            // format YYYY-MM-DD
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD'),
            start_day: startDay,
            gap: gap,
            // duration
            duration: Math.floor((end.valueOf() - start.valueOf()) / (1000 * 60 * 60 * 24)), // Duration in days
            type: Math.random() > 0.5 ? 'Meeting' : 'Work',
        };

        bookings.push(booking);
    }

    // order bookings by start date
    bookings.sort((a, b) => {
        if (a.moment_start.isAfter(b.moment_start)) {
            return 1;
        } else if (a.moment_start.isBefore(b.moment_start)) {
            return -1;
        } else {
            return 0;
        }
    });

    return bookings;
};

interface BookingDetails {
    start: string;
    end: string;
    duration: number;
    size: string;
    margin_left: string;
    bookingMode: boolean;
    isEndOutOfWeek: boolean;
    isStartOutOfWeek: boolean;
};

export { getCurrentWeekDays, generateBookings, WeekInfo, BookingInfo, BookingDetails };