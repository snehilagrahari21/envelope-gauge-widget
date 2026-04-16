import type { HTMLAttributes, ReactNode } from 'react';
import './Tag.css';
export type TagSize = 'Medium' | 'Large';
export interface TagProps extends HTMLAttributes<HTMLDivElement> {
    /** Tag label text */
    label: string;
    /** Size of the tag */
    size?: TagSize;
    /** Whether the tag is disabled */
    isDisabled?: boolean;
    /** Optional leading icon slot */
    leadingIcon?: ReactNode;
    /** Called when the dismiss button is clicked */
    onDismiss?: () => void;
}
export declare function Tag({ label, size, isDisabled, leadingIcon, onDismiss, className, ...props }: TagProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Tag {
    var displayName: string;
}
