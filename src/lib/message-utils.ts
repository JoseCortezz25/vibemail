import type { FileUIPart, UIMessage } from 'ai';

/**
 * Extracts the text content from a UIMessage's parts array
 */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => (part as { type: 'text'; text: string }).text)
    .join('');
}

/**
 * Extracts file parts from a UIMessage
 */
export function getMessageFileParts(message: UIMessage) {
  return message.parts.filter(part => part.type === 'file');
}

/**
 * Extracts image file parts from a UIMessage
 */
export function getMessageImageParts(message: UIMessage) {
  return message.parts.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('image/')
  );
}

/**
 * Extracts PDF file parts from a UIMessage
 */
export function getMessagePdfParts(message: UIMessage) {
  return message.parts.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('application/pdf')
  );
}
