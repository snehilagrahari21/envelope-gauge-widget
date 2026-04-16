import { type InputHTMLAttributes } from 'react';
import './Radio.css';
export type RadioSize = 'Small' | 'Medium' | 'Large';
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Label text displayed next to the radio */
    label: string;
    /** Size of the radio */
    size?: RadioSize;
    /** Whether the radio is disabled */
    isDisabled?: boolean;
}
export declare const Radio: import("react").ForwardRefExoticComponent<RadioProps & import("react").RefAttributes<HTMLInputElement>>;
