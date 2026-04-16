import type { HTMLAttributes } from 'react';
import './CalendarWeekdays.css';
export interface CalendarWeekdaysProps extends HTMLAttributes<HTMLDivElement> {
    /** Weekday labels — defaults to S M T W T F S */
    days?: string[];
}
export declare function CalendarWeekdays({ days, className, ...props }: CalendarWeekdaysProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CalendarWeekdays {
    var displayName: string;
}
