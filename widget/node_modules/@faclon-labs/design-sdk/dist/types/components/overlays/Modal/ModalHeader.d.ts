import type { ReactNode, HTMLAttributes } from 'react';
import './ModalHeader.css';
export interface ModalHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Header title */
    title: string;
    /** Subtitle below the title */
    subtitle?: string;
    /** Leading item slot — pass ModalLeadingItem */
    leadingItem?: ReactNode;
    /** Trailing item slot — pass ModalTrailingItem */
    trailingItem?: ReactNode;
    /** Counter slot — pass Badge next to the title */
    counter?: ReactNode;
    /** Called when the close button is clicked */
    onClose?: () => void;
}
export declare function ModalHeader({ title, subtitle, leadingItem, trailingItem, counter, onClose, className, ...props }: ModalHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ModalHeader {
    var displayName: string;
}
