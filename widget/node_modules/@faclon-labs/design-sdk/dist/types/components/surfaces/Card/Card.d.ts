import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';
export type CardElevation = 'None' | 'LowRaised' | 'MidRaised' | 'HighRaised';
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Elevation shadow level */
    elevation?: CardElevation;
    /** Whether the card shows hover shadow effect */
    isHoverable?: boolean;
    /** Whether the card scales up (1.05×) on hover */
    isHoverScaled?: boolean;
    /** Whether the card is in selected state (blue border) */
    isSelected?: boolean;
    /** Card header slot — pass CardHeader */
    header?: ReactNode;
    /** Card body slot — pass CardBody or custom content */
    body?: ReactNode;
    /** Card footer slot — pass CardFooter */
    footer?: ReactNode;
    /** Alternative: pass all content as children instead of header/body/footer slots */
    children?: ReactNode;
}
export declare function Card({ elevation, isHoverable, isHoverScaled, isSelected, header, body, footer, children, className, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Card {
    var displayName: string;
}
