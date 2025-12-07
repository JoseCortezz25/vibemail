'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface LayoutPropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function LayoutPropertiesSection({
  properties,
  onPropertyChange
}: LayoutPropertiesSectionProps) {
  return (
    <AccordionItem value="layout">
      <AccordionTrigger>Layout</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PropertyFormField
            id="width"
            label="Width"
            value={properties.width || ''}
            onChange={value => onPropertyChange('width', value)}
            placeholder="auto"
          />

          <PropertyFormField
            id="height"
            label="Height"
            value={properties.height || ''}
            onChange={value => onPropertyChange('height', value)}
            placeholder="auto"
          />
        </div>

        <Separator />

        <PropertyFormField
          id="padding"
          label="Padding"
          value={properties.padding || ''}
          onChange={value => onPropertyChange('padding', value)}
          placeholder="0px"
        />

        <PropertyFormField
          id="margin"
          label="Margin"
          value={properties.margin || ''}
          onChange={value => onPropertyChange('margin', value)}
          placeholder="0px"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
