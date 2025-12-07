'use client';

import { cn } from '@/lib/utils';
import type { FileUIPart } from 'ai';
import { MessageAttachmentImage } from '../atoms/message-attachment-image';

interface MessageAttachmentsGridProps {
  attachments: FileUIPart[];
  messageId: string;
}

export function MessageAttachmentsGrid({
  attachments,
  messageId
}: MessageAttachmentsGridProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid max-w-[60%] gap-2 md:max-w-[40%]',
        attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
      )}
    >
      {attachments.map((attachment, index) => (
        <MessageAttachmentImage
          key={`${messageId}-${index}`}
          url={attachment.url}
          filename={attachment.filename}
          messageId={messageId}
          index={index}
        />
      ))}
    </div>
  );
}
