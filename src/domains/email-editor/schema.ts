import { z } from 'zod';

/**
 * Email format types
 */
export type EmailFormat = 'text' | 'html';

/**
 * Email data schema
 */
export const emailSchema = z.object({
  to: z.string().email().optional().or(z.literal('')),
  subject: z.string(),
  content: z.string(),
  format: z.enum(['text', 'html']).default('html')
});

/**
 * Email editor state schema
 */
export const emailEditorStateSchema = z.object({
  email: emailSchema,
  isModified: z.boolean().default(false),
  lastSaved: z.date().optional()
});

/**
 * Type exports
 */
export type Email = z.infer<typeof emailSchema>;
export type EmailEditorState = z.infer<typeof emailEditorStateSchema>;
