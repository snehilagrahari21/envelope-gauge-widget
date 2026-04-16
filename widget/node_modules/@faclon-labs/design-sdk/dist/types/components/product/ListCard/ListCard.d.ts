import type { ReactNode, HTMLAttributes } from 'react';
import './ListCard.css';
export interface ListCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Card title */
    title: string;
    /** Subtitle below the title */
    subtitle?: string;
    /** Whether the card is selected */
    isSelected?: boolean;
    /** Whether the card is disabled */
    isDisabled?: boolean;
    /** Leading item slot — pass ListCardLeadingItem */
    leadingItem?: ReactNode;
    /** Trailing items slot — pass ListCardTrailingItem(s) */
    trailingItems?: ReactNode;
}
export declare function ListCard({ title, subtitle, isSelected, isDisabled, leadingItem, trailingItems, className, ...props }: ListCardProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ListCard {
    var displayName: string;
}
