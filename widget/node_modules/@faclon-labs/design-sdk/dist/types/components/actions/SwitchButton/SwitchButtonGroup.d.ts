import type { ReactNode, HTMLAttributes } from 'react';
import './SwitchButtonGroup.css';
export interface SwitchButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** SwitchButtonBase children */
    children?: ReactNode;
}
export declare function SwitchButtonGroup({ children, className, ...props }: SwitchButtonGroupProps): import("react/jsx-runtime").JSX.Element;
export declare namespace SwitchButtonGroup {
    var displayName: string;
}
