# prompt-textarea Component - Code Review Report

**Reviewed**: 2025-12-06
**Reviewer**: code-reviewer
**Component**: `src/components/molecules/prompt-textarea.tsx`
**Status**: CRITICAL VIOLATIONS

## 1. Executive Summary

**Files Reviewed**: 1
**Violations Found**: 11
**Critical Issues**: 7
**Warnings**: 4

**Overall Assessment**: This component is severely misclassified and violates multiple critical architectural constraints. It should be reclassified as an ORGANISM, moved to a domain, and have its business logic extracted to custom hooks. The component has grown beyond the acceptable size for a molecule (129 lines vs 30-80 line guideline) and mixes multiple responsibilities.

---

## 2. Critical Violations (Must Fix)

### VIOLATION 1: Misclassification - Component is an Organism, Not a Molecule

**File**: `src/components/molecules/prompt-textarea.tsx:1-129`
**Rule**: Atomic Design hierarchy - molecules should be simple compositions (30-80 lines)
**Severity**: Critical

**Issue**: This component is 129 lines and composes multiple molecules AND organisms, making it definitively an organism, not a molecule.

**Evidence**:
- Composes 6+ child components: `PromptInput`, `SelectedElementIndicator`, `Source`, `InputUploadFiles`, `Button` (2 instances), `PromptInputTextarea`
- Contains complex business logic (file management, form submission, mode toggling)
- Manages 4 pieces of state
- Integrates with 2 global stores
- Has conditional rendering logic for feature flags

**Atomic Design Hierarchy**:
- **Atoms**: Basic UI elements (buttons, inputs) - 10-30 lines
- **Molecules**: Simple compositions of atoms - 30-80 lines
- **Organisms**: Complex compositions with business logic - 80-200 lines

**This component clearly fits the organism definition.**

**Required Fix**: Rename and relocate to `src/components/organisms/prompt-textarea.tsx`

**Reference**: `.claude/knowledge/architecture-patterns.md#atomic-design`

---

### VIOLATION 2: Business Logic in UI Component (Not Extracted to Hooks)

**File**: `src/components/molecules/prompt-textarea.tsx:32-54`
**Rule**: Critical Constraint #11 - Business logic must be extracted to custom hooks
**Severity**: Critical

**Current Code**:
```typescript
const handleFileRemove = (file: File) => {
  if (!files) return;

  const newFiles = Array.from(files).filter(f => f.name !== file.name);
  const dataTransfer = new DataTransfer();
  newFiles.forEach(file => dataTransfer.items.add(file));
  setFiles(dataTransfer.files);
};

const handleSubmitInput = () => {
  if (files && files.length > 0) {
    onSubmit(input, files);
  } else {
    onSubmit(input);
  }

  setFiles(undefined);
  setInput('');

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};
```

**Issue**: Complex file manipulation logic and form state management is embedded directly in the component, violating the separation of concerns principle.

**Required Fix**: Extract to a custom hook

**Correct Approach**:
```typescript
// domains/chat/hooks/use-prompt-input.ts
export function usePromptInput(onSubmit: (message: string, files?: FileList) => void) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRemove = useCallback((file: File) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(f => f.name !== file.name);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  }, [files]);

  const handleSubmitInput = useCallback(() => {
    if (files && files.length > 0) {
      onSubmit(input, files);
    } else {
      onSubmit(input);
    }

    setFiles(undefined);
    setInput('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [input, files, onSubmit]);

  return {
    input,
    setInput,
    files,
    setFiles,
    fileInputRef,
    handleFileRemove,
    handleSubmitInput
  };
}

// Component becomes simpler:
export function PromptTextarea({ onSubmit, isLoading }: PromptTextareaProps) {
  const {
    input,
    setInput,
    files,
    handleFileRemove,
    handleSubmitInput,
    fileInputRef
  } = usePromptInput(onSubmit);

  // ... render logic only
}
```

**Reference**: `.claude/knowledge/critical-constraints.md#11-business-logic-in-custom-hooks`

---

### VIOLATION 3: Global Store Access in Generic UI Component

**File**: `src/components/molecules/prompt-textarea.tsx:15-18,29-30`
**Rule**: Architecture dependency rules - components/ cannot import from domains or stores
**Severity**: Critical

**Current Code**:
```typescript
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useEmailStore } from '@/stores/email.store';

// In component:
const { isEditMode, setEditMode } = useVisualEditStore();
const { htmlBody } = useEmailStore();
```

**Issue**: Generic UI components in `/components` should NOT access domain-specific stores. This creates tight coupling and violates the dependency rules.

**Dependency Matrix Violation**:
```
components → stores: ❌ FORBIDDEN
```

**Required Fix**: This component belongs in a domain (likely `domains/chat/` or `domains/email/`), not in generic `/components`.

**Correct Approach**:
```typescript
// Move to: domains/chat/components/organisms/prompt-textarea.tsx
// OR pass data as props from parent:

interface PromptTextareaProps {
  onSubmit: (message: string, files?: FileList) => void;
  isLoading: boolean;
  // Add explicit props instead of store access
  isEditMode?: boolean;
  onEditModeChange?: (enabled: boolean) => void;
  hasEmailBody?: boolean;
}

export function PromptTextarea({
  onSubmit,
  isLoading,
  isEditMode = false,
  onEditModeChange,
  hasEmailBody = false
}: PromptTextareaProps) {
  // Use props instead of direct store access
}
```

**Reference**: `.claude/knowledge/architecture-patterns.md#dependency-rules`

---

### VIOLATION 4: Component in Wrong Location (Business Logic in /components)

**File**: `src/components/molecules/prompt-textarea.tsx:1`
**Rule**: Critical Constraint #5 - Screaming Architecture
**Severity**: Critical

**Issue**: This component contains business logic specific to chat/email features, but is placed in the generic `/components` folder. It should be in a domain folder.

**Current Location**: `src/components/molecules/prompt-textarea.tsx`
**Correct Location**: `src/domains/chat/components/organisms/prompt-textarea.tsx`

**Why?**
- Accesses domain-specific stores (visual-edit, email)
- Has chat/email-specific logic (file uploads, design mode toggle)
- Not a generic reusable UI component
- Tightly coupled to specific business features

**Reference**: `.claude/knowledge/critical-constraints.md#5-screaming-architecture`

---

### VIOLATION 5: Missing Naming Convention Prefixes

**File**: `src/components/molecules/prompt-textarea.tsx:26-28`
**Rule**: Critical Constraint #6 - Strict naming conventions
**Severity**: High

**Current Code**:
```typescript
const [input, setInput] = useState('');
const [files, setFiles] = useState<FileList | undefined>(undefined);
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Issues**:
1. No clear semantic naming
2. Generic variable names that don't convey purpose

**Correct Approach**:
```typescript
// Better semantic names
const [inputValue, setInputValue] = useState('');  // Or: promptText, messageText
const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(undefined);
const fileInputRef = useRef<HTMLInputElement>(null);  // This one is OK
```

Note: While these aren't boolean violations, they lack semantic clarity required by the naming conventions.

**Reference**: `.claude/knowledge/critical-constraints.md#6-strict-naming-conventions`

---

### VIOLATION 6: Inline Business Logic in Render (Lines 67-77)

**File**: `src/components/molecules/prompt-textarea.tsx:67-77`
**Rule**: Critical Constraint #11 - Extract business logic to hooks
**Severity**: High

**Current Code**:
```typescript
{files && files.length > 0 && (
  <div className="flex flex-wrap gap-2 pb-2">
    {Array.from(files).map((file, index) => (
      <Source
        key={index}
        filename={file.name}
        onRemove={() => handleFileRemove(file)}
      />
    ))}
  </div>
)}
```

**Issues**:
1. Array transformation logic in render
2. Using `index` as key (anti-pattern)
3. Inline callback creation in render (performance issue)

**Correct Approach**:
```typescript
// In custom hook:
const fileList = useMemo(() => {
  if (!files) return [];
  return Array.from(files).map((file, index) => ({
    id: `${file.name}-${file.size}-${index}`, // Unique stable key
    name: file.name,
    file
  }));
}, [files]);

// In component:
{fileList.length > 0 && (
  <div className="flex flex-wrap gap-2 pb-2">
    {fileList.map(({ id, name, file }) => (
      <Source
        key={id}
        filename={name}
        onRemove={() => handleFileRemove(file)}
      />
    ))}
  </div>
)}
```

**Reference**: `.claude/knowledge/critical-constraints.md#11-business-logic-in-custom-hooks`

---

### VIOLATION 7: Complex Conditional UI Logic (Feature Flag Pattern Missing)

**File**: `src/components/molecules/prompt-textarea.tsx:90-107`
**Rule**: Maintainability - Complex conditionals should be extracted
**Severity**: Medium

**Current Code**:
```typescript
{!!htmlBody && (
  <PromptInputAction tooltip="Select elements">
    <Button
      variant="ghost"
      disabled={isLoading}
      className={cn(
        'h-8 cursor-pointer rounded-[10px] p-2 text-sm transition-all disabled:cursor-not-allowed',
        !isEditMode
          ? 'bg-gray-100'
          : 'bg-black-700 hover:bg-black-700/80 text-white hover:text-white'
      )}
      onClick={() => setEditMode(!isEditMode)}
    >
      <MousePointer2 className="size-4" />
      Design
    </Button>
  </PromptInputAction>
)}
```

**Issue**: Complex conditional rendering and dynamic className logic embedded in JSX makes it hard to read and test.

**Correct Approach**:
```typescript
// Extract to computed values
const showDesignMode = !!htmlBody;
const designButtonClassName = cn(
  'h-8 cursor-pointer rounded-[10px] p-2 text-sm transition-all disabled:cursor-not-allowed',
  isEditMode
    ? 'bg-black-700 hover:bg-black-700/80 text-white hover:text-white'
    : 'bg-gray-100'
);

// Simpler render:
{showDesignMode && (
  <PromptInputAction tooltip="Select elements">
    <Button
      variant="ghost"
      disabled={isLoading}
      className={designButtonClassName}
      onClick={() => setEditMode(!isEditMode)}
    >
      <MousePointer2 className="size-4" />
      Design
    </Button>
  </PromptInputAction>
)}
```

**Reference**: React best practices - computed values over inline logic

---

## 3. Warnings (Should Fix)

### WARNING 1: Component Size Exceeds Molecule Guidelines

**File**: `src/components/molecules/prompt-textarea.tsx:1-129`
**Issue**: Component is 129 lines, which exceeds the typical molecule size (30-80 lines)
**Recommendation**: Split into smaller components or reclassify as organism
**Impact**: Reduces maintainability and violates Atomic Design principles

---

### WARNING 2: Prop Drilling Pattern

**File**: `src/components/molecules/prompt-textarea.tsx:14,87`
**Issue**: `fileInputRef` is created in this component but passed down to `InputUploadFiles`
**Recommendation**: Consider lifting ref management to parent or using context for deeply nested refs
**Impact**: Creates tight coupling between parent and child components

---

### WARNING 3: Missing Memoization for Callbacks

**File**: `src/components/molecules/prompt-textarea.tsx:32-54`
**Issue**: Handler functions are recreated on every render
**Recommendation**: Wrap handlers in `useCallback` to prevent unnecessary re-renders
**Impact**: Performance degradation, especially with file operations

**Correct Approach**:
```typescript
const handleFileRemove = useCallback((file: File) => {
  // ... implementation
}, [files]);

const handleSubmitInput = useCallback(() => {
  // ... implementation
}, [input, files, onSubmit]);
```

---

### WARNING 4: Default Export Violation

**File**: `src/components/molecules/prompt-textarea.tsx:25`
**Issue**: Uses named export (CORRECT) but should verify consistency
**Recommendation**: Ensure all imports use named imports, never default
**Impact**: None (this is actually correct)

This is NOT a violation - the component correctly uses named exports. Good practice!

---

## 4. Compliance Summary

### Critical Constraints

| Rule | Status | Notes |
|------|--------|-------|
| React Server Components | ✅ Pass | Correctly uses 'use client' directive |
| Server Actions | N/A | Component doesn't mutate data |
| Suspense Boundaries | N/A | No async operations |
| Named Exports | ✅ Pass | Uses named export correctly |
| Screaming Architecture | ❌ Fail | Component in wrong location (generic /components vs domain) |
| Naming Conventions | ⚠️ Warning | Variable names lack semantic clarity |
| State Management | ❌ Fail | Accesses global stores from generic component |
| Route Protection | N/A | Not a protected route |
| Forms | ⚠️ Warning | Manual form state, could use React Hook Form |
| Styles | ✅ Pass | Uses Tailwind appropriately |
| Business Logic | ❌ Fail | Business logic not extracted to hooks |

### File Structure

| Rule | Status | Notes |
|------|--------|-------|
| Component Naming | ✅ Pass | Correct kebab-case |
| Hook Naming | N/A | No custom hooks defined |
| Server Action Files | N/A | Not applicable |
| Store Naming | N/A | Imports stores, doesn't define them |
| Import Strategy | ✅ Pass | Uses absolute imports with @/ |
| Directory Structure | ❌ Fail | Should be in domain, not generic components |

### Tech Stack

| Rule | Status | Notes |
|------|--------|-------|
| Package Manager | N/A | Not visible in component |
| State Management Tools | ❌ Fail | Uses Zustand stores from generic component |
| Form Handling | ⚠️ Warning | Manual state management for form |
| Validation | N/A | No validation in component |
| Styling | ✅ Pass | Tailwind CSS |

---

## 5. Atomic Design Analysis

### Is this a Molecule or Organism?

**Verdict**: ORGANISM

**Molecule Definition**:
- Composition of 2-5 atoms
- Simple, reusable building blocks
- Minimal logic (mostly presentation)
- 30-80 lines typically
- Examples: search-bar, form-field, user-avatar

**Organism Definition**:
- Composition of multiple molecules/atoms
- Contains business logic
- Feature-specific
- 80-200 lines typically
- Examples: header, data-table, navigation-menu

**This Component's Characteristics**:
- ✅ Composes 6+ child components
- ✅ Contains business logic (file management, submission)
- ✅ Feature-specific (chat/email prompt)
- ✅ 129 lines
- ✅ Manages complex state (input, files, refs)
- ✅ Integrates with global stores

**Conclusion**: This is definitively an ORGANISM.

---

### What Should Be Extracted?

#### 1. Extract Business Logic to Hook
**Target**: Lines 26-54 → `use-prompt-input.ts`

**Responsibilities**:
- Input state management
- File state management
- File removal logic
- Submit logic
- Ref management

**Benefit**: Component becomes pure presentation

---

#### 2. Extract Design Mode Toggle Button to Atom/Molecule
**Target**: Lines 90-107 → `design-mode-toggle.tsx`

**Why**: This is a self-contained feature that could be reused

```typescript
// components/molecules/design-mode-toggle.tsx
interface DesignModeToggleProps {
  isActive: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
}

export function DesignModeToggle({
  isActive,
  isDisabled,
  onToggle
}: DesignModeToggleProps) {
  const className = cn(
    'h-8 cursor-pointer rounded-[10px] p-2 text-sm transition-all disabled:cursor-not-allowed',
    isActive
      ? 'bg-black-700 hover:bg-black-700/80 text-white hover:text-white'
      : 'bg-gray-100'
  );

  return (
    <Button
      variant="ghost"
      disabled={isDisabled}
      className={className}
      onClick={onToggle}
    >
      <MousePointer2 className="size-4" />
      Design
    </Button>
  );
}
```

---

#### 3. Extract File List Display to Molecule
**Target**: Lines 67-77 → `uploaded-files-list.tsx`

```typescript
// components/molecules/uploaded-files-list.tsx
interface UploadedFilesListProps {
  files: FileList | undefined;
  onFileRemove: (file: File) => void;
}

export function UploadedFilesList({ files, onFileRemove }: UploadedFilesListProps) {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {Array.from(files).map((file, index) => (
        <Source
          key={`${file.name}-${file.size}-${index}`}
          filename={file.name}
          onRemove={() => onFileRemove(file)}
        />
      ))}
    </div>
  );
}
```

---

## 6. Refactoring Plan

### Priority 1: Critical Violations (Must Fix)

**Estimated Effort**: 3-4 hours

**Step 1: Relocate Component**
```bash
# Move from generic components to domain
mkdir -p src/domains/chat/components/organisms
mv src/components/molecules/prompt-textarea.tsx \
   src/domains/chat/components/organisms/prompt-textarea.tsx
```

**Step 2: Create Custom Hook**
```bash
# Create hook file
touch src/domains/chat/hooks/use-prompt-input.ts
```

Extract all business logic:
- Input state (`input`, `setInput`)
- File state (`files`, `setFiles`)
- File ref (`fileInputRef`)
- `handleFileRemove` logic
- `handleSubmitInput` logic

**Step 3: Refactor Store Access**
Convert direct store access to props:
```typescript
// Before: const { isEditMode, setEditMode } = useVisualEditStore();
// After: Pass as props from parent
```

**Step 4: Update Imports**
Update all components importing `prompt-textarea`:
```typescript
// Before:
import { PromptTextarea } from '@/components/molecules/prompt-textarea';

// After:
import { PromptTextarea } from '@/domains/chat/components/organisms/prompt-textarea';
```

**Step 5: Verify Compliance**
- ✅ Component in correct domain location
- ✅ Business logic extracted to hook
- ✅ Store access removed (replaced with props)
- ✅ Named exports maintained

---

### Priority 2: Warnings and Improvements (Should Fix)

**Estimated Effort**: 2-3 hours

**Step 1: Extract Reusable Sub-Components**
1. Create `uploaded-files-list.tsx` molecule
2. Create `design-mode-toggle.tsx` molecule
3. Refactor main component to use extracted pieces

**Step 2: Add Memoization**
1. Wrap callbacks in `useCallback`
2. Wrap computed values in `useMemo`
3. Add React DevTools profiling to verify improvements

**Step 3: Improve Naming**
1. Rename `input` → `promptText` or `messageInput`
2. Rename `files` → `selectedFiles` or `uploadedFiles`
3. Add JSDoc comments for complex logic

**Step 4: Consider React Hook Form**
Evaluate if the form complexity warrants React Hook Form:
- Current: 2 form fields (text + files)
- Threshold: 3+ fields with validation
- Decision: Keep current approach for now, but monitor

---

## 7. Files Reviewed

- ❌ `src/components/molecules/prompt-textarea.tsx` - 7 critical violations, 4 warnings

**Related Files Analyzed**:
- ✅ `src/components/atoms/source.tsx` - No issues
- ✅ `src/components/molecules/selected-element-indicator.tsx` - No issues
- ⚠️ `src/components/molecules/input-upload-file.tsx` - Similar issues (separate review needed)
- ⚠️ `src/stores/visual-edit.store.ts` - Accessed from generic component (architectural smell)
- ⚠️ `src/stores/email.store.ts` - Accessed from generic component (architectural smell)

---

## 8. Recommendations

### Immediate Actions (Before Next Deploy)

1. **RELOCATE**: Move component to `src/domains/chat/components/organisms/prompt-textarea.tsx`
2. **EXTRACT**: Create `use-prompt-input.ts` hook with all business logic
3. **DECOUPLE**: Replace store access with props
4. **UPDATE**: Fix all import statements in consuming components

### Future Improvements

1. **SPLIT**: Extract `design-mode-toggle` and `uploaded-files-list` to separate components
2. **OPTIMIZE**: Add memoization for performance
3. **CLARIFY**: Improve variable naming for better semantics
4. **DOCUMENT**: Add JSDoc comments explaining the component's purpose and usage

### Architectural Guidance

**For Similar Components**:
1. Start by determining if it's atom, molecule, or organism based on complexity
2. If it accesses stores or has business logic → belongs in a domain
3. If it's >80 lines → probably an organism
4. If it composes 5+ components → definitely an organism
5. Extract business logic to hooks BEFORE component gets too large

---

## 9. Positive Highlights

**Good Practices Found**:
- ✅ Correctly uses named exports
- ✅ Uses 'use client' directive appropriately
- ✅ Absolute imports with @/ alias
- ✅ TypeScript interfaces for props
- ✅ Proper use of Tailwind CSS
- ✅ Good component composition (uses existing UI components)
- ✅ Semantic HTML structure
- ✅ Accessible button elements

---

## 10. Next Steps

**Action Required**: IMMEDIATE REFACTORING

**Severity**: This component violates core architectural principles and must be refactored before it becomes harder to maintain.

**Priority Order**:
1. **CRITICAL** (Do immediately):
   - Relocate to domain
   - Extract business logic to hook
   - Remove direct store access

2. **HIGH** (Do before next feature):
   - Split into smaller components
   - Add memoization

3. **MEDIUM** (Technical debt backlog):
   - Improve naming
   - Add documentation

**Impact Assessment**:
- **Breaking Changes**: Yes - import paths will change
- **Migration Effort**: Medium (3-4 hours)
- **Risk Level**: Low (if done with proper testing)
- **Benefit**: High (improved architecture, maintainability, testability)

---

## 11. Testing Recommendations

After refactoring, ensure:

1. **Unit Tests** for custom hook:
   - File removal logic
   - Submit logic
   - State management

2. **Component Tests**:
   - Rendering with different props
   - File upload interaction
   - Design mode toggle
   - Submit button states

3. **Integration Tests**:
   - Parent-child communication
   - Store synchronization (if kept)
   - File upload end-to-end

---

**Review Complete** ✅

This component requires significant refactoring to meet project standards. The violations are clear and the refactoring path is well-defined. Please prioritize the Critical Violations (Priority 1) before continuing development on related features.
