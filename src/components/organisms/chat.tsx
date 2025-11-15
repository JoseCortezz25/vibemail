'use client';

import { PromptTextarea } from '../molecules/prompt-textarea';
import { useChat } from '@ai-sdk/react';
import { Conversation } from './conversation';
import { useEmailStore } from '@/stores/email.store';
import { useUIStore } from '@/stores/ui.store';
import { generateEmail } from '@/actions/generate';
import { convertToModelMessages } from 'ai';

export const Chat = () => {
  const { setIsLoading, setEmail } = useEmailStore();
  const { setActiveView } = useUIStore();

  const { messages, sendMessage, status, addToolOutput, regenerate } = useChat({
    onToolCall: async toolCall => {
      console.log('toolCall', toolCall);

      if (toolCall.toolCall.toolName === 'createEmail') {
        try {
          setIsLoading(true);
          const { prompt } = toolCall.toolCall.input as { prompt: string };
          const modelMessages = convertToModelMessages(messages);

          const generatedEmail = await generateEmail(prompt, modelMessages);

          const email = JSON.parse(generatedEmail) as {
            subject: string;
            jsxBody: string;
            htmlBody: string;
          };

          setEmail({
            subject: email.subject,
            jsxBody: email.jsxBody,
            htmlBody: email.htmlBody
          });

          // Auto-switch to preview on mobile/tablet when email is generated
          if (window.innerWidth < 1024) {
            setActiveView('preview');
          }

          addToolOutput({
            state: 'output-available',
            tool: 'createEmail',
            toolCallId: toolCall.toolCall.toolCallId,
            output: email
          });
        } catch (error) {
          console.error('error', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (message: string, files: FileList) => {
    sendMessage({
      text: message,
      files: files
    });
  };

  return (
    <div className="border-border relative flex h-full min-h-[calc(100dvh-73px)] w-full flex-col items-center justify-between p-2 lg:min-h-[calc(100dvh-57px)] lg:border-r">
      {/* Messages list  */}
      <Conversation
        messages={messages}
        status={status}
        error={undefined}
        reload={regenerate}
        onEdit={() => {}}
        onDelete={() => {}}
        onShowCanvas={() => {}}
        isLoading={isLoading}
      />
      {/* Input prompt */}
      <PromptTextarea onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
