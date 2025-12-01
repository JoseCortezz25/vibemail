'use client';

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from '@/components/ui/prompt-input';
import { Button } from '@/components/ui/button';
import { ArrowUp, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { Source } from '../atoms/source';
import { InputUploadFiles } from './input-upload-file';

interface PromptTextareaProps {
  onSubmit: (message: string, files?: FileList) => void;
  isLoading: boolean;
}

export function PromptTextarea({ onSubmit, isLoading }: PromptTextareaProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRemove = (file: File) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(f => f.name !== file.name);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  const handleSubmitInput = () => {
    if (files && files.length > 0) {
      onSubmit(input, files);
    } else {
      onSubmit(input);
    }

    setFiles(undefined);
    setInput('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmitInput}
      className="w-full max-w-(--breakpoint-md) rounded-[10px]"
    >
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {Array.from(files).map((file, index) => (
            <Source
              key={index}
              filename={file.name}
              onRemove={() => handleFileRemove(file)}
            />
          ))}
        </div>
      )}

      <PromptInputTextarea placeholder="Ask me anything..." />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <PromptInputAction tooltip="Attach files">
          <InputUploadFiles setFiles={setFiles} fileInputRef={fileInputRef} />
        </PromptInputAction>

        <PromptInputAction
          tooltip={isLoading ? 'Stop generation' : 'Send message'}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-[10px] bg-black"
            onClick={handleSubmitInput}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
