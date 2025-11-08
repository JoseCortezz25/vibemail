/**
 * Chat domain exports
 * Central export point for all chat-related functionality
 */

// Re-export AI SDK hooks for convenience
export { useChat } from 'ai/react';

// Types and schemas
export { messageSchema, chatRequestSchema } from './schema';
export type { Message, ChatRequest } from './schema';
