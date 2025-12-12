'use client';

import { PromptTextarea } from '@/domains/chat/components/organisms/prompt-textarea';
import { UIMessage, useChat } from '@ai-sdk/react';
import { Conversation } from './conversation';
import { useEmailStore } from '@/stores/email.store';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useCallback, useState, useRef, useEffect } from 'react';
import { createFileParts } from '@/lib/utils';
import { toast } from 'sonner';
import { VisualEdits } from '@/domains/visual-editing/components/organisms/element-properties-panel';
import { DefaultChatTransport, FileUIPart } from 'ai';
import { useModelStore } from '@/stores/model.store';
import { useUIStore } from '@/stores/ui.store';
import {
  useFreeUsageStore,
  FREE_LIMIT,
  selectFreeUsed
} from '@/stores/free-usage.store';

export const Chat = () => {
  const { setIsLoading, setEmail, htmlBody } = useEmailStore();
  const { selectedElement, isEditMode, setEditMode, deselectElement } =
    useVisualEditStore();
  const { model, apiKey, hasHydrated } = useModelStore();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setActiveView } = useUIStore();
  const { registerEmail } = useFreeUsageStore();
  const freeUsed = useFreeUsageStore(selectFreeUsed);

  // Use refs to keep updated values accessible in the transport closure
  const modelRef = useRef(model);
  const apiKeyRef = useRef(apiKey);
  const isFreeModeRef = useRef(apiKey.trim() === '');

  // Keep refs in sync with current values (only after hydration)
  useEffect(() => {
    if (hasHydrated) {
      modelRef.current = model;
      apiKeyRef.current = apiKey;
    }
  }, [model, apiKey, hasHydrated]);

  const { messages, sendMessage, status, setMessages, regenerate, error } =
    useChat({
      transport: new DefaultChatTransport({
        body: () => ({
          currentModel: modelRef.current,
          modelApiKey: apiKeyRef.current,
          isFreeMode: isFreeModeRef.current
        })
      }),
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
            if (output.htmlBody) {
              registerEmail(output.subject);
            }

            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (isMobile) {
              setActiveView('preview');
            }
          }
        });
      },
      onError: error => {
        console.log('error', error);
        toast.error('Error generating email. Try again later.');

        if (error.message.includes('You exceeded your current quota')) {
          setErrorMessage(
            'You exceeded your current quota. Please review your usage and upgrade to a paid plan with your own API key.'
          );
          return;
        }

        if (
          error.message.includes('Please use API Key') ||
          apiKeyRef.current === ''
        ) {
          setErrorMessage(
            'You have not configured your API key. Please go to settings and configure your API key.'
          );
          return;
        }

        if (error.message.includes('Google Generative AI API key is missing')) {
          setErrorMessage('Google Gemini API key is missing.');
          return;
        }

        if (error.message.includes('You exceeded your current quota')) {
          setErrorMessage('You exceeded your current quota.');
          return;
        }

        if (
          error.message.includes('Incorrect API key provided') ||
          error.message.includes('API key not valid')
        ) {
          setErrorMessage('Incorrect API key provided.');
          return;
        }

        setErrorMessage('Error generating email. Try again later.');
      }
    });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = async (prompt: string, images?: FileList) => {
    // Build the prompt with element context if selected
    let finalPrompt = prompt;

    if (selectedElement) {
      const elementContext = `<selected-element>
      Type: ${selectedElement.type}
      Code: ${selectedElement.code}
      </selected-element>
      
      ${prompt}`;
      finalPrompt = elementContext;

      setEditMode(false);
      deselectElement();
    }

    if (images) {
      const imagePromises = createFileParts(images);
      const imageParts = await Promise.all(imagePromises);

      const messageWithImages = {
        role: 'user' as const,
        parts: [{ type: 'text' as const, text: finalPrompt }, ...imageParts]
      };
      sendMessage(messageWithImages);
    } else {
      sendMessage({ text: finalPrompt });
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
    <div className="border-border relative flex h-full max-h-[calc(100dvh-73px)] min-h-[calc(100dvh-73px)] w-full flex-col items-center justify-between p-2 md:max-h-[calc(100dvh-57px)] md:min-h-[calc(100dvh-57px)] lg:border-r">
      {selectedElement ? (
        <VisualEdits />
      ) : (
        <Conversation
          messages={messages}
          status={status}
          error={{ error, message: errorMessage }}
          reload={regenerate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowCanvas={() => {}}
          isLoading={isLoading}
        />
      )}

      {/* Input prompt */}
      <PromptTextarea
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditMode={isEditMode}
        hasHtmlBody={!!htmlBody}
        isDisabled={freeUsed >= FREE_LIMIT}
        onToggleEditMode={() => setEditMode(!isEditMode)}
      />
    </div>
  );
};
