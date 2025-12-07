'use client';

import { Button } from '@/components/ui/button';
import { MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignModeToggleProps {
  isEditMode: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

export function DesignModeToggle({
  isEditMode,
  isDisabled,
  onToggle
}: DesignModeToggleProps) {
  return (
    <Button
      variant="ghost"
      disabled={isDisabled}
      className={cn(
        'h-8 cursor-pointer rounded-[10px] p-2 text-sm transition-all disabled:cursor-not-allowed',
        !isEditMode
          ? 'bg-gray-100'
          : 'bg-black-700 hover:bg-black-700/80 text-white hover:text-white'
      )}
      onClick={onToggle}
    >
      <MousePointer2 className="size-4" />
      Design
    </Button>
  );
}
