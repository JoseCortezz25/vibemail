'use client';

import { Textarea } from '@/components/ui/textarea';
import { EmailToolbar, FormatAction } from './email-toolbar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type EmailContentEditorProps = {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  className?: string;
  minHeight?: string | number;
};

/**
 * EmailContentEditor - Molecule component for editing email content
 *
 * Provides a rich text editing experience with formatting toolbar.
 * Currently uses textarea, designed to be upgradeable to a rich text editor.
 *
 * @example
 * ```tsx
 * <EmailContentEditor
 *   content={emailContent}
 *   onChange={setEmailContent}
 *   minHeight="300px"
 * />
 * ```
 */
export function EmailContentEditor({
  content,
  onChange,
  disabled = false,
  className,
  minHeight = '300px'
}: EmailContentEditorProps) {
  const [activeFormats, setActiveFormats] = useState<FormatAction[]>([]);

  const handleFormat = (action: FormatAction) => {
    // TODO: Implement actual formatting logic when integrating a rich text editor
    // For now, this is a placeholder that tracks active formats
    console.log('Format action:', action);

    setActiveFormats(prev =>
      prev.includes(action)
        ? prev.filter(f => f !== action)
        : [...prev, action]
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      <EmailToolbar
        onFormat={handleFormat}
        activeFormats={activeFormats}
        disabled={disabled}
      />
      <div className="border-input focus-within:ring-ring rounded-lg border focus-within:ring-2">
        <Textarea
          value={content}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your email content here..."
          disabled={disabled}
          className="min-h-[var(--min-height)] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ '--min-height': minHeight } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
