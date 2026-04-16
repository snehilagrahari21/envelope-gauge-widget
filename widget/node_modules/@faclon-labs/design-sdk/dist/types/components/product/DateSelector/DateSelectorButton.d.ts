import type { HTMLAttributes } from 'react';
import './DateSelectorButton.css';
export interface DateSelectorButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /** Button label (e.g. "M", "T", "W") */
    label: string;
    /** Whether the button is active/selected */
    isActive?: boolean;
    /** Whether the button is disabled */
    isDisabled?: boolean;
}
export declare function DateSelectorButton({ label, isActive, isDisabled, className, ...props }: DateSelectorButtonProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DateSelectorButton {
    var displayName: string;
}
