'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useEmailStore } from '@/stores/email.store';
import { DOWNLOAD_EMAIL_TEXT } from './download-email-button.text-map';

export const DownloadEmailButton = () => {
  const { htmlBody, subject } = useEmailStore();

  const handleDownload = () => {
    if (!htmlBody) return;

    try {
      // Create blob with HTML content
      const blob = new Blob([htmlBody], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Generate filename with sanitized subject and timestamp
      const sanitizedSubject = subject
        ? subject
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : DOWNLOAD_EMAIL_TEXT.fileName.fallback;

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${DOWNLOAD_EMAIL_TEXT.fileName.prefix}-${sanitizedSubject}-${timestamp}.html`;

      // Create temporary anchor element and trigger download
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      // Cleanup
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download email:', error);
    }
  };

  // Don't render button if no HTML content
  if (!htmlBody) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          aria-label={DOWNLOAD_EMAIL_TEXT.button.ariaLabel}
          className="absolute right-4 bottom-4 z-50 shadow-lg transition-all hover:shadow-xl md:right-5 md:bottom-5 lg:right-6 lg:bottom-6"
        >
          <Download className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        {DOWNLOAD_EMAIL_TEXT.button.tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
