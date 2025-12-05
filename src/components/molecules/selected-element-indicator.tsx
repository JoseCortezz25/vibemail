'use client';

import { Badge } from '@/components/ui/badge';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { SELECTED_ELEMENT_TEXT } from '@/constants/selected-element-indicator.text-map';

export const SelectedElementIndicator = () => {
  const { selectedElementType, selectedElementId } = useVisualEditStore();

  if (!selectedElementType || !selectedElementId) {
    return null;
  }

  const elementTypeLabel =
    SELECTED_ELEMENT_TEXT.elementTypes[selectedElementType];

  return (
    <Badge variant="selected" className="gap-1">
      <span className="text-xs">{elementTypeLabel}</span>
    </Badge>
  );
};
