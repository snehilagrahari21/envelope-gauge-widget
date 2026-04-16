import { type InputHTMLAttributes } from 'react';
import './Checkbox.css';
export type CheckboxSize = 'Small' | 'Medium' | 'Large';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Label text displayed next to the checkbox */
    label: string;
    /** Size of the checkbox */
    size?: CheckboxSize;
    /** Whether the checkbox is disabled */
    isDisabled?: boolean;
    /** Whether the checkbox is in the indeterminate (intermediate) state */
    isIndeterminate?: boolean;
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
