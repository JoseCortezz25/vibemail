'use client';

import { useState, useRef, useCallback } from 'react';

interface UsePromptInputProps {
  onSubmit: (message: string, files?: FileList) => void;
}

export function usePromptInput({ onSubmit }: UsePromptInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRemove = useCallback(
    (file: File) => {
      if (!files) return;

      const newFiles = Array.from(files).filter(f => f.name !== file.name);
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    },
    [files]
  );

  const handleSubmit = useCallback(() => {
    if (files && files.length > 0) {
      onSubmit(input, files);
    } else {
      onSubmit(input);
    }

    // Reset state
    setFiles(undefined);
    setInput('');

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [input, files, onSubmit]);

  return {
    input,
    setInput,
    files,
    setFiles,
    fileInputRef,
    handleFileRemove,
    handleSubmit
  };
}
