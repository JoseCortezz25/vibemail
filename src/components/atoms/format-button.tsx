'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export type FormatButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * FormatButton - Atom component for formatting actions
 *
 * A button with icon and tooltip for text formatting actions in the editor.
 * Shows active state when the format is currently applied.
 *
 * @example
 * ```tsx
 * <FormatButton
 *   icon={Bold}
 *   label="Bold"
 *   onClick={() => applyFormat('bold')}
 *   isActive={isBold}
 * />
 * ```
 */
export function FormatButton({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  className
}: FormatButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isActive ? 'default' : 'ghost'}
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn('h-8 w-8', className)}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
