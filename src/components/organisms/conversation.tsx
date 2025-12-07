'use client';

import { TextShimmerWave } from '../ui/text-shimmer-wave';
import { ChatContainerRoot, ChatContainerContent } from '../ui/chat-container';
import { MessageUser } from './message-user';
import { MessageAssistant } from './message-assistant';
import { ChatEmptyState } from '../molecules/chat-empty-state';
import { ChatRequestOptions, FileUIPart, UIMessage } from 'ai';
import { cn } from '@/lib/utils';
import { MessageError } from '../atoms/message-error';

interface ConversationProps {
  messages: UIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: { error: Error | undefined; message: string };
  onEdit: (id: string, newText: string, newImages?: FileUIPart[]) => void;
  onDelete: (id: string) => void;
  onShowCanvas: (isShowing: boolean) => void;
  isLoading: boolean;
  reload: ({
    messageId,
    ...options
  }: ChatRequestOptions & { messageId?: string }) => Promise<void>;
}

export const Conversation = ({
  messages,
  error,
  reload,
  onEdit,
  onDelete,
  onShowCanvas,
  isLoading
}: ConversationProps) => {
  return (
    <ChatContainerRoot className="no-scrollbar h-full max-h-[calc(100dvh-190px)] w-full max-w-[768px] px-3 lg:max-h-[calc(100dvh-182px)]">
      <ChatContainerContent
        className={cn(
          messages.length === 0 && 'flex flex-col items-center justify-center',
          'no-scrollbar space-y-4" h-full'
        )}
      >
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <>
            {messages.map(message => {
              const isAssistant = message.role === 'assistant';

              if (isAssistant) {
                return (
                  <MessageAssistant
                    key={message.id}
                    message={message}
                    parts={message.parts}
                    onReload={() => reload({ messageId: message.id })}
                    onShowCanvas={onShowCanvas}
                  />
                );
              }

              return (
                <MessageUser
                  key={message.id}
                  message={message}
                  onEdit={onEdit}
                  onReload={() => reload({ messageId: message.id })}
                  onDelete={onDelete}
                />
              );
            })}

            {error.error && (
              <MessageError
                error={error.message}
                reload={() =>
                  reload({ messageId: messages[messages.length - 1].id })
                }
              />
            )}

            {isLoading && messages.length > 0 && (
              <div className="group min-h-scroll-anchor mx-auto mt-[20px] flex w-full max-w-3xl flex-col items-start gap-2 px-2 pb-2">
                <TextShimmerWave className="font-mono text-sm" duration={1}>
                  Cooking email...
                </TextShimmerWave>
              </div>
            )}
          </>
        )}
      </ChatContainerContent>
    </ChatContainerRoot>
  );
};
