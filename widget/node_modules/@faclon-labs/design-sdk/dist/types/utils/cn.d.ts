/**
 * Merge CSS class names, filtering out falsy values.
 *
 * @example
 *   cn('fds-btn', isActive && 'fds-btn--active', className)
 *   // => "fds-btn fds-btn--active custom-class"
 */
export declare function cn(...inputs: Array<string | boolean | null | undefined>): string;
