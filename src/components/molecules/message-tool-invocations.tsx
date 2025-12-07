'use client';

import { BookMarkedIcon } from 'lucide-react';
import { TextShimmerWave } from '../ui/text-shimmer-wave';
import { UIMessagePart, UIDataTypes, UITools } from 'ai';

interface MessageToolInvocationsProps {
  toolInvocationParts: UIMessagePart<UIDataTypes, UITools>[];
  onShowCanvas: (isShowing: boolean) => void;
}

export function MessageToolInvocations({
  toolInvocationParts,
  onShowCanvas
}: MessageToolInvocationsProps) {
  if (!toolInvocationParts || toolInvocationParts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {toolInvocationParts.map(toolInvocation => {
        switch (toolInvocation.type) {
          case 'tool-showPromptInCanvas': {
            const callId = toolInvocation.toolCallId;

            switch (toolInvocation.state) {
              case 'input-streaming':
                return (
                  <TextShimmerWave
                    key={callId}
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
                    <span className="text-sm">Showing prompt in canvas...</span>
                  </button>
                );
            }
            break;
          }
        }
      })}
    </div>
  );
}
