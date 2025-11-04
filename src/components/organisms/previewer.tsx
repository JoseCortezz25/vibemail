'use client';

import { useState } from 'react';
import { ViewModeToggle } from '../molecules/view-mode-toggle';
import { PreviewerEmail } from './previewer-email';
import { PreviewerCode } from './previewer-code';

export const Previewer = () => {
  const [isPreview, setIsPreview] = useState(true);

  return (
    <div className="border-border flex h-full w-full flex-col">
      {/* toolbar */}
      <div className="border-border flex items-center justify-between border-b p-4">
        {/* code/preview toggle */}
        <ViewModeToggle
          onToggle={() => setIsPreview(prev => !prev)}
          isPreview={isPreview}
        />

        {/* name of email */}
        <h3 className="text-sm font-medium">Name of email</h3>

        {/* options: download, versions etc */}
        <div className="w-[140px]"></div>
      </div>

      {isPreview ? <PreviewerEmail /> : <PreviewerCode />}
    </div>
  );
};
