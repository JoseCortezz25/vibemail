'use client';

import { useEffect, useRef } from 'react';

interface MessageEditTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MessageEditTextarea({
  value,
  onChange,
  onSave,
  onCancel
}: MessageEditTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <textarea
      ref={textareaRef}
      className="w-full resize-none bg-transparent outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSave();
        }
        if (e.key === 'Escape') {
          onCancel();
        }
      }}
    />
  );
}
