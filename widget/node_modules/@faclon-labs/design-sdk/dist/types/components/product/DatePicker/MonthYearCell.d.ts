import type { HTMLAttributes } from 'react';
import './MonthYearCell.css';
export interface MonthYearCellProps extends HTMLAttributes<HTMLButtonElement> {
    /** Display label (e.g. "Jan", "2023") */
    label: string;
    /** Whether this cell is selected */
    isSelected?: boolean;
}
export declare function MonthYearCell({ label, isSelected, className, ...props }: MonthYearCellProps): import("react/jsx-runtime").JSX.Element;
export declare namespace MonthYearCell {
    var displayName: string;
}
