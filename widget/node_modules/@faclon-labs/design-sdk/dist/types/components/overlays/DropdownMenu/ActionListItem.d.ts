import type { ReactNode, HTMLAttributes } from 'react';
import './ActionListItem.css';
export type ActionListContentType = 'Item' | 'Separator' | 'SectionHeading';
export type ActionListSelectionType = 'None' | 'Single' | 'Multiple';
export interface ActionListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Content type — Item (interactive), Separator (divider), or SectionHeading (group label) */
    contentType?: ActionListContentType;
    /** Selection type — None (default), Single (highlight only), Multiple (checkbox indicator) */
    selectionType?: ActionListSelectionType;
    /** Item title text */
    title?: string;
    /** Description text below the title */
    description?: string;
    /** Leading icon slot — pass a 16px icon. Ignored when selectionType is Multiple. */
    leadingIcon?: ReactNode;
    /** Trailing content slot — keyboard shortcut text, icon, etc. */
    trailing?: ReactNode;
    /** Badge group slot — shown next to the title */
    badges?: ReactNode;
    /** Whether the item is selected */
    isSelected?: boolean;
    /** Whether the item is disabled */
    isDisabled?: boolean;
    /** Whether the item is destructive (red text) */
    isDestructive?: boolean;
}
export declare function ActionListItem({ contentType, selectionType, title, description, leadingIcon, trailing, badges, isSelected, isDisabled, isDestructive, className, ...props }: ActionListItemProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ActionListItem {
    var displayName: string;
}
