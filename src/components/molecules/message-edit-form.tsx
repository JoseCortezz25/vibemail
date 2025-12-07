'use client';

import { Button } from '@/components/ui/button';
import { MessageEditTextarea } from '../atoms/message-edit-textarea';

interface MessageEditFormProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  width?: number;
}

export function MessageEditForm({
  value,
  onChange,
  onSave,
  onCancel,
  width
}: MessageEditFormProps) {
  return (
    <div
      className="bg-accent relative flex w-full min-w-[180px] flex-col gap-2 rounded-3xl px-5 pt-3.5 pb-2.5"
      style={{ width: width ? `${width}px` : undefined }}
    >
      <MessageEditTextarea
        value={value}
        onChange={onChange}
        onSave={onSave}
        onCancel={onCancel}
      />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
