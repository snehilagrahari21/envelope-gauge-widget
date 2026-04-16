import { type ReactNode, type HTMLAttributes } from 'react';
import './Modal.css';
export type ModalSize = 'Small' | 'Medium' | 'Large';
export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    /** Width — Small: 400px, Medium: 760px, Large: 1024px */
    size?: ModalSize;
    /** Whether the modal is visible */
    isOpen?: boolean;
    /** Body padding — true: 20px, false: 0px */
    hasBodyPadding?: boolean;
    /** Header slot — pass ModalHeader */
    header?: ReactNode;
    /** Footer slot — pass ModalFooter */
    footer?: ReactNode;
    /** Body content — pass ModalBody or custom content */
    children?: ReactNode;
    /** Called when backdrop or close button is clicked / Escape is pressed */
    onClose?: () => void;
}
export declare function Modal({ size, isOpen, hasBodyPadding, header, footer, children, onClose, className, ...props }: ModalProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace Modal {
    var displayName: string;
}
