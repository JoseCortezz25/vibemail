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
  const { model, setModel } = useModelStore();

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

          <PromptInputAction tooltip="Select elements">
            <Select
              value={model}
              onValueChange={(value: string) => setModel(value as Model)}
              defaultValue={currentModel}
            >
              <SelectTrigger className="w-[150px] cursor-pointer rounded-[10px] border-none bg-gray-100 p-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>OpenAI</SelectLabel>
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
                  <SelectItem value={Model.GEMINI_2_5_PRO}>
                    <Gemini />
                    Gemini 2.5 Pro
                  </SelectItem>
                  <SelectItem value={Model.GEMINI_2_5_FLASH}>
                    <Gemini />
                    Gemini 2.5 Flash
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PromptInputAction>
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
