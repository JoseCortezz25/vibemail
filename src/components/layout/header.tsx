'use client';

import { ViewToggle } from '../molecules/view-toggle';
import { useEmailStore } from '@/stores/email.store';

export const Header = () => {
  const { subject, htmlBody, jsxBody, isLoading } = useEmailStore();
  const showViewToggle = isLoading || !!(subject || htmlBody || jsxBody);

  return (
    <header className="border-border flex w-full items-center justify-between border-b p-4">
      <nav>
        <h3 className="text-lg font-medium">Vibe Emailing</h3>
      </nav>

      {/* View toggle - only visible on mobile/tablet when preview is available */}
      {showViewToggle && (
        <div className="lg:hidden">
          <ViewToggle />
        </div>
      )}
    </header>
  );
};
