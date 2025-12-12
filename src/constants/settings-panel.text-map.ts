export const settingsPanelTextMap = {
  // Sheet header
  title: 'Settings',
  description: 'Configure your AI model and API key preferences',

  // Free tier
  freeTierTitle: 'Free tier',
  freeTierDescription:
    'Includes 10 free from-scratch generations using our shared API key (Gemini only).',
  freeTierLimitReached: 'Limit reached. Add your API key to continue.',

  // Form labels
  modelLabel: 'AI Model',
  modelPlaceholder: 'Select an AI model',
  apiKeyLabel: 'API Key',
  apiKeyPlaceholder: 'Enter your API key',

  // Helper text
  apiKeyHelper:
    'Your API key is stored locally in your browser and never sent to our servers.',
  modelHelper: 'Choose the AI model that best fits your needs.',

  // Model options
  models: {
    'gpt-5.2-2025-12-11': 'GPT-5.2 (Latest)',
    'gpt-5.1-2025-11-13': 'GPT-5.1',
    'gpt-5-mini-2025-08-07': 'GPT-5 Mini',
    'gpt-5-nano-2025-08-07': 'GPT-5 Nano',
    'gemini-3-pro-preview': 'Gemini 3 Pro (Preview)',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-2.5-flash': 'Gemini 2.5 Flash'
  },

  // Buttons
  saveButton: 'Save Settings',
  cancelButton: 'Cancel',
  closeButton: 'Close',

  // Feedback messages
  saveSuccess: 'Settings saved successfully',
  saveError: 'Failed to save settings. Please try again.',
  validationErrorModel: 'Please select a model',

  // Empty states
  noApiKey: 'No API key configured',
  firstTimeMessage:
    'Welcome! Configure your AI model and API key to get started.',

  // Footer
  footerLabel: 'Created by',
  footerName: '@JoseCortezz25',
  footerLink: 'https://github.com/JoseCortezz25',

  // Accessibility
  closeButtonAriaLabel: 'Close settings panel',
  settingsButtonAriaLabel: 'Open settings',
  modelSelectAriaLabel: 'Select AI model from dropdown',
  apiKeyInputAriaLabel: 'Enter your API key'
} as const;

export type SettingsPanelTextMap = typeof settingsPanelTextMap;
