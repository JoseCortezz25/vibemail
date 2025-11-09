import { generateEmail } from '@/actions/generate';
import { tool } from 'ai';
import { z } from 'zod';

export const createEmailTool = tool({
  description: 'Crea el template del email',
  inputSchema: z.object({
    prompt: z
      .string()
      .describe(
        'El prompt para crear el template del email. El prompt se creo con base a la conversacion con el usuario.'
      )
  }),
  execute: async ({ prompt }, { messages }) => {
    // console.log('prompt', prompt);
    // return `You have to create the email template based on the prompt`;

    const generatedEmail = await generateEmail(prompt, messages);
    const email = JSON.parse(generatedEmail) as {
      subject: string;
      jsxBody: string;
      htmlBody: string;
    };

    console.log('email', email);

    return `Email generated successfully. This is the subject: ${email.subject} and this is the html body: ${email.htmlBody}`;
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
