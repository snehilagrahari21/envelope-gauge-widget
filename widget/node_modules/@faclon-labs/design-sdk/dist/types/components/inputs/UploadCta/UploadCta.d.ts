import type { HTMLAttributes } from 'react';
import './UploadCta.css';
export interface UploadCtaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Body text shown before the upload link */
    bodyText?: string;
    /** Upload link label */
    linkText?: string;
    /** Whether the component is disabled */
    isDisabled?: boolean;
    /** Accepted file types (e.g. ".png,.jpg" or "image/*") */
    accept?: string;
    /** Allow multiple files */
    multiple?: boolean;
    /** Called when files are selected (via click or drop) */
    onFilesSelect?: (files: FileList) => void;
}
export declare function UploadCta({ bodyText, linkText, isDisabled, accept, multiple, onFilesSelect, className, ...props }: UploadCtaProps): import("react/jsx-runtime").JSX.Element;
export declare namespace UploadCta {
    var displayName: string;
}
