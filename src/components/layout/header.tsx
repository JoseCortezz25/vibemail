'use client';

import { useState } from 'react';
import { ViewToggle } from '../molecules/view-toggle';
import { useEmailStore } from '@/stores/email.store';
import { Button } from '../ui/button';
import { Settings } from 'lucide-react';
import { SettingsPanel } from '../organisms/settings-panel';
import { settingsPanelTextMap } from '@/constants/settings-panel.text-map';

export const Header = () => {
  const { subject, htmlBody, jsxBody, isLoading } = useEmailStore();
  const showViewToggle = isLoading || !!(subject || htmlBody || jsxBody);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="border-border flex w-full items-center justify-between border-b px-4 py-2">
      <nav>
        <h3 className="text-[14px] font-medium">Maily App</h3>
      </nav>

      {/* View toggle - only visible on mobile/tablet when preview is available */}
      {showViewToggle && (
        <div className="lg:hidden">
          <ViewToggle />
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer"
        onClick={() => setIsSettingsOpen(true)}
        aria-label={settingsPanelTextMap.settingsButtonAriaLabel}
      >
        <Settings className="size-4" />
      </Button>

      <SettingsPanel isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </header>
  );
};
