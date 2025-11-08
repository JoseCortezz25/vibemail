'use client';

import { useState, useCallback } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from '../actions/chat.actions';
import type { Message } from '../schema';
import { CoreMessage } from 'ai';

/**
 * Custom hook to manage chat functionality with AI streaming
 *
 * Encapsulates all chat business logic including:
 * - Message state management
 * - Streaming AI responses
 * - Loading states
 * - Error handling
 *
 * @returns Chat state and control functions
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');

  /**
   * Send a message and stream the AI response
   */
  const handleSendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!content.trim() && (!files || files.length === 0)) return;

      try {
        setIsLoading(true);
        setError(null);

        // Add user message
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content,
          createdAt: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Convert messages to CoreMessage format for AI SDK
        const coreMessages: CoreMessage[] = [
          ...messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content
          }
        ];

        // Call server action and get stream
        const stream = await continueConversation(coreMessages);

        // Create assistant message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          createdAt: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Read and update stream
        for await (const delta of readStreamableValue(stream)) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + (delta ?? '') }
                : msg
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Chat error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  /**
   * Clear all messages
   */
  const handleClearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Stop current generation (if needed in the future)
   */
  const handleStopGeneration = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    input,
    setInput,
    handleSendMessage,
    handleClearMessages,
    handleStopGeneration
  };
}
