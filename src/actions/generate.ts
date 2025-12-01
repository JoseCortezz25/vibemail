'use server';

import { generatedEmailSchema } from '@/lib/schema';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, ModelMessage } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export async function generateEmail(
  prompt: string,
  messages: ModelMessage[] // messages from the user with images
): Promise<string> {
  try {
    const imageMessages: ModelMessage[] = [];

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      system: `You are an expert email developer, expert in email marketing and AI assistant. 
        Tu tarea es crear el template de un email usando la libreria React Email.

        There are two possible intents:
        - The user wants to create a new email or change an existing one. This includes prompts like "create a welcome email", "change the button color", "add a section about our new feature", or if they upload an image.
        - The user is asking a general question that does not require changing the email content. This includes prompts like "what are some good subject lines?", "give me ideas for a newsletter", or "how can I improve my email's open rate?".
        
        Based on the intent, you will respond with a single JSON object conforming to the provided schema. Do not wrap it in markdown backticks.

        Instrucciones:
        - Debes generar el temaplte del email siguiendo las mejores prácticas de email marketing.
        - Debes generar el código del email siguiendo las mejores prácticas de React Email.
        - Tienes que generar 'subject' y 'jsxBody' para el email.
        - 'htmlBody' es el HTML del email.

        Output Format:
        - Debes generar el codigo del email usando React Email y todos sus componentes.
        - Debe ser responsive y adaptativo para todos los dispositivos.

        When modifying an existing email, you MUST preserve all 'data-vibe-id' attributes on unchanged elements.`,
      messages: [
        ...messages,
        ...imageMessages,
        { role: 'user', content: 'Request from user: ' + prompt }
      ],
      schema: generatedEmailSchema
    });

    return JSON.stringify(result.object);
  } catch (error) {
    console.error('error', error);
    throw new Error(JSON.stringify(error));
  }
}
