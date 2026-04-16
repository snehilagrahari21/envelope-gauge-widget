import { type ReactNode, type HTMLAttributes } from 'react';
import './DropdownMenu.css';
export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
    /** Header slot — pass DropdownHeader */
    header?: ReactNode;
    /** Footer slot — pass DropdownFooter */
    footer?: ReactNode;
    /** Menu items — pass ActionListItem components or groups */
    children?: ReactNode;
}
export declare function DropdownMenu({ header, footer, children, className, ...props }: DropdownMenuProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DropdownMenu {
    var displayName: string;
}
