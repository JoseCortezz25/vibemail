'use server';

import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';
import { createStreamableValue } from 'ai/rsc';

/**
 * Server action to handle chat completion with AI streaming
 *
 * @param messages - Array of chat messages
 * @returns Streamable text response from AI
 */
export async function continueConversation(messages: CoreMessage[]) {
  // TODO: Add authentication/session validation here
  // const session = await auth();
  // if (!session?.user) throw new Error('Unauthorized');

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    maxTokens: 1000,
    temperature: 0.7
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

/**
 * Alternative action for non-streaming responses
 * Use this if you need the full response at once
 */
export async function getChatCompletion(messages: CoreMessage[]) {
  // TODO: Add authentication/session validation here
  // const session = await auth();
  // if (!session?.user) throw new Error('Unauthorized');

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    maxTokens: 1000,
    temperature: 0.7
  });

  return result;
}
