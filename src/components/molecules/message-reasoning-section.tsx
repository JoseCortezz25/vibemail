import type { ReasoningUIPart } from 'ai';
import { MessageReasoningText } from '../atoms/message-reasoning-text';

interface MessageReasoningSectionProps {
  reasoningParts?: ReasoningUIPart;
}

export function MessageReasoningSection({
  reasoningParts
}: MessageReasoningSectionProps) {
  if (!reasoningParts || !reasoningParts.text) {
    return null;
  }

  return <MessageReasoningText text={reasoningParts.text} />;
}
