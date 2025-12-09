import { generatedEmailSchema } from '@/lib/schema';
import { Model } from '@/stores/model.store';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, ModelMessage, tool } from 'ai';
import { z } from 'zod';

export const createEmailTool = (model: Model, apiKey: string) =>
  tool({
    description: 'Crea el template del email',
    inputSchema: z.object({
      prompt: z
        .string()
        .describe(
          'El prompt para crear el template del email. El prompt se creo con base a la conversacion con el usuario.'
        )
    }),
    execute: async ({ prompt }, { messages }) => {
      try {
        const allMessages: ModelMessage[] = [];
        const google = createGoogleGenerativeAI({ apiKey });

        const result = await generateObject({
          model: google(model),
          system: `You are an expert email developer, expert in email marketing and AI assistant. Tu tarea es crear el template de un email usando la libreria React Email.

        Instrucciones:
        - Debes generar el temaplte del email siguiendo las mejores prácticas de email marketing.
        - Debes generar el código del email siguiendo las mejores prácticas de React Email.
        - Tienes que generar 'subject' y 'jsxBody' para el email.
        - 'htmlBody' es el HTML del email.

        Output Format:
        - Debes generar el codigo del email usando React Email y todos sus componentes.
        - Debe ser responsive y adaptativo para todos los dispositivos.

        When modifying an existing email, you MUST preserve all 'data-vibe-id' attributes on unchanged elements.
        
        
        Identifica que elementos son necesarios que sea una imagen.
        Si necesitas una imagen, usa la siguiente URL: https://placehold.co/600x400
        Esta es al documentación: 
        <placeholder-image>
        Guía rápida para generar imágenes con Placehold.co
        Placehold.co es un servicio gratuito para generar imágenes placeholder
        de forma rápida.

        1. Tamaño
        https://placehold.co/600x400
        https://placehold.co/400

        2. Formato
        https://placehold.co/600x400/png
        https://placehold.co/600x400.png

        3. Colores
        https://placehold.co/600x400/000/FFF
        https://placehold.co/600x400/orange/white

        4. Texto
        https://placehold.co/600x400?text=Hello+World
        https://placehold.co/600x400?text=Hello
        5. Fuente
        https://placehold.co/600x400?font=roboto
        6. Retina
        https://placehold.co/600x400@2x.png
        </placeholder-image>
        `,
          messages: [
            ...messages,
            ...allMessages,
            { role: 'user', content: 'Request from user: ' + prompt }
          ],
          schema: generatedEmailSchema
        });

        console.log('EMAIL GENERATE:', result);
        return result.object;
      } catch (error) {
        console.log('Error generating email:', error);
        return `Error generating email: ${error}`;
      }
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
