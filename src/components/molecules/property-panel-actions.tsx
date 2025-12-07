'use client';

import { Button } from '@/components/ui/button';

interface PropertyPanelActionsProps {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
}

export function PropertyPanelActions({
  onApply,
  onCancel,
  isApplyDisabled = false
}: PropertyPanelActionsProps) {
  return (
    <div className="border-border flex gap-2 border-t p-4">
      <Button onClick={onApply} className="flex-1" disabled={isApplyDisabled}>
        Apply Changes
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
