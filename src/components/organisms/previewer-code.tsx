'use client';

import { useEmailStore } from '@/stores/email.store';
import { CodeBlock, CodeBlockCode } from '../ui/code-block';

export const PreviewerCode = () => {
  const { jsxBody, isLoading } = useEmailStore();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-3">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-sm">Generating email...</p>
        </div>
      </div>
    );
  }

  if (!jsxBody) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-2 px-4 text-center">
          <p className="text-sm">No code generated yet</p>
          <p className="text-muted-foreground/70 text-xs">
            Start a conversation to create your first email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-full overflow-hidden">
      <CodeBlock className="h-full">
        <CodeBlockCode code={jsxBody} language="tsx" theme="github-light" />
      </CodeBlock>
    </div>
  );
};
