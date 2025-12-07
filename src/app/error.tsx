'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Error Code */}
        <div className="relative mb-8">
          <span className="text-brand-blue text-[120px] leading-none font-bold tracking-tighter sm:text-[180px]">
            500
          </span>
          <div className="bg-brand-blue absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2" />
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl font-bold tracking-wider uppercase">
            Something went wrong
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
        </div>

        {/* Terminal-style error */}
        <div className="bg-black-900/10 text-black-100 dark:bg-black-950 mb-8 p-4 text-left font-mono text-xs">
          <p className="text-muted-foreground">$ maily --status</p>
          <p className="text-brand-red mt-2">
            Error: Internal server error occurred
          </p>
          {error.digest && (
            <p className="text-muted-foreground mt-1">
              &gt; Error ID: {error.digest}
            </p>
          )}
          <p className="text-muted-foreground mt-1">
            &gt; Attempting recovery...
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            Go back home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-12 text-xs">
          Maily App — We&apos;re working on fixing this issue.
        </p>
      </div>
    </div>
  );
}
