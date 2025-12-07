'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);

    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  }, []);

  const isCopied = useCallback(
    (text: string) => copiedText === text,
    [copiedText]
  );

  return {
    copyToClipboard,
    isCopied,
    copiedText
  };
}
