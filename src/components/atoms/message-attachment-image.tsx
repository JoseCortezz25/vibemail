'use client';

import { DialogModal } from '../organisms/dialog';

interface MessageAttachmentImageProps {
  url: string;
  filename?: string;
  messageId: string;
  index: number;
}

export function MessageAttachmentImage({
  url,
  filename,
  messageId,
  index
}: MessageAttachmentImageProps) {
  return (
    <DialogModal image={url}>
      <img
        key={`${messageId}-${index}`}
        src={url}
        alt={filename || 'image'}
        className="h-full w-full cursor-pointer object-cover"
      />
    </DialogModal>
  );
}
