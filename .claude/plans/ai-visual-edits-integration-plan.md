# Visual Edits - AI SDK Integration Plan

**Created**: 2025-12-04
**Session**: visual-edits-20251204
**Complexity**: High

## 1. Overview

The Visual Edits feature enables users to click on email elements in the preview iframe and either edit them through a properties panel OR use natural language AI commands to modify them. The AI needs to understand which element is selected and intelligently modify only that specific part of the HTML while preserving the rest of the email structure.

**Value Proposition**:
- Users can make precise edits to specific elements without regenerating entire email
- AI context is enriched with element-level granularity (not just full HTML)
- Combines visual editing with AI assistance for optimal UX
- Maintains data-vibe-id attributes for element tracking across generations

**Key Challenge**: Bridging the gap between visual DOM manipulation in iframe and AI-powered HTML generation while maintaining consistency and state synchronization.

---

## 2. Model & Provider Strategy

### Primary Model
**Model**: `gemini-2.5-flash` (currently used, fast for real-time edits)
**Provider**: `@ai-sdk/google`
**Rationale**: Already integrated, performs well for HTML generation, cost-effective for frequent small edits

### Parameters
```typescript
{
  model: google('gemini-2.5-flash'),
  temperature: 0.3,  // Lower than chat (0.7) for consistent HTML output
  maxTokens: 2000,   // Element edits are smaller than full emails
  responseFormat: 'structured', // Use generateObject for type-safe element updates
}
```

### Streaming Strategy
**For element edits**: NO streaming (use `generateObject`)
**For chat responses**: YES streaming (use `streamText`)

**Rationale**:
- Element modifications need atomic updates (all-or-nothing)
- Streaming partial HTML could break structure
- Chat responses benefit from progressive display

### Tool Calling Architecture
Define new AI SDK tool: `modifyEmailElement`

```typescript
defineTool({
  name: 'modifyEmailElement',
  description: 'Modify a specific element in the email by its data-vibe-id',
  inputSchema: z.object({
    elementId: z.string().describe('The data-vibe-id of the element to modify'),
    modification: z.object({
      content: z.string().optional(),
      styles: z.record(z.string()).optional(),
      attributes: z.record(z.string()).optional()
    })
  })
})
```

---

## 3. Files to Create

### /src/ai/tools/element-modification-tool.ts
**Purpose**: AI SDK tool definition for element-level modifications
**Exports**: `modifyElementTool`
**Dependencies**:
- `ai` (defineTool, tool)
- `zod`
- `/src/lib/schema` (new elementModificationSchema)

**Key Responsibilities**:
- Validate element ID exists in current HTML
- Parse HTML and locate element by data-vibe-id
- Apply modifications (content, styles, attributes)
- Return updated HTML with only target element changed
- Preserve all other data-vibe-id attributes

---

### /src/stores/visual-edit.store.ts
**Purpose**: Zustand store for visual editing state
**Type**: Client/UI state (NOT server state)

**State Shape**:
```typescript
interface VisualEditStore {
  // Selected element state
  selectedElementId: string | null;
  selectedElementType: 'text' | 'image' | 'button' | 'container' | null;
  selectedElementProperties: Record<string, unknown> | null;

  // Edit mode
  isEditMode: boolean;
  editSource: 'visual' | 'ai' | null;

  // Actions
  selectElement: (id: string, type: string, properties: Record<string, unknown>) => void;
  deselectElement: () => void;
  updateElementProperty: (key: string, value: unknown) => void;
  setEditMode: (enabled: boolean) => void;
  setEditSource: (source: 'visual' | 'ai') => void;
}
```

---

### /src/lib/schema.ts (modify)
**Purpose**: Add schemas for element modifications

**New Schemas**:
```typescript
export const elementModificationSchema = z.object({
  elementId: z.string(),
  content: z.string().optional(),
  styles: z.record(z.string()).optional(),
  attributes: z.record(z.string()).optional()
});

export const elementSelectionSchema = z.object({
  elementId: z.string(),
  elementType: z.enum(['text', 'image', 'button', 'container', 'link']),
  currentContent: z.string(),
  currentStyles: z.record(z.string()),
  currentAttributes: z.record(z.string())
});
```

---

### /src/actions/modify-element.ts
**Purpose**: Server Action for AI-powered element modifications

**Function Signature**:
```typescript
'use server';

export async function modifyElementWithAI(
  elementId: string,
  elementContext: ElementContext,
  userPrompt: string,
  fullHTML: string
): Promise<{ success: boolean; updatedHTML: string; error?: string }>
```

**Flow**:
1. Validate element exists in HTML
2. Extract element context (current content, styles, attributes)
3. Build AI prompt with element-specific context
4. Call AI SDK generateObject with element modification schema
5. Apply changes to HTML using HTML parser
6. Return updated HTML with preserved data-vibe-id attributes

**Dependencies**:
- `ai` (generateObject)
- `@ai-sdk/google`
- `/src/lib/schema` (elementModificationSchema)
- HTML parser library (e.g., `node-html-parser` or `jsdom`)

---

### /src/hooks/use-element-selection.ts
**Purpose**: Hook for managing element selection in iframe

**Responsibilities**:
- Attach click listeners to iframe elements with data-vibe-id
- Extract element properties (tag, content, styles, attributes)
- Update visual-edit.store with selected element
- Add/remove visual highlight CSS to selected element

**API**:
```typescript
export function useElementSelection(iframeRef: RefObject<HTMLIFrameElement>) {
  return {
    attachSelectionListeners: () => void;
    removeSelectionListeners: () => void;
    highlightElement: (elementId: string) => void;
    removeHighlight: () => void;
  }
}
```

---

### /src/components/organisms/element-properties-panel.tsx
**Purpose**: UI panel showing editable properties of selected element
**Replaces**: Conversation component when element is selected

**Props**:
```typescript
interface ElementPropertiesPanelProps {
  elementId: string;
  elementType: string;
  properties: Record<string, unknown>;
  onPropertyChange: (key: string, value: unknown) => void;
  onAIEdit: (prompt: string) => void;
  onDeselect: () => void;
}
```

**Sections**:
1. **Header**: Element type badge, deselect button
2. **Properties List**: Dynamic form based on element type
   - Text: content, fontSize, color, fontWeight, textAlign
   - Image: src, alt, width, height, alignment
   - Button: text, backgroundColor, textColor, borderRadius, href
3. **AI Edit Section**: Mini chat input for element-specific AI commands
4. **Preview Updates**: Real-time sync with iframe

---

### /src/components/molecules/selected-element-indicator.tsx
**Purpose**: Shows selected element info above prompt textarea

**Design**:
```
┌──────────────────────────────────────────────────┐
│ 🎯 Editing: Button • "Subscribe Now"      [✕]   │
│ Ask AI to modify this element...                │
└──────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface SelectedElementIndicatorProps {
  elementType: string;
  elementPreview: string; // First 50 chars of content
  onDeselect: () => void;
}
```

---

## 4. Files to Modify

### /src/app/api/chat/route.ts
**Changes**:
1. Add `modifyElementTool` to tools object
2. Inject selected element context into system prompt when present
3. Pass selected element metadata in request body

**New System Prompt Addition**:
```typescript
const selectedElementContext = selectedElement
  ? `\n\nCURRENT CONTEXT: The user has selected a ${selectedElement.type} element with id="${selectedElement.id}".
     Current content: "${selectedElement.content}"
     When the user asks to modify "it", "this", "the button", etc., they are referring to this selected element.
     Use the modifyEmailElement tool to make targeted changes to this specific element only.`
  : '';

system: `${SYSTEM_PROMPT}${selectedElementContext}`
```

---

### /src/ai/tools.ts
**Changes**:
1. Add import for new `modifyElementTool`
2. Export it alongside `createEmailTool`

**New Export**:
```typescript
export { createEmailTool, modifyEmailTool } from './tools/element-modification-tool';
```

---

### /src/components/organisms/chat.tsx
**Changes**:
1. Import `useVisualEditStore` to access selected element
2. Conditionally render `ElementPropertiesPanel` instead of `Conversation` when element selected
3. Pass selected element context to API when sending messages
4. Add handler for element modification responses

**Conditional Render Logic**:
```typescript
const { selectedElementId, selectedElementType, selectedElementProperties } = useVisualEditStore();

return (
  <div>
    {selectedElementId ? (
      <ElementPropertiesPanel
        elementId={selectedElementId}
        elementType={selectedElementType}
        properties={selectedElementProperties}
        onPropertyChange={handlePropertyChange}
        onAIEdit={handleAIElementEdit}
        onDeselect={deselectElement}
      />
    ) : (
      <Conversation messages={messages} ... />
    )}

    <PromptTextarea ... />
  </div>
)
```

---

### /src/components/organisms/previewer-email.tsx
**Changes**:
1. Import `useElementSelection` hook
2. Attach selection listeners to iframe after HTML loads
3. Add CSS for element highlighting
4. Sync visual edits back to email store

**New useEffect**:
```typescript
const { attachSelectionListeners, highlightElement } = useElementSelection(iframeRef);

useEffect(() => {
  if (iframeRef.current && htmlBody) {
    // ... existing iframe write logic ...

    // Attach click listeners for element selection
    attachSelectionListeners();
  }
}, [htmlBody, attachSelectionListeners]);
```

---

### /src/components/molecules/prompt-textarea.tsx
**Changes**:
1. Add `SelectedElementIndicator` above file upload area
2. Modify placeholder text based on whether element is selected
3. Pass selected element context with submission

**New UI Structure**:
```tsx
<div>
  {selectedElement && (
    <SelectedElementIndicator
      elementType={selectedElement.type}
      elementPreview={selectedElement.preview}
      onDeselect={deselectElement}
    />
  )}

  <FileUploadArea />

  <textarea
    placeholder={
      selectedElement
        ? `Ask AI to modify this ${selectedElement.type}...`
        : "Describe the email you want to create..."
    }
  />
</div>
```

---

### /src/stores/email.store.ts
**Changes**:
1. Add method to update specific element in HTML
2. Track modification history for undo/redo (optional)

**New Methods**:
```typescript
updateElementInHTML: (elementId: string, newHTML: string) => {
  set(state => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(state.htmlBody, 'text/html');
    const element = doc.querySelector(`[data-vibe-id="${elementId}"]`);

    if (element) {
      element.outerHTML = newHTML;
      return { htmlBody: doc.documentElement.outerHTML };
    }

    return state;
  });
}
```

---

### /src/ai/prompts.ts
**Changes**: Add element-specific prompt template

**New Export**:
```typescript
export const ELEMENT_MODIFICATION_PROMPT = `You are modifying a specific element in an email template.

Context:
- Element Type: {elementType}
- Element ID: {elementId}
- Current Content: {currentContent}
- Current Styles: {currentStyles}

User Request: {userPrompt}

Instructions:
- ONLY modify the requested properties of this specific element
- Preserve all data-vibe-id attributes
- Maintain HTML validity
- Keep responsive design intact
- Return ONLY the modified properties, not the full HTML

Output Format: JSON matching elementModificationSchema
`;
```

---

## 5. Implementation Steps

### Phase 1: Element Selection Infrastructure
1. Create `/src/stores/visual-edit.store.ts` with element selection state
2. Create `/src/hooks/use-element-selection.ts` for iframe interaction
3. Modify `/src/components/organisms/previewer-email.tsx` to enable element selection
4. Test: Click elements in iframe → state updates → visual highlight appears

**Validation**: Can select/deselect elements, state syncs correctly

---

### Phase 2: Properties Panel UI
1. Create `/src/components/organisms/element-properties-panel.tsx`
2. Create `/src/components/molecules/selected-element-indicator.tsx`
3. Modify `/src/components/organisms/chat.tsx` to conditionally render panel
4. Modify `/src/components/molecules/prompt-textarea.tsx` to show indicator
5. Implement visual property editing (non-AI) with immediate preview updates

**Validation**: Property changes update iframe in real-time, no AI involved yet

---

### Phase 3: AI Integration for Element Modifications
1. Add element modification schemas to `/src/lib/schema.ts`
2. Create `/src/ai/tools/element-modification-tool.ts` with `defineTool`
3. Create `/src/actions/modify-element.ts` Server Action
4. Modify `/src/ai/tools.ts` to export new tool
5. Update `/src/app/api/chat/route.ts` to include tool and inject element context

**Validation**: AI commands can modify selected elements while preserving rest of email

---

### Phase 4: Context Injection & Prompt Engineering
1. Add element context injection to system prompt in `/src/app/api/chat/route.ts`
2. Create element-specific prompt in `/src/ai/prompts.ts`
3. Implement context-aware prompt construction in Server Action
4. Handle ambiguous references (e.g., "change it to blue" → knows "it" = selected element)

**Validation**: AI understands selected element context without explicit mention

---

### Phase 5: State Synchronization & Conflict Resolution
1. Add HTML update method to `/src/stores/email.store.ts`
2. Implement conflict detection (visual edit vs AI edit at same time)
3. Add optimistic updates for instant feedback
4. Implement error handling and rollback for failed AI modifications

**Validation**: No state conflicts between visual and AI edits, smooth UX

---

### Phase 6: Chat History Integration
1. Decide: Should visual edits be added to chat history as messages?
2. If yes: Add system messages like "User edited button color to #FF0000"
3. If no: Keep chat history AI-only, visual edits are silent state changes
4. Implement chosen strategy

**Recommendation**: Add visual edits to history as system messages for context continuity

---

## 6. LLM-Specific Sections

### Tool Calling: `modifyElementTool`

**Tool Definition**:
```typescript
export const modifyElementTool = tool({
  description: 'Modify a specific element in the email by its unique ID. Use when user wants to change properties of a selected element.',

  inputSchema: z.object({
    elementId: z.string().describe('The data-vibe-id of the element to modify'),
    modifications: z.object({
      content: z.string().optional().describe('New text content for the element'),
      styles: z.record(z.string()).optional().describe('CSS styles to update (e.g., {"color": "#FF0000", "fontSize": "18px"})'),
      attributes: z.record(z.string()).optional().describe('HTML attributes to update (e.g., {"href": "https://example.com", "alt": "New image description"})'),
    }).describe('Properties to modify on the element')
  }),

  execute: async ({ elementId, modifications }, { messages }) => {
    try {
      // 1. Get current email HTML from context
      const currentHTML = extractHTMLFromMessages(messages);

      // 2. Parse HTML and find element
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentHTML, 'text/html');
      const element = doc.querySelector(`[data-vibe-id="${elementId}"]`);

      if (!element) {
        return { success: false, error: `Element ${elementId} not found` };
      }

      // 3. Apply modifications
      if (modifications.content) {
        element.textContent = modifications.content;
      }

      if (modifications.styles) {
        Object.entries(modifications.styles).forEach(([key, value]) => {
          element.style[key] = value;
        });
      }

      if (modifications.attributes) {
        Object.entries(modifications.attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }

      // 4. Return updated HTML
      const updatedHTML = doc.documentElement.outerHTML;

      return {
        success: true,
        updatedHTML,
        message: `Successfully modified ${element.tagName.toLowerCase()} element`
      };

    } catch (error) {
      console.error('Error modifying element:', error);
      return { success: false, error: error.message };
    }
  }
});
```

**Usage by AI**:
```
User: "Make that button bigger"
AI thinks: User has button selected with id="btn-123"
AI calls: modifyElementTool({
  elementId: "btn-123",
  modifications: {
    styles: {
      fontSize: "18px",
      padding: "16px 32px"
    }
  }
})
```

---

### Prompting Strategy: Element-Aware Context

**System Prompt Enhancement** (dynamic injection):

```typescript
function buildSystemPrompt(selectedElement?: SelectedElement): string {
  const basePrompt = SYSTEM_PROMPT;

  if (!selectedElement) {
    return basePrompt;
  }

  const elementContext = `

CURRENT SELECTION CONTEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━
The user has selected an element in the email preview:

• Type: ${selectedElement.type} (${selectedElement.tagName})
• ID: ${selectedElement.id}
• Current Content: "${truncate(selectedElement.content, 100)}"
• Current Styles: ${JSON.stringify(selectedElement.styles, null, 2)}

IMPORTANT INSTRUCTIONS:
- When the user uses pronouns like "it", "this", "the button", they refer to this selected element
- Use the 'modifyElementTool' to make changes to this specific element
- DO NOT regenerate the entire email unless explicitly asked
- Preserve all other elements unchanged
- Keep the data-vibe-id="${selectedElement.id}" attribute intact

EXAMPLE USER REQUESTS:
User: "Make it red" → Change selected element's color to red
User: "Change the text to Welcome" → Update selected element's content
User: "Remove the border" → Modify selected element's border style
User: "Make the whole email modern" → Regenerate entire email (use createEmailTool)
`;

  return basePrompt + elementContext;
}
```

**Benefits**:
1. AI understands implicit references (pronouns)
2. Prevents unnecessary full email regeneration
3. Guides AI to use correct tool (element vs full email)
4. Provides element state for context-aware suggestions

---

### Structured Outputs: Element Modification Schema

**Why Structured Outputs?**
- Guarantees type-safe modifications
- Prevents AI from returning invalid HTML
- Enables optimistic UI updates
- Simplifies parsing and error handling

**Schema Definition**:
```typescript
export const elementModificationSchema = z.object({
  success: z.boolean(),
  elementId: z.string(),
  modifications: z.object({
    content: z.string().optional(),
    styles: z.record(z.string()).optional(),
    attributes: z.record(z.string()).optional()
  }),
  reasoning: z.string().describe('Brief explanation of changes made')
});
```

**Usage in Server Action**:
```typescript
const result = await generateObject({
  model: google('gemini-2.5-flash'),
  system: buildSystemPrompt(selectedElement),
  messages: [...messages],
  schema: elementModificationSchema,
  temperature: 0.3, // Lower for deterministic output
});

// result.object is guaranteed to match schema
const { modifications, reasoning } = result.object;
```

---

### Safety & Reliability

#### Input Validation
```typescript
// Before AI call, validate element exists
function validateElementModification(html: string, elementId: string): boolean {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const element = doc.querySelector(`[data-vibe-id="${elementId}"]`);

  if (!element) {
    throw new Error(`Element ${elementId} not found in current HTML`);
  }

  return true;
}
```

#### HTML Sanitization
```typescript
import sanitizeHtml from 'sanitize-html';

function sanitizeElementModification(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'style']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['data-vibe-id', 'style', 'class']
    }
  });
}
```

#### Retry Strategy
```typescript
async function modifyElementWithRetry(
  elementId: string,
  context: ElementContext,
  prompt: string,
  maxRetries = 2
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await modifyElementWithAI(elementId, context, prompt);

      if (result.success) {
        return result;
      }

      // If structured output is invalid, retry with more explicit prompt
      if (attempt < maxRetries) {
        prompt += `\n\nIMPORTANT: Return valid JSON matching the schema.`;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}
```

#### Fallback Behavior
```typescript
// If AI modification fails, fall back to visual editing only
try {
  const aiResult = await modifyElementWithAI(...);
  updateHTML(aiResult.updatedHTML);
} catch (error) {
  toast.error('AI modification failed. Please use manual editing.');
  console.error(error);
  // User can still use properties panel for manual edits
}
```

---

### Parallelization: NOT RECOMMENDED

**Rationale**: Element modifications should be sequential, not parallel

**Why?**
- HTML state must be consistent between modifications
- Parallel modifications could conflict (race conditions)
- Element IDs might change if HTML is regenerated
- Order matters for undo/redo functionality

**Example of WRONG approach**:
```typescript
// ❌ DON'T DO THIS
await Promise.all([
  modifyElement('btn-1', { color: 'red' }),
  modifyElement('txt-2', { fontSize: '20px' }),
  modifyElement('img-3', { width: '100%' })
]);
// Race condition: all three try to modify same HTML base
```

**Correct Sequential Approach**:
```typescript
// ✅ DO THIS
for (const modification of modifications) {
  await modifyElement(modification.elementId, modification.changes);
  // Each modification uses the result of the previous one
}
```

**Exception**: Multiple independent property changes on THE SAME element can be batched:
```typescript
// ✅ OK: Single element, multiple properties
await modifyElement('btn-1', {
  color: 'red',
  fontSize: '20px',
  padding: '16px'
});
```

---

## 7. Critical Implementation Notes

### Data Attribute Strategy: `data-vibe-id`

**Purpose**: Stable identifiers for elements across AI regenerations

**Generation**:
```typescript
// When AI generates HTML, inject unique IDs
function injectVibeIds(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Add data-vibe-id to elements that don't have one
  const elements = doc.querySelectorAll('button, a, img, h1, h2, h3, p, div.section');

  elements.forEach((element, index) => {
    if (!element.hasAttribute('data-vibe-id')) {
      const id = `vibe-${element.tagName.toLowerCase()}-${Date.now()}-${index}`;
      element.setAttribute('data-vibe-id', id);
    }
  });

  return doc.documentElement.outerHTML;
}
```

**Prompt Instruction for AI**:
```
When modifying an existing email, you MUST preserve all 'data-vibe-id' attributes on unchanged elements.
When creating new elements, assign new unique data-vibe-id attributes in format: vibe-{elementType}-{timestamp}-{index}
```

---

### Conflict Resolution: Visual vs AI Edits

**Scenario**: User makes visual edit while AI is processing element modification

**Strategy**: Optimistic Updates with Rollback

```typescript
// 1. User makes visual edit
function handleVisualEdit(elementId: string, newValue: unknown) {
  const previousHTML = useEmailStore.getState().htmlBody;

  // Optimistic update
  updateElementVisually(elementId, newValue);

  // Track for potential rollback
  editHistory.push({ elementId, previousHTML, timestamp: Date.now() });
}

// 2. AI response arrives
function handleAIEditResponse(aiHTML: string) {
  const latestEdit = editHistory[editHistory.length - 1];

  // If visual edit happened in last 5 seconds, show conflict warning
  if (latestEdit && Date.now() - latestEdit.timestamp < 5000) {
    showConflictDialog({
      message: 'You made a manual edit while AI was processing. Which version do you want to keep?',
      options: ['Keep my edit', 'Use AI version', 'Merge both'],
      onResolve: (choice) => {
        if (choice === 'Keep my edit') {
          // Do nothing, current state is already user's edit
        } else if (choice === 'Use AI version') {
          updateHTML(aiHTML);
        } else {
          // Merge: apply AI changes to elements OTHER than the one user edited
          mergeEdits(latestEdit.elementId, aiHTML);
        }
      }
    });
  } else {
    // No conflict, apply AI changes
    updateHTML(aiHTML);
  }
}
```

**Alternative**: Pessimistic Locking
```typescript
// Simpler approach: disable visual editing while AI is processing
const { setIsLoading } = useEmailStore();

function handleAIEdit(prompt: string) {
  setIsLoading(true); // Disables properties panel
  await modifyElementWithAI(prompt);
  setIsLoading(false); // Re-enables properties panel
}
```

**Recommendation**: Use pessimistic locking for MVP, implement optimistic updates + conflict resolution in v2

---

### Chat History: Should Visual Edits Be Logged?

**Option A: Log visual edits as system messages** (Recommended)

```typescript
// When user makes visual edit
const systemMessage = {
  id: generateId(),
  role: 'system',
  content: `User manually changed ${elementType} ${elementId}: ${propertyKey} = ${newValue}`,
  timestamp: Date.now()
};

messages.push(systemMessage);
```

**Benefits**:
- AI has full context of all changes (visual + AI)
- User can see history of modifications in chat
- Enables "undo last 3 changes" type commands
- Better for debugging and support

**Drawbacks**:
- Clutters chat with non-conversational messages
- Could confuse users (mixed visual/AI edits)

---

**Option B: Separate visual edit log** (Alternative)

```typescript
// Separate tracking, not in chat messages
const visualEditLog = useVisualEditStore(state => state.editLog);

visualEditLog.push({
  elementId,
  propertyKey,
  oldValue,
  newValue,
  timestamp,
  source: 'visual'
});
```

**Benefits**:
- Cleaner chat UI (only conversational messages)
- Separate concerns (visual edits vs AI conversation)

**Drawbacks**:
- AI loses context of manual edits
- Harder to implement "undo" across both types
- Two sources of truth for state changes

---

**Recommendation**: **Option A** for MVP

**Rationale**:
- AI context is critical for accurate modifications
- Unified history simplifies state management
- Users benefit from seeing full edit trail
- Can add filter to hide system messages if needed

**Implementation**:
```typescript
function logVisualEdit(element: Element, property: string, oldValue: string, newValue: string) {
  const systemMessage = {
    id: generateId(),
    role: 'system',
    parts: [{
      type: 'text',
      text: `📝 Manual edit: Changed ${element.tagName.toLowerCase()} ${property} from "${oldValue}" to "${newValue}"`
    }],
    createdAt: new Date()
  };

  setMessages(prev => [...prev, systemMessage]);
}
```

---

## 8. Testing Strategy

### Unit Tests
- `/src/ai/tools/element-modification-tool.test.ts`: Test tool execution, edge cases
- `/src/actions/modify-element.test.ts`: Test Server Action with mock AI responses
- `/src/hooks/use-element-selection.test.ts`: Test element selection logic

### Integration Tests
- Full flow: Select element → Modify via AI → Verify HTML update → Check state sync
- Conflict scenarios: Visual edit + AI edit simultaneously
- Error handling: Invalid element ID, AI failure, malformed HTML

### E2E Tests (Playwright)
- Click element in iframe → Properties panel opens → Make AI edit → Preview updates
- Visual edit → AI edit → Verify no conflicts
- Deselect element → Chat returns to normal mode

---

## 9. Performance Considerations

### Debouncing Visual Edits
```typescript
// Don't send API request on every keystroke
const debouncedAIEdit = useDebouncedCallback(
  (prompt: string) => {
    modifyElementWithAI(selectedElementId, prompt);
  },
  1000 // Wait 1 second after user stops typing
);
```

### Optimistic UI Updates
```typescript
// Update iframe immediately, rollback if AI fails
function handlePropertyChange(key: string, value: unknown) {
  const previousHTML = htmlBody;

  // Optimistic update
  updateElementInIframe(selectedElementId, { [key]: value });

  // Send to AI in background
  modifyElementWithAI(selectedElementId, { [key]: value })
    .catch(() => {
      // Rollback on failure
      setHTMLBody(previousHTML);
      toast.error('Failed to save changes');
    });
}
```

### Caching Element Context
```typescript
// Cache parsed element properties to avoid re-parsing on every render
const elementPropertiesCache = new Map<string, ElementProperties>();

function getElementProperties(elementId: string): ElementProperties {
  if (elementPropertiesCache.has(elementId)) {
    return elementPropertiesCache.get(elementId)!;
  }

  const properties = parseElementProperties(elementId);
  elementPropertiesCache.set(elementId, properties);
  return properties;
}
```

---

## 10. Security Considerations

### XSS Prevention
```typescript
// Sanitize user input before injecting into HTML
import DOMPurify from 'dompurify';

function sanitizeUserInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
}
```

### Iframe Sandbox
```tsx
// Already implemented in previewer-email.tsx
<iframe
  sandbox="allow-same-origin" // Allows JS interaction
  // NO "allow-scripts" - prevents arbitrary JS execution
  // NO "allow-forms" - prevents form submission
/>
```

### AI Prompt Injection Defense
```typescript
// Validate user prompt doesn't contain malicious instructions
function validatePrompt(prompt: string): boolean {
  const blacklist = [
    'ignore previous instructions',
    'system prompt',
    'forget everything',
    '<script>',
    'eval(',
  ];

  return !blacklist.some(term =>
    prompt.toLowerCase().includes(term.toLowerCase())
  );
}
```

---

## 11. Open Questions & Decisions Needed

### Q1: Should AI suggest property changes before applying?
**Option A**: AI applies changes immediately (current)
**Option B**: AI suggests changes, user approves/rejects

**Recommendation**: Option A for MVP, add approval workflow in v2

---

### Q2: How to handle multi-element modifications?
**Scenario**: User selects button and says "make all buttons red"

**Option A**: Only modify selected button
**Option B**: Detect intent and modify all similar elements

**Recommendation**: Option A for clarity, add bulk edit feature later

---

### Q3: Undo/Redo functionality?
**Should we implement Ctrl+Z / Ctrl+Y?**

**Recommendation**: Yes, high value for user experience

**Implementation**:
```typescript
const [historyStack, setHistoryStack] = useState<string[]>([]);
const [historyIndex, setHistoryIndex] = useState(0);

function undo() {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setHTMLBody(historyStack[historyIndex - 1]);
  }
}

function redo() {
  if (historyIndex < historyStack.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setHTMLBody(historyStack[historyIndex + 1]);
  }
}
```

---

## 12. Success Metrics

### Feature Adoption
- % of users who click on elements (vs only using chat)
- Average # of elements edited per session
- % of edits done visually vs AI

### Performance
- Average latency for AI element modifications (target: <2s)
- Success rate of element modifications (target: >95%)
- Conflict rate between visual and AI edits (target: <5%)

### User Satisfaction
- Task completion rate for element editing
- User feedback on editing experience
- Error rate and support tickets related to editing

---

## 13. Next Steps After Implementation

### Phase 2 Features (Future)
1. **Multi-element selection**: Shift+Click to select multiple elements
2. **Bulk AI edits**: "Make all buttons blue"
3. **Smart suggestions**: AI proactively suggests improvements
4. **Edit templates**: Save common modifications as reusable templates
5. **Collaboration**: Multi-user editing with presence awareness
6. **Version history**: Git-like branching and merging of email versions

### Potential Optimizations
1. **Edge runtime**: Move AI calls to Edge for lower latency
2. **Model fine-tuning**: Train custom model on email HTML patterns
3. **Client-side parsing**: Use WASM for faster HTML parsing
4. **Real-time sync**: WebSocket for instant preview updates

---

## 14. Dependencies to Install

```bash
pnpm add node-html-parser        # HTML parsing and manipulation
pnpm add dompurify              # XSS protection
pnpm add sanitize-html          # Additional HTML sanitization
pnpm add use-debounce           # Debouncing hooks
```

**Optional** (if using alternative parsers):
```bash
pnpm add jsdom                  # Full DOM emulation (heavier)
pnpm add parse5                 # Alternative HTML parser
```

---

## 15. Documentation Requirements

### For Developers
- Architecture diagram showing component interactions
- API documentation for new hooks and Server Actions
- Testing guide with examples

### For Users
- Tutorial: "How to edit email elements visually"
- FAQ: Common questions about AI editing
- Video walkthrough of feature

---

## 16. Rollout Plan

### Phase 1: Internal Testing (Week 1)
- Deploy to staging environment
- Test with internal team
- Collect feedback and fix critical bugs

### Phase 2: Beta Release (Week 2-3)
- Enable for 10% of users
- Monitor error rates and performance
- Iterate based on user feedback

### Phase 3: Full Release (Week 4)
- Gradual rollout to 50% → 100%
- Monitor metrics closely
- Have rollback plan ready

---

## Summary for Parent Agent

This plan provides a complete AI SDK integration strategy for element-level editing:

**Core Components**:
1. **Element Selection**: Hook-based iframe interaction + Zustand store
2. **Properties Panel**: Visual editing UI replacing chat when element selected
3. **AI Tool**: `modifyElementTool` for targeted LLM-powered edits
4. **Context Injection**: Dynamic system prompt enhancement with selected element info
5. **State Sync**: Unified state management between visual and AI edits

**Key Technical Decisions**:
- Use `generateObject` (not streaming) for atomic element updates
- Log visual edits as system messages for AI context continuity
- Pessimistic locking (disable visual editing during AI processing) for MVP
- Preserve `data-vibe-id` attributes for element tracking

**Implementation Phases**:
1. Element selection infrastructure (iframe + store)
2. Properties panel UI (visual editing only)
3. AI tool integration (LLM-powered editing)
4. Context injection (element-aware prompts)
5. State synchronization (conflict resolution)
6. Chat history integration (logging strategy)

**Parent Agent Actions**:
1. Read this plan thoroughly
2. Create todos for each phase using TodoWrite
3. Execute implementation sequentially (phases 1-6)
4. Test after each phase before proceeding
5. Update session context after completing each phase

**Critical Constraints to Remember**:
- NO direct HTML manipulation in client components (use Server Actions)
- ALWAYS use Zustand for UI state (selected element), NOT React Query
- ALWAYS use AI SDK tools (defineTool), NO custom fetch
- PRESERVE all data-vibe-id attributes in AI-generated HTML
- FOLLOW naming conventions (kebab-case files, use- prefix for hooks)
