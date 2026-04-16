import type { ReactNode, HTMLAttributes } from 'react';
import './ModalTrailingItem.css';
export type ModalTrailingType = 'Action' | 'Link' | 'Badge' | 'Text';
export interface ModalTrailingItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Trailing variant — controls padding. Action has no extra padding, others get 4px py. */
    trailing?: ModalTrailingType;
    /** Content slot — pass IconButton, LinkButton, Badge, or text */
    children?: ReactNode;
}
export declare function ModalTrailingItem({ trailing, children, className, ...props }: ModalTrailingItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ModalTrailingItem {
    var displayName: string;
}
