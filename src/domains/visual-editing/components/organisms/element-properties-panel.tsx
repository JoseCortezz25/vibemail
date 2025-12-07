'use client';

import { CardContent } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useEmailStore } from '@/stores/email.store';
import { EmptyStateMessage } from '@/components/atoms/empty-state-message';
import { ContentPropertiesSection } from '@/components/molecules/content-properties-section';
import { StylePropertiesSection } from '@/components/molecules/style-properties-section';
import { LayoutPropertiesSection } from '@/components/molecules/layout-properties-section';
import { PropertyPanelActions } from '@/components/molecules/property-panel-actions';
import { useElementPropertiesPanel } from '@/domains/visual-editing/hooks/use-element-properties-panel';

export function VisualEdits() {
  const { selectedElement, updateElementProperty, deselectElement } =
    useVisualEditStore();

  const { htmlBody, setHtmlBody } = useEmailStore();

  const { handleApplyChanges, handlePropertyChange } =
    useElementPropertiesPanel({
      selectedElementId: selectedElement?.id ?? null,
      selectedElementProperties: selectedElement?.properties ?? null,
      htmlBody,
      setHtmlBody,
      deselectElement,
      updateElementProperty
    });

  // Empty state
  if (!selectedElement) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <EmptyStateMessage
          title="No element selected"
          description="Click on an element in the preview to edit its properties"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col border-0 shadow-none">
        <CardContent className="max-h-[calc(100dvh-190px)] flex-1 overflow-auto p-4">
          <Accordion
            type="multiple"
            defaultValue={['content', 'style', 'layout']}
            className="w-full"
          >
            <ContentPropertiesSection
              elementType={selectedElement.type}
              properties={selectedElement.properties}
              onPropertyChange={handlePropertyChange}
            />

            <StylePropertiesSection
              properties={selectedElement.properties}
              onPropertyChange={handlePropertyChange}
            />

            <LayoutPropertiesSection
              properties={selectedElement.properties}
              onPropertyChange={handlePropertyChange}
            />
          </Accordion>
        </CardContent>

        <PropertyPanelActions
          onApply={handleApplyChanges}
          onCancel={deselectElement}
        />
      </div>
    </div>
  );
}
