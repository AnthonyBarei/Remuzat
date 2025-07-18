import moment from "moment";
import "moment/locale/fr";
import { BookingInfo, BookingDetails, GapDetails, WeekInfo } from "./interfaces";

// Set French locale for moment
moment.locale('fr');

// get current week days TODO : fix monday is wrong date :/
const getCurrentWeekDays = (): WeekInfo[] => {
    const date = moment();
    const currentDate = moment(date).startOf('isoWeek'); // Adjust to start on Monday

    let week: WeekInfo[] = [];

    for (let i = 0; i < 7; i++) {     
        const day = {
            ddmmyyyy: currentDate.format('DD/MM/YYYY'),
            day: currentDate.date(),
            month: currentDate.month() + 1,
            month_name: currentDate.format('MMMM'),
            year: currentDate.year(),
            day_of_the_week: currentDate.format('dddd'),
            day_of_the_month: currentDate.date(),
        };
        
        week.push(day);
        currentDate.add(1, 'days');
    }
    return week;
};

// Get week that contains a specific date
const getWeekForDate = (date: string): WeekInfo[] => {
    const targetDate = moment(date, "YYYY-MM-DD");
    const weekStart = targetDate.startOf('isoWeek'); // Start on Monday

    let week: WeekInfo[] = [];

    for (let i = 0; i < 7; i++) {     
        const day = {
            ddmmyyyy: weekStart.format('DD/MM/YYYY'),
            day: weekStart.date(),
            month: weekStart.month() + 1,
            month_name: weekStart.format('MMMM'),
            year: weekStart.year(),
            day_of_the_week: weekStart.format('dddd'),
            day_of_the_month: weekStart.date(),
        };
        
        week.push(day);
        weekStart.add(1, 'days');
    }
    return week;
};

const getPreviousWeekDays = (week: WeekInfo[]): WeekInfo[] => {
    const previousWeek: WeekInfo[] = [];

    week.forEach((day) => {
        const previousDay = moment(day.ddmmyyyy, "DD/MM/YYYY").subtract(7, 'days');
        const previousDayInfo = {
            ddmmyyyy: previousDay.format('DD/MM/YYYY'),
            day: previousDay.date(),
            month: previousDay.month() + 1,
            month_name: previousDay.format('MMMM'),
            year: previousDay.year(),
            day_of_the_week: previousDay.format('dddd'),
            day_of_the_month: previousDay.date(),
        };
        previousWeek.push(previousDayInfo);
    });

    return previousWeek;
};

const getNextWeekDays = (week: WeekInfo[]): WeekInfo[] => {
    const nextWeek: WeekInfo[] = [];

    week.forEach((day) => {
        const nextDay = moment(day.ddmmyyyy, "DD/MM/YYYY").add(7, 'days');
        const nextDayInfo = {
            ddmmyyyy: nextDay.format('DD/MM/YYYY'),
            day: nextDay.date(),
            month: nextDay.month() + 1,
            month_name: nextDay.format('MMMM'),
            year: nextDay.year(),
            day_of_the_week: nextDay.format('dddd'),
            day_of_the_month: nextDay.date(),
        };
        nextWeek.push(nextDayInfo);
    });

    return nextWeek;
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
        const startDay = start.day() - 1;

        // Calculate gap between end day and 7 (sunday)
        const gap = 7 - end.day();
        
        // Generate random booking information
        const booking: BookingInfo = {
            // format YYYY-MM-DD
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD'),
            start_day: startDay,
            end_day: end.day(),
            gap: gap,
            // duration
            duration: Math.floor((end.valueOf() - start.valueOf()) / (1000 * 60 * 60 * 24)) + 1, // Duration in days
            type: Math.random() > 0.5 ? 'Meeting' : 'Work',
            status: 'pending',
        };

        bookings.push(booking);
    }

    // Sort bookings by start date
    bookings.sort((a, b) => {
        if (a.start < b.start) {
            return -1;
        }
        if (a.start > b.start) {
            return 1;
        }
        return 0;
    });

    return bookings;
};

export { getCurrentWeekDays, getPreviousWeekDays, getNextWeekDays, generateBookings, getWeekForDate };