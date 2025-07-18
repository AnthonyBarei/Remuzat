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
    id?: number;
    start: string;
    end: string;
    start_day: number;
    end_day: number;
    gap: number;
    duration: number;
    type: string;
    status: 'pending' | 'approved' | 'cancelled';
    added_by?: number;
    validated_by?: number;
    user?: {
        id: number;
        firstname: string;
        lastname: string;
        color_preference: string;
    };
};

interface BookingDetails {
    id?: number;
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
    type?: string;
    status?: 'pending' | 'approved' | 'cancelled';
    userColor?: string;
    user?: {
        id: number;
        firstname: string;
        lastname: string;
        color_preference: string;
    };
    added_by?: number;
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
    type?: string;
};

export type { WeekInfo, BookingInfo, BookingDetails, GapDetails };