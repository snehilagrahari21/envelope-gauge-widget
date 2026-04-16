import type { ReactNode, HTMLAttributes } from 'react';
import './ModalFooter.css';
export type ModalFooterStacking = 'Horizontal' | 'Vertical';
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
    /** Button layout — Horizontal: side-by-side right-aligned; Vertical: stacked full-width */
    stacking?: ModalFooterStacking;
    /** Primary action slot — pass a Button (Primary variant) */
    primaryAction?: ReactNode;
    /** Secondary action slot — pass a Button (Secondary variant) */
    secondaryAction?: ReactNode;
    /** Optional content above the actions (e.g. checkbox, text) */
    children?: ReactNode;
}
export declare function ModalFooter({ stacking, primaryAction, secondaryAction, children, className, ...props }: ModalFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ModalFooter {
    var displayName: string;
}
