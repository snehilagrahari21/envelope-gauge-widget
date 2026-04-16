import type { ComponentPropsWithoutRef, ElementType } from 'react';
/**
 * Props for polymorphic "as" pattern.
 * Allows a component to render as any HTML element or React component.
 *
 * @example
 *   type BoxProps<T extends ElementType = 'div'> = PolymorphicProps<T, { gap?: string }>;
 */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
    as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;
