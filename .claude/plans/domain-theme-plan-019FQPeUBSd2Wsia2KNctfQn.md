# Domain Architecture Plan: Theme State Management

**Session ID**: 019FQPeUBSd2Wsia2KNctfQn
**Agent**: domain-architect
**Created**: 2025-12-09
**Status**: ✅ Completed

---

## Overview

Design the theme state management domain using Zustand with localStorage persistence, ensuring SSR-safe initialization, system preference detection, and FOUC (Flash of Unstyled Content) prevention.

---

## 1. Architecture Decision

### 1.1 Store vs Domain

**Decision**: Use **`/src/stores/theme.store.ts`** (simple Zustand store)

**Rationale:**
- Theme is **UI/client state**, not business logic (per critical-constraints.md #7)
- Similar to existing `model.store.ts` pattern
- No complex business rules or server actions needed
- Lightweight, fits the "right tool for the right job" principle

**Not creating** `/domains/theme/` because:
- No server-side data fetching
- No complex business logic
- No need for actions.ts or repository pattern
- Pure client-side UI state

---

## 2. Theme Store Schema

### 2.1 TypeScript Types

**File**: `src/stores/theme.store.ts`

```typescript
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  // User's explicit preference (light, dark, or system)
  theme: Theme;
  
  // Resolved theme after considering system preference
  // This is what actually gets applied to the DOM
  resolvedTheme: ResolvedTheme;
  
  // Hydration flag to prevent mismatches
  hasHydrated: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  setHasHydrated: (state: boolean) => void;
  
  // Helper to initialize system theme listener
  initializeSystemThemeListener: () => () => void;
}
```

**Key Design Decisions:**
- **`theme`**: User's choice (can be "system")
- **`resolvedTheme`**: Actual theme applied ("light" or "dark" only)
- **Separation**: Allows showing "System (Dark)" in UI while applying "dark" to DOM
- **`initializeSystemThemeListener`**: Returns cleanup function for unmounting

### 2.2 Store Implementation Pattern

**Based on existing `model.store.ts` pattern:**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// SSR-safe localStorage wrapper (reuse from model.store.ts)
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Silent fail for incognito mode
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Silent fail
    }
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: Theme.SYSTEM,
      resolvedTheme: 'light', // Default fallback
      hasHydrated: false,
      
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // If not system, resolved theme is explicit
        if (theme !== Theme.SYSTEM) {
          set({ resolvedTheme: theme as ResolvedTheme });
        } else {
          // Detect system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ resolvedTheme: systemPrefersDark ? 'dark' : 'light' });
        }
      },
      
      setResolvedTheme: (resolvedTheme: ResolvedTheme) => set({ resolvedTheme }),
      
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      
      initializeSystemThemeListener: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
          const { theme } = get();
          if (theme === Theme.SYSTEM) {
            set({ resolvedTheme: e.matches ? 'dark' : 'light' });
          }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        
        // Return cleanup function
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => safeLocalStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Only persist user preference, not resolved theme
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
);
```

**Key Features:**
- ✅ SSR-safe with `safeLocalStorage` wrapper
- ✅ Persists only `theme` (user preference)
- ✅ Resolves system preference on hydration
- ✅ Provides cleanup for event listeners
- ✅ Follows existing codebase pattern

---

## 3. FOUC Prevention Strategy

### 3.1 The Problem

**FOUC (Flash of Unstyled Content)** occurs when:
1. Page loads with default light theme
2. React hydrates
3. Zustand reads localStorage
4. Theme switches to dark (user sees flicker)

**This is unacceptable UX.**

### 3.2 Solution: Blocking Script

**Location**: `src/app/layout.tsx` (inline script in `<head>`)

**Strategy:**
1. Inject minimal blocking script **before** any styles/content render
2. Read localStorage theme preference immediately
3. Apply `dark` class to `<html>` element synchronously
4. Zustand store hydrates later, syncing with pre-applied theme

**Implementation:**

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC Prevention Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-preference');
                  var stored = theme ? JSON.parse(theme) : null;
                  var preference = stored?.state?.theme || 'system';
                  
                  var isDark = preference === 'dark';
                  
                  if (preference === 'system') {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={...}>
        {children}
      </body>
    </html>
  );
}
```

**Why `suppressHydrationWarning`?**
- React will warn about server/client mismatch for `className` on `<html>`
- This is expected and safe because we're deliberately applying class client-side
- Suppresses hydration warning only for `<html>` tag

**Script Behavior:**
- Executes **synchronously** before paint
- Reads from same localStorage key Zustand uses (`theme-preference`)
- Parses Zustand's JSON structure (`{state: {theme: '...'}}`)
- Applies `dark` class immediately if needed
- No flicker, no FOUC ✅

---

## 4. Theme Application Mechanism

### 4.1 Client Component: ThemeProvider

**File**: `src/components/providers/theme-provider.tsx`

**Purpose:**
- Initialize Zustand store on mount
- Apply theme class to `<html>` element reactively
- Set up system theme listener
- Clean up on unmount

```typescript
'use client';

import { useEffect } from 'react';
import { useThemeStore, Theme } from '@/stores/theme.store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, hasHydrated, setTheme, initializeSystemThemeListener } = useThemeStore();

  // Apply theme class to HTML element
  useEffect(() => {
    if (!hasHydrated) return;

    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme, hasHydrated]);

  // Initialize system theme listener
  useEffect(() => {
    if (!hasHydrated) return;
    if (theme !== Theme.SYSTEM) return;

    const cleanup = initializeSystemThemeListener();
    return cleanup; // Cleanup on unmount
  }, [theme, hasHydrated, initializeSystemThemeListener]);

  // Initial resolution of system theme
  useEffect(() => {
    if (!hasHydrated) return;
    if (theme !== Theme.SYSTEM) return;

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeStore.getState().setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
  }, [hasHydrated]);

  return <>{children}</>;
}
```

**Usage in layout:**

```tsx
// src/app/layout.tsx
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ... FOUC prevention script ... */}
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 4.2 Why Not use next-themes?

**Considered**: `next-themes` library (popular solution)

**Decision**: **Build custom solution**

**Rationale:**
- Project already has Zustand pattern established
- `next-themes` is 6KB+ and brings unnecessary complexity
- Custom solution: ~100 lines, fully understood, no black box
- Full control over store structure and behavior
- Consistency with existing `model.store.ts` pattern
- Learning opportunity for team

**Trade-off:**
- Custom code to maintain vs. community package
- Acceptable given simplicity and project patterns

---

## 5. Text Map Structure

### 5.1 File Structure

**File**: `src/constants/theme-toggle.text-map.ts`

```typescript
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
  
  // Toast messages
  toastThemeUpdatedLight: 'Theme updated to Light mode',
  toastThemeUpdatedDark: 'Theme updated to Dark mode',
  toastThemeUpdatedSystem: 'Theme will follow your system preference',
  
  // ARIA labels
  themeToggleAriaLabel: 'Select theme preference',
  themeLightAriaLabel: 'Switch to light mode',
  themeDarkAriaLabel: 'Switch to dark mode',
  themeSystemAriaLabel: 'Use system theme preference'
} as const;

export type ThemeToggleTextMap = typeof themeToggleTextMap;
```

**Following Project Pattern:**
- ✅ All UI strings externalized (critical-constraints requirement)
- ✅ TypeScript `as const` for type safety
- ✅ Consistent naming: `{component}{element}{purpose}`
- ✅ Includes ARIA labels for accessibility

---

## 6. Integration Points

### 6.1 Settings Panel Integration

**File**: `src/components/organisms/settings-panel.tsx`

**Add theme toggle section:**

```tsx
import { useThemeStore, Theme } from '@/stores/theme.store';
import { themeToggleTextMap } from '@/constants/theme-toggle.text-map';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Inside SettingsPanel component:
const { theme, setTheme } = useThemeStore();

<div className="flex flex-col gap-2">
  <Label>{themeToggleTextMap.sectionLabel}</Label>
  <Tabs value={theme} onValueChange={(value) => setTheme(value as Theme)}>
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value={Theme.LIGHT}>
        {themeToggleTextMap.themeLightLabel}
      </TabsTrigger>
      <TabsTrigger value={Theme.DARK}>
        {themeToggleTextMap.themeDarkLabel}
      </TabsTrigger>
      <TabsTrigger value={Theme.SYSTEM}>
        {themeToggleTextMap.themeSystemLabel}
      </TabsTrigger>
    </TabsList>
  </Tabs>
  <p className="text-muted-foreground text-xs">
    {theme === Theme.SYSTEM && themeToggleTextMap.themeSystemHelper}
  </p>
</div>
```

**Toast notification:**
```tsx
import { toast } from 'sonner';

const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);
  
  const messages = {
    [Theme.LIGHT]: themeToggleTextMap.toastThemeUpdatedLight,
    [Theme.DARK]: themeToggleTextMap.toastThemeUpdatedDark,
    [Theme.SYSTEM]: themeToggleTextMap.toastThemeUpdatedSystem
  };
  
  toast.success(messages[newTheme]);
};
```

### 6.2 Layout Integration

**Modifications to `src/app/layout.tsx`:**

1. Add FOUC prevention script in `<head>`
2. Wrap children in `<ThemeProvider>`
3. Add `suppressHydrationWarning` to `<html>`

(See Section 3.2 and 4.1 for implementation)

---

## 7. File Structure Summary

### Files to Create:

```
src/
├── stores/
│   └── theme.store.ts           # Zustand theme store
├── components/
│   └── providers/
│       └── theme-provider.tsx   # Client component for theme logic
├── constants/
│   └── theme-toggle.text-map.ts # UI strings
```

### Files to Modify:

```
src/
├── app/
│   └── layout.tsx              # Add FOUC script, ThemeProvider
├── components/
│   └── organisms/
│       └── settings-panel.tsx  # Add theme toggle UI
```

---

## 8. Critical Constraints Compliance

**Verification against `.claude/knowledge/critical-constraints.md`:**

- ✅ **#4**: Named exports only (`export function`, `export enum`)
- ✅ **#7**: Zustand for UI/client state (theme is UI preference)
- ✅ **#10**: No arbitrary inline values (all text in text map)
- ✅ **#11**: Business logic in hooks (if needed, extract to `useTheme` hook)

**No violations.**

---

## 9. Testing Strategy

### 9.1 Unit Tests

**File**: `src/stores/__tests__/theme.store.test.ts`

**Test cases:**
- [ ] Default theme is `Theme.SYSTEM`
- [ ] `setTheme` updates both `theme` and `resolvedTheme`
- [ ] System theme resolves based on `matchMedia`
- [ ] LocalStorage persistence works
- [ ] Hydration flag updates correctly

### 9.2 Integration Tests

- [ ] FOUC prevention: no flicker on page load
- [ ] Theme persists across page reloads
- [ ] System theme changes when OS preference changes
- [ ] Settings panel theme toggle works
- [ ] All components render correctly in both themes

---

## 10. Implementation Order

1. **Create theme store** (`theme.store.ts`)
2. **Create text map** (`theme-toggle.text-map.ts`)
3. **Create ThemeProvider** (`theme-provider.tsx`)
4. **Modify layout** (FOUC script, provider)
5. **Update settings panel** (theme toggle UI)
6. **Test** (manual and automated)

---

## Next Steps

- **Parent Agent**: Implement store, provider, and layout modifications
- **Parent Agent**: Update settings panel with theme toggle
- **Code Reviewer**: Verify SSR safety and FOUC prevention

---

**Plan Status**: ✅ Ready for Implementation
