'use client';

import { Button } from '@/components/ui/button';
import { ArrowUp, Square } from 'lucide-react';

interface PromptSubmitButtonProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export function PromptSubmitButton({
  isLoading,
  onSubmit
}: PromptSubmitButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className="h-8 w-8 rounded-[10px] bg-black"
      onClick={onSubmit}
    >
      {isLoading ? (
        <Square className="size-5 fill-current" />
      ) : (
        <ArrowUp className="size-5" />
      )}
    </Button>
  );
}
