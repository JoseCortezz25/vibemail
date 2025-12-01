'use client';

import { FormatButton } from '@/components/atoms/format-button';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image
} from 'lucide-react';

export type FormatAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'bulletList'
  | 'orderedList'
  | 'link'
  | 'image';

export type EmailToolbarProps = {
  onFormat: (action: FormatAction) => void;
  activeFormats?: FormatAction[];
  disabled?: boolean;
  className?: string;
};

/**
 * EmailToolbar - Molecule component for email formatting toolbar
 *
 * Provides a complete set of formatting tools for the email editor.
 * Includes text formatting, alignment, lists, and media insertion.
 *
 * @example
 * ```tsx
 * <EmailToolbar
 *   onFormat={handleFormat}
 *   activeFormats={['bold', 'alignLeft']}
 * />
 * ```
 */
export function EmailToolbar({
  onFormat,
  activeFormats = [],
  disabled = false,
  className
}: EmailToolbarProps) {
  const isActive = (format: FormatAction) => activeFormats.includes(format);

  return (
    <div
      className={cn(
        'border-border flex flex-wrap items-center gap-1 rounded-lg border bg-background p-2',
        className
      )}
      role="toolbar"
      aria-label="Email formatting toolbar"
    >
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <FormatButton
          icon={Bold}
          label="Bold"
          onClick={() => onFormat('bold')}
          isActive={isActive('bold')}
          disabled={disabled}
        />
        <FormatButton
          icon={Italic}
          label="Italic"
          onClick={() => onFormat('italic')}
          isActive={isActive('italic')}
          disabled={disabled}
        />
        <FormatButton
          icon={Underline}
          label="Underline"
          onClick={() => onFormat('underline')}
          isActive={isActive('underline')}
          disabled={disabled}
        />
      </div>

      <div className="bg-border h-6 w-px" aria-hidden="true" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <FormatButton
          icon={AlignLeft}
          label="Align Left"
          onClick={() => onFormat('alignLeft')}
          isActive={isActive('alignLeft')}
          disabled={disabled}
        />
        <FormatButton
          icon={AlignCenter}
          label="Align Center"
          onClick={() => onFormat('alignCenter')}
          isActive={isActive('alignCenter')}
          disabled={disabled}
        />
        <FormatButton
          icon={AlignRight}
          label="Align Right"
          onClick={() => onFormat('alignRight')}
          isActive={isActive('alignRight')}
          disabled={disabled}
        />
      </div>

      <div className="bg-border h-6 w-px" aria-hidden="true" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <FormatButton
          icon={List}
          label="Bullet List"
          onClick={() => onFormat('bulletList')}
          isActive={isActive('bulletList')}
          disabled={disabled}
        />
        <FormatButton
          icon={ListOrdered}
          label="Numbered List"
          onClick={() => onFormat('orderedList')}
          isActive={isActive('orderedList')}
          disabled={disabled}
        />
      </div>

      <div className="bg-border h-6 w-px" aria-hidden="true" />

      {/* Media & Links */}
      <div className="flex items-center gap-1">
        <FormatButton
          icon={Link}
          label="Insert Link"
          onClick={() => onFormat('link')}
          disabled={disabled}
        />
        <FormatButton
          icon={Image}
          label="Insert Image"
          onClick={() => onFormat('image')}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
