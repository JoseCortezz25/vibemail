import { Paperclip } from 'lucide-react';

interface MessageSourceBadgeProps {
  title: string;
  url?: string;
}

export function MessageSourceBadge({
  title,
  url = ''
}: MessageSourceBadgeProps) {
  return (
    <div className="text-brand-green bg-brand-green/10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Paperclip className="size-4" />
        <p className="text-sm">{title}</p>
      </a>
    </div>
  );
}
