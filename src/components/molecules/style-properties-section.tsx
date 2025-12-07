'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import { PropertyColorField } from '@/components/atoms/property-color-field';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface StylePropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function StylePropertiesSection({
  properties,
  onPropertyChange
}: StylePropertiesSectionProps) {
  return (
    <AccordionItem value="style">
      <AccordionTrigger>Style</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PropertyColorField
            id="color"
            label="Text Color"
            value={properties.color || ''}
            onChange={value => onPropertyChange('color', value)}
            defaultValue="#000000"
          />

          <PropertyColorField
            id="backgroundColor"
            label="Background"
            value={properties.backgroundColor || ''}
            onChange={value => onPropertyChange('backgroundColor', value)}
            defaultValue="#ffffff"
          />
        </div>

        <Separator />

        <PropertyFormField
          id="fontSize"
          label="Font Size"
          value={properties.fontSize || ''}
          onChange={value => onPropertyChange('fontSize', value)}
          placeholder="16px"
        />

        <PropertyFormField
          id="fontWeight"
          label="Font Weight"
          value={properties.fontWeight || ''}
          onChange={value => onPropertyChange('fontWeight', value)}
          placeholder="400"
        />

        <PropertyFormField
          id="textAlign"
          label="Text Align"
          value={properties.textAlign || ''}
          onChange={value => onPropertyChange('textAlign', value)}
          placeholder="left"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
