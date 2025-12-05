'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { SELECTED_ELEMENT_TEXT } from './selected-element-indicator.text-map';

export const SelectedElementIndicator = () => {
  const { selectedElementType, selectedElementId, deselectElement } =
    useVisualEditStore();

  if (!selectedElementType || !selectedElementId) {
    return null;
  }

  const elementTypeLabel =
    SELECTED_ELEMENT_TEXT.elementTypes[selectedElementType];

  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-950">
      <Badge variant="secondary" className="gap-1">
        <span className="text-xs font-medium">
          {SELECTED_ELEMENT_TEXT.label.editing}:
        </span>
        <span className="text-xs">{elementTypeLabel}</span>
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={deselectElement}
        aria-label={SELECTED_ELEMENT_TEXT.actions.deselectAriaLabel}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};
