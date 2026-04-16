import type { ReactNode, HTMLAttributes } from 'react';
import './ModalLeadingItem.css';
export type ModalLeadingType = 'Icon' | 'Asset' | 'error' | 'warning' | 'success';
export interface ModalLeadingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Leading variant */
    leading?: ModalLeadingType;
    /** Icon slot — for 'Icon' variant, pass a 20px react-feather icon */
    icon?: ReactNode;
    /** Custom content slot — for 'Asset' variant */
    children?: ReactNode;
}
export declare function ModalLeadingItem({ leading, icon, children, className, ...props }: ModalLeadingItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ModalLeadingItem {
    var displayName: string;
}
