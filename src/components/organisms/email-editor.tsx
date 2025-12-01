'use client';

import { EmailHeader, EmailHeaderData } from '@/components/molecules/email-header';
import { EmailContentEditor } from '@/components/molecules/email-content-editor';
import { Email } from '@/domains/email-editor/schema';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type EmailEditorProps = {
  initialEmail?: Partial<Email>;
  onChange?: (email: Email) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * EmailEditor - Organism component for complete email editing
 *
 * Combines header fields and content editor into a complete email composer.
 * Manages the state of the entire email and provides callbacks for changes.
 *
 * @example
 * ```tsx
 * <EmailEditor
 *   initialEmail={{ subject: 'Draft', content: 'Hello...' }}
 *   onChange={(email) => console.log('Email changed:', email)}
 * />
 * ```
 */
export function EmailEditor({
  initialEmail = {},
  onChange,
  disabled = false,
  className
}: EmailEditorProps) {
  const [email, setEmail] = useState<Email>({
    to: initialEmail.to || '',
    subject: initialEmail.subject || '',
    content: initialEmail.content || '',
    format: initialEmail.format || 'html'
  });

  const handleHeaderChange = (data: Partial<EmailHeaderData>) => {
    const updatedEmail = { ...email, ...data };
    setEmail(updatedEmail);
    onChange?.(updatedEmail);
  };

  const handleContentChange = (content: string) => {
    const updatedEmail = { ...email, content };
    setEmail(updatedEmail);
    onChange?.(updatedEmail);
  };

  return (
    <div
      className={cn(
        'border-border space-y-6 rounded-lg border bg-card p-6',
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Compose Email</h2>
        <p className="text-muted-foreground text-sm">
          Create and format your email message
        </p>
      </div>

      <EmailHeader
        data={{ to: email.to, subject: email.subject }}
        onChange={handleHeaderChange}
        disabled={disabled}
      />

      <EmailContentEditor
        content={email.content}
        onChange={handleContentChange}
        disabled={disabled}
      />
    </div>
  );
}
