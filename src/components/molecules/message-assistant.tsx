'use client';

import { Message, MessageActions } from '@/components/ui/message';
import {
  BookMarkedIcon,
  Check,
  Copy,
  Paperclip,
  RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  ReasoningUIPart,
  SourceDocumentUIPart,
  SourceUrlUIPart,
  UIMessage
} from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';
import { getMessageText } from '@/lib/message-utils';
import { TextShimmerWave } from '../ui/text-shimmer-wave';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface MessageAssistantProps {
  message: UIMessage;
  parts: UIMessage['parts'];
  onReload: () => void;
  onShowCanvas: (isShowing: boolean) => void;
}

export const MessageAssistant = ({
  message,
  parts,
  onShowCanvas,
  onReload
}: MessageAssistantProps) => {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  // Tool invocations now use tool-{toolName} type pattern
  const toolInvocationParts = parts?.filter(part =>
    part.type.startsWith('tool-')
  );

  const sourceParts = parts?.filter(
    part => part.type === 'source-url' || part.type === 'source-document'
  ) as SourceUrlUIPart[] | SourceDocumentUIPart[] | undefined;

  const reasoningParts = parts?.find(part => part.type === 'reasoning') as
    | ReasoningUIPart
    | undefined;

  const fileParts: FileUIPart | undefined = parts?.find(
    part => part.type === 'file'
  ) as FileUIPart | undefined;

  const textContent = getMessageText(message);

  return (
    <Message key={message.id} className="group justify-start">
      <div className="flex max-w-full flex-1 flex-col space-y-2 text-sm sm:max-w-[75%]">
        {reasoningParts && reasoningParts.text && (
          <div className="text-foreground bg-transparent">
            {reasoningParts.text}
          </div>
        )}

        {textContent && (
          <Markdown className="message-content">{textContent}</Markdown>
        )}

        {fileParts && (
          <div className="flex flex-col gap-2">
            <img
              src={`data:${fileParts.mimeType};base64,${fileParts.data}`}
              alt={fileParts.mimeType}
            />
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {toolInvocationParts.map(toolInvocation => {
              switch (toolInvocation.type) {
                case 'tool-showPromptInCanvas': {
                  const callId = toolInvocation.toolCallId;

                  // States: input-streaming, input-available, output-available, output-error
                  switch (toolInvocation.state) {
                    case 'input-streaming':
                      return (
                        <TextShimmerWave
                          className="font-mono text-sm"
                          duration={1}
                        >
                          Writing prompt...
                        </TextShimmerWave>
                      );
                    case 'output-available':
                      return (
                        <button
                          key={callId}
                          className="bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md p-2 text-gray-500"
                          onClick={() => onShowCanvas(true)}
                        >
                          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-md border-[1.5px] border-gray-200">
                            <BookMarkedIcon className="size-5" />
                          </div>
                          <span className="text-sm">
                            Showing prompt in canvas...
                          </span>
                        </button>
                      );
                  }
                  break;
                }
              }
            })}
          </div>
        )}

        {sourceParts && sourceParts.length > 0 && (
          <div className="mt-2 flex w-full flex-wrap gap-1">
            {sourceParts.map(source => (
              <div
                key={source.sourceId}
                className="text-brand-green bg-brand-green/10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              >
                <a
                  href={'url' in source ? source.url : ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Paperclip className="size-4" />
                  <p className="text-sm">{source.title}</p>
                </a>
              </div>
            ))}
          </div>
        )}

        <MessageActions className="w-full justify-start self-end transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => handleCopy(textContent)}
          >
            {copyMessage === textContent ? (
              <Check className="text-green-500" />
            ) : (
              <Copy className="transition-transform duration-500 group-hover/item:rotate-[-10deg]" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => onReload()}
          >
            <RefreshCcw className="transition-transform duration-700 group-hover/item:rotate-180" />
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
