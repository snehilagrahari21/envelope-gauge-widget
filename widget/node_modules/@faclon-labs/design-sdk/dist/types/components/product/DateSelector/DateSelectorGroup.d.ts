import type { ReactNode, HTMLAttributes } from 'react';
import './DateSelectorGroup.css';
export interface DateSelectorGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Label above the button row */
    label?: string;
    /** Help text below the button row */
    helpText?: string;
    /** DateSelectorButton children */
    children?: ReactNode;
}
export declare function DateSelectorGroup({ label, helpText, children, className, ...props }: DateSelectorGroupProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DateSelectorGroup {
    var displayName: string;
}
