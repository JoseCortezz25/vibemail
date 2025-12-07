'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PropertyColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export function PropertyColorField({
  id,
  label,
  value,
  onChange,
  defaultValue = '#000000'
}: PropertyColorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="color"
        value={value || defaultValue}
        onChange={e => onChange(e.target.value)}
        className="h-10"
      />
    </div>
  );
}
