'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type EmailFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email';
  className?: string;
  disabled?: boolean;
};

/**
 * EmailField - Atom component for email form fields
 *
 * A labeled input field for email-related data like subject, recipient, etc.
 * Follows shadcn/ui patterns with Label and Input components.
 *
 * @example
 * ```tsx
 * <EmailField
 *   label="Subject"
 *   value={subject}
 *   onChange={setSubject}
 *   placeholder="Enter email subject"
 * />
 * ```
 */
export function EmailField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  className,
  disabled = false
}: EmailFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
