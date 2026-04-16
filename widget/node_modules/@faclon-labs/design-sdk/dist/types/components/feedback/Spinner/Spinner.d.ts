import type { HTMLAttributes } from 'react';
import './Spinner.css';
export type SpinnerColor = 'Brand' | 'Positive' | 'Negative' | 'Warning' | 'Information' | 'Neutral' | 'White';
export type SpinnerSize = 'Medium' | 'Large' | 'XLarge';
export type SpinnerLabelPosition = 'Bottom' | 'Right';
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    /** Color variant of the spinner */
    color?: SpinnerColor;
    /** Size of the spinner — Medium (16px), Large (20px), XLarge (24px) */
    size?: SpinnerSize;
    /** Optional label text shown alongside the spinner */
    label?: string;
    /** Position of the label relative to the spinner */
    labelPosition?: SpinnerLabelPosition;
    /** Accessible label for screen readers (used when no visible label) */
    accessibilityLabel?: string;
}
/**
 * Spinner indicates a loading state. Renders an inline SVG with a rotating
 * animation matching the Figma _SpinnerBase + Spinner components.
 *
 * Structure: a faded full-circle track (9% opacity) with two arcs
 * at full opacity forming the spinning indicator.
 */
export declare function Spinner({ color, size, label, labelPosition, accessibilityLabel, className, ...props }: SpinnerProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Spinner {
    var displayName: string;
}
