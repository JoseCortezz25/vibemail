import { z } from 'zod';

export const generatedEmailSchema = z.object({
  subject: z.string(),
  jsxBody: z.string(),
  htmlBody: z.string()
});
