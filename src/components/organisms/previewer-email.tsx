'use client';

import { useEffect, useRef } from 'react';
import { useEmailStore } from '@/stores/email.store';
import { cn } from '@/lib/utils';
import { DownloadEmailButton } from '../molecules/download-email-button';
import { useElementSelection } from '@/hooks/use-element-selection';
import { useVisualEditStore } from '@/stores/visual-edit.store';

interface PreviewerEmailProps {
  isDesktop: boolean;
}

export const PreviewerEmail = ({ isDesktop }: PreviewerEmailProps) => {
  const { htmlBody, isLoading } = useEmailStore();
  const { isEditMode } = useVisualEditStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { attachSelectionListeners, removeSelectionListeners } =
    useElementSelection(iframeRef);

  // Load HTML into iframe
  useEffect(() => {
    if (iframeRef.current && htmlBody) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlBody);
        iframeDoc.close();

        // Attach selection listeners after content loads
        if (isEditMode) {
          setTimeout(() => {
            attachSelectionListeners();
          }, 100);
        }
      }
    }
  }, [htmlBody, isEditMode, attachSelectionListeners]);

  // Manage selection listeners based on edit mode
  useEffect(() => {
    if (isEditMode && htmlBody) {
      attachSelectionListeners();
    } else {
      removeSelectionListeners();
    }

    return () => {
      removeSelectionListeners();
    };
  }, [
    isEditMode,
    htmlBody,
    attachSelectionListeners,
    removeSelectionListeners
  ]);

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

  if (!htmlBody) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-2 px-4 text-center">
          <p className="text-sm">No email generated yet</p>
          <p className="text-muted-foreground/70 text-xs">
            Start a conversation to create your first email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-auto p-6">
      {/* Email Preview */}
      <div
        className={cn(
          'bg-background transition-all duration-300',
          isDesktop ? 'h-[600px] w-full max-w-7xl' : 'h-[667px] w-[375px]',
          'border-border overflow-hidden rounded-lg border shadow-lg'
        )}
      >
        <iframe
          ref={iframeRef}
          title="Email Preview"
          className="h-full w-full"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Download Button */}
      <DownloadEmailButton />
    </div>
  );
};
