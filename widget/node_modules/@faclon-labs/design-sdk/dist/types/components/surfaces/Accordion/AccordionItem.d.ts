import { type ReactNode } from 'react';
import { type AccordionLeadingType } from './AccordionLeadingItem';
import './AccordionItem.css';
export interface AccordionItemProps {
    /** Unique key identifying this item within an Accordion group */
    value?: string;
    /** Title text displayed in the header */
    title: string;
    /** Body text content (simple text mode) */
    bodyText?: string;
    /** Custom body content (slot — takes precedence over bodyText) */
    children?: ReactNode;
    /** Type of leading item */
    leading?: AccordionLeadingType;
    /** Icon element for leading (when leading='Icon') */
    leadingIcon?: ReactNode;
    /** Number/text for leading (when leading='Number') */
    leadingNumber?: string;
    /** Controlled expanded state (standalone mode) */
    isExpanded?: boolean;
    /** Default expanded state (standalone uncontrolled mode) */
    defaultExpanded?: boolean;
    /** Called when expanded state changes */
    onExpandedChange?: (expanded: boolean) => void;
    /** Additional class name */
    className?: string;
}
export declare function AccordionItem({ value, title, bodyText, children, leading, leadingIcon, leadingNumber, isExpanded: controlledExpanded, defaultExpanded, onExpandedChange, className, }: AccordionItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace AccordionItem {
    var displayName: string;
}
