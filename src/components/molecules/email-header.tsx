'use client';

import { EmailField } from '@/components/atoms/email-field';
import { cn } from '@/lib/utils';

export type EmailHeaderData = {
  to: string;
  subject: string;
};

export type EmailHeaderProps = {
  data: EmailHeaderData;
  onChange: (data: Partial<EmailHeaderData>) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * EmailHeader - Molecule component for email header fields
 *
 * Contains the recipient and subject fields for an email.
 * Groups related email metadata fields together.
 *
 * @example
 * ```tsx
 * <EmailHeader
 *   data={{ to: 'user@example.com', subject: 'Hello' }}
 *   onChange={(data) => setEmailData({ ...emailData, ...data })}
 * />
 * ```
 */
export function EmailHeader({
  data,
  onChange,
  disabled = false,
  className
}: EmailHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <EmailField
        label="To"
        type="email"
        value={data.to}
        onChange={to => onChange({ to })}
        placeholder="recipient@example.com"
        disabled={disabled}
      />
      <EmailField
        label="Subject"
        value={data.subject}
        onChange={subject => onChange({ subject })}
        placeholder="Enter email subject"
        required
        disabled={disabled}
      />
    </div>
  );
}
