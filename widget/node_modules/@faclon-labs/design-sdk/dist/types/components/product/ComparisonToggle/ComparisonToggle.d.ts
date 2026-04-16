import type { HTMLAttributes } from 'react';
import './ComparisonToggle.css';
export type ComparisonToggleValue = 'left' | 'right';
export interface ComparisonToggleProps extends HTMLAttributes<HTMLDivElement> {
    /** Which side is selected */
    value?: ComparisonToggleValue;
    /** Whether the entire toggle is disabled */
    isDisabled?: boolean;
    /** Called when a side is clicked */
    onValueChange?: (value: ComparisonToggleValue) => void;
}
export declare function ComparisonToggle({ value, isDisabled, onValueChange, className, ...props }: ComparisonToggleProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ComparisonToggle {
    var displayName: string;
}
