import type { ReactNode, HTMLAttributes } from 'react';
import './ActionListItemGroup.css';
export interface ActionListItemGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** ActionListItem components */
    children?: ReactNode;
}
export declare function ActionListItemGroup({ children, className, ...props }: ActionListItemGroupProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ActionListItemGroup {
    var displayName: string;
}
