'use client';

import { useEffect } from 'react';
import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} bg-[#0d0d0d] font-mono text-[#f5f5f5] antialiased`}
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
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
                Critical Error
              </h1>
              <p className="text-muted-foreground text-sm">
                A critical error occurred. Please try refreshing the page.
              </p>
            </div>

            {/* Terminal-style error */}
            <div className="bg-black-900/10 text-black-100 mb-8 p-4 text-left font-mono text-xs">
              <p className="text-muted-foreground">$ maily --status</p>
              <p className="text-brand-blue mt-2">
                Fatal: Application crashed unexpectedly
              </p>
              {error.digest && (
                <p className="text-muted-foreground mt-1">
                  &gt; Error ID: {error.digest}
                </p>
              )}
              <p className="text-muted-foreground mt-1">
                &gt; Manual reset required
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={reset}
                className="cursor-pointer bg-[#f5f5f5] px-8 py-3 text-sm font-bold text-[#0d0d0d] transition-opacity hover:opacity-90"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="cursor-pointer border border-[#3b3b3b] bg-transparent px-8 py-3 text-sm font-bold text-[#f5f5f5] transition-opacity hover:opacity-80"
              >
                Go back home
              </button>
            </div>

            {/* Footer */}
            <p className="mt-12 text-xs text-[#6e6e6e]">
              Maily App — Something went very wrong. We apologize.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
