import type { ReactNode, HTMLAttributes } from 'react';
import './SwitchButtonBase.css';
export type SwitchButtonType = 'Icon' | 'Text';
export interface SwitchButtonBaseProps extends HTMLAttributes<HTMLButtonElement> {
    /** Button type — Icon: 36×36 square with icon; Text: 36px height with label */
    type?: SwitchButtonType;
    /** Whether this button is the active/selected one */
    isActive?: boolean;
    /** Whether the button is disabled */
    isDisabled?: boolean;
    /** Label text — for Text type */
    label?: string;
    /** Icon slot — for Icon type, pass a 16px react-feather icon */
    icon?: ReactNode;
}
export declare function SwitchButtonBase({ type, isActive, isDisabled, label, icon, className, ...props }: SwitchButtonBaseProps): import("react/jsx-runtime").JSX.Element;
export declare namespace SwitchButtonBase {
    var displayName: string;
}
