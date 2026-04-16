import type { ReactNode, HTMLAttributes } from 'react';
import './PATrailingItem.css';
export type PATrailingType = 'Icon' | 'Badge' | 'Counter';
export interface PATrailingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Trailing variant */
    trailing?: PATrailingType;
    /** Icon slot — for 'Icon' variant, pass a 20px react-feather icon */
    icon?: ReactNode;
    /** Content slot — for 'Badge' or 'Counter' variant, pass Badge/Counter component */
    children?: ReactNode;
}
export declare function PATrailingItem({ trailing, icon, children, className, ...props }: PATrailingItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PATrailingItem {
    var displayName: string;
}
