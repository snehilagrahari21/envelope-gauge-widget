import type { ReactNode, HTMLAttributes } from 'react';
import './InputFieldHeader.css';
export type InputFieldHeaderSize = 'Medium' | 'Large';
export type InputFieldNecessityIndicator = 'none' | 'required';
export interface InputFieldHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Label text */
    label: string;
    /** Shows a red asterisk when 'required' */
    necessityIndicator?: InputFieldNecessityIndicator;
    /** Medium: 12px/18px, Large: 14px/20px */
    size?: InputFieldHeaderSize;
    /** Trailing slot — link, action, or custom content on the right */
    trailing?: ReactNode;
    /** Associates the label with an input via htmlFor */
    htmlFor?: string;
}
export declare function InputFieldHeader({ label, necessityIndicator, size, trailing, htmlFor, className, ...props }: InputFieldHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace InputFieldHeader {
    var displayName: string;
}
