'use client';

import { PromptTextarea } from '../molecules/prompt-textarea';
import { useChat } from '@ai-sdk/react';
import { Conversation } from './conversation';
import { useEmailStore } from '@/stores/email.store';

export const Chat = () => {
  const { setIsLoading } = useEmailStore();

  const { messages, sendMessage, status } = useChat({
    onToolCall: async ({ toolCall }) => {
      console.log('toolCall', toolCall);
      if (toolCall.toolName === 'createEmail') {
        setIsLoading(true);
        // generate email
        //
        console.log('toolCall.input', toolCall);
        //  const prompt = (toolCall.input as { prompt: string }).prompt;
        // console.log('prompt to generate email', prompt);

        // // const generatedEmail = await generateEmail(prompt, messages);
        // // const email = JSON.parse(generatedEmail) as {
        // //   subject: string;
        // //   jsxBody: string;
        // //   htmlBody: string;
        // // };

        // console.log('generatedEmail', email);
        // setEmail({
        //   subject: email.subject,
        //   jsxBody: email.jsxBody,
        //   htmlBody: email.htmlBody
        // });
        setIsLoading(false);
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
    <div className="border-border relative flex h-full min-h-[calc(100dvh-57px)] w-full flex-col items-center justify-between border-r p-2">
      {/* Messages list  */}
      <Conversation
        messages={messages}
        status={status}
        error={undefined}
        reload={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onShowCanvas={() => {}}
      />
      {/* Input prompt */}
      <PromptTextarea onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
