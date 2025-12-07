'use client';

import { MessageSquare } from 'lucide-react';

export const ChatEmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-8">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <MessageSquare className="text-muted-foreground h-8 w-8" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-foreground text-lg font-semibold">
          Welcome to Maily Agent
        </h3>
        <p className="text-muted-foreground max-w-[280px] text-sm">
          Send a message to begin creating your email with AI assistance.
        </p>
      </div>
    </div>
  );
};
