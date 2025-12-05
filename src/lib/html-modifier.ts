import { parse } from 'node-html-parser';
import type { ElementProperties } from '@/stores/visual-edit.store';

export interface ModifyElementOptions {
  htmlBody: string;
  elementId: string;
  properties: ElementProperties;
}

/**
 * Modifies a specific element in the HTML by its data-vibe-id
 */
export function modifyElementInHTML({
  htmlBody,
  elementId,
  properties
}: ModifyElementOptions): string {
  // Parse the HTML
  const root = parse(htmlBody);

  // Find the element by data-vibe-id
  const element = root.querySelector(`[data-vibe-id="${elementId}"]`);

  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return htmlBody;
  }

  // Update content
  if (properties.content !== undefined) {
    // Check if it's an image (images don't have text content)
    if (element.tagName !== 'IMG') {
      element.textContent = properties.content;
    }
  }

  // Update styles
  const stylesToUpdate: Record<string, string> = {};

  if (properties.color) stylesToUpdate.color = properties.color;
  if (properties.backgroundColor)
    stylesToUpdate['background-color'] = properties.backgroundColor;
  if (properties.fontSize) stylesToUpdate['font-size'] = properties.fontSize;
  if (properties.fontWeight)
    stylesToUpdate['font-weight'] = properties.fontWeight;
  if (properties.fontFamily)
    stylesToUpdate['font-family'] = properties.fontFamily;
  if (properties.textAlign) stylesToUpdate['text-align'] = properties.textAlign;
  if (properties.padding) stylesToUpdate.padding = properties.padding;
  if (properties.margin) stylesToUpdate.margin = properties.margin;
  if (properties.width) stylesToUpdate.width = properties.width;
  if (properties.height) stylesToUpdate.height = properties.height;

  // Apply styles
  if (Object.keys(stylesToUpdate).length > 0) {
    const currentStyle = element.getAttribute('style') || '';
    const styleObj = parseStyleString(currentStyle);

    // Merge new styles
    Object.assign(styleObj, stylesToUpdate);

    // Convert back to style string
    const newStyleString = Object.entries(styleObj)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    element.setAttribute('style', newStyleString);
  }

  // Update image-specific attributes
  if (element.tagName === 'IMG') {
    if (properties.src) {
      element.setAttribute('src', properties.src);
    }
    if (properties.alt !== undefined) {
      element.setAttribute('alt', properties.alt);
    }
  }

  // Update link-specific attributes
  if (element.tagName === 'A') {
    if (properties.href) {
      element.setAttribute('href', properties.href);
    }
    if (properties.target) {
      element.setAttribute('target', properties.target);
    }
  }

  // Return the modified HTML
  return root.toString();
}

/**
 * Parses a style string into an object
 */
function parseStyleString(styleString: string): Record<string, string> {
  const styleObj: Record<string, string> = {};

  if (!styleString) return styleObj;

  const styles = styleString.split(';').filter(s => s.trim());

  for (const style of styles) {
    const [key, value] = style.split(':').map(s => s.trim());
    if (key && value) {
      styleObj[key] = value;
    }
  }

  return styleObj;
}
