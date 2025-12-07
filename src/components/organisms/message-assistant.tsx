'use client';

import { Message, MessageActions } from '@/components/ui/message';
import type { UIMessage } from 'ai';
import { getMessageText } from '@/lib/message-utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useMessageParts } from '@/hooks/use-message-parts';
import { MessageReasoningSection } from '@/components/molecules/message-reasoning-section';
import { MessageContentSection } from '@/components/molecules/message-content-section';
import { MessageFilesSection } from '@/components/molecules/message-files-section';
import { MessageToolInvocations } from '@/components/molecules/message-tool-invocations';
import { MessageSourcesList } from '@/components/molecules/message-sources-list';
import { MessageAssistantActions } from '@/components/molecules/message-assistant-actions';

interface MessageAssistantProps {
  message: UIMessage;
  parts: UIMessage['parts'];
  onReload: () => void;
  onShowCanvas: (isShowing: boolean) => void;
}

export function MessageAssistant({
  message,
  parts,
  onShowCanvas,
  onReload
}: MessageAssistantProps) {
  const textContent = getMessageText(message);

  // Custom hooks for business logic
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const { toolInvocationParts, sourceParts, reasoningParts, fileParts } =
    useMessageParts({ parts });

  return (
    <Message key={message.id} className="group justify-start">
      <div className="flex max-w-full flex-1 flex-col space-y-2 text-sm sm:max-w-[75%]">
        <MessageReasoningSection reasoningParts={reasoningParts} />

        <MessageContentSection content={textContent} />

        <MessageFilesSection fileParts={fileParts} />

        <MessageToolInvocations
          toolInvocationParts={toolInvocationParts || []}
          onShowCanvas={onShowCanvas}
        />

        <MessageSourcesList sourceParts={sourceParts} />

        <MessageActions>
          <MessageAssistantActions
            onCopy={() => copyToClipboard(textContent)}
            onReload={onReload}
            isCopied={isCopied(textContent)}
          />
        </MessageActions>
      </div>
    </Message>
  );
}
