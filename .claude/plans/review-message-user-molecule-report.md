# MessageUser Component - Code Review Report

**Reviewed**: 2025-12-06
**Reviewer**: code-reviewer
**File**: `/src/components/molecules/message-user.tsx`
**Status**: ❌ CRITICAL VIOLATIONS

## 1. Executive Summary

**Files Reviewed**: 1
**Violations Found**: 7
**Critical Issues**: 3
**Warnings**: 4

**Overall Assessment**: This component has significant architectural violations. It is incorrectly classified as a molecule when it should be an organism based on its complexity (214 lines vs typical 30-80 for molecules). Multiple responsibilities are mixed, business logic exists in the component, and there are several critical constraints violations including lack of text externalization and improper state management.

## 2. Critical Violations (Must Fix)

### ❌ Violation 1: Incorrect Atomic Design Classification

**File**: `src/components/molecules/message-user.tsx:1-214`
**Rule**: Atomic Design hierarchy and component size guidelines
**Severity**: Critical

**Issue**: This component is 214 lines long, making it the largest molecule in the codebase. Based on analysis:
- Average molecule size in this project: 50-75 lines
- Other molecules: 11-129 lines (message-user at 214 is a clear outlier)
- Similar complexity component (message-assistant): 182 lines, also oversized
- Typical organisms: 45-112 lines

**Current Code**:
```tsx
// src/components/molecules/message-user.tsx - 214 lines
export const MessageUser = ({
  message,
  onEdit,
  onReload,
  onDelete
}: MessageUserProps) => {
  // Multiple responsibilities:
  // - Message display
  // - Image attachment grid rendering
  // - PDF file attachment rendering
  // - Inline edit mode with textarea
  // - Action buttons (copy, delete, edit)
  // - Complex state management
```

**Why This Violates Atomic Design**:

**Molecule Definition**: Composition of 2-3 atoms with single, focused purpose
- ✅ Examples: `search-bar.tsx` (33 lines), `device-toggle.tsx` (44 lines)
- ❌ This component: 214 lines with 5+ distinct responsibilities

**Organism Definition**: Complex composition of molecules with business context
- ✅ Examples: `chat.tsx` (112 lines), `conversation.tsx` (99 lines)
- ✅ This should be: organism-level component

**Required Fix**: Reclassify as organism or break down into smaller molecules

**Correct Approach**:

**Option A: Reclassify as Organism**
```bash
# Move to organisms directory
mv src/components/molecules/message-user.tsx \
   src/components/organisms/message-user.tsx
```

**Option B: Break Down into Molecules (Recommended)**
```tsx
// Create smaller, focused molecules:

// 1. src/components/molecules/message-attachments.tsx (30 lines)
export const MessageAttachments = ({ images, files }) => {
  return (
    <>
      <MessageImageGrid images={images} />
      <MessageFileList files={files} />
    </>
  );
};

// 2. src/components/molecules/message-edit-form.tsx (50 lines)
export const MessageEditForm = ({
  initialText,
  onSave,
  onCancel,
  width
}) => {
  // Edit mode logic
};

// 3. src/components/molecules/message-actions-toolbar.tsx (40 lines)
export const MessageActionsToolbar = ({
  onCopy,
  onDelete,
  onEdit,
  content
}) => {
  // Action buttons
};

// 4. src/components/organisms/message-user.tsx (60 lines)
export const MessageUser = ({ message, onEdit, onReload, onDelete }) => {
  return (
    <Message>
      <MessageAttachments
        images={imageAttachments}
        files={filesAttachments}
      />

      {isEditing ? (
        <MessageEditForm
          initialText={textContent}
          onSave={handleSave}
          onCancel={handleEditCancel}
        />
      ) : (
        <MessageContent>{textContent}</MessageContent>
      )}

      <MessageActionsToolbar
        onCopy={handleCopy}
        onDelete={handleDelete}
        onEdit={() => setIsEditing(true)}
        content={textContent}
      />
    </Message>
  );
};
```

**Reference**: `.claude/knowledge/architecture-patterns.md#Atomic-Design`

---

### ❌ Violation 2: Missing Text Externalization

**File**: `src/components/molecules/message-user.tsx:159-164`
**Rule**: Critical Constraint #11 - All text must be externalized to text maps
**Severity**: Critical

**Current Code**:
```tsx
<Button size="sm" variant="ghost" onClick={handleEditCancel}>
  Cancel
</Button>
<Button size="sm" onClick={handleSave}>
  Save
</Button>
```

**Issue**: Hardcoded UI text strings ("Cancel", "Save") directly in component JSX. This violates the project's critical constraint requiring all text to be externalized.

**Required Fix**: Create text map file and externalize all strings

**Correct Approach**:
```tsx
// src/components/molecules/message-user.text-map.ts
export const MESSAGE_USER_TEXT = {
  EDIT_CANCEL_BUTTON: 'Cancel',
  EDIT_SAVE_BUTTON: 'Save',
  COPY_ARIA_LABEL: 'Copy message',
  DELETE_ARIA_LABEL: 'Delete message',
  EDIT_ARIA_LABEL: 'Edit message',
  EDIT_TEXTAREA_PLACEHOLDER: 'Edit your message...'
} as const;

// src/components/molecules/message-user.tsx
import { MESSAGE_USER_TEXT } from './message-user.text-map';

<Button size="sm" variant="ghost" onClick={handleEditCancel}>
  {MESSAGE_USER_TEXT.EDIT_CANCEL_BUTTON}
</Button>
<Button size="sm" onClick={handleSave}>
  {MESSAGE_USER_TEXT.EDIT_SAVE_BUTTON}
</Button>
```

**Additional Hardcoded Text Found**:
- Line 112: `alt="image"` (inline alt text)
- Line 130: `"file.pdf"` (fallback filename)
- Buttons lack ARIA labels for accessibility

**Reference**: `.claude/knowledge/critical-constraints.md#externalize-text`

---

### ❌ Violation 3: Business Logic in Component

**File**: `src/components/molecules/message-user.tsx:36-48, 64-75`
**Rule**: Critical Constraint #11 - Business logic must be in custom hooks
**Severity**: Critical

**Current Code**:
```tsx
// Lines 36-48: Complex file filtering logic in component
const imageAttachments = message.parts?.filter(
  part =>
    part.type === 'file' &&
    (part as FileUIPart).mediaType?.startsWith('image/')
) as FileUIPart[];

const filesAttachments = message.parts?.filter(
  part =>
    part.type === 'file' &&
    (part as FileUIPart).mediaType?.startsWith('application/pdf')
) as FileUIPart[];

// Lines 64-75: Complex message handling logic in component
const handleSave = () => {
  const currentImages = message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('image/')
  ) as FileUIPart[];

  if (onEdit) {
    onEdit(message.id, editInput, currentImages);
  }
  onReload();
  setIsEditing(false);
};
```

**Issue**: Complex business logic for filtering attachments and handling edits is directly embedded in the component. This logic is:
1. Duplicated (image filtering appears twice: lines 37-41 and 64-68)
2. Not testable in isolation
3. Not reusable across components
4. Makes component harder to understand

**Note**: The utility function `getMessageText` from `@/lib/message-utils` is correctly used (line 29), but similar utilities should exist for attachment filtering.

**Required Fix**: Extract to custom hooks and utility functions

**Correct Approach**:
```tsx
// src/lib/message-utils.ts (add to existing file)
/**
 * Extracts image file parts from a UIMessage
 */
export function getMessageImageParts(message: UIMessage): FileUIPart[] {
  return message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('image/')
  ) as FileUIPart[] || [];
}

/**
 * Extracts PDF file parts from a UIMessage
 */
export function getMessagePdfParts(message: UIMessage): FileUIPart[] {
  return message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('application/pdf')
  ) as FileUIPart[] || [];
}

// src/components/molecules/message-user.tsx
import {
  getMessageText,
  getMessageImageParts,
  getMessagePdfParts
} from '@/lib/message-utils';

export const MessageUser = ({ message, onEdit, onReload, onDelete }) => {
  const textContent = getMessageText(message);
  const imageAttachments = getMessageImageParts(message);
  const filesAttachments = getMessagePdfParts(message);

  const handleSave = () => {
    const currentImages = getMessageImageParts(message);

    if (onEdit) {
      onEdit(message.id, editInput, currentImages);
    }
    onReload();
    setIsEditing(false);
  };
  // ...
};
```

**Additional Logic to Extract**:
- Copy to clipboard with timeout (lines 49-56) → `useCopyToClipboard` hook
- Edit mode state management → `useMessageEdit` hook

**Reference**: `.claude/knowledge/critical-constraints.md#business-logic-in-custom-hooks`

---

## 3. Warnings (Should Fix)

### ⚠️ Warning 1: Lack of ARIA Labels for Accessibility

**File**: `src/components/molecules/message-user.tsx:181-209`
**Issue**: Action buttons (Copy, Delete, Edit) lack proper ARIA labels and accessible names
**Recommendation**: Add aria-label attributes to all icon-only buttons
**Impact**: Screen reader users cannot understand button purposes

**Current Code**:
```tsx
<Button
  variant="ghost"
  size="icon"
  className="group/item"
  onClick={() => handleCopy(textContent)}
>
  {copyMessage === textContent ? (
    <Check className="text-green-500" />
  ) : (
    <Copy className="..." />
  )}
</Button>
```

**Correct Approach**:
```tsx
<Button
  variant="ghost"
  size="icon"
  className="group/item"
  onClick={() => handleCopy(textContent)}
  aria-label={MESSAGE_USER_TEXT.COPY_ARIA_LABEL}
>
  {copyMessage === textContent ? (
    <Check className="text-green-500" aria-hidden="true" />
  ) : (
    <Copy className="..." aria-hidden="true" />
  )}
</Button>
```

---

### ⚠️ Warning 2: Missing Keyboard Event Handling Documentation

**File**: `src/components/molecules/message-user.tsx:147-155`
**Issue**: Keyboard shortcuts (Enter to save, Escape to cancel) are not documented
**Recommendation**: Add JSDoc comment explaining keyboard shortcuts for maintainability

**Current Code**:
```tsx
onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSave();
  }
  if (e.key === 'Escape') {
    handleEditCancel();
  }
}}
```

**Better Approach**:
```tsx
/**
 * Keyboard shortcuts:
 * - Enter: Save changes
 * - Shift+Enter: New line
 * - Escape: Cancel edit
 */
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSave();
  }
  if (e.key === 'Escape') {
    handleEditCancel();
  }
};

<textarea
  onKeyDown={handleKeyDown}
  // ...
/>
```

---

### ⚠️ Warning 3: Inconsistent Naming Convention

**File**: `src/components/molecules/message-user.tsx:34`
**Issue**: Variable `contentRef` lacks semantic prefix, should be `messageContentRef`
**Recommendation**: Use more descriptive names for refs
**Impact**: Minor - reduces code clarity

**Current**: `const contentRef = useRef<HTMLDivElement>(null);`
**Better**: `const messageContentRef = useRef<HTMLDivElement>(null);`

---

### ⚠️ Warning 4: Potential Memory Leak with setTimeout

**File**: `src/components/molecules/message-user.tsx:49-56`
**Issue**: `setTimeout` is not cleaned up if component unmounts before timeout completes
**Recommendation**: Store timeout ID and clear in cleanup function
**Impact**: Low - but good practice for production code

**Current Code**:
```tsx
const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);

  setTimeout(() => {
    setCopyMessage(null);
  }, 2000);
};
```

**Correct Approach**:
```tsx
const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);

  const timeoutId = setTimeout(() => {
    setCopyMessage(null);
  }, 2000);

  // Store for cleanup if needed
  return () => clearTimeout(timeoutId);
};

// Or better: extract to custom hook
const { copy, isCopied } = useCopyToClipboard(2000);
```

---

## 4. Compliance Summary

### ✅ Critical Constraints

| Rule | Status | Notes |
|------|--------|-------|
| React Server Components | ✅ Pass | Correctly uses "use client" directive |
| Server Actions | N/A | No mutations in this component |
| Suspense Boundaries | N/A | No async operations |
| Named Exports | ✅ Pass | Uses named export |
| Screaming Architecture | ✅ Pass | In /components (UI layer) |
| Naming Conventions | ⚠️ Warning | Minor issue with contentRef |
| State Management | ✅ Pass | Correctly uses useState for local state |
| Route Protection | N/A | Not a route component |
| Forms | ✅ Pass | Simple textarea for edit, appropriate |
| Styles | ✅ Pass | Uses Tailwind with mobile-first |
| Business Logic | ❌ Fail | Logic not extracted to hooks/utils |

### ✅ File Structure

| Rule | Status | Notes |
|------|--------|-------|
| Component Naming | ✅ Pass | Uses kebab-case (message-user.tsx) |
| Hook Naming | N/A | No custom hooks defined |
| Server Action Files | N/A | No server actions |
| Store Naming | N/A | No stores |
| Import Strategy | ✅ Pass | Uses absolute imports with @/ |
| Directory Structure | ❌ Fail | Should be organism, not molecule |

### ✅ Tech Stack

| Rule | Status | Notes |
|------|--------|-------|
| Package Manager | ✅ Pass | Uses npm/pnpm |
| State Management Tools | ✅ Pass | useState for local state |
| Form Handling | ✅ Pass | Simple textarea appropriate |
| Validation | N/A | No validation needed |
| Styling | ✅ Pass | Tailwind CSS used correctly |

## 5. Refactoring Plan

### Priority 1: Critical Violations (Must Fix)

**Estimated Effort**: 3-4 hours

**Steps**:

1. **Extract business logic to utilities** (1 hour)
   - Add `getMessageImageParts` to `src/lib/message-utils.ts`
   - Add `getMessagePdfParts` to `src/lib/message-utils.ts`
   - Create `src/lib/hooks/use-copy-to-clipboard.ts` for copy functionality
   - Update component to use new utilities

2. **Create text map file** (30 minutes)
   - Create `src/components/molecules/message-user.text-map.ts`
   - Externalize all hardcoded strings
   - Add ARIA labels for accessibility
   - Update component to use text map

3. **Decide on Atomic Design classification** (30 minutes)
   - Option A: Move to `/organisms/` (quick fix)
   - Option B: Break down into smaller molecules (recommended)

4. **Break down component** (if Option B chosen) (2 hours)
   - Create `message-attachments.tsx` molecule (image grid + file list)
   - Create `message-edit-form.tsx` molecule (edit mode with textarea)
   - Create `message-actions-toolbar.tsx` molecule (copy/delete/edit buttons)
   - Refactor main component to compose new molecules
   - Move to `/organisms/message-user.tsx`

### Priority 2: Warnings and Improvements

**Estimated Effort**: 1-2 hours

**Steps**:

1. **Add accessibility improvements** (30 minutes)
   - Add ARIA labels to all buttons
   - Add aria-hidden to decorative icons
   - Test with screen reader

2. **Add documentation** (30 minutes)
   - Document keyboard shortcuts with JSDoc
   - Add component-level documentation
   - Document props with JSDoc

3. **Fix naming conventions** (15 minutes)
   - Rename `contentRef` to `messageContentRef`

4. **Fix potential memory leak** (15 minutes)
   - Extract copy logic to `useCopyToClipboard` hook
   - Implement proper cleanup

## 6. Files Reviewed

- ❌ `src/components/molecules/message-user.tsx` - 3 critical violations, 4 warnings

## 7. Recommendations

### Immediate Actions (Before Production)

1. **Extract business logic** to `message-utils.ts` and custom hooks
2. **Create text map** and externalize all strings
3. **Add ARIA labels** for accessibility compliance

### Design Decision Required

**Question**: Should this component remain as an oversized molecule or be refactored?

**Option A: Quick Fix (30 min)**
- Move to `/organisms/message-user.tsx`
- Keeps current structure
- Fixes classification violation
- Component remains large and hard to maintain

**Option B: Proper Refactor (2-3 hours)**
- Break into 3-4 focused molecules
- Create organism that composes them
- Better maintainability
- Easier testing
- Follows Atomic Design principles properly
- Matches project standards

**Recommendation**: Option B for long-term maintainability

### Future Improvements

1. **Extract similar logic** from `message-assistant.tsx` (182 lines, also oversized)
2. **Create shared molecule** for message actions (used in both user and assistant messages)
3. **Consider creating domain** for chat/messaging if it grows (currently in /components)

## 8. Positive Highlights

**Good Practices Found**:
- ✅ Correctly uses "use client" directive for interactive component
- ✅ Uses absolute imports with @/ alias
- ✅ Named export (no default export)
- ✅ Properly uses shadcn/ui Button component
- ✅ Good use of existing utility (`getMessageText` from message-utils)
- ✅ Responsive design with mobile-first Tailwind classes
- ✅ Proper TypeScript typing with imported types from 'ai' package
- ✅ Good UX with edit mode, keyboard shortcuts, and visual feedback

## 9. Next Steps

**If CRITICAL VIOLATIONS**:
1. ⚠️ **STOP** - Do not proceed with this component as-is
2. Address Priority 1 violations immediately:
   - Extract business logic to utils/hooks
   - Create text map
   - Decide on refactoring approach (Option A vs B)
3. Re-review after fixes
4. Address Priority 2 warnings before production

**Recommended Timeline**:
- **Immediate** (today): Extract utils, create text map (1.5 hours)
- **This week**: Decide on refactoring approach with team
- **Next sprint**: Implement chosen refactoring option (2-3 hours)
- **Before production**: Add accessibility improvements (30 min)

## 10. Related Components Needing Review

Based on this analysis, these components should also be reviewed:

1. **`message-assistant.tsx`** (182 lines)
   - Also oversized for a molecule
   - Likely has similar violations
   - Should be reviewed with same criteria

2. **`prompt-textarea.tsx`** (129 lines)
   - Borderline size for molecule
   - May need similar refactoring

## 11. Architectural Question for Team

**Discussion Point**: Should chat/messaging components move to a domain?

**Current**: `/components/molecules/message-*`
**Potential**: `/domains/chat/components/organisms/message-*`

**Rationale**:
- Message handling contains business logic (edit, delete, copy)
- Could have domain-specific state (message store)
- Could have domain-specific actions (edit message, delete message)
- May grow to include threads, reactions, etc.

**Recommendation**: Discuss with team if chat becomes more complex

---

**Report Generated**: 2025-12-06
**Next Review**: After Priority 1 violations are fixed
