/**
 * Registers a global keyboard shortcut.
 *
 * @example
 *   useKeyboard('Escape', () => setOpen(false));
 */
export declare function useKeyboard(key: string, handler: (event: KeyboardEvent) => void, enabled?: boolean): void;
