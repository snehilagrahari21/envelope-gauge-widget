import type { HTMLAttributes } from 'react';
import './InputFieldFooter.css';
export type InputFieldFooterSize = 'Medium' | 'Large';
export type InputFieldFooterState = 'default' | 'error' | 'success';
export interface InputFieldFooterProps extends HTMLAttributes<HTMLDivElement> {
    /** Help / error / success message text */
    helpText?: string;
    /** Counter text (e.g. "0/232") */
    counterText?: string;
    /** Visual state — controls text color and leading icon */
    state?: InputFieldFooterState;
    /** Medium: 12px text, Large: 14px text */
    size?: InputFieldFooterSize;
}
export declare function InputFieldFooter({ helpText, counterText, state, size, className, ...props }: InputFieldFooterProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace InputFieldFooter {
    var displayName: string;
}
