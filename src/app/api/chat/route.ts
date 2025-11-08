import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // TODO: Add authentication/session validation here
  // const session = await auth();
  // if (!session?.user) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    maxTokens: 1000,
    temperature: 0.7
  });

  return result.toDataStreamResponse();
}
