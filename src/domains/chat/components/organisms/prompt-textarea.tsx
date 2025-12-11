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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { currentModel, Model } from '@/stores/model.store';
import { Gemini, OpenAI } from '@/components/atoms/icons';
import { SelectGroup } from '@radix-ui/react-select';
import { useModelStore } from '@/stores/model.store';
import { Badge } from '@/components/ui/badge';

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
  const { model, setModel, hasHydrated } = useModelStore();

  // Use currentModel as fallback until hydration completes
  const displayModel = hasHydrated ? model : currentModel;

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-(--breakpoint-md) rounded-[10px] shadow-[1px_1px_5px_#d1d1d1]"
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

          <PromptInputAction tooltip="Select model">
            <Select
              value={displayModel}
              onValueChange={(value: string) => setModel(value as Model)}
            >
              <SelectTrigger className="w-[150px] cursor-pointer rounded-[10px] border-none bg-gray-100 p-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>OpenAI</SelectLabel>
                  <SelectItem value={Model.GPT_5_2}>
                    <div className="flex items-center gap-2">
                      <OpenAI />
                      <span>GPT-5.2</span>
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
                      >
                        new
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value={Model.GPT_5_1}>
                    <OpenAI />
                    GPT-5.1
                  </SelectItem>
                  <SelectItem value={Model.GPT_5_MINI}>
                    <OpenAI />
                    GPT-5.0 Mini
                  </SelectItem>
                  <SelectItem value={Model.GPT_5_NANO}>
                    <OpenAI />
                    GPT-5.0 Nano
                  </SelectItem>

                  <SelectLabel>Google</SelectLabel>
                  <SelectItem value={Model.GEMINI_3_PRO_PREVIEW}>
                    <Gemini />
                    Gemini 3 Pro Preview
                  </SelectItem>
                  <SelectItem value={Model.GEMINI_FLASH_LATEST}>
                    <Gemini />
                    Gemini Flash
                  </SelectItem>
                  <SelectItem value={Model.GEMINI_FLASH_LITE_LATEST}>
                    <Gemini />
                    Gemini Flash Lite
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
          <PromptSubmitButton
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={isLoading || input.length === 0}
          />
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
