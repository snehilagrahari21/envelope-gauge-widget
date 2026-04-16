import type { ReactNode, HTMLAttributes } from 'react';
import './ListCardTrailingItem.css';
export type ListCardTrailingType = 'Icon' | 'Slot';
export interface ListCardTrailingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Trailing variant */
    trailing?: ListCardTrailingType;
    /** Icon slot — for 'Icon' variant, pass a 16px icon or IconButton */
    icon?: ReactNode;
    /** Custom content slot — for 'Slot' variant */
    children?: ReactNode;
}
export declare function ListCardTrailingItem({ trailing, icon, children, className, ...props }: ListCardTrailingItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ListCardTrailingItem {
    var displayName: string;
}
