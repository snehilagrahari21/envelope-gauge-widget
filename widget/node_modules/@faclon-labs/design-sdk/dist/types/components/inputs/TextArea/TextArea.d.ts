import { type TextareaHTMLAttributes } from 'react';
import './TextArea.css';
export type TextAreaSize = 'Medium' | 'Large';
export type TextAreaMaxLines = 2 | 3 | 4 | 5;
export type TextAreaValidationState = 'none' | 'error';
export type TextAreaNecessityIndicator = 'optional' | 'required';
export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur' | 'onFocus'> {
    /** Label for the textarea */
    label: string;
    /** Size — Medium (14px text) or Large (16px text) */
    size?: TextAreaSize;
    /** Number of visible lines (controls field height) */
    maxLines?: TextAreaMaxLines;
    /** Placeholder text */
    placeholder?: string;
    /** Controlled value (text mode) */
    value?: string;
    /** Default value for uncontrolled usage (text mode) */
    defaultValue?: string;
    /** Validation state */
    validationState?: TextAreaValidationState;
    /** Help text shown below the field */
    helpText?: string;
    /** Error text shown when validationState is 'error' */
    errorText?: string;
    /** Called when value changes (text mode) */
    onChange?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Called when field receives focus */
    onFocus?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Called when field loses focus */
    onBlur?: (meta: {
        name: string;
        value: string;
    }) => void;
    /** Disables the textarea */
    isDisabled?: boolean;
    /** Marks the field as required */
    isRequired?: boolean;
    /** Indicator next to label */
    necessityIndicator?: TextAreaNecessityIndicator;
    /** Max character count (text mode) */
    maxCharacters?: number;
    /** Enable tags mode — Enter creates tag chips instead of new lines */
    isTagsMode?: boolean;
    /** Controlled tags (tags mode) */
    tags?: string[];
    /** Default tags for uncontrolled usage (tags mode) */
    defaultTags?: string[];
    /** Called when tags change (tags mode) */
    onTagsChange?: (tags: string[]) => void;
}
export declare const TextArea: import("react").ForwardRefExoticComponent<TextAreaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
