import { type InputHTMLAttributes, type ReactNode } from 'react';
import './Switch.css';
export type SwitchSize = 'Small' | 'Medium';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
    /** Size of the switch */
    size?: SwitchSize;
    /** Whether the switch is on */
    isChecked?: boolean;
    /** Default checked state for uncontrolled usage */
    defaultChecked?: boolean;
    /** Whether the switch is disabled */
    isDisabled?: boolean;
    /** Called when the switch is toggled */
    onChange?: (meta: {
        name: string;
        checked: boolean;
    }) => void;
    /** Field name for form submissions */
    name?: string;
    /** Accessible label (use when no visible label) */
    accessibilityLabel?: string;
    /** Title text — when provided, renders the "with text" layout */
    label?: string;
    /** Subheading text below the title */
    helpText?: string;
    /** Icon slot next to the title (e.g. Info icon) */
    trailingIcon?: ReactNode;
    /** Show a muted divider below the row */
    showDivider?: boolean;
    /** Additional class name */
    className?: string;
}
export declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLInputElement>>;
