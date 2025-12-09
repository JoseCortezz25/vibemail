# Settings Panel with localStorage Persistence - Next.js Implementation Plan

**Created**: 2025-12-07
**Session**: settings-panel-20251207
**Type**: Next.js Architecture
**Complexity**: Medium

## 1. Feature Overview

**Feature**: Settings panel with localStorage persistence for model selection and API key
**User Flow**: User clicks settings icon in header → Sheet opens → User configures model and API key → Settings are automatically persisted to localStorage → Settings are restored on page reload
**Route**: `/` (existing home page)

## 2. Routing Structure

### Existing Routes to Modify

#### Route: `/`
**File**: `src/app/page.tsx`
**Change**: No changes needed - this is already a Client Component with the Header component integrated
**Note**: The Header component is where the settings button will trigger the Sheet

## 3. Server Component Architecture

### No Server Components Needed

This feature is 100% client-side:
- UI preferences (model selection, API key)
- Browser localStorage access
- Sheet interactivity (open/close state)
- All components involved MUST be Client Components

**Why Client Components**:
- [x] Browser APIs (localStorage)
- [x] Event handlers (onClick for settings button)
- [x] UI state (Sheet open/close)
- [x] Zustand store integration (already client-side)

## 4. Client Component Architecture

### Settings Button (Already exists)

**File**: `src/components/layout/header.tsx`
**Component Type**: Client Component (already has "use client")

**Current State**:
```typescript
// Line 25-28
<Button variant="outline" size="icon" className="cursor-pointer">
  <Settings className="size-4" />
</Button>
```

**Required Change**: Add onClick handler to trigger Sheet open

```typescript
<Button
  variant="outline"
  size="icon"
  className="cursor-pointer"
  onClick={handleOpenSettings} // ✅ Add click handler
>
  <Settings className="size-4" />
</Button>
```

### Settings Panel Component (New)

**File**: `src/components/organisms/settings-panel.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { useModelStore } from '@/stores/model.store';
import { useState } from 'react';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { model, apiKey, setModel, setApiKey } = useModelStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        {/* Model selection */}
        {/* API key input */}

        <SheetFooter>
          {/* Credits to creator */}
          <p className="text-sm text-muted-foreground">
            Created by <a href="https://github.com/JoseCortezz25" target="_blank">@JoseCortezz25</a>
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

**Why Client Component**:
- [x] Sheet component requires interactivity (open/close)
- [x] Form inputs for model and API key
- [x] Zustand store integration
- [x] Event handlers

**Note**: This component is in `@/components/organisms/` because it's a complex, reusable UI component combining multiple molecules/atoms.

## 5. Layouts and Templates

### Root Layout

**File**: `src/app/layout.tsx`
**Changes**: None needed - already Server Component with proper structure

### No Nested Layouts Needed

This feature lives entirely within the existing home page layout.

## 6. Loading and Error States

### No Loading UI Needed

localStorage operations are synchronous, no async loading state required.

### Error Handling

**Strategy**: Handle localStorage errors gracefully (SSR, incognito mode, quota exceeded)

```typescript
// In Zustand store middleware
const persistConfig = {
  name: 'model-settings',
  storage: createJSONStorage(() => {
    // ✅ Safe localStorage wrapper
    try {
      return localStorage;
    } catch {
      // ✅ Fallback to no-op storage (SSR, incognito)
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      };
    }
  })
};
```

## 7. Data Fetching Strategy

### No Server Fetching Needed

This feature only deals with client-side localStorage:
- No API calls
- No database queries
- No Server Actions needed

### Client-Side Persistence Only

```typescript
// ✅ Zustand persist middleware handles localStorage automatically
export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      model: currentModel,
      apiKey: '',
      setModel: (model: string) => set({ model }),
      setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' })
    }),
    {
      name: 'model-settings', // ✅ localStorage key
      storage: createJSONStorage(() => safeLocalStorage), // ✅ SSR-safe wrapper
    }
  )
);
```

## 8. localStorage Persistence Strategy

### Zustand Persist Middleware (Recommended)

**Why**:
- Automatic localStorage sync
- Built-in SSR/hydration handling
- Minimal code changes to existing store

### Implementation in model.store.ts

**Current Store** (`src/stores/model.store.ts`):
```typescript
// ❌ No persistence currently
export const useModelStore = create<ModelStore>(set => ({
  model: currentModel,
  apiKey: '',
  setModel: (model: string) => set({ model }),
  setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' })
}));
```

**New Store with Persistence**:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ✅ SSR-safe localStorage wrapper
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Silently fail (incognito mode, quota exceeded)
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Silently fail
    }
  }
};

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      model: currentModel,
      apiKey: '',
      setModel: (model: string) => set({ model }),
      setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' })
    }),
    {
      name: 'model-settings', // localStorage key: 'model-settings'
      storage: createJSONStorage(() => safeLocalStorage),
      // ✅ Optional: Only persist specific fields
      partialize: (state) => ({
        model: state.model,
        apiKey: state.apiKey
      })
    }
  )
);
```

### Hydration Strategy

**Problem**: SSR renders on server (no localStorage) → Client hydrates with localStorage → Mismatch warning

**Solution**: Zustand persist middleware handles this automatically with:
1. Initial render uses default values (SSR-safe)
2. After hydration, `onRehydrateStorage` callback fires
3. Store updates with localStorage values
4. Component re-renders with persisted values

**Optional**: Add hydration callback for debugging

```typescript
export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({ /* store definition */ }),
    {
      name: 'model-settings',
      storage: createJSONStorage(() => safeLocalStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Hydration complete:', state);
      }
    }
  )
);
```

## 9. Hydration Mismatch Prevention

### Strategy: Wait for Client-Side Mount

**Problem**: During SSR, localStorage is not available → store uses defaults → client hydrates with different values → React hydration mismatch

**Solution 1: Use Zustand's built-in hydration** (Recommended)
```typescript
// ✅ Zustand persist middleware handles this automatically
// No additional code needed - middleware waits for client-side mount
```

**Solution 2: Manual hydration check** (If needed)
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useModelStore } from '@/stores/model.store';

export function SettingsPanel({ open, onOpenChange }) {
  const [isClient, setIsClient] = useState(false);
  const { model, apiKey, setModel, setApiKey } = useModelStore();

  useEffect(() => {
    setIsClient(true); // ✅ Mark as client-side
  }, []);

  if (!isClient) {
    return null; // ✅ Prevent SSR render
  }

  // Render settings form
}
```

**Recommended**: Use Solution 1 (Zustand handles it automatically)

## 10. Component Interaction Flow

### 1. User clicks Settings button in Header

```typescript
// src/components/layout/header.tsx
'use client';

import { useState } from 'react';
import { SettingsPanel } from '@/components/organisms/settings-panel';

export const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header>
        {/* Existing header content */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="size-4" />
        </Button>
      </header>

      {/* Settings Sheet */}
      <SettingsPanel
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
};
```

### 2. Sheet opens with current settings

```typescript
// src/components/organisms/settings-panel.tsx
'use client';

export function SettingsPanel({ open, onOpenChange }) {
  const { model, apiKey, setModel, setApiKey } = useModelStore();

  // ✅ Initial values come from Zustand store (persisted in localStorage)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {/* Model selector - pre-populated with current model */}
        {/* API key input - pre-populated with current API key */}
      </SheetContent>
    </Sheet>
  );
}
```

### 3. User changes settings

```typescript
// ✅ Zustand automatically persists to localStorage on every change
const handleModelChange = (newModel: string) => {
  setModel(newModel); // Zustand persist middleware saves to localStorage
};

const handleApiKeyChange = (newApiKey: string) => {
  setApiKey(newApiKey); // Zustand persist middleware saves to localStorage
};
```

### 4. On next page load

```typescript
// ✅ Zustand persist middleware automatically:
// 1. Reads from localStorage on mount
// 2. Hydrates store with saved values
// 3. Components re-render with persisted state

// No manual code needed!
```

## 11. Files to Create

### `src/components/organisms/settings-panel.tsx`
**Purpose**: Settings Sheet component with model selection, API key input, and footer credits
**Type**: Client Component (needs "use client")
**Exports**: `export function SettingsPanel({ open, onOpenChange })`
**Dependencies**: Sheet components from shadcn/ui (to be added by shadcn-builder agent)

### No new files in `app/` directory
This feature integrates into existing home page - no new routes needed.

## 12. Files to Modify

### `src/stores/model.store.ts`
**Change**: Add Zustand persist middleware for localStorage sync
**Additions**:
- Import `persist` and `createJSONStorage` from 'zustand/middleware'
- Create `safeLocalStorage` wrapper (SSR-safe)
- Wrap store with `persist()` middleware
- Configure persistence options (name, storage, partialize)

**Diff Preview**:
```diff
  import { create } from 'zustand';
+ import { persist, createJSONStorage } from 'zustand/middleware';

+ // SSR-safe localStorage wrapper
+ const safeLocalStorage = { /* ... */ };

- export const useModelStore = create<ModelStore>(set => ({
+ export const useModelStore = create<ModelStore>()(
+   persist(
+     (set) => ({
        model: currentModel,
        apiKey: '',
        setModel: (model: string) => set({ model }),
        setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' })
-     }));
+     }),
+     {
+       name: 'model-settings',
+       storage: createJSONStorage(() => safeLocalStorage)
+     }
+   )
+ );
```

### `src/components/layout/header.tsx`
**Change**: Add state for Sheet open/close and integrate SettingsPanel component
**Additions**:
- Import `useState` from 'react'
- Import `SettingsPanel` component
- Add `isSettingsOpen` state
- Add `onClick` handler to Settings button
- Render `<SettingsPanel>` component

**Diff Preview**:
```diff
  'use client';

+ import { useState } from 'react';
  import { ViewToggle } from '../molecules/view-toggle';
+ import { SettingsPanel } from '@/components/organisms/settings-panel';
  import { useEmailStore } from '@/stores/email.store';
  import { Button } from '../ui/button';
  import { Settings } from 'lucide-react';

  export const Header = () => {
+   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { subject, htmlBody, jsxBody, isLoading } = useEmailStore();
    const showViewToggle = isLoading || !!(subject || htmlBody || jsxBody);

    return (
+     <>
        <header className="...">
          {/* ... existing header content ... */}

-         <Button variant="outline" size="icon" className="cursor-pointer">
+         <Button
+           variant="outline"
+           size="icon"
+           className="cursor-pointer"
+           onClick={() => setIsSettingsOpen(true)}
+         >
            <Settings className="size-4" />
          </Button>
        </header>

+       <SettingsPanel
+         open={isSettingsOpen}
+         onOpenChange={setIsSettingsOpen}
+       />
+     </>
    );
  };
```

### `package.json` (if needed)
**Change**: Ensure `zustand` version supports persist middleware
**Note**: Check current version - persist middleware is available in zustand@4.0.0+

## 13. shadcn/ui Components Needed

**Delegation**: The shadcn-builder agent will handle component selection and installation.

**Required Components**:
1. **Sheet** - Main dialog component for settings panel
2. **Label** - Form labels for inputs
3. **Input** - API key input field
4. **Select** - Model selection dropdown (if not already available)

**Note**: Parent agent should invoke shadcn-builder agent to add these components before implementing SettingsPanel.

## 14. Implementation Steps

**Step 1: Install shadcn/ui Sheet component**
- Delegate to shadcn-builder agent
- Ensure Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter are available

**Step 2: Modify model.store.ts**
- Import persist middleware from zustand
- Create safeLocalStorage wrapper
- Wrap store with persist() middleware
- Configure persistence options

**Step 3: Create SettingsPanel component**
- Create file: `src/components/organisms/settings-panel.tsx`
- Add "use client" directive
- Import Sheet components and Zustand store
- Implement UI with model selector and API key input
- Add footer with creator credits

**Step 4: Integrate into Header**
- Import SettingsPanel into header.tsx
- Add useState for Sheet open/close
- Add onClick handler to Settings button
- Render SettingsPanel with open state

**Step 5: Test hydration**
- Test SSR rendering (no errors)
- Test client-side hydration (localStorage loads)
- Test incognito mode (graceful fallback)
- Test localStorage unavailable scenarios

**Step 6: Verify persistence**
- Change model and API key in settings
- Verify localStorage is updated (DevTools)
- Refresh page - verify settings persist
- Clear localStorage - verify defaults are used

## 15. Component Placement Strategy

### Client Components Only

**Settings Panel** (new):
- **Location**: `src/components/organisms/settings-panel.tsx`
- **Reason**: Complex UI component combining Sheet + Form + Store integration
- **Atomic Design**: Organism (composed of molecules like Select, Input)

**Header** (existing):
- **Location**: `src/components/layout/header.tsx`
- **Already Client Component**: Correct placement

### No Server Components

This feature is 100% client-side - no Server Components needed.

## 16. Performance Considerations

### localStorage Access

**Performance**: localStorage is synchronous and fast
- No async operations needed
- No loading states required
- No Suspense boundaries needed

**Optimization**: Zustand persist middleware is optimized:
- Debounced writes to localStorage
- Only writes on state changes
- Minimal re-renders

### Hydration Performance

**Strategy**: Zustand persist handles hydration efficiently:
- Initial render uses default values (fast)
- Hydration happens after mount (non-blocking)
- Only one re-render after hydration

**No Flash of Incorrect Content**:
- Default values should match expected values
- Quick hydration prevents visible flash

### Bundle Size

**Sheet Component**: ~5-10KB (acceptable for this feature)
**Zustand Persist**: ~1KB (minimal overhead)

## 17. Error Handling Strategy

### localStorage Errors

**Scenarios to Handle**:
1. **SSR/Server-Side**: localStorage undefined
2. **Incognito Mode**: localStorage throws on setItem
3. **Quota Exceeded**: localStorage full
4. **Browser Settings**: localStorage disabled

**Solution**: safeLocalStorage wrapper

```typescript
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    // ✅ Check if window exists (SSR)
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(name);
    } catch {
      // ✅ Silent fail - return null (use defaults)
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(name, value);
    } catch {
      // ✅ Silent fail - no error to user
      // Settings won't persist, but app still works
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(name);
    } catch {
      // ✅ Silent fail
    }
  }
};
```

**Strategy**: Graceful degradation
- If localStorage unavailable → settings don't persist
- App continues to work with in-memory state
- No error shown to user
- Defaults are used on next load

### Form Validation

**API Key Validation** (optional):
- Client-side: Basic format check (non-empty string)
- No server-side validation needed (API key validated on AI API call)

**Model Selection Validation**:
- Constrained by Select dropdown (no invalid values possible)

## 18. Important Notes

**Client-Side State** (UI Preferences):
- Model selection is a UI preference (not server state)
- API key is stored client-side (user's browser only)
- Zustand is appropriate per critical-constraints.md Rule #7

**Security Consideration**:
- API keys stored in localStorage are accessible to any JavaScript
- This is acceptable for client-side API calls (same as environment variables in browser)
- User is responsible for their own API key
- Consider adding warning: "Your API key is stored locally in your browser"

**SSR Considerations**:
- All components using localStorage must be Client Components
- Zustand persist middleware handles SSR gracefully
- No hydration mismatch warnings expected

**Migration Path** (if existing users have no localStorage):
- Default values from store definition are used
- On first settings change, localStorage is created
- Seamless migration - no user action required

## 19. Coordination with Other Agents

### shadcn-builder Agent
**Receives from this plan**:
- Component requirements (Sheet, Label, Input, Select)
- Usage context (settings panel)

**Provides back**:
- Installed shadcn/ui components
- Import paths and usage examples

**Action**: Parent agent should invoke shadcn-builder before implementing SettingsPanel component.

### UX Designer Agent
**Receives from this plan**:
- Component structure (Sheet with form fields)
- User flow (click settings → open sheet → edit settings)

**Provides back**:
- Detailed UI/UX design for settings panel
- Model selector design (dropdown, radio buttons, etc.)
- API key input design (password field, show/hide toggle)
- Footer credits design

**Action**: Parent agent should invoke ux-ui-designer to design the SettingsPanel UI before implementation.

### Domain Architect
**Not needed for this feature**:
- No business logic required
- No domain models needed
- Pure UI/client state management

### Code Reviewer
**After implementation**:
- Review localStorage error handling
- Review hydration strategy
- Review Zustand persist configuration
- Check for SSR/client mismatches

## 20. Testing Strategy

### Manual Testing Checklist

**localStorage Persistence**:
- [ ] Set model and API key in settings
- [ ] Verify localStorage updated (DevTools → Application → localStorage)
- [ ] Refresh page - settings persist
- [ ] Clear localStorage - defaults are used
- [ ] Change settings again - new values persist

**SSR/Hydration**:
- [ ] Hard refresh (bypass cache)
- [ ] No hydration warnings in console
- [ ] Settings load correctly after hydration
- [ ] No flash of incorrect content

**Error Scenarios**:
- [ ] Incognito mode - app works, settings don't persist
- [ ] localStorage disabled - app works, settings don't persist
- [ ] localStorage quota full - app works, silent fail

**UI/UX**:
- [ ] Settings button opens Sheet
- [ ] Sheet can be closed (X button, outside click, ESC key)
- [ ] Model selection updates immediately
- [ ] API key input updates immediately
- [ ] Footer credits visible and styled correctly

### Unit Testing (Optional)

**Store Testing**:
```typescript
// Test Zustand store with persist middleware
import { renderHook, act } from '@testing-library/react';
import { useModelStore } from '@/stores/model.store';

test('persists model to localStorage', () => {
  const { result } = renderHook(() => useModelStore());

  act(() => {
    result.current.setModel('gpt-5.1-2025-11-13');
  });

  expect(localStorage.getItem('model-settings')).toContain('gpt-5.1');
});
```

**Component Testing**:
```typescript
// Test SettingsPanel component
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from '@/components/organisms/settings-panel';

test('renders settings panel', () => {
  render(<SettingsPanel open={true} onOpenChange={jest.fn()} />);

  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/api key/i)).toBeInTheDocument();
});
```

## 21. Future Enhancements (Out of Scope)

**Not included in this plan** (consider for future iterations):

1. **API Key Validation**:
   - Validate API key format before saving
   - Test API key with provider (OpenAI, Gemini)
   - Show validation status (valid/invalid)

2. **Multiple API Keys**:
   - Store different API keys per provider
   - Auto-select API key based on selected model

3. **Settings Export/Import**:
   - Export settings to JSON file
   - Import settings from JSON file
   - Backup/restore functionality

4. **Settings Sync**:
   - Sync settings across devices (requires backend)
   - User account integration

5. **Advanced Settings**:
   - Temperature, max tokens, etc.
   - Prompt customization
   - Theme preferences

## 22. Architecture Decision Records

### ADR-001: Use Zustand persist middleware instead of manual localStorage

**Decision**: Use Zustand persist middleware for localStorage sync

**Rationale**:
- Automatic sync on state changes (no manual localStorage.setItem calls)
- Built-in SSR/hydration handling (no manual isClient checks)
- Optimized writes (debounced, only on changes)
- Less code to maintain
- Standard pattern in Zustand ecosystem

**Alternatives Considered**:
1. Manual localStorage in useEffect → More code, manual SSR handling
2. React Context with localStorage → More boilerplate, no optimization
3. Server-side storage → Overkill for UI preferences, requires backend

### ADR-002: Client Components only (no Server Components)

**Decision**: All components in this feature are Client Components

**Rationale**:
- localStorage is browser-only (requires client-side)
- Sheet component needs interactivity (open/close, form inputs)
- Zustand store is client-side state
- No server data fetching needed
- Complies with critical-constraints.md (only use "use client" when necessary)

**Why this is correct**: Browser APIs and interactivity require Client Components

### ADR-003: Graceful degradation for localStorage errors

**Decision**: Silent fail when localStorage is unavailable

**Rationale**:
- Better UX than showing error messages
- App continues to work with in-memory state
- Defaults provide reasonable fallback
- Covers SSR, incognito mode, disabled localStorage

**Alternatives Considered**:
1. Show error toast → Annoying for users, not actionable
2. Throw error → Breaks app unnecessarily
3. Fallback to cookies → More complexity, same issues in incognito

### ADR-004: Store in `src/stores/` instead of domain-based

**Decision**: Keep model.store.ts in `src/stores/` (existing location)

**Rationale**:
- Already exists in `src/stores/` - no need to move
- UI state (not business logic) - appropriate location
- Consistent with existing ui.store.ts pattern
- Complies with critical-constraints.md Rule #7 (Zustand for UI state)

**Note**: If this were server state (e.g., user workouts), it would belong in `src/domains/{domain}/stores/` and use React Query instead.

## 23. Implementation Checklist

**Before starting implementation**:
- [ ] Read this plan completely
- [ ] Invoke shadcn-builder agent to add Sheet components
- [ ] Invoke ux-ui-designer agent to design settings panel UI
- [ ] Review Zustand persist middleware documentation
- [ ] Review existing store patterns (ui.store.ts, model.store.ts)

**During implementation**:
- [ ] Modify model.store.ts with persist middleware
- [ ] Create safeLocalStorage wrapper
- [ ] Create SettingsPanel component
- [ ] Integrate SettingsPanel into Header
- [ ] Test localStorage persistence
- [ ] Test SSR/hydration (no warnings)
- [ ] Test error scenarios (incognito, disabled localStorage)

**After implementation**:
- [ ] Manual testing checklist complete
- [ ] No console errors or warnings
- [ ] localStorage updates correctly
- [ ] Settings persist across page reloads
- [ ] Graceful degradation works
- [ ] Update session context with implementation notes

## 24. Success Criteria

**Feature is complete when**:
1. Settings button opens Sheet with settings form
2. Model and API key can be edited in the Sheet
3. Settings are automatically persisted to localStorage
4. Settings are restored on page reload
5. No SSR/hydration errors or warnings
6. Graceful degradation when localStorage unavailable
7. Footer with creator credits is visible
8. All manual tests pass

**Quality Gates**:
- Zero console errors or warnings
- Zero hydration mismatch warnings
- localStorage operations are SSR-safe
- Zustand persist middleware correctly configured
- Component follows Atomic Design (in organisms/)
- Code follows critical-constraints.md rules

---

**Next Steps for Parent Agent**:

1. **Invoke shadcn-builder agent**:
   - Task: "Add Sheet component and related form components (Label, Input, Select if needed) for settings panel"
   - Session: settings-panel-20251207

2. **Invoke ux-ui-designer agent**:
   - Task: "Design settings panel UI with model selector, API key input, and footer credits"
   - Session: settings-panel-20251207

3. **Execute this plan**:
   - Modify model.store.ts with persist middleware
   - Create SettingsPanel component based on UX design
   - Integrate into Header component
   - Test thoroughly

4. **Update session context**:
   - Append implementation notes
   - Document any deviations from plan
   - Record lessons learned
