'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PropertyFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'number' | 'color';
  placeholder?: string;
  className?: string;
}

export function PropertyFormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className
}: PropertyFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
