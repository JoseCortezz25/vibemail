import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Error Code */}
        <div className="relative mb-8">
          <span className="text-brand-blue text-[120px] leading-none font-bold tracking-tighter sm:text-[180px]">
            404
          </span>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl font-bold tracking-wider uppercase">
            Page not found
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Terminal-style error */}
        <div className="bg-black-900/10 text-black-100 dark:bg-black-950 mb-8 p-4 text-left font-mono text-xs">
          <p className="text-muted-foreground">$ maily --find-page</p>
          <p className="text-brand-red mt-2">
            Error: ENOENT - no such file or directory
          </p>
          <p className="text-muted-foreground mt-1">
            &gt; Suggestion: return to homepage
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link href="/">Go back home</Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-12 text-xs">
          Maily App — Lost? Let&apos;s get you back on track.
        </p>
      </div>
    </div>
  );
}
