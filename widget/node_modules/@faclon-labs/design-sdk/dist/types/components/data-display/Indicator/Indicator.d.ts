import type { HTMLAttributes } from 'react';
import './Indicator.css';
export type IndicatorIntent = 'Positive' | 'Negative' | 'Notice' | 'Information' | 'Neutral';
export type IndicatorSize = 'Small' | 'Medium' | 'Large';
export interface IndicatorProps extends HTMLAttributes<HTMLDivElement> {
    /** Semantic color intent */
    intent?: IndicatorIntent;
    /** Dot size — Small 6px, Medium 8px, Large 10px */
    size?: IndicatorSize;
    /** Label text next to the dot */
    label?: string;
}
export declare function Indicator({ intent, size, label, className, ...props }: IndicatorProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Indicator {
    var displayName: string;
}
