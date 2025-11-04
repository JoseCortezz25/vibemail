import { Code2Icon, EyeIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ViewModeToggleProps {
  onToggle: () => void;
  isPreview: boolean;
}

export const ViewModeToggle = ({
  onToggle,
  isPreview
}: ViewModeToggleProps) => {
  return (
    <div className="border-border bg-background inline-flex rounded-md border shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-r-md px-3 py-1.5 text-sm font-medium transition-colors',
          isPreview
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={isPreview}
      >
        <EyeIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors',
          !isPreview
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={!isPreview}
      >
        <Code2Icon className="size-4" />
      </button>
    </div>
  );
};
