'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy, Pencil, Trash } from 'lucide-react';

interface MessageActionButtonsProps {
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isCopied: boolean;
  showForUser?: boolean;
}

export function MessageActionButtons({
  onCopy,
  onEdit,
  onDelete,
  isCopied,
  showForUser = false
}: MessageActionButtonsProps) {
  return (
    <div
      className={cn(
        'flex w-full gap-2 self-end transition-opacity duration-200 group-hover:opacity-100 md:opacity-0',
        showForUser ? 'hidden justify-end md:flex' : 'justify-start'
      )}
    >
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
        className="group/item transition-all duration-500 hover:bg-red-500/10"
        onClick={onDelete}
      >
        <Trash className="size-4 transition-transform duration-500 group-hover/item:text-red-500" />
      </Button>

      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="size-4" />
      </Button>
    </div>
  );
}
