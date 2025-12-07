// 'use client' required for:
// - Form input state management
// - File upload interactions
// - Button click handlers
'use client';

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from '@/components/ui/prompt-input';
import { usePromptInput } from '@/domains/chat/hooks/use-prompt-input';
import { FilesPreviewList } from '@/components/molecules/files-preview-list';
import { DesignModeToggle } from '@/components/molecules/design-mode-toggle';
import { PromptSubmitButton } from '@/components/molecules/prompt-submit-button';
import { InputUploadFiles } from '@/components/molecules/input-upload-file';
import { SelectedElementIndicator } from '@/components/molecules/selected-element-indicator';

interface PromptTextareaProps {
  onSubmit: (message: string, files?: FileList) => void;
  isLoading: boolean;
  isEditMode: boolean;
  hasHtmlBody: boolean;
  onToggleEditMode: () => void;
}

export function PromptTextarea({
  onSubmit,
  isLoading,
  isEditMode,
  hasHtmlBody,
  onToggleEditMode
}: PromptTextareaProps) {
  const {
    input,
    setInput,
    files,
    setFiles,
    fileInputRef,
    handleFileRemove,
    handleSubmit
  } = usePromptInput({ onSubmit });

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-(--breakpoint-md) rounded-[10px]"
    >
      <SelectedElementIndicator />

      {files && (
        <FilesPreviewList files={files} onFileRemove={handleFileRemove} />
      )}

      <PromptInputTextarea
        placeholder="Ask me anything..."
        className="max-h-[100px] px-1"
      />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <PromptInputAction tooltip="Attach files">
            <InputUploadFiles setFiles={setFiles} fileInputRef={fileInputRef} />
          </PromptInputAction>

          {hasHtmlBody && (
            <PromptInputAction tooltip="Select elements">
              <DesignModeToggle
                isEditMode={isEditMode}
                isDisabled={isLoading}
                onToggle={onToggleEditMode}
              />
            </PromptInputAction>
          )}
        </div>

        <PromptInputAction
          tooltip={isLoading ? 'Stop generation' : 'Send message'}
        >
          <PromptSubmitButton isLoading={isLoading} onSubmit={handleSubmit} />
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
