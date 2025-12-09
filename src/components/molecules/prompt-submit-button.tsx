'use client';

import { Button } from '@/components/ui/button';
import { ArrowUp, Square } from 'lucide-react';
import type { ComponentProps } from 'react';

interface PromptSubmitButtonProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export function PromptSubmitButton({
  isLoading,
  onSubmit,
  ...props
}: PromptSubmitButtonProps & ComponentProps<'button'>) {
  return (
    <Button
      variant="default"
      size="icon"
      className="h-8 w-8 rounded-[10px]"
      onClick={onSubmit}
      {...props}
    >
      {isLoading ? (
        <Square className="size-5 fill-current" />
      ) : (
        <ArrowUp className="size-5" />
      )}
    </Button>
  );
}
