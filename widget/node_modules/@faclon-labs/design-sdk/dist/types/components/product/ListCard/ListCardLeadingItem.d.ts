import type { ReactNode, HTMLAttributes } from 'react';
import './ListCardLeadingItem.css';
export type ListCardLeadingType = 'Icon' | 'Slot' | 'Color';
export interface ListCardLeadingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Leading variant */
    leading?: ListCardLeadingType;
    /** Icon slot — for 'Icon' variant, pass a 16px react-feather icon */
    icon?: ReactNode;
    /** Custom content slot — for 'Slot' variant */
    children?: ReactNode;
    /** Color value — for 'Color' variant (any CSS color) */
    color?: string;
}
export declare function ListCardLeadingItem({ leading, icon, children, color, className, ...props }: ListCardLeadingItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ListCardLeadingItem {
    var displayName: string;
}
