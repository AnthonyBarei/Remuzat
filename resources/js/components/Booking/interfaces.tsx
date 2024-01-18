interface WeekInfo {
    ddmmyyyy: string;
    day: number;
    month: number;
    month_name: string;
    year: number;
    day_of_the_week: string;
    day_of_the_month: number;
};

interface BookingInfo {
    start: string;
    end: string;
    start_day: number;
    end_day: number;
    gap: number;
    duration: number;
    type: string;
};

interface BookingDetails {
    start: string;
    end: string;
    start_day: number;
    end_day: number;
    duration: number;
    size: string;
    margin_left: string;
    bookingMode: boolean;
    isEndOutOfWeek: boolean;
    isStartOutOfWeek: boolean;
    isGap: boolean;
    gapSize?: string;
};

interface GapDetails {
    start?: string;
    end?: string;
    start_day?: number;
    end_day?: number;
    duration?: number;
    size?: string;
    margin_left?: string;
    bookingMode?: boolean;
    isEndOutOfWeek?: boolean;
    isStartOutOfWeek?: boolean;
    isGap: boolean;
    gapSize: string;
};

export type { WeekInfo, BookingInfo, BookingDetails, GapDetails };