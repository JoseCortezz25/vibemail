import { z } from 'zod';

/**
 * Message schema for chat messages
 */
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  createdAt: z.date().optional()
});

/**
 * Chat request schema for server actions
 */
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  files: z.array(z.instanceof(File)).optional()
});

/**
 * Type exports
 */
export type Message = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
