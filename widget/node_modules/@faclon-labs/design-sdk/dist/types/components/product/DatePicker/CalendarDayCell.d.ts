import type { HTMLAttributes } from 'react';
import './CalendarDayCell.css';
export type DayCellType = 'default' | 'currentDate' | 'rangeStart' | 'rangeIn' | 'rangeEnd' | 'outOfMonth';
export interface CalendarDayCellProps extends HTMLAttributes<HTMLButtonElement> {
    /** Day number to display */
    date: number | string;
    /** Cell type — controls shape, bg, and range styling */
    type?: DayCellType;
    /** Whether this cell is selected */
    isSelected?: boolean;
    /** Whether this cell is disabled */
    isDisabled?: boolean;
    /** Whether this cell is today — shows dot even when type is a range type */
    isCurrentDate?: boolean;
}
export declare function CalendarDayCell({ date, type, isSelected, isDisabled, isCurrentDate, className, ...props }: CalendarDayCellProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CalendarDayCell {
    var displayName: string;
}
