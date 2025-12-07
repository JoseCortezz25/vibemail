import { Markdown } from '../ui/markdown';

interface MessageContentSectionProps {
  content: string;
}

export function MessageContentSection({ content }: MessageContentSectionProps) {
  if (!content) {
    return null;
  }

  return <Markdown className="message-content">{content}</Markdown>;
}
