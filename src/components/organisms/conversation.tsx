'use client';

import { TextShimmerWave } from '../ui/text-shimmer-wave';
import { ChatContainerRoot, ChatContainerContent } from '../ui/chat-container';
import { MessageUser } from '../molecules/message-user';
import { MessageAssistant } from '../molecules/message-assistant';
import { UIMessage } from 'ai';

interface ConversationProps {
  messages: UIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: Error | undefined;
  reload: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onShowCanvas: (isShowing: boolean) => void;
}

export const Conversation = ({
  messages,
  status,
  error,
  reload,
  onEdit,
  onDelete,
  onShowCanvas
}: ConversationProps) => {
  return (
    <ChatContainerRoot className="h-full max-h-[calc(100dvh-182px)] px-3">
      <ChatContainerContent className="space-y-4">
        {messages.map(message => {
          const isAssistant = message.role === 'assistant';

          if (isAssistant) {
            return (
              <MessageAssistant
                key={message.id}
                message={message}
                parts={message.parts}
                onReload={reload}
                onShowCanvas={onShowCanvas}
              />
            );
          }

          return (
            <MessageUser
              key={message.id}
              message={message}
              onEdit={onEdit}
              onReload={reload}
              onDelete={onDelete}
            />
          );
        })}

        {error && (
          <div className="flex items-center justify-center gap-2 rounded-md bg-red-100 p-2 text-red-950">
            <p>An error occurred. {error.message}</p>
            <button type="button" onClick={reload} className="font-bold">
              Retry
            </button>
          </div>
        )}

        {status === 'submitted' && messages.length > 0 && (
          <div className="group min-h-scroll-anchor mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 pb-2">
            <TextShimmerWave className="font-mono text-sm" duration={1}>
              Thinking...
            </TextShimmerWave>
          </div>
        )}
      </ChatContainerContent>
    </ChatContainerRoot>
  );
};
