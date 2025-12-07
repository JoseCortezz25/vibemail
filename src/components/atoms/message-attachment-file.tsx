import { File } from 'lucide-react';

interface MessageAttachmentFileProps {
  filename?: string;
}

export function MessageAttachmentFile({
  filename
}: MessageAttachmentFileProps) {
  return (
    <div className="bg-brand-green-light/10 flex cursor-pointer items-center gap-3 rounded-md p-2">
      <div className="bg-brand-green/10 text-brand-green flex h-[45px] w-[45px] items-center justify-center rounded-md">
        <File className="size-5" />
      </div>
      <span className="text-brand-green mr-1 text-sm font-semibold">
        {filename || 'file.pdf'}
      </span>
    </div>
  );
}
