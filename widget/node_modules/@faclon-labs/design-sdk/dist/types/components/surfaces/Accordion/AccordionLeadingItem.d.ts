import type { ReactNode } from 'react';
import './AccordionLeadingItem.css';
export type AccordionLeadingType = 'None' | 'Icon' | 'Number';
export interface AccordionLeadingItemProps {
    /** Type of leading item */
    leading?: AccordionLeadingType;
    /** Icon element (when leading='Icon') */
    icon?: ReactNode;
    /** Number/text string (when leading='Number'), e.g. "1." */
    number?: string;
}
export declare function AccordionLeadingItem({ leading, icon, number, }: AccordionLeadingItemProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace AccordionLeadingItem {
    var displayName: string;
}
