'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import { PropertyTextareaField } from '@/components/atoms/property-textarea-field';
import type {
  ElementType,
  ElementProperties
} from '@/stores/visual-edit.store';

interface ContentPropertiesSectionProps {
  elementType: ElementType;
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function ContentPropertiesSection({
  elementType,
  properties,
  onPropertyChange
}: ContentPropertiesSectionProps) {
  const isTextElement = ['text', 'button', 'link'].includes(elementType);
  const isImageElement = elementType === 'image';
  const isLinkElement = elementType === 'link';

  return (
    <AccordionItem value="content">
      <AccordionTrigger>Content</AccordionTrigger>
      <AccordionContent className="space-y-4">
        {isTextElement && (
          <PropertyTextareaField
            id="content"
            label="Text Content"
            value={properties.content || ''}
            onChange={value => onPropertyChange('content', value)}
            placeholder="Enter text content..."
          />
        )}

        {isImageElement && (
          <>
            <PropertyFormField
              id="src"
              label="Image URL"
              type="url"
              value={properties.src || ''}
              onChange={value => onPropertyChange('src', value)}
              placeholder="https://..."
            />

            <PropertyFormField
              id="alt"
              label="Alt Text"
              value={properties.alt || ''}
              onChange={value => onPropertyChange('alt', value)}
              placeholder="Describe the image..."
            />
          </>
        )}

        {isLinkElement && (
          <PropertyFormField
            id="href"
            label="Link URL"
            type="url"
            value={properties.href || ''}
            onChange={value => onPropertyChange('href', value)}
            placeholder="https://..."
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
