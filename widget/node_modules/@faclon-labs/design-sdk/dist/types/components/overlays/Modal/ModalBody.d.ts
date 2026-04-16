import type { ReactNode, HTMLAttributes } from 'react';
import './ModalBody.css';
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
    /** Body text — renders as BodyMediumRegular paragraph */
    bodyText?: string;
    /** Custom content slot — overrides bodyText when provided */
    children?: ReactNode;
}
export declare function ModalBody({ bodyText, children, className, ...props }: ModalBodyProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ModalBody {
    var displayName: string;
}
