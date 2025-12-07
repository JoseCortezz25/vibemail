'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';

interface MessageAssistantActionsProps {
  onCopy: () => void;
  onReload: () => void;
  isCopied: boolean;
}

export function MessageAssistantActions({
  onCopy,
  onReload,
  isCopied
}: MessageAssistantActionsProps) {
  return (
    <div className="w-full justify-start self-end transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
      <Button
        variant="ghost"
        size="icon"
        className="group/item"
        onClick={onCopy}
      >
        {isCopied ? (
          <Check className="text-green-500" />
        ) : (
          <Copy className="transition-transform duration-500 group-hover/item:rotate-[-10deg]" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="group/item"
        onClick={onReload}
      >
        <RefreshCcw className="transition-transform duration-700 group-hover/item:rotate-180" />
      </Button>
    </div>
  );
}
