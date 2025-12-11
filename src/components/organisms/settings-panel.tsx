'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useModelStore, Model } from '@/stores/model.store';
import { settingsPanelTextMap } from '@/constants/settings-panel.text-map';
import { themeToggleTextMap } from '@/constants/theme-toggle.text-map';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Gemini, OpenAI } from '@/components/atoms/icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsPanel = ({ isOpen, onOpenChange }: SettingsPanelProps) => {
  const { model, apiKey, hasHydrated, setModel, setApiKey } = useModelStore();
  const { theme, setTheme } = useTheme();

  const [localModel, setLocalModel] = useState(model);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [mounted, setMounted] = useState(false);

  // Sync local state with store when panel opens or hydration completes
  useEffect(() => {
    if (isOpen && hasHydrated) {
      setLocalModel(model);
      setLocalApiKey(apiKey);
    }
  }, [isOpen, model, apiKey, hasHydrated]);

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    // Validation
    if (!localModel) {
      toast.error(settingsPanelTextMap.validationErrorModel);
      return;
    }

    if (!localApiKey.trim()) {
      toast.error(settingsPanelTextMap.validationErrorApiKey);
      return;
    }

    // Save to store (will auto-persist to localStorage)
    setModel(localModel);
    setApiKey(localApiKey);

    toast.success(settingsPanelTextMap.saveSuccess);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to stored values
    setLocalModel(model);
    setLocalApiKey(apiKey);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[95%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{settingsPanelTextMap.title}</SheetTitle>
          <SheetDescription>
            {settingsPanelTextMap.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-4">
          {/* Model Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="model-select">
              {settingsPanelTextMap.modelLabel}
            </Label>
            <Select value={localModel} onValueChange={setLocalModel}>
              <SelectTrigger
                id="model-select"
                className="w-full"
                aria-label={settingsPanelTextMap.modelSelectAriaLabel}
              >
                <SelectValue
                  placeholder={settingsPanelTextMap.modelPlaceholder}
                />
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
            <p className="text-muted-foreground text-xs">
              {settingsPanelTextMap.modelHelper}
            </p>
          </div>

          {/* API Key Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key-input">
              {settingsPanelTextMap.apiKeyLabel}
            </Label>
            <Input
              id="api-key-input"
              type="password"
              placeholder={settingsPanelTextMap.apiKeyPlaceholder}
              value={localApiKey}
              onChange={e => setLocalApiKey(e.target.value)}
              aria-label={settingsPanelTextMap.apiKeyInputAriaLabel}
            />
            <p className="text-muted-foreground text-xs">
              {settingsPanelTextMap.apiKeyHelper}
            </p>
          </div>

          {/* Theme Selection */}
          {mounted && (
            <div className="flex flex-col gap-2">
              <Label>{themeToggleTextMap.sectionLabel}</Label>
              <Tabs value={theme} onValueChange={(value) => setTheme(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="light"
                    aria-label={themeToggleTextMap.themeLightAriaLabel}
                  >
                    {themeToggleTextMap.themeLightLabel}
                  </TabsTrigger>
                  <TabsTrigger
                    value="dark"
                    aria-label={themeToggleTextMap.themeDarkAriaLabel}
                  >
                    {themeToggleTextMap.themeDarkLabel}
                  </TabsTrigger>
                  <TabsTrigger
                    value="system"
                    aria-label={themeToggleTextMap.themeSystemAriaLabel}
                  >
                    {themeToggleTextMap.themeSystemLabel}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {theme === 'system' && (
                <p className="text-muted-foreground text-xs">
                  {themeToggleTextMap.themeSystemHelper}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {settingsPanelTextMap.saveButton}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              {settingsPanelTextMap.cancelButton}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer with Creator Credits */}
        <SheetFooter className="flex-col items-center sm:flex-col">
          <p className="text-muted-foreground text-center text-sm">
            {settingsPanelTextMap.footerLabel}{' '}
            <a
              href={settingsPanelTextMap.footerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              {settingsPanelTextMap.footerName}
            </a>
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
