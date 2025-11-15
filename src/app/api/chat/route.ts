import { createEmailTool } from '@/ai/tools';
import { SYSTEM_PROMPT } from '@/ai/prompts';
import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  ModelMessage,
  streamText,
  UIMessage
} from 'ai';
import { createUIMessageStream } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  const stream = createUIMessageStream({
    // We use "writer" to write message fragmentws in a secuence UI
    async execute({ writer }) {
      // Create start part of UIMessage
      writer.write({
        type: 'start'
      });

      // Agent Consultant
      const streamAgentConsultant = streamText({
        model: google('gemini-2.5-flash'),
        system: SYSTEM_PROMPT,
        messages: modelMessages,
        tools: {
          createEmail: createEmailTool
        }
      });

      writer.merge(streamAgentConsultant.toUIMessageStream());
      await streamAgentConsultant.consumeStream(); // consumeStream means consume the all stream of messages without process or show it in the UI
    }
  });

  return createUIMessageStreamResponse({ stream });
}
