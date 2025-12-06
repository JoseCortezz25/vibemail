'use client';

import { PromptTextarea } from '../molecules/prompt-textarea';
import { UIMessage, useChat } from '@ai-sdk/react';
import { Conversation } from './conversation';
import { useEmailStore } from '@/stores/email.store';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useCallback } from 'react';
import { createFileParts } from '@/lib/utils';
import { toast } from 'sonner';
import { VisualEdits } from './element-properties-panel';
import { FileUIPart } from 'ai';

export const Chat = () => {
  const { setIsLoading, setEmail } = useEmailStore();
  const { selectedElementId } = useVisualEditStore();
  const { messages, sendMessage, status, setMessages, regenerate } = useChat({
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'createEmail') {
        setIsLoading(true);
      }
    },
    onFinish: async ({ message }) => {
      const parts = message.parts;

      parts.map(part => {
        if (part.type === 'tool-createEmail') {
          const output = part.output as {
            subject: string;
            jsxBody: string;
            htmlBody: string;
          };
          setEmail({
            subject: output.subject,
            jsxBody: output.jsxBody,
            htmlBody: output.htmlBody
          });
          setIsLoading(false);
        }
      });
    },
    onData: async ({ data }) => {
      console.log('data', data);
    },
    onError: error => {
      console.log('error', error);
      toast.error('Error generating email. Try again later.');
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = async (prompt: string, images?: FileList) => {
    if (images) {
      const imagePromises = createFileParts(images);
      const imageParts = await Promise.all(imagePromises);

      const messageWithImages = {
        role: 'user' as const,
        parts: [{ type: 'text' as const, text: prompt }, ...imageParts]
      };
      sendMessage(messageWithImages);
    } else {
      sendMessage({ text: prompt });
    }
  };

  const handleEdit = useCallback(
    (id: string, newText: string, newImages?: FileUIPart[]) => {
      const findMessages: UIMessage[] = messages.map((message: UIMessage) =>
        message.id === id
          ? {
              ...message,
              parts: [{ type: 'text', text: newText }, ...(newImages || [])]
            }
          : message
      );

      setMessages(findMessages);
    },
    [messages, setMessages]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter(message => message.id !== id));
    },
    [messages, setMessages]
  );

  return (
    <div className="border-border relative flex h-full min-h-[calc(100dvh-73px)] w-full flex-col items-center justify-between p-2 lg:min-h-[calc(100dvh-57px)] lg:border-r">
      {selectedElementId ? (
        <VisualEdits />
      ) : (
        <Conversation
          messages={messages}
          status={status}
          error={undefined}
          reload={regenerate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowCanvas={() => {}}
          isLoading={isLoading}
        />
      )}

      {/* Input prompt */}
      <PromptTextarea onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
