'use client';

import { Email } from '@/domains/email-editor/schema';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

export type EmailPreviewProps = {
  email: Email;
  from?: string;
  className?: string;
};

/**
 * EmailPreview - Organism component for previewing email
 *
 * Displays a read-only preview of how the email will appear to recipients.
 * Shows sender, recipient, subject, and formatted content.
 *
 * @example
 * ```tsx
 * <EmailPreview
 *   email={currentEmail}
 *   from="sender@example.com"
 * />
 * ```
 */
export function EmailPreview({
  email,
  from = 'you@example.com',
  className
}: EmailPreviewProps) {
  const hasContent = email.to || email.subject || email.content;

  return (
    <div
      className={cn(
        'border-border space-y-6 rounded-lg border bg-card p-6',
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <p className="text-muted-foreground text-sm">
          How your email will appear to recipients
        </p>
      </div>

      {!hasContent ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
          <Mail className="mb-4 h-12 w-12 opacity-20" />
          <p className="text-sm">
            Start composing your email to see a preview
          </p>
        </div>
      ) : (
        <div className="bg-background space-y-4 rounded-lg border p-6">
          {/* Email metadata */}
          <div className="border-border space-y-2 border-b pb-4">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground min-w-[60px] text-sm font-medium">
                From:
              </span>
              <span className="text-sm">{from}</span>
            </div>
            {email.to && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[60px] text-sm font-medium">
                  To:
                </span>
                <span className="text-sm">{email.to}</span>
              </div>
            )}
            {email.subject && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[60px] text-sm font-medium">
                  Subject:
                </span>
                <span className="text-sm font-semibold">{email.subject}</span>
              </div>
            )}
          </div>

          {/* Email content */}
          <div className="prose prose-sm max-w-none">
            {email.content ? (
              email.format === 'html' ? (
                <div
                  dangerouslySetInnerHTML={{ __html: email.content }}
                  className="whitespace-pre-wrap"
                />
              ) : (
                <p className="whitespace-pre-wrap">{email.content}</p>
              )
            ) : (
              <p className="text-muted-foreground italic">No content yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
