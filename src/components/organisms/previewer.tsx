'use client';

import { useState } from 'react';
import { ViewModeToggle } from '../molecules/view-mode-toggle';
import { DeviceToggle } from '../molecules/device-toggle';
import { PreviewerEmail } from './previewer-email';
import { PreviewerCode } from './previewer-code';
import { useEmailStore } from '@/stores/email.store';

export const Previewer = () => {
  const [isPreview, setIsPreview] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const { subject } = useEmailStore();
  const activePreview = isPreview && subject !== '';

  return (
    <div className="border-border @container flex h-full w-full flex-col">
      {/* toolbar */}
      <div className="border-border flex items-center justify-between gap-4 border-b p-4">
        {/* code/preview toggle */}
        <ViewModeToggle
          onToggle={() => setIsPreview(prev => !prev)}
          isPreview={isPreview}
        />

        {/* name of email */}
        <h3 className="text-sm font-medium @md:max-w-[330px] @md:truncate @lg:max-w-[730px]">
          {subject}
        </h3>

        {/* desktop/mobile toggle - only visible in preview mode */}
        <div className="flex w-[140px] justify-end">
          {activePreview && (
            <DeviceToggle
              isDesktop={isDesktop}
              onToggle={() => setIsDesktop(prev => !prev)}
            />
          )}
        </div>
      </div>

      {isPreview ? <PreviewerEmail isDesktop={isDesktop} /> : <PreviewerCode />}
    </div>
  );
};
