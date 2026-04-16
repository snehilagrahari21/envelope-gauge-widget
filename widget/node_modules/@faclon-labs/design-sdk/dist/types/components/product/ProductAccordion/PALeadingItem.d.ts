import type { ReactNode, HTMLAttributes } from 'react';
import './PALeadingItem.css';
export type PALeadingType = 'None' | 'Icon' | 'Number' | 'Slot';
export interface PALeadingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Leading variant */
    leading?: PALeadingType;
    /** Icon slot — for 'Icon' variant, pass a 20px react-feather icon */
    icon?: ReactNode;
    /** Number text — for 'Number' variant (e.g. "1.", "2.") */
    number?: string;
    /** Custom content slot — for 'Slot' variant */
    children?: ReactNode;
}
export declare function PALeadingItem({ leading, icon, number, children, className, ...props }: PALeadingItemProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace PALeadingItem {
    var displayName: string;
}
