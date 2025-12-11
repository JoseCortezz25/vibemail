export const themeToggleTextMap = {
  // Section header
  sectionLabel: 'Theme Preference',
  sectionDescription: 'Choose how the application looks',

  // Theme options
  themeLightLabel: 'Light',
  themeDarkLabel: 'Dark',
  themeSystemLabel: 'System',

  // Helper text
  themeSystemHelper: 'Follows your device settings',

  // ARIA labels
  themeToggleAriaLabel: 'Toggle theme',
  themeLightAriaLabel: 'Switch to light mode',
  themeDarkAriaLabel: 'Switch to dark mode',
  themeSystemAriaLabel: 'Use system theme'
} as const;

export type ThemeToggleTextMap = typeof themeToggleTextMap;
