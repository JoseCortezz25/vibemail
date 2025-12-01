'use client';

import { useUIStore, ViewType } from '@/stores/ui.store';
import { useEmailStore } from '@/stores/email.store';
import { MessageSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ViewToggle = () => {
  const { activeView, setActiveView } = useUIStore();
  const { subject } = useEmailStore();

  const hasEmail = !!subject;

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
  };

  return (
    <div className="bg-muted inline-flex h-10 items-center justify-center rounded-lg p-1">
      <button
        onClick={() => handleViewChange('chat')}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          activeView === 'chat'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={activeView === 'chat'}
      >
        <MessageSquare className="h-4 w-4" />
        Chat
      </button>

      <button
        onClick={() => handleViewChange('preview')}
        disabled={!hasEmail}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          activeView === 'preview'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={activeView === 'preview'}
      >
        <Eye className="h-4 w-4" />
        Preview
      </button>
    </div>
  );
};
