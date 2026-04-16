import type { HTMLAttributes } from 'react';
import './Divider.css';
export type DividerThickness = 'Thinner' | 'Thin' | 'Thick' | 'Thicker';
export type DividerLineStyle = 'Solid' | 'Dashed';
export type DividerVariant = 'Normal' | 'Subtle' | 'Muted';
export type DividerOrientation = 'Horizontal' | 'Vertical';
export interface DividerProps extends HTMLAttributes<HTMLElement> {
    /** Border width — Thinner (0.5px), Thin (1px), Thick (1.5px), Thicker (2px) */
    thickness?: DividerThickness;
    /** Line style — solid or dashed */
    lineStyle?: DividerLineStyle;
    /** Color variant */
    variant?: DividerVariant;
    /** Orientation — horizontal (full width) or vertical (full height of parent) */
    orientation?: DividerOrientation;
}
export declare function Divider({ thickness, lineStyle, variant, orientation, className, ...props }: DividerProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Divider {
    var displayName: string;
}
