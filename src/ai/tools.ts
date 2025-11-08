import { tool } from 'ai';
import { z } from 'zod';

export const createEmailTool = tool({
  description: 'Create the email template',
  inputSchema: z.object({
    prompt: z.string().describe('The prompt to create the email template')
  }),
  execute: async ({ prompt }) => {
    console.log('prompt', prompt);
    return `You have to create the email template based on the prompt`;
  }
});

export const modifyEmailTool = tool({
  description: 'Modify the email template',
  inputSchema: z.object({
    currentEmail: z.string().describe('The current email template'),
    prompt: z.string().describe('The prompt to modify the email template')
  }),
  execute: async ({ prompt }) => {
    console.log('prompt', prompt);
    return `You have to modify the email template based on the prompt`;
  }
});
