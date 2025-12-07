import { ReactNode } from 'react';

interface EmptyStateMessageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyStateMessage({
  title,
  description,
  icon
}: EmptyStateMessageProps) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-muted-foreground text-center">
        {icon && <div className="mb-2">{icon}</div>}
        <p className="text-sm">{title}</p>
        {description && (
          <p className="text-muted-foreground/70 text-xs">{description}</p>
        )}
      </div>
    </div>
  );
}
