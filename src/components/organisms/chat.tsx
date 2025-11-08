'use client';

import { PromptTextarea } from '../molecules/prompt-textarea';
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor
} from '../ui/chat-container';
import { useChat } from '@/domains/chat';

export const Chat = () => {
  const { messages, input, setInput, handleSubmit, isLoading, error, stop } =
    useChat({
      api: '/api/chat',
      onError: error => {
        console.error('Chat error:', error);
      }
    });

  return (
    <div className="border-border relative flex h-full min-h-[calc(100dvh-57px)] w-full max-w-[400px] flex-col justify-between border-r p-2">
      {/* Messages list */}
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Start a conversation
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto max-w-[85%]'
                    : 'bg-muted max-w-[85%]'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            ))
          )}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {error.message}
            </div>
          )}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input prompt */}
      <PromptTextarea
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </div>
  );
};
