import type { SourceDocumentUIPart, SourceUrlUIPart } from 'ai';
import { MessageSourceBadge } from '../atoms/message-source-badge';

interface MessageSourcesListProps {
  sourceParts?: (SourceUrlUIPart | SourceDocumentUIPart)[];
}

export function MessageSourcesList({ sourceParts }: MessageSourcesListProps) {
  if (!sourceParts || sourceParts.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex w-full flex-wrap gap-1">
      {sourceParts.map(source => {
        const url = 'url' in source ? source.url : undefined;
        return (
          <MessageSourceBadge
            key={source.sourceId}
            title={source.title ?? ''}
            url={url}
          />
        );
      })}
    </div>
  );
}
