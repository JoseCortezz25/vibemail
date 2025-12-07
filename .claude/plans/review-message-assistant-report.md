# Message Assistant Component - Code Review Report

**Reviewed**: 2025-12-06
**File**: `src/components/molecules/message-assistant.tsx`
**Reviewer**: code-reviewer
**Status**: ⚠️ ISSUES FOUND

## 1. Executive Summary

**Files Reviewed**: 2 (message-assistant.tsx + message-user.tsx for comparison)
**Violations Found**: 6
**Critical Issues**: 2
**Warnings**: 4

**Overall Assessment**: The `MessageAssistant` component is currently classified as a MOLECULE but exhibits characteristics of an ORGANISM. At 182 lines, it exceeds typical molecule complexity (30-80 lines per the refactor plan) and contains multiple distinct sections that could be broken down into smaller, more maintainable components. Additionally, it shares 35+ lines of duplicated code with `MessageUser` component, violating the DRY principle. While it doesn't violate critical constraints, it does violate Atomic Design principles and code reusability best practices.

## 2. Critical Violations (Must Fix)

### ❌ Violation 1: Code Duplication with MessageUser

**Files**:
- `src/components/molecules/message-assistant.tsx:42-56, 156-178`
- `src/components/molecules/message-user.tsx:30-56, 173-210`

**Rule**: DRY (Don't Repeat Yourself) - Critical Constraint #11
**Severity**: Critical

**Duplicated Code**:
```typescript
// IDENTICAL in both files (15 lines duplicated)
const [copyMessage, setCopyMessage] = useState<string | null>(null);

const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);

  setTimeout(() => {
    setCopyMessage(null);
  }, 2000);
};
```

**Issue**:
1. **Copy functionality duplicated**: Exact same 15 lines of code in both message-assistant.tsx and message-user.tsx
2. **Action button pattern duplicated**: Similar MessageActions structure in both components (35+ total duplicated lines)
3. **Violates DRY principle**: Any bug fix or enhancement must be made in two places
4. **Maintenance burden**: Inconsistencies can arise if one is updated without the other

**Required Fix**: Extract to reusable hook and molecule

**Correct Approach**:

Create shared hook:
```typescript
// hooks/use-copy-to-clipboard.ts
export function useCopyToClipboard(timeout = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), timeout);
  }, [timeout]);

  return {
    copiedText,
    handleCopy,
    isCopied: (text: string) => copiedText === text
  };
}
```

Usage in both components:
```typescript
// message-assistant.tsx & message-user.tsx
const { handleCopy, isCopied } = useCopyToClipboard();

// In render
{isCopied(textContent) ? <Check /> : <Copy />}
```

**Impact**: Eliminates 30 lines of duplication (15 lines × 2 files)

**Reference**: `.claude/knowledge/critical-constraints.md` - Section on DRY principle

---

### ❌ Violation 2: Incorrect Atomic Design Classification

**File**: `src/components/molecules/message-assistant.tsx:1-182`
**Rule**: Atomic Design hierarchy and component complexity
**Severity**: High

**Current Code**:
```typescript
// File is 182 lines long and located in /molecules/
export const MessageAssistant = ({
  message,
  parts,
  onShowCanvas,
  onReload
}: MessageAssistantProps) => {
  // Lines 42-51: Copy state management
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const handleCopy = (content: string) => { ... }

  // Lines 54-68: Complex data extraction logic
  const toolInvocationParts = parts?.filter(part =>
    part.type.startsWith('tool-')
  );
  const sourceParts = parts?.filter(...) as ...;
  const reasoningParts = parts?.find(...) as ...;
  const fileParts: FileUIPart | undefined = parts?.find(...) as ...;

  // Lines 70-181: Multiple distinct rendering sections
  return (
    <Message key={message.id} className="group justify-start">
      {/* Reasoning section */}
      {/* Text content section */}
      {/* File parts section */}
      {/* Tool invocation section with switch statement */}
      {/* Source parts section */}
      {/* Message actions section */}
    </Message>
  );
};
```

**Issue**: This component violates Atomic Design principles in multiple ways:

1. **Size**: 182 lines exceeds the typical molecule range (30-80 lines based on the `element-properties-panel` refactor plan)
2. **Complexity**: Contains 6 distinct rendering sections, each handling different UI concerns
3. **Mixed Responsibilities**: Combines data transformation, state management, conditional rendering, and UI composition
4. **Too many sub-components**: Molecules should compose atoms, not orchestrate multiple complex sections

**Required Fix**: Reclassify as ORGANISM and extract sections into molecules/atoms

**Correct Approach**:

```
Organism: MessageAssistant (~60-80 lines)
├── Molecule: MessageReasoningSection
├── Molecule: MessageTextContent
├── Molecule: MessageFileParts
├── Molecule: MessageToolInvocations
│   └── Molecule: ToolShowPromptInCanvas
├── Molecule: MessageSourceParts
└── Molecule: MessageActions (already reusable)
```

**Reference**: `.claude/plans/refactor-element-properties-panel-atomic-design.md` - Shows similar pattern where 297-line component was broken into atoms + molecules + organism

---

## 3. Warnings (Should Fix)

### ⚠️ Warning 1: Business Logic in Component

**File**: `src/components/molecules/message-assistant.tsx:54-68`
**Issue**: Data transformation and filtering logic embedded in component
**Recommendation**: Extract to custom hook
**Impact**: Harder to test, reuse, and maintain

**Current Code**:
```typescript
// Lines 54-68: Complex filtering logic
const toolInvocationParts = parts?.filter(part =>
  part.type.startsWith('tool-')
);

const sourceParts = parts?.filter(
  part => part.type === 'source-url' || part.type === 'source-document'
) as SourceUrlUIPart[] | SourceDocumentUIPart[] | undefined;

const reasoningParts = parts?.find(part => part.type === 'reasoning') as
  | ReasoningUIPart
  | undefined;

const fileParts: FileUIPart | undefined = parts?.find(
  part => part.type === 'file'
) as FileUIPart | undefined;

const textContent = getMessageText(message);
```

**Recommendation**: Extract to custom hook for better testability and reusability

```typescript
// hooks/use-message-parts.ts
export function useMessageParts(message: UIMessage, parts: UIMessage['parts']) {
  return useMemo(() => ({
    toolInvocationParts: parts?.filter(part => part.type.startsWith('tool-')),
    sourceParts: parts?.filter(
      part => part.type === 'source-url' || part.type === 'source-document'
    ) as SourceUrlUIPart[] | SourceDocumentUIPart[] | undefined,
    reasoningParts: parts?.find(part => part.type === 'reasoning') as ReasoningUIPart | undefined,
    fileParts: parts?.find(part => part.type === 'file') as FileUIPart | undefined,
    textContent: getMessageText(message)
  }), [message, parts]);
}

// In component
const { toolInvocationParts, sourceParts, reasoningParts, fileParts, textContent } =
  useMessageParts(message, parts);
```

---

### ⚠️ Warning 2: Inline State Management for Copy Functionality

**File**: `src/components/molecules/message-assistant.tsx:42-51`
**Issue**: Local state and timer logic in component instead of custom hook
**Recommendation**: Extract to reusable hook
**Impact**: Copy functionality cannot be reused in other components

**Current Code**:
```typescript
const [copyMessage, setCopyMessage] = useState<string | null>(null);

const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);

  setTimeout(() => {
    setCopyMessage(null);
  }, 2000);
};
```

**Recommendation**: Extract to custom hook

```typescript
// hooks/use-copy-to-clipboard.ts
export function useCopyToClipboard(timeout = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);

    setTimeout(() => {
      setCopiedText(null);
    }, timeout);
  }, [timeout]);

  const isCopied = useCallback((text: string) =>
    copiedText === text,
    [copiedText]
  );

  return { handleCopy, isCopied, copiedText };
}

// In component
const { handleCopy, isCopied } = useCopyToClipboard();

// Usage
{isCopied(textContent) ? (
  <Check className="text-green-500" />
) : (
  <Copy className="transition-transform duration-500 group-hover/item:rotate-[-10deg]" />
)}
```

---

### ⚠️ Warning 3: Complex Switch Statement in Render

**File**: `src/components/molecules/message-assistant.tsx:94-133`
**Issue**: Switch statement with state-based rendering logic embedded in component
**Recommendation**: Extract tool rendering to separate component/molecule
**Impact**: Hard to test individual tool states, hard to add new tool types

**Current Code**:
```typescript
{toolInvocationParts && toolInvocationParts.length > 0 && (
  <div className="flex flex-col gap-2">
    {toolInvocationParts.map(toolInvocation => {
      switch (toolInvocation.type) {
        case 'tool-showPromptInCanvas': {
          const callId = toolInvocation.toolCallId;

          // States: input-streaming, input-available, output-available, output-error
          switch (toolInvocation.state) {
            case 'input-streaming':
              return (
                <TextShimmerWave
                  className="font-mono text-sm"
                  duration={1}
                >
                  Writing prompt...
                </TextShimmerWave>
              );
            case 'output-available':
              return (
                <button
                  key={callId}
                  className="bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md p-2 text-gray-500"
                  onClick={() => onShowCanvas(true)}
                >
                  {/* ... */}
                </button>
              );
          }
          break;
        }
      }
    })}
  </div>
)}
```

**Recommendation**: Extract to separate molecule for each tool type

```typescript
// molecules/tool-show-prompt-in-canvas.tsx
interface ToolShowPromptInCanvasProps {
  toolInvocation: ToolShowPromptInCanvasType;
  onShowCanvas: (isShowing: boolean) => void;
}

export function ToolShowPromptInCanvas({
  toolInvocation,
  onShowCanvas
}: ToolShowPromptInCanvasProps) {
  switch (toolInvocation.state) {
    case 'input-streaming':
      return (
        <TextShimmerWave className="font-mono text-sm" duration={1}>
          Writing prompt...
        </TextShimmerWave>
      );
    case 'output-available':
      return (
        <button
          key={toolInvocation.toolCallId}
          className="bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md p-2 text-gray-500"
          onClick={() => onShowCanvas(true)}
        >
          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-md border-[1.5px] border-gray-200">
            <BookMarkedIcon className="size-5" />
          </div>
          <span className="text-sm">Showing prompt in canvas...</span>
        </button>
      );
    default:
      return null;
  }
}

// In MessageAssistant
{toolInvocationParts?.map(toolInvocation => {
  if (toolInvocation.type === 'tool-showPromptInCanvas') {
    return (
      <ToolShowPromptInCanvas
        key={toolInvocation.toolCallId}
        toolInvocation={toolInvocation}
        onShowCanvas={onShowCanvas}
      />
    );
  }
  return null;
})}
```

---

### ⚠️ Warning 4: CONFIRMED Code Duplication with MessageUser

**Files**:
- `src/components/molecules/message-assistant.tsx:156-178` (182 lines total)
- `src/components/molecules/message-user.tsx:173-210` (214 lines total)

**Issue**: Both components duplicate the exact same copy functionality and action button pattern
**Recommendation**: Extract shared logic to reusable hooks and molecules
**Impact**: 35+ lines of duplicated code between two components

**Duplicated Code in message-assistant.tsx**:
```typescript
// Lines 42-56: Copy functionality
const [copyMessage, setCopyMessage] = useState<string | null>(null);
const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);
  setTimeout(() => {
    setCopyMessage(null);
  }, 2000);
};

// Lines 156-178: Action buttons
<MessageActions className="w-full justify-start self-end...">
  <Button variant="ghost" size="icon" className="group/item"
    onClick={() => handleCopy(textContent)}>
    {copyMessage === textContent ? (
      <Check className="text-green-500" />
    ) : (
      <Copy className="transition-transform duration-500..." />
    )}
  </Button>
  <Button variant="ghost" size="icon" className="group/item"
    onClick={() => onReload()}>
    <RefreshCcw className="transition-transform duration-700..." />
  </Button>
</MessageActions>
```

**Duplicated Code in message-user.tsx**:
```typescript
// Lines 30-56: IDENTICAL copy functionality
const [copyMessage, setCopyMessage] = useState<string | null>(null);
const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
  setCopyMessage(content);
  setTimeout(() => {
    setCopyMessage(null);
  }, 2000);
};

// Lines 173-210: SIMILAR action buttons (different actions but same pattern)
<MessageActions className={cn("flex w-full gap-2 self-end...")}>
  <Button variant="ghost" size="icon" className="group/item"
    onClick={() => handleCopy(textContent)}>
    {copyMessage === textContent ? (
      <Check className="text-green-500" />
    ) : (
      <Copy className="transition-transform duration-500..." />
    )}
  </Button>
  <Button variant="ghost" size="icon" onClick={handleDelete}>
    <Trash className="size-4..." />
  </Button>
  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
    <Pencil className="size-4" />
  </Button>
</MessageActions>
```

**Severity**: Medium - Direct code duplication violates DRY principle

**Recommendation**:
1. ✅ CONFIRMED: Both components have identical copy functionality (lines 42-56 in both)
2. Extract shared copy logic to `use-copy-to-clipboard.ts` hook (reduces duplication by 15 lines × 2 = 30 lines)
3. Extract action button pattern to `message-action-buttons.tsx` molecule
4. Each message type configures which actions to show

```typescript
// molecules/message-action-buttons.tsx
interface MessageAction {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
  activeIcon?: React.ReactNode;
}

interface MessageActionButtonsProps {
  actions: MessageAction[];
  className?: string;
}

export function MessageActionButtons({
  actions,
  className
}: MessageActionButtonsProps) {
  return (
    <MessageActions className={cn("w-full justify-start self-end", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="group/item"
          onClick={action.onClick}
        >
          {action.isActive && action.activeIcon ? action.activeIcon : action.icon}
        </Button>
      ))}
    </MessageActions>
  );
}

// Usage in MessageAssistant
const actions = [
  {
    icon: <Copy className="transition-transform duration-500 group-hover/item:rotate-[-10deg]" />,
    activeIcon: <Check className="text-green-500" />,
    isActive: copyMessage === textContent,
    onClick: () => handleCopy(textContent)
  },
  {
    icon: <RefreshCcw className="transition-transform duration-700 group-hover/item:rotate-180" />,
    onClick: onReload
  }
];

<MessageActionButtons actions={actions} />
```

---

## 4. Compliance Summary

### ✅ Critical Constraints

| Rule | Status | Notes |
|------|--------|-------|
| React Server Components | ✅ Pass | Correctly marked as Client Component (`'use client'`) |
| Server Actions | ✅ Pass | N/A - No mutations in this component |
| Suspense Boundaries | ✅ Pass | N/A - No async operations |
| Named Exports | ✅ Pass | Uses `export const MessageAssistant` |
| Screaming Architecture | ✅ Pass | Component in `/components/` (UI layer) |
| Naming Conventions | ✅ Pass | `handleCopy`, `copyMessage` use correct prefixes |
| State Management | ✅ Pass | Correctly uses useState for local UI state |
| Route Protection | ✅ Pass | N/A - UI component only |
| Forms | ✅ Pass | N/A - No forms |
| Styles | ✅ Pass | Uses Tailwind classes properly |
| Business Logic | ⚠️ Warning | Some logic could be extracted to hooks |

### ✅ File Structure

| Rule | Status | Notes |
|------|--------|-------|
| Component Naming | ✅ Pass | `message-assistant.tsx` uses kebab-case |
| Hook Naming | ✅ Pass | N/A - No custom hooks |
| Server Action Files | ✅ Pass | N/A |
| Store Naming | ✅ Pass | N/A |
| Import Strategy | ✅ Pass | All imports use absolute paths with `@/` |
| Directory Structure | ⚠️ Fail | Should be in `/organisms/` not `/molecules/` |

### ✅ Tech Stack

| Rule | Status | Notes |
|------|--------|-------|
| Package Manager | ✅ Pass | N/A |
| State Management Tools | ✅ Pass | useState for local state (correct) |
| Form Handling | ✅ Pass | N/A |
| Validation | ✅ Pass | N/A |
| Styling | ✅ Pass | Tailwind CSS used correctly |

### ✅ Atomic Design Compliance

| Rule | Status | Notes |
|------|--------|-------|
| **Component Classification** | ❌ Fail | Should be ORGANISM, not MOLECULE |
| **Component Size** | ❌ Fail | 182 lines exceeds molecule range (30-80 lines) |
| **Single Responsibility** | ⚠️ Warning | Handles too many distinct sections |
| **Atom/Molecule Composition** | ⚠️ Warning | Should compose smaller molecules |
| **Business Logic Separation** | ⚠️ Warning | Some logic should be in hooks |

---

## 5. Refactoring Plan

### Priority 0: Extract Duplicated Code (CRITICAL)

**Steps**:
1. Create `hooks/use-copy-to-clipboard.ts` hook
2. Update `message-assistant.tsx` to use hook
3. Update `message-user.tsx` to use hook
4. Test both components
5. Verify copy functionality works identically

**Files Affected**: 2 (message-assistant.tsx, message-user.tsx)
**Lines Saved**: 30 lines (15 × 2)

**Estimated Effort**: 1 hour

---

### Priority 1: Reclassify Components

**Steps**:
1. Move `message-assistant.tsx` from `/molecules/` to `/organisms/`
2. Move `message-user.tsx` from `/molecules/` to `/organisms/`
3. Update import paths in all consuming components
4. Verify no regressions

**Estimated Effort**: 1 hour

### Priority 2: Extract Molecules and Atoms

**Atoms to Create**:
1. `message-copy-button.tsx` - Copy button with state (if needed standalone)

**Molecules to Create**:
1. `message-reasoning-section.tsx` - Reasoning parts display
2. `message-text-content.tsx` - Text content with Markdown
3. `message-file-parts.tsx` - File/image display
4. `message-tool-invocations.tsx` - Tool invocation list
   - `tool-show-prompt-in-canvas.tsx` - Specific tool renderer
5. `message-source-parts.tsx` - Source links display
6. `message-action-buttons.tsx` - Reusable action buttons

**Hooks to Create**:
1. `use-message-parts.ts` - Extract data transformation logic
2. `use-copy-to-clipboard.ts` - Extract copy functionality

**Organism Refactor**:
1. Simplify `message-assistant.tsx` to ~60-80 lines
2. Compose molecules for each section
3. Delegate logic to hooks

**Estimated Effort**: 6-8 hours (per component = 12-16 hours total for both)

**Note**: MessageUser component (214 lines) also needs the same refactoring treatment

---

## 6. Files Reviewed

- ❌ `src/components/molecules/message-assistant.tsx` - 182 lines, misclassified, code duplication
- ⚠️ `src/components/molecules/message-user.tsx` - 214 lines, also misclassified, shares duplicated code

**Both components**:
- Exceed molecule size (should be 30-80 lines)
- Should be classified as ORGANISMS
- Share 35+ lines of duplicated code
- Need refactoring following same pattern

---

## 7. Recommendations

### Immediate Actions

1. **Move file** from `/molecules/` to `/organisms/` to correctly reflect component complexity
2. **Extract `use-message-parts` hook** to isolate data transformation logic
3. **Extract `use-copy-to-clipboard` hook** for reusability

### Future Improvements

1. **Break down into molecules**: Each section (reasoning, content, files, tools, sources, actions) should be a separate molecule
2. **Create reusable atoms**: Extract any repeating UI patterns into atoms
3. **Add Storybook stories**: Document each new molecule/atom
4. **Add unit tests**: Test each molecule and hook in isolation
5. **Verify similarity with message-user.tsx**: Check if code can be shared between user/assistant message components

### Architectural Notes

**Good Practices Found**:
- ✅ Correct use of `'use client'` directive
- ✅ Named exports
- ✅ TypeScript interfaces defined
- ✅ Absolute imports
- ✅ Proper prop typing
- ✅ Correct state management (useState for local UI state)

**Anti-Patterns Found**:
- ❌ Component too large for a molecule (182 lines)
- ❌ Mixed concerns (data transformation + UI rendering)
- ❌ Business logic in component instead of hooks
- ⚠️ Complex nested conditional rendering
- ⚠️ Potential code duplication with message-user.tsx

---

## 8. Next Steps

**If RECLASSIFY ONLY** (Quick Fix):
1. Move file from `/molecules/` to `/organisms/`
2. Update imports
3. Document component as organism in code comments
4. Address in future refactor sprint

**If FULL REFACTOR** (Recommended):
1. Parent agent reviews this report
2. Create refactor plan similar to `element-properties-panel`
3. Implement atoms, molecules, and hooks incrementally
4. Refactor organism to compose molecules
5. Add tests and Storybook stories
6. Review and merge

**Estimated Total Refactor Time**: 8-10 hours (including testing)

---

## 9. Comparison with Element Properties Panel

### Similarities

| Aspect | Element Properties Panel | Message Assistant |
|--------|-------------------------|-------------------|
| **Original Size** | 297 lines | 182 lines |
| **Classification** | Misclassified as component | Misclassified as molecule |
| **Sections** | 6 distinct sections | 6 distinct sections |
| **State Management** | Local useState | Local useState |
| **Business Logic** | Mixed in component | Mixed in component |
| **Needed Refactoring** | Yes (completed) | Yes (pending) |

### Refactoring Pattern (Based on Element Properties Panel)

Following the same pattern as the successful `element-properties-panel` refactor:

**Before**:
- 182 lines in `/molecules/message-assistant.tsx`
- Mixed concerns
- Hard to test and maintain

**After** (Recommended):
- ~60-80 lines in `/organisms/message-assistant.tsx`
- 6 molecules extracted (one per section)
- 2 custom hooks
- Clear separation of concerns
- Testable and maintainable

**Reduction**: ~67% code reduction in main organism (similar to 76% in element-properties-panel)

---

## 10. Code Quality Metrics

### Current State

- **Lines of Code**: 182
- **Cyclomatic Complexity**: High (multiple nested conditionals, switch statements)
- **Testability**: Low (mixed concerns make unit testing difficult)
- **Reusability**: Low (specific to assistant messages)
- **Maintainability**: Medium (clear structure but too large)

### After Refactoring (Projected)

- **Lines of Code (Organism)**: ~60-80 (67% reduction)
- **Cyclomatic Complexity**: Low (logic delegated to hooks and molecules)
- **Testability**: High (each piece testable in isolation)
- **Reusability**: High (molecules reusable across message types)
- **Maintainability**: High (small, focused components)

---

## 11. Related Files to Check

Files verified for code duplication:

1. ✅ `/src/components/molecules/message-user.tsx` - **CONFIRMED: 35+ lines duplicated**
   - 214 lines (also exceeds molecule size)
   - Identical copy functionality (15 lines)
   - Similar action button pattern (20+ lines)
   - Also needs organism reclassification

Files to verify for usage context:

2. `/src/components/organisms/chat.tsx` - Check how MessageAssistant is used
3. `/src/components/organisms/conversation.tsx` - Check message flow
4. `/src/components/ui/message.tsx` - Check base message component

---

## 12. Positive Highlights

**Good Practices Found**:
- ✅ Clear prop interface definition
- ✅ Proper TypeScript typing for AI SDK parts
- ✅ Good use of semantic HTML
- ✅ Accessible icon usage with Lucide icons
- ✅ Responsive design considerations (`md:opacity-0`)
- ✅ Good animation patterns (transitions on hover)
- ✅ Proper key usage in map iterations
- ✅ Clean JSX structure (readable and well-indented)

---

## 13. Final Verdict

**Status**: ⚠️ NEEDS REFACTORING

**Classification Issue**: Component is misclassified as a MOLECULE when it should be an ORGANISM

**Severity**: Medium - Code works but violates Atomic Design principles

**Action Required**:
- **Critical (Priority 0)**: Extract duplicated code to hook (1 hour) - MUST FIX
- **Minimum**: Reclassify both components as organisms (1 hour)
- **Recommended**: Full refactor both components following element-properties-panel pattern (12-16 hours total)

**Priority**:
- **Duplication fix**: HIGH - Code duplication is a critical issue
- **Reclassification**: Medium - Architecture consistency
- **Full refactor**: Medium - Not blocking, but should be in next sprint

**Risk**: Low - Current code is functional, refactor is for maintainability improvement only

---

**Review Completed**: 2025-12-06
**Next Review**: After refactoring (if implemented)
