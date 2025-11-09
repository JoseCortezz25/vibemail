'use client';

import { Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceToggleProps {
  onToggle: () => void;
  isDesktop: boolean;
}

export const DeviceToggle = ({ onToggle, isDesktop }: DeviceToggleProps) => {
  return (
    <div className="border-border bg-background inline-flex rounded-md border shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors',
          isDesktop
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={isDesktop}
        aria-label="Desktop view"
      >
        <Monitor className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-r-md px-3 py-1.5 text-sm font-medium transition-colors',
          !isDesktop
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={!isDesktop}
        aria-label="Mobile view"
      >
        <Smartphone className="size-4" />
      </button>
    </div>
  );
};
