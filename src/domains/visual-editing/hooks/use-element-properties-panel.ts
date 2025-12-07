'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { modifyElementInHTML } from '@/lib/html-modifier';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface UseElementPropertiesPanelProps {
  selectedElementId: string | null;
  selectedElementProperties: ElementProperties | null;
  htmlBody: string;
  setHtmlBody: (htmlBody: string) => void;
  deselectElement: () => void;
  updateElementProperty: (key: string, value: unknown) => void;
}

export function useElementPropertiesPanel({
  selectedElementId,
  selectedElementProperties,
  htmlBody,
  setHtmlBody,
  deselectElement,
  updateElementProperty
}: UseElementPropertiesPanelProps) {
  const handleApplyChanges = useCallback(() => {
    if (!selectedElementId || !selectedElementProperties || !htmlBody) {
      toast.error('Cannot apply changes');
      return;
    }

    try {
      // Modify the HTML with the updated properties
      const updatedHTML = modifyElementInHTML({
        htmlBody,
        elementId: selectedElementId,
        properties: selectedElementProperties
      });

      // Update the HTML in the store
      setHtmlBody(updatedHTML);

      toast.success('Changes applied successfully');
      deselectElement();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error('Failed to apply changes');
    }
  }, [
    selectedElementId,
    selectedElementProperties,
    htmlBody,
    setHtmlBody,
    deselectElement
  ]);

  const handlePropertyChange = useCallback(
    (key: string, value: string) => {
      updateElementProperty(key, value);
    },
    [updateElementProperty]
  );

  return {
    handleApplyChanges,
    handlePropertyChange
  };
}
