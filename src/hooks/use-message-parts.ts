'use client';

import { useMemo } from 'react';
import type {
  ReasoningUIPart,
  SourceDocumentUIPart,
  SourceUrlUIPart,
  UIMessage
} from 'ai';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface UseMessagePartsProps {
  parts: UIMessage['parts'];
}

export function useMessageParts({ parts }: UseMessagePartsProps) {
  const toolInvocationParts = useMemo(
    () => parts?.filter(part => part.type.startsWith('tool-')),
    [parts]
  );

  const sourceParts = useMemo(
    () =>
      parts?.filter(
        part => part.type === 'source-url' || part.type === 'source-document'
      ) as SourceUrlUIPart[] | SourceDocumentUIPart[] | undefined,
    [parts]
  );

  const reasoningParts = useMemo(
    () =>
      parts?.find(part => part.type === 'reasoning') as
        | ReasoningUIPart
        | undefined,
    [parts]
  );

  const fileParts = useMemo(
    () => parts?.find(part => part.type === 'file') as FileUIPart | undefined,
    [parts]
  );

  return {
    toolInvocationParts,
    sourceParts,
    reasoningParts,
    fileParts
  };
}
