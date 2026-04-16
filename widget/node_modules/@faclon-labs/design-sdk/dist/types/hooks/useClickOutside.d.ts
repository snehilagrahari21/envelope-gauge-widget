import { type RefObject } from 'react';
/**
 * Calls `handler` when a click occurs outside the referenced element.
 * Useful for closing dropdowns, modals, popovers, etc.
 */
export declare function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, handler: (event: MouseEvent | TouchEvent) => void): void;
