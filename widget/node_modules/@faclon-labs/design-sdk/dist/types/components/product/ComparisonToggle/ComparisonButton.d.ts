import type { HTMLAttributes } from 'react';
import './ComparisonButton.css';
export interface ComparisonButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /** Whether comparison is active (colored arrows) or inactive (gray arrows) */
    isSelected?: boolean;
    /** Whether the button is disabled */
    isDisabled?: boolean;
}
export declare function ComparisonButton({ isSelected, isDisabled, className, ...props }: ComparisonButtonProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ComparisonButton {
    var displayName: string;
}
