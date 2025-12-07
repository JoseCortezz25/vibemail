# Element Properties Panel - Code Review Report

**Reviewed**: 2025-12-06
**File**: `src/components/organisms/element-properties-panel.tsx`
**Reviewer**: code-reviewer
**Status**: CRITICAL VIOLATIONS

## 1. Executive Summary

**Files Reviewed**: 1
**Violations Found**: 14
**Critical Issues**: 8
**Warnings**: 6

**Overall Assessment**: This 297-line organism component contains multiple severe architectural violations including misplaced business logic, incorrect state management approach, Atomic Design violations, and critical constraint breaches. The component violates the fundamental principle that UI components should not contain domain-specific business logic or direct store manipulation. Immediate refactoring is required.

## 2. Critical Violations (Must Fix)

### CRITICAL 1: Component in Wrong Location (Screaming Architecture Violation)

**File**: `src/components/organisms/element-properties-panel.tsx` (entire file)
**Rule**: Critical Constraint #5 - Screaming Architecture
**Severity**: Critical

**Issue**: This component contains visual editing business logic but is located in `/components/organisms/` instead of `/domains/`. The `/components/` directory should ONLY contain reusable UI components without business logic.

**Current Location**:
```
src/components/organisms/element-properties-panel.tsx  # ❌ WRONG
```

**Required Fix**: Move to domain-specific location since this is specific to visual editing feature.

**Correct Location**:
```
src/domains/visual-editing/
├── components/
│   └── organisms/
│       └── element-properties-panel.tsx  # ✅ CORRECT
├── hooks/
│   └── use-visual-edits.ts              # Extract logic here
├── stores/
│   └── visual-edit-store.ts             # Store already exists
└── types.ts                              # Element types
```

**Reference**: `.claude/knowledge/critical-constraints.md#5-screaming-architecture`

---

### CRITICAL 2: Business Logic Embedded in UI Component (Lines 43-66)

**File**: `src/components/organisms/element-properties-panel.tsx:43-66`
**Rule**: Critical Constraint #11 - Business logic in custom hooks
**Severity**: Critical

**Current Code**:
```tsx
const handleApplyChanges = () => {
  if (!selectedElementId || !selectedElementProperties || !htmlBody) {
    toast.error('Cannot apply changes');
    return;
  }

  try {
    // Modify the HTML with the updated properties
    const updatedHTML = modifyElementInHTML({
      htmlBody,
      elementId: selectedElementId,
      properties: selectedElementProperties
    });

    // Update the HTML in the store
    setHtmlBody(updatedHTML);

    toast.success('Changes applied successfully');
    deselectElement();
  } catch (error) {
    console.error('Error applying changes:', error);
    toast.error('Failed to apply changes');
  }
};
```

**Issue**: Complex business logic (HTML modification, state orchestration, error handling) is embedded directly in the component. This violates the rule that business logic must be extracted to custom hooks within the corresponding domain.

**Required Fix**: Extract to custom hook in domain.

**Correct Approach**:
```tsx
// domains/visual-editing/hooks/use-visual-edits.ts
export function useVisualEdits() {
  const {
    selectedElementId,
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement
  } = useVisualEditStore();
  const { htmlBody, setHtmlBody } = useEmailStore();

  const applyChanges = useCallback(() => {
    if (!selectedElementId || !selectedElementProperties || !htmlBody) {
      toast.error('Cannot apply changes');
      return;
    }

    try {
      const updatedHTML = modifyElementInHTML({
        htmlBody,
        elementId: selectedElementId,
        properties: selectedElementProperties
      });

      setHtmlBody(updatedHTML);
      toast.success('Changes applied successfully');
      deselectElement();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error('Failed to apply changes');
    }
  }, [selectedElementId, selectedElementProperties, htmlBody, setHtmlBody, deselectElement]);

  return {
    selectedElementId,
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement,
    applyChanges,
    isValid: !!(selectedElementType && selectedElementProperties)
  };
}

// In component (clean presentation)
export function ElementPropertiesPanel() {
  const {
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement,
    applyChanges,
    isValid
  } = useVisualEdits();

  if (!isValid) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Render UI only */}
    </div>
  );
}
```

**Reference**: `.claude/knowledge/critical-constraints.md#11-business-logic-in-custom-hooks`

---

### CRITICAL 3: Stores Located Outside Domain Directory

**File**: Lines 14-15 (import statements)
**Rule**: Critical Constraint #5 - Screaming Architecture
**Severity**: Critical

**Current Code**:
```tsx
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useEmailStore } from '@/stores/email.store';
```

**Issue**: Stores are located in `/stores/` directory (flat structure) instead of domain-specific locations. This violates Screaming Architecture principles.

**Current Structure**:
```
src/stores/
├── visual-edit.store.ts  # ❌ WRONG - should be in domain
├── email.store.ts        # ❌ WRONG - should be in domain
```

**Required Fix**: Move stores to their respective domains.

**Correct Structure**:
```
src/domains/
├── visual-editing/
│   └── stores/
│       └── visual-edit-store.ts  # ✅ CORRECT
└── email/
    └── stores/
        └── email-store.ts        # ✅ CORRECT
```

**Correct Imports**:
```tsx
import { useVisualEditStore } from '@/domains/visual-editing/stores/visual-edit-store';
import { useEmailStore } from '@/domains/email/stores/email-store';
```

**Reference**: `.claude/knowledge/file-structure.md#stores-zustand`

---

### CRITICAL 4: File Naming Convention Violation

**File**: `src/components/organisms/element-properties-panel.tsx` (filename)
**Rule**: File Structure - Component Naming
**Severity**: Critical

**Issue**: Component is named "VisualEdits" (line 20) but file is named "element-properties-panel.tsx". File name should match the exported component name.

**Current**:
```tsx
// element-properties-panel.tsx
export const VisualEdits = () => { ... }  # ❌ Name mismatch
```

**Required Fix**: Either rename file or component for consistency.

**Correct Option 1** (Rename file):
```
visual-edits.tsx  # ✅ Matches component name
export const VisualEdits = () => { ... }
```

**Correct Option 2** (Rename component):
```
element-properties-panel.tsx
export const ElementPropertiesPanel = () => { ... }  # ✅ Matches file name
```

**Reference**: `.claude/knowledge/file-structure.md#components`

---

### CRITICAL 5: Default Export Violation (Line 20)

**File**: `src/components/organisms/element-properties-panel.tsx:20`
**Rule**: Critical Constraint #4 - Named exports only
**Severity**: Critical

**Current Code**:
```tsx
export const VisualEdits = () => {
```

**Issue**: While this uses `const` with named export, the arrow function syntax is non-standard for React components. Named function declarations are preferred and more debuggable.

**Required Fix**: Use named function declaration.

**Correct Approach**:
```tsx
// ✅ CORRECT
export function VisualEdits() {
  // component logic
}
```

**Benefits**:
- Better stack traces in debugging
- More standard React component pattern
- Consistent with React conventions
- Better static analysis support

**Reference**: `.claude/knowledge/critical-constraints.md#4-named-exports-only`

---

### CRITICAL 6: Atomic Design Violation - Oversized Organism (297 lines)

**File**: `src/components/organisms/element-properties-panel.tsx` (entire file)
**Rule**: Architecture Patterns - Atomic Design
**Severity**: Critical

**Issue**: This 297-line organism component violates Atomic Design principles. It contains multiple responsibilities that should be broken down into smaller atoms and molecules:

1. **Empty state UI** (lines 31-41) - Should be separate molecule
2. **Content accordion section** (lines 87-149) - Should be separate molecule
3. **Style accordion section** (lines 151-223) - Should be separate molecule
4. **Layout accordion section** (lines 225-281) - Should be separate molecule
5. **Action buttons footer** (lines 285-292) - Should be separate molecule

**Required Fix**: Break down into Atomic Design hierarchy.

**Correct Approach**:

```tsx
// domains/visual-editing/components/atoms/
// - property-input.tsx
// - property-color-picker.tsx
// - property-textarea.tsx

// domains/visual-editing/components/molecules/
// - empty-state-message.tsx
// - content-properties-section.tsx
// - style-properties-section.tsx
// - layout-properties-section.tsx
// - properties-actions.tsx

// domains/visual-editing/components/organisms/
// - element-properties-panel.tsx (orchestrates molecules)

// Clean organism (under 100 lines):
export function ElementPropertiesPanel() {
  const {
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement,
    applyChanges,
    isValid
  } = useVisualEdits();

  if (!isValid) {
    return <EmptyStateMessage />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col border-0 shadow-none">
        <PanelHeader title="Visual Edits" />

        <CardContent className="max-h-[calc(100dvh-190px)] flex-1 overflow-auto p-4">
          <Accordion type="multiple" defaultValue={['content', 'style', 'layout']}>
            <ContentPropertiesSection
              elementType={selectedElementType}
              properties={selectedElementProperties}
              onUpdate={updateElementProperty}
            />
            <StylePropertiesSection
              properties={selectedElementProperties}
              onUpdate={updateElementProperty}
            />
            <LayoutPropertiesSection
              properties={selectedElementProperties}
              onUpdate={updateElementProperty}
            />
          </Accordion>
        </CardContent>

        <PropertiesActions
          onApply={applyChanges}
          onCancel={deselectElement}
        />
      </div>
    </div>
  );
}
```

**Reference**: `.claude/knowledge/architecture-patterns.md#atomic-design`

---

### CRITICAL 7: Multiple Direct Store Imports in Component (Lines 21-28)

**File**: `src/components/organisms/element-properties-panel.tsx:21-28`
**Rule**: Critical Constraint #11 - Business logic in custom hooks
**Severity**: Critical

**Current Code**:
```tsx
const {
  selectedElementId,
  selectedElementType,
  selectedElementProperties,
  updateElementProperty,
  deselectElement
} = useVisualEditStore();
const { htmlBody, setHtmlBody } = useEmailStore();
```

**Issue**: Component directly consumes multiple stores. This creates tight coupling and makes the component untestable and non-reusable. Store logic should be abstracted through custom hooks.

**Required Fix**: Abstract store access through custom hook.

**Correct Approach**:
```tsx
// domains/visual-editing/hooks/use-visual-edits.ts
export function useVisualEdits() {
  const {
    selectedElementId,
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement
  } = useVisualEditStore();
  const { htmlBody, setHtmlBody } = useEmailStore();

  // Expose clean API
  return {
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement,
    applyChanges: () => { /* implementation */ },
    isValid: !!(selectedElementType && selectedElementProperties)
  };
}

// In component - single hook import
export function ElementPropertiesPanel() {
  const visualEdits = useVisualEdits();
  // Component only knows about the hook, not the stores
}
```

**Benefits**:
- Single source of truth for visual editing logic
- Easier to test (mock single hook vs multiple stores)
- Reusable across components
- Easier to refactor store implementation

**Reference**: `.claude/knowledge/critical-constraints.md#11-business-logic-in-custom-hooks`

---

### CRITICAL 8: Missing Client Component Directive Justification

**File**: `src/components/organisms/element-properties-panel.tsx:1`
**Rule**: Critical Constraint #1 - React Server Components as foundation
**Severity**: High

**Current Code**:
```tsx
'use client';
```

**Issue**: While `'use client'` is correctly used (component needs interactivity), there's no comment explaining WHY this needs to be a Client Component. This makes it harder for future developers to understand architectural decisions.

**Required Fix**: Add explanatory comment.

**Correct Approach**:
```tsx
// 'use client' required for:
// - useState/form interactions (input changes)
// - Zustand store consumption (useVisualEditStore, useEmailStore)
// - Toast notifications (sonner)
'use client';
```

**Reference**: `.claude/knowledge/critical-constraints.md#1-react-server-components`

---

## 3. Warnings (Should Fix)

### WARNING 1: Hardcoded UI Strings (Lines 33-36, 77)

**File**: Multiple locations
**Issue**: Hardcoded UI text strings instead of externalization to text maps
**Recommendation**: Extract to config/messages.ts

**Current**:
```tsx
<p className="text-sm">No element selected</p>
<p className="text-muted-foreground/70 text-xs">
  Click on an element in the preview to edit its properties
</p>
<h2 className="text-lg font-medium">Visual Edits</h2>
```

**Recommended**:
```tsx
// config/messages.ts
export const visualEditMessages = {
  noElementSelected: 'No element selected',
  noElementHint: 'Click on an element in the preview to edit its properties',
  panelTitle: 'Visual Edits',
  applyButton: 'Apply Changes',
  cancelButton: 'Cancel'
};

// In component
import { visualEditMessages as msg } from '@/config/messages';

<p className="text-sm">{msg.noElementSelected}</p>
<p className="text-muted-foreground/70 text-xs">{msg.noElementHint}</p>
```

**Impact**: Easier i18n support in the future, centralized text management

---

### WARNING 2: Type Definitions Missing for Element Properties

**File**: Lines 68-71
**Issue**: Inline type checking without proper type guards
**Recommendation**: Create proper type guards in domain types

**Current**:
```tsx
const isTextElement = ['text', 'button', 'link'].includes(
  selectedElementType
);
const isImageElement = selectedElementType === 'image';
```

**Recommended**:
```tsx
// domains/visual-editing/types.ts
export type ElementType = 'text' | 'image' | 'button' | 'container' | 'link';

export type TextElementType = 'text' | 'button' | 'link';
export type ImageElementType = 'image';

export function isTextElement(type: ElementType | null): type is TextElementType {
  return type === 'text' || type === 'button' || type === 'link';
}

export function isImageElement(type: ElementType | null): type is ImageElementType {
  return type === 'image';
}

// In component
import { isTextElement, isImageElement } from '@/domains/visual-editing/types';
```

**Impact**: Better type safety, reusable type guards, clearer intent

---

### WARNING 3: Repetitive Input Components (Lines 92-147)

**File**: Multiple accordion sections
**Issue**: Repeated Input/Label/Textarea patterns could be extracted
**Recommendation**: Create PropertyInput molecule

**Current** (repeated 10+ times):
```tsx
<div className="space-y-2">
  <Label htmlFor="content">Text Content</Label>
  <Textarea
    id="content"
    value={selectedElementProperties.content || ''}
    onChange={e => updateElementProperty('content', e.target.value)}
    rows={4}
    placeholder="Enter text content..."
  />
</div>
```

**Recommended**:
```tsx
// domains/visual-editing/components/atoms/property-field.tsx
interface PropertyFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'url' | 'color' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function PropertyField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  rows
}: PropertyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {type === 'textarea' ? (
        <Textarea
          id={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={name}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

// Usage
<PropertyField
  label="Text Content"
  name="content"
  type="textarea"
  value={selectedElementProperties.content || ''}
  onChange={value => updateElementProperty('content', value)}
  placeholder="Enter text content..."
  rows={4}
/>
```

**Impact**: DRY principle, easier maintenance, consistent styling

---

### WARNING 4: Missing Error Boundary

**File**: Lines 43-66
**Issue**: Error handling with try-catch but no Error Boundary for React errors
**Recommendation**: Wrap component in Error Boundary

**Current**:
```tsx
try {
  const updatedHTML = modifyElementInHTML({...});
  setHtmlBody(updatedHTML);
  toast.success('Changes applied successfully');
} catch (error) {
  console.error('Error applying changes:', error);
  toast.error('Failed to apply changes');
}
```

**Recommended**:
```tsx
// app/editor/page.tsx or parent component
import { ErrorBoundary } from '@/components/molecules/error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <ElementPropertiesPanel />
</ErrorBoundary>
```

**Impact**: Better error handling for render-time errors, improved UX

---

### WARNING 5: Accessibility - Missing ARIA Labels

**File**: Lines 74-295
**Issue**: Complex interactive panel without proper ARIA labels
**Recommendation**: Add aria-label and semantic HTML

**Current**:
```tsx
<div className="flex h-full flex-col overflow-hidden">
  <div className="flex h-full flex-col border-0 shadow-none">
```

**Recommended**:
```tsx
<aside
  className="flex h-full flex-col overflow-hidden"
  aria-label="Element properties panel"
  role="complementary"
>
  <div className="flex h-full flex-col border-0 shadow-none">
```

**Impact**: Better screen reader support, improved accessibility

---

### WARNING 6: Performance - Missing Memoization

**File**: Lines 43-66, 68-71
**Issue**: Handler functions and computed values recreated on every render
**Recommendation**: Use useCallback and useMemo

**Current**:
```tsx
const handleApplyChanges = () => { ... };

const isTextElement = ['text', 'button', 'link'].includes(
  selectedElementType
);
```

**Recommended**:
```tsx
const handleApplyChanges = useCallback(() => {
  // implementation
}, [selectedElementId, selectedElementProperties, htmlBody, setHtmlBody, deselectElement]);

const isTextElement = useMemo(
  () => ['text', 'button', 'link'].includes(selectedElementType),
  [selectedElementType]
);
```

**Impact**: Prevents unnecessary re-renders, better performance

---

## 4. Compliance Summary

### Critical Constraints

| Rule | Status | Notes |
|------|--------|-------|
| React Server Components | ⚠️ Partial | Correctly uses 'use client' but lacks justification comment |
| Server Actions | ✅ Pass | N/A - no mutations in this component |
| Suspense Boundaries | ✅ Pass | N/A - no async operations |
| Named Exports | ⚠️ Partial | Uses const arrow function instead of named function |
| Screaming Architecture | ❌ Fail | Component in /components/ instead of /domains/ |
| Naming Conventions | ⚠️ Partial | File name doesn't match component name |
| State Management | ✅ Pass | Correctly uses Zustand for UI state |
| Route Protection | ✅ Pass | N/A - UI component only |
| Forms | ✅ Pass | Simple form inputs, appropriate use of controlled components |
| Styles | ✅ Pass | Uses Tailwind classes appropriately |
| Business Logic | ❌ Fail | Business logic embedded in component instead of custom hooks |

### File Structure

| Rule | Status | Notes |
|------|--------|-------|
| Component Naming | ❌ Fail | element-properties-panel.tsx vs VisualEdits component name |
| Hook Naming | ✅ Pass | N/A - no hooks defined |
| Server Action Files | ✅ Pass | N/A - no actions |
| Store Naming | ❌ Fail | Stores in /stores/ instead of /domains/{domain}/stores/ |
| Import Strategy | ✅ Pass | Uses absolute imports with @/ |
| Directory Structure | ❌ Fail | Component in wrong location (not domain-based) |

### Tech Stack

| Rule | Status | Notes |
|------|--------|-------|
| Package Manager | ✅ Pass | Using pnpm correctly |
| State Management Tools | ✅ Pass | Zustand used correctly for UI state |
| Form Handling | ✅ Pass | Simple controlled inputs, appropriate for use case |
| Validation | ⚠️ Partial | No explicit validation of property values |
| Styling | ✅ Pass | Tailwind CSS v4 used correctly |

## 5. Refactoring Plan

### Priority 1: Critical Violations (Must Fix)

**Steps**:

1. **Create domain structure**
   ```bash
   mkdir -p src/domains/visual-editing/{components/{atoms,molecules,organisms},hooks,stores,types}
   mkdir -p src/domains/email/stores
   ```

2. **Move stores to domains**
   - Move `src/stores/visual-edit.store.ts` → `src/domains/visual-editing/stores/visual-edit-store.ts`
   - Move `src/stores/email.store.ts` → `src/domains/email/stores/email-store.ts`

3. **Extract business logic to custom hook**
   - Create `src/domains/visual-editing/hooks/use-visual-edits.ts`
   - Extract `handleApplyChanges` logic
   - Extract store consumption
   - Export clean API

4. **Break down component into Atomic Design hierarchy**
   - Create `empty-state-message.tsx` molecule
   - Create `content-properties-section.tsx` molecule
   - Create `style-properties-section.tsx` molecule
   - Create `layout-properties-section.tsx` molecule
   - Create `properties-actions.tsx` molecule
   - Create `property-field.tsx` atom
   - Refactor organism to orchestrate molecules (target: <100 lines)

5. **Move component to correct location**
   - Move to `src/domains/visual-editing/components/organisms/element-properties-panel.tsx`
   - Update all imports in consuming files

6. **Fix naming inconsistencies**
   - Rename component to `ElementPropertiesPanel` to match filename
   - Use named function declaration instead of const arrow function

**Estimated Effort**: 4-6 hours

### Priority 2: Warnings and Improvements

**Steps**:

1. **Externalize UI strings** to `config/messages.ts`
2. **Create type guards** in `domains/visual-editing/types.ts`
3. **Add Error Boundary** wrapper in parent component
4. **Add accessibility attributes** (aria-label, semantic HTML)
5. **Add performance optimizations** (useCallback, useMemo)
6. **Add JSDoc comments** for public API

**Estimated Effort**: 2-3 hours

## 6. Files Reviewed

- ❌ `src/components/organisms/element-properties-panel.tsx` - 8 critical violations, 6 warnings

## 7. Recommendations

### Immediate Actions

1. **STOP using this component as reference** - it violates multiple critical constraints
2. **Create domain structure** for visual-editing feature
3. **Extract business logic** to custom hooks before adding more features
4. **Break down into Atomic Design** components to improve maintainability

### Future Improvements

1. **Add unit tests** for custom hooks once extracted
2. **Add Storybook stories** for each molecule/atom
3. **Consider React Hook Form** if property validation becomes more complex
4. **Add TypeScript strict mode** checks for type safety
5. **Document component API** with JSDoc for better DX

## 8. Positive Highlights

**Good Practices Found**:

- ✅ Correctly uses `'use client'` directive for interactive component
- ✅ Appropriate use of Zustand for UI state management (not server data)
- ✅ Uses absolute imports with @/ alias consistently
- ✅ Proper use of shadcn/ui components (Accordion, Input, Label, etc.)
- ✅ Conditional rendering for different element types
- ✅ User feedback with toast notifications
- ✅ Error handling with try-catch for critical operations
- ✅ Semantic component structure with clear sections

## 9. Next Steps

**CRITICAL VIOLATIONS FOUND - IMMEDIATE ACTION REQUIRED**

1. **Parent agent reviews this report**
2. **Create domain structure** as outlined in Priority 1
3. **Implement refactoring plan** step-by-step
4. **Re-run code-reviewer** after fixes to verify compliance
5. **Update other components** that may have similar violations

**IMPORTANT**: Do NOT proceed with adding new features to this component until Priority 1 violations are fixed. The current architecture will make the codebase increasingly difficult to maintain.

---

## Appendix: Proposed New Structure

### Recommended File Organization

```
src/
├── domains/
│   ├── visual-editing/
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   ├── property-field.tsx
│   │   │   │   └── property-color-picker.tsx
│   │   │   ├── molecules/
│   │   │   │   ├── empty-state-message.tsx
│   │   │   │   ├── content-properties-section.tsx
│   │   │   │   ├── style-properties-section.tsx
│   │   │   │   ├── layout-properties-section.tsx
│   │   │   │   └── properties-actions.tsx
│   │   │   └── organisms/
│   │   │       └── element-properties-panel.tsx  # ✅ NEW LOCATION
│   │   ├── hooks/
│   │   │   └── use-visual-edits.ts              # ✅ NEW - extract logic
│   │   ├── stores/
│   │   │   └── visual-edit-store.ts             # ✅ MOVED from /stores
│   │   └── types.ts                              # ✅ NEW - type guards
│   └── email/
│       └── stores/
│           └── email-store.ts                    # ✅ MOVED from /stores
└── config/
    └── messages.ts                               # ✅ NEW - UI strings
```

### Estimated Lines of Code After Refactor

- `element-properties-panel.tsx`: ~80 lines (down from 297)
- `use-visual-edits.ts`: ~60 lines (extracted logic)
- `content-properties-section.tsx`: ~35 lines
- `style-properties-section.tsx`: ~40 lines
- `layout-properties-section.tsx`: ~35 lines
- `properties-actions.tsx`: ~20 lines
- `property-field.tsx`: ~30 lines
- `empty-state-message.tsx`: ~15 lines
- Total: ~315 lines (organized, maintainable, testable)

**Benefit**: Same functionality, better organization, easier to maintain, follows all architectural constraints.
