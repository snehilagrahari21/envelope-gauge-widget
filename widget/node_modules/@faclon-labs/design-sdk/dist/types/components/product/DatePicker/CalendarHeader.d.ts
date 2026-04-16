import type { HTMLAttributes } from 'react';
import './CalendarHeader.css';
export interface CalendarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Display label (e.g. "March 2026") */
    label: string;
    /** Called when prev (up) button is clicked */
    onPrev?: () => void;
    /** Called when next (down) button is clicked */
    onNext?: () => void;
    /** Called when the label area is clicked (to open month/year picker) */
    onLabelClick?: () => void;
}
export declare function CalendarHeader({ label, onPrev, onNext, onLabelClick, className, ...props }: CalendarHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace CalendarHeader {
    var displayName: string;
}
