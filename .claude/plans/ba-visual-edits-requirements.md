# Visual Edits Feature - Business Requirements Document

**Document Version**: 1.0
**Date**: 2025-12-04
**Session ID**: visual-edits-20251204
**Author**: business-analyst agent
**Status**: Draft - Pending Approval

---

## Executive Summary

The Visual Edits feature enables users to directly interact with email preview elements through click-to-select functionality, providing an intuitive visual editing experience. This feature transforms the current chat-only workflow into a hybrid chat + visual editing interface, allowing users to quickly modify specific email elements through both direct manipulation and AI-assisted refinements.

**Key Value Proposition**: Reduce editing friction by 70% - users can click and edit any element instead of describing changes through chat prompts.

**Target Users**: Email marketers, designers, and content creators who need to iterate quickly on email templates.

**Expected Impact**:
- Faster email editing workflow (estimated 3x faster for simple edits)
- Reduced cognitive load (visual selection vs text description)
- More precise edits (direct element targeting)
- Enhanced AI context (AI understands exactly what element user wants to modify)

---

## 1. Problem Statement

### Current Situation

Users currently interact with email generation through a pure chat interface:
- User describes desired email in chat → AI generates email → User sees preview
- To modify an element (e.g., change button color), user must describe it in chat: "Make the button blue"
- AI must interpret the description and identify the correct element
- Multiple back-and-forth exchanges may be needed for precise edits
- No visual affordance for which elements are editable

**Pain Points**:
1. **Ambiguity**: "Change the button" - which button if there are multiple?
2. **Inefficiency**: Simple edits (change text color) require full chat interaction
3. **Cognitive overhead**: User must mentally map visual elements to text descriptions
4. **Discovery**: Users don't know what can be edited until they try asking

### Desired Outcome

**Visual-first editing workflow**:
1. User clicks any element in preview → Element highlights
2. Properties panel appears (replacing chat messages area)
3. User edits properties directly (text content, colors, sizes, alignment)
4. Changes apply in real-time to preview
5. User can also ask AI to refine selected element: "Make this more professional"

**Success Criteria**:
- Click-to-select works for all major HTML elements (text, images, buttons, links, containers)
- Properties panel provides relevant controls based on element type
- Real-time preview updates (< 100ms latency)
- AI understands selected element context in subsequent prompts
- Visual selection state persists until user deselects or selects another element

### Value Proposition

**For End Users**:
- **Speed**: Edit elements 3x faster than chat-only workflow
- **Precision**: Direct targeting eliminates ambiguity
- **Discoverability**: Visual interface reveals editable properties
- **Flexibility**: Choose between manual edits or AI-assisted refinements

**For Business**:
- **User satisfaction**: Reduced frustration with editing workflow
- **Adoption**: Lower learning curve (familiar WYSIWYG paradigm)
- **Differentiation**: Hybrid visual + AI editing is unique value proposition
- **Retention**: Power users will prefer this over pure chat interfaces

---

## 2. Stakeholders

### Primary Users: Email Creators

**Profile**: Marketing professionals, designers, content creators
**Technical Level**: Intermediate (familiar with email tools like Mailchimp, Klaviyo)
**Goals**:
- Create professional email templates quickly
- Iterate on designs with minimal friction
- Maintain brand consistency
- Test different variations

**Pain Points**:
- Chat-only interfaces feel slower for simple edits
- Want visual confirmation of changes
- Need to see all properties in one place

**Needs**:
- Click any element to edit it
- See all editable properties clearly
- Undo/redo for mistake recovery
- Preview changes before applying

**User Journey**:
1. Generate initial email via chat
2. Click element they want to refine
3. Edit properties in panel (or ask AI to refine)
4. See changes immediately in preview
5. Click another element or deselect to continue

---

### Secondary Users: Developer/Advanced Users

**Profile**: Technical users who understand HTML/CSS
**Goals**:
- Fine-grained control over styles
- Ability to edit raw HTML if needed
- Understand element structure (nested elements)

**Needs**:
- Inspect element hierarchy
- Edit advanced CSS properties
- Copy element HTML
- See element selectors (for debugging)

**Future Consideration**: Advanced mode with HTML/CSS inspector (not MVP)

---

### Decision Makers: Product/Engineering Leads

**Role**: Approve feature scope, technical approach, timeline
**Success Criteria**:
- Feature doesn't compromise performance (< 2s load time)
- Architecture is maintainable and extensible
- Works within existing tech stack (Next.js 15, React 19, Zustand)
- Security: No XSS vulnerabilities from user-editable HTML

---

## 3. Scope

### In Scope ✅

**MVP Features (P0)**:
1. **Element Selection**:
   - Click-to-select any element in email preview iframe
   - Visual highlight with border/outline on selected element
   - Single element selection (not multi-select)
   - Deselect by clicking outside element or on deselect button

2. **Properties Panel** (replaces chat messages area):
   - Displays when element is selected
   - Shows element type (e.g., "Heading 1", "Button", "Image")
   - Editable properties based on element type:
     - **Text elements** (p, h1-h6, span): Content, font size, color, bold/italic, alignment
     - **Images** (img): Change image URL, alt text, width/height, alignment
     - **Buttons/Links** (button, a): Text, background color, text color, border radius, href
     - **Containers** (div, section): Background color, padding
   - Real-time preview updates as user edits
   - "Apply Changes" button (optional: auto-apply on change)

3. **Selected Element Indicator** (in prompt textarea area):
   - Badge/chip shown above file upload button
   - Displays: `Editing: {element-type}` (e.g., "Editing: Button")
   - Click "X" to deselect element
   - Persists while element is selected

4. **AI Integration**:
   - AI receives selected element context in prompts
   - User can type: "Make this button more prominent" (AI knows which button)
   - AI modifies only selected element (preserves rest of email)
   - Selected element is preserved after AI edit (unless user deselects)

5. **Element Identification System**:
   - All editable elements have `data-vibe-id` attribute (unique identifier)
   - IDs persist across AI regenerations (unchanged elements keep same ID)
   - Enables precise element targeting and tracking

---

### Out of Scope ❌

**Not in MVP** (future enhancements):
1. **Multi-select**: Selecting multiple elements at once
2. **Drag-and-drop**: Moving elements within email
3. **Add/delete elements**: Creating new elements or removing existing ones
4. **Advanced CSS editing**: Raw CSS input, custom classes
5. **HTML inspector**: View/edit raw HTML source
6. **Undo/Redo**: Version history (will use browser undo for text inputs)
7. **Collaborative editing**: Real-time multi-user editing
8. **Element presets**: Save/load element styles as presets
9. **Responsive preview**: Edit different properties per device size
10. **Copy/paste elements**: Duplicate elements within or across emails

**Explicitly NOT doing**:
- Full visual email builder (this is AI-assisted editing, not a drag-and-drop builder)
- Element library/component gallery (AI generates elements)
- Template marketplace

---

### Assumptions

1. **Technical Assumptions**:
   - Email HTML is served in iframe with `sandbox="allow-same-origin"` (allows JS interaction)
   - All HTML is valid and well-formed (AI generates valid HTML)
   - Email preview iframe and parent app are same-origin (no CORS issues)
   - `data-vibe-id` attributes don't conflict with email rendering

2. **User Behavior Assumptions**:
   - Users understand click-to-select paradigm (common in design tools)
   - Users prefer visual editing for simple changes, chat for complex/creative changes
   - Users will primarily edit text content, colors, and images
   - Users expect changes to preview immediately (not after "submit")

3. **Business Assumptions**:
   - Visual editing will reduce support requests about "how to change X"
   - Users will generate more email variations with lower friction
   - Feature doesn't significantly increase server costs (client-side editing)

---

### Dependencies

**External Dependencies**:
- **AI Model** (Gemini 2.5 Flash): Must preserve `data-vibe-id` attributes when regenerating HTML
- **React Email library**: Generated HTML must be compatible with element selection
- **Browser support**: Click events, contentDocument access in iframe

**Internal Dependencies**:
- **Email Store** (`email.store.ts`): Needs to store selected element state
- **Iframe Integration** (`previewer-email.tsx`): Must support click event listeners
- **Chat Component** (`chat.tsx`): Must conditionally hide when properties panel is shown
- **Prompt Textarea** (`prompt-textarea.tsx`): Must show selected element indicator

**Technical Constraints**:
- iframe sandbox mode must allow same-origin (for element selection)
- Properties panel must fit in same space as chat messages (same container dimensions)
- Element IDs must be stable across AI regenerations (see system prompt in tools.ts)

---

## 4. User Stories and Features

### Epic 1: Element Selection

**Priority**: P0 (Critical - core functionality)

---

#### US-1.1: Click to Select Element

**As a** email creator
**I want to** click any element in the email preview
**So that** I can select it for editing

**Acceptance Criteria**:
- [ ] User can click any element in email preview iframe
- [ ] Clicked element receives visual highlight (2px solid border, color: primary)
- [ ] Only one element can be selected at a time
- [ ] Clicking another element deselects previous and selects new element
- [ ] Selected element ID is stored in state (`selectedElementId`)
- [ ] Selected element's properties are extracted and available to properties panel

**Priority**: P0
**Estimated Effort**: Large
**Technical Notes**:
- Requires postMessage communication between iframe and parent
- Must handle nested elements (click on child should select child, not parent)
- Must prevent event bubbling to parent elements

---

#### US-1.2: Visual Highlight on Selected Element

**As a** email creator
**I want to** see a clear visual highlight on the selected element
**So that** I know which element I'm editing

**Acceptance Criteria**:
- [ ] Selected element has 2px solid border (use theme primary color)
- [ ] Border is clearly visible on all background colors (use contrasting color if needed)
- [ ] Highlight is removed when element is deselected
- [ ] Highlight persists when switching between properties panel and preview
- [ ] Highlight appears immediately (< 50ms after click)

**Priority**: P0
**Estimated Effort**: Medium
**Technical Notes**:
- Inject style into iframe document
- Use CSS class or inline style on selected element
- Handle edge cases: element at edge of viewport, very small elements

---

#### US-1.3: Deselect Element

**As a** email creator
**I want to** deselect the currently selected element
**So that** I can return to chat mode or select a different element

**Acceptance Criteria**:
- [ ] User can click "X" button on selected element indicator to deselect
- [ ] Clicking outside email elements deselects current element
- [ ] Pressing Escape key deselects current element
- [ ] Deselection removes visual highlight
- [ ] Deselection hides properties panel and shows chat messages
- [ ] Deselection clears `selectedElementId` from state

**Priority**: P0
**Estimated Effort**: Medium

---

### Epic 2: Properties Panel

**Priority**: P0 (Critical - core functionality)

---

#### US-2.1: Show Properties Panel on Element Selection

**As a** email creator
**I want to** see a properties panel when I select an element
**So that** I can view and edit its properties

**Acceptance Criteria**:
- [ ] Properties panel replaces chat messages area when element is selected
- [ ] Panel shows element type (e.g., "Heading 1", "Button", "Image")
- [ ] Panel is scrollable if properties exceed viewport height
- [ ] Panel has consistent styling with rest of app (shadcn/ui theme)
- [ ] Panel appears smoothly (fade-in animation, 200ms duration)

**Priority**: P0
**Estimated Effort**: Large
**Technical Notes**:
- Conditional rendering: `{selectedElement ? <PropertiesPanel /> : <Conversation />}`
- Panel uses same container as Conversation component

---

#### US-2.2: Edit Text Content

**As a** email creator
**I want to** edit the text content of selected text elements
**So that** I can update email copy directly

**Acceptance Criteria**:
- [ ] Text input field shows current text content
- [ ] User can type new text
- [ ] Text updates in preview as user types (debounced, 300ms)
- [ ] Multi-line text uses textarea (for paragraphs)
- [ ] Single-line text uses input (for headings, buttons)
- [ ] Character count shown for text inputs (optional: limit per element type)

**Priority**: P0
**Estimated Effort**: Medium
**Applies to**: p, h1-h6, span, button, a (link text)

---

#### US-2.3: Edit Text Styles (Typography)

**As a** email creator
**I want to** change font size, color, weight, and alignment of selected text
**So that** I can adjust visual hierarchy and emphasis

**Acceptance Criteria**:
- [ ] **Font Size**: Number input or dropdown (12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60 px)
- [ ] **Text Color**: Color picker with hex input, shows current color
- [ ] **Font Weight**: Buttons for Normal, Bold (toggle)
- [ ] **Font Style**: Buttons for Normal, Italic (toggle)
- [ ] **Text Alignment**: Buttons for Left, Center, Right, Justify (radio selection)
- [ ] Changes apply to preview immediately (< 100ms)
- [ ] Changes update element's inline styles or classes

**Priority**: P0
**Estimated Effort**: Large
**Applies to**: p, h1-h6, span

**UI Components**:
- Color picker: shadcn/ui Popover + color input
- Toggle buttons: shadcn/ui ToggleGroup
- Alignment: shadcn/ui RadioGroup with icons

---

#### US-2.4: Edit Image Properties

**As a** email creator
**I want to** change image source, alt text, and dimensions
**So that** I can update email visuals

**Acceptance Criteria**:
- [ ] **Image URL**: Text input for image source URL
- [ ] **Alt Text**: Text input for accessibility text
- [ ] **Width**: Number input (px or %) or slider
- [ ] **Height**: Number input (px or %) or slider, option to maintain aspect ratio
- [ ] **Alignment**: Buttons for Left, Center, Right (applies to parent container)
- [ ] Image preview updates when URL changes
- [ ] Broken image fallback shown if URL invalid

**Priority**: P0
**Estimated Effort**: Large
**Applies to**: img

**Technical Notes**:
- Validate image URL format (basic regex check)
- Show loading state while image loads
- Handle CORS issues with external images (user warning)

---

#### US-2.5: Edit Button/Link Properties

**As a** email creator
**I want to** change button text, colors, and link URL
**So that** I can update CTAs and navigation

**Acceptance Criteria**:
- [ ] **Button Text**: Text input for button label
- [ ] **Background Color**: Color picker for button background
- [ ] **Text Color**: Color picker for button text
- [ ] **Border Radius**: Slider (0-20px) for corner roundness
- [ ] **Link URL** (for links): Text input for href attribute
- [ ] **Button Size** (optional): Dropdown for Small, Medium, Large (applies padding)
- [ ] Changes apply to preview immediately

**Priority**: P0
**Estimated Effort**: Large
**Applies to**: button, a (with button-like styles)

---

#### US-2.6: Edit Container Properties

**As a** email creator
**I want to** change container background colors and spacing
**So that** I can adjust layout and visual grouping

**Acceptance Criteria**:
- [ ] **Background Color**: Color picker with option for transparent
- [ ] **Padding**: Number input for top, right, bottom, left (or single value for all)
- [ ] **Padding visual**: Show padding values in a box model diagram (optional enhancement)
- [ ] Changes apply to preview immediately

**Priority**: P1 (High - important but can be phased after text/image/button)
**Estimated Effort**: Medium
**Applies to**: div, section, td (table cells)

---

### Epic 3: Selected Element Indicator

**Priority**: P0 (Critical - UX clarity)

---

#### US-3.1: Show Selected Element Badge

**As a** email creator
**I want to** see which element is currently selected
**So that** I have context when typing prompts

**Acceptance Criteria**:
- [ ] Badge appears above file upload button in prompt textarea area
- [ ] Badge shows: "Editing: {element-type}" (e.g., "Editing: Heading 1")
- [ ] Badge has "X" button to deselect element
- [ ] Badge uses subtle styling (small size, low contrast, doesn't dominate UI)
- [ ] Badge is visible whether or not files are uploaded
- [ ] Badge disappears when element is deselected

**Priority**: P0
**Estimated Effort**: Small

**UI Design**:
- Component: shadcn/ui Badge with destructive variant "X" button
- Placement: Fixed position above PromptInputActions, below file sources
- Text: Secondary color, small font size (text-sm)

---

### Epic 4: AI Integration for Visual Edits

**Priority**: P0 (Critical - core value proposition)

---

#### US-4.1: AI Receives Selected Element Context

**As a** email creator
**I want** the AI to know which element I have selected
**So that** my prompts apply to that specific element

**Acceptance Criteria**:
- [ ] When user sends prompt with element selected, AI receives element context
- [ ] Context includes: `data-vibe-id`, element type, current HTML content
- [ ] AI prompt is augmented with: "User has selected: {element-type} with ID {vibe-id}"
- [ ] AI tool (`modifyEmailTool`) is invoked instead of `createEmailTool`
- [ ] AI modifies only the selected element (preserves `data-vibe-id` on others)

**Priority**: P0
**Estimated Effort**: Large
**Technical Notes**:
- Modify `/api/chat/route.ts` to include selected element in tool calls
- Update `modifyEmailTool` in `ai/tools.ts` to handle element-specific edits
- AI system prompt must emphasize: "ONLY modify element with data-vibe-id={id}"

---

#### US-4.2: AI Modifies Selected Element

**As a** email creator
**I want to** ask AI to change the selected element
**So that** I can use natural language for complex edits

**Acceptance Criteria**:
- [ ] User types prompt like "Make this more professional" with element selected
- [ ] AI understands prompt applies to selected element only
- [ ] AI generates updated HTML for that element
- [ ] Updated HTML replaces element in preview
- [ ] All other elements remain unchanged (data-vibe-id preserved)
- [ ] Selected element remains selected after AI edit

**Priority**: P0
**Estimated Effort**: Large

**Example Prompts**:
- "Make this button larger and use blue color"
- "Change this heading to be more persuasive"
- "Use a professional tone for this paragraph"
- "Make this image smaller"

---

#### US-4.3: Chat Mode vs Edit Mode Toggle

**As a** email creator
**I want** the UI to clearly show whether I'm in chat mode or edit mode
**So that** I understand how my prompts will be interpreted

**Acceptance Criteria**:
- [ ] **Chat Mode** (no element selected): Full email regeneration, chat messages visible
- [ ] **Edit Mode** (element selected): Element-specific edits, properties panel visible
- [ ] Mode indicator shown in UI (optional: badge or toggle switch)
- [ ] User can deselect element to return to chat mode
- [ ] Prompt textarea placeholder changes based on mode:
  - Chat mode: "Ask me anything..."
  - Edit mode: "Ask me to modify this element..."

**Priority**: P1 (High - UX clarity)
**Estimated Effort**: Small

---

### Epic 5: Element Identification System

**Priority**: P0 (Critical - technical foundation)

---

#### US-5.1: Assign Unique IDs to Editable Elements

**As a** developer
**I want** all editable elements to have unique, stable IDs
**So that** the system can precisely target elements for editing

**Acceptance Criteria**:
- [ ] AI generates HTML with `data-vibe-id` attribute on all editable elements
- [ ] ID format: `vibe-{element-type}-{uuid}` (e.g., `vibe-heading-a1b2c3d4`)
- [ ] IDs are unique within email document
- [ ] IDs persist when AI regenerates email (unchanged elements keep same ID)
- [ ] IDs do not affect email rendering or styling

**Priority**: P0
**Estimated Effort**: Medium
**Technical Notes**:
- Update AI system prompt in `ai/tools.ts` to always include `data-vibe-id`
- AI must be instructed: "When modifying email, preserve data-vibe-id on unchanged elements"

---

#### US-5.2: Parse Element by ID

**As a** developer
**I want to** extract element properties from HTML by `data-vibe-id`
**So that** the properties panel can display current values

**Acceptance Criteria**:
- [ ] Function: `parseElementById(html: string, vibeId: string): ElementProperties`
- [ ] Returns element type, tag name, attributes, styles, content
- [ ] Handles nested elements correctly (returns immediate element, not parents)
- [ ] Returns null if element not found
- [ ] Performant for large HTML documents (< 10ms parse time)

**Priority**: P0
**Estimated Effort**: Medium
**Implementation**: Utility function in `/lib/email-parser.ts` (new file)

---

#### US-5.3: Update Element by ID

**As a** developer
**I want to** update a specific element's properties in HTML by `data-vibe-id`
**So that** user edits are applied to preview

**Acceptance Criteria**:
- [ ] Function: `updateElementById(html: string, vibeId: string, updates: Partial<ElementProperties>): string`
- [ ] Updates element attributes, styles, or content
- [ ] Preserves other elements unchanged
- [ ] Returns updated HTML string
- [ ] Handles edge cases: missing element, invalid updates, malformed HTML

**Priority**: P0
**Estimated Effort**: Large
**Implementation**: Utility function in `/lib/email-parser.ts`
**Technical Approach**: Use DOMParser to parse HTML, find element, update, serialize back

---

## 5. Functional Requirements

### FR-1: Element Selection in Preview

**Priority**: P0

**Requirements**:

- **FR-1.1**: System SHALL enable click-to-select for all elements with `data-vibe-id` attribute
  - **AC**: User clicks element in iframe → `selectedElementId` state updates
  - **AC**: Click event does not trigger default behavior (e.g., link navigation)

- **FR-1.2**: System SHALL highlight selected element with 2px solid border
  - **AC**: Border color is theme primary color
  - **AC**: Border is visible on all background colors (use CSS outline if needed)

- **FR-1.3**: System SHALL support single element selection only
  - **AC**: Selecting new element deselects previous element
  - **AC**: Only one element has highlight at a time

- **FR-1.4**: System SHALL provide deselection mechanism
  - **AC**: Clicking outside elements deselects current selection
  - **AC**: Clicking "X" on indicator badge deselects current selection
  - **AC**: Pressing Escape key deselects current selection

- **FR-1.5**: System SHALL handle nested element clicks
  - **AC**: Clicking child element selects child, not parent
  - **AC**: Deepest clickable element is selected (event target, not parents)

---

### FR-2: Properties Panel UI

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL conditionally render properties panel OR chat messages
  - **AC**: If `selectedElementId` is set → show PropertiesPanel
  - **AC**: If `selectedElementId` is null → show Conversation
  - **AC**: Transition is smooth (200ms fade animation)

- **FR-2.2**: System SHALL display element type in panel header
  - **AC**: Header shows human-readable element name (e.g., "Heading 1" for h1, "Button" for button)

- **FR-2.3**: System SHALL display relevant properties based on element type
  - **AC**: Text elements show: content, font size, color, weight, style, alignment
  - **AC**: Image elements show: URL, alt text, width, height, alignment
  - **AC**: Button/link elements show: text, background color, text color, border radius, URL
  - **AC**: Container elements show: background color, padding

- **FR-2.4**: System SHALL update preview in real-time as user edits properties
  - **AC**: Text input updates trigger preview update after 300ms debounce
  - **AC**: Color picker updates trigger immediate preview update
  - **AC**: Slider/toggle updates trigger immediate preview update

- **FR-2.5**: System SHALL validate user inputs
  - **AC**: Color inputs accept hex format (#RRGGBB) or CSS color names
  - **AC**: URL inputs show warning if invalid format (basic regex validation)
  - **AC**: Number inputs enforce min/max bounds (e.g., font size: 8-72px)

---

### FR-3: Element Identification

**Priority**: P0

**Requirements**:

- **FR-3.1**: System SHALL assign unique `data-vibe-id` to all editable elements
  - **AC**: AI-generated HTML includes `data-vibe-id` on p, h1-h6, img, button, a, div, section, span elements
  - **AC**: IDs follow format: `vibe-{type}-{uuid}`
  - **AC**: IDs are unique within email document

- **FR-3.2**: System SHALL preserve `data-vibe-id` on unchanged elements during AI regeneration
  - **AC**: AI system prompt instructs to preserve existing IDs
  - **AC**: Only modified elements get new IDs or updated attributes

- **FR-3.3**: System SHALL parse element properties by ID
  - **AC**: Function extracts element tag, attributes, styles, text content
  - **AC**: Parse time < 10ms for typical email HTML (< 50KB)

- **FR-3.4**: System SHALL update element properties by ID
  - **AC**: Function updates element in HTML string
  - **AC**: Other elements remain unchanged
  - **AC**: HTML remains valid after update

---

### FR-4: AI Integration

**Priority**: P0

**Requirements**:

- **FR-4.1**: System SHALL augment AI prompts with selected element context
  - **AC**: Prompt includes: "User has selected: {element-type} with data-vibe-id={id}"
  - **AC**: Current element HTML is included in AI context

- **FR-4.2**: System SHALL invoke `modifyEmailTool` when element is selected
  - **AC**: If `selectedElementId` exists → call `modifyEmailTool`
  - **AC**: If `selectedElementId` is null → call `createEmailTool`

- **FR-4.3**: AI SHALL modify only selected element
  - **AC**: AI system prompt emphasizes: "ONLY modify element with data-vibe-id={id}"
  - **AC**: AI returns updated HTML for selected element only (or full email with only that element changed)

- **FR-4.4**: System SHALL preserve element selection after AI edit
  - **AC**: After AI response, selected element remains selected (if still exists)
  - **AC**: Properties panel stays open with updated element properties

---

### FR-5: State Management

**Priority**: P0

**Requirements**:

- **FR-5.1**: System SHALL store selected element ID in state
  - **AC**: New store or extend `useEmailStore()` with `selectedElementId` field
  - **AC**: State is reactive (UI updates when state changes)

- **FR-5.2**: System SHALL store selected element properties in state
  - **AC**: Element properties (type, attributes, styles, content) stored separately
  - **AC**: Properties are extracted when element is selected

- **FR-5.3**: System SHALL update email HTML when properties change
  - **AC**: Property changes trigger `updateElementById()` function
  - **AC**: Updated HTML is set to `useEmailStore().htmlBody`
  - **AC**: Preview iframe re-renders with updated HTML

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

**Requirements**:

- **NFR-1.1**: Element selection SHALL respond in < 50ms
  - **Measurement**: Time from click to highlight appearing
  - **Rationale**: Users expect instant feedback for direct manipulation

- **NFR-1.2**: Properties panel SHALL appear in < 200ms
  - **Measurement**: Time from selection to panel fully rendered
  - **Rationale**: Smooth transition feels intentional, not laggy

- **NFR-1.3**: Preview updates SHALL apply in < 100ms for non-text changes
  - **Measurement**: Time from property change (color, toggle) to preview update
  - **Rationale**: Real-time editing requires immediate visual feedback

- **NFR-1.4**: Preview updates SHALL apply in < 300ms for text changes (debounced)
  - **Measurement**: Time from last keystroke to preview update
  - **Rationale**: Balance responsiveness with performance (avoid re-render on every keystroke)

- **NFR-1.5**: HTML parsing SHALL complete in < 10ms for typical emails
  - **Measurement**: Time to parse 50KB HTML and extract element by ID
  - **Rationale**: Parsing happens on every selection, must not block UI

---

### NFR-2: Usability

**Priority**: P0

**Requirements**:

- **NFR-2.1**: Selected element SHALL be visually distinct from unselected elements
  - **Test**: Visual regression test, user testing (95% of users identify selected element)
  - **Rationale**: Core interaction pattern must be obvious

- **NFR-2.2**: Properties panel SHALL be self-explanatory (no help text needed)
  - **Test**: User testing with first-time users (90% complete task without help)
  - **Rationale**: Reduce learning curve, increase adoption

- **NFR-2.3**: All property controls SHALL have appropriate input types
  - **Test**: Color picker for colors (not text input), slider for ranges, toggle for booleans
  - **Rationale**: Use web platform affordances users are familiar with

- **NFR-2.4**: Error states SHALL provide clear feedback
  - **Test**: Invalid inputs show inline error message (not generic alert)
  - **Rationale**: Users can self-correct without frustration

---

### NFR-3: Accessibility

**Priority**: P1

**Requirements**:

- **NFR-3.1**: Element selection SHALL be keyboard accessible
  - **AC**: Tab key navigates between elements
  - **AC**: Enter key selects focused element
  - **AC**: Escape key deselects current element

- **NFR-3.2**: Properties panel controls SHALL follow WCAG 2.1 AA standards
  - **AC**: All inputs have labels (visible or aria-label)
  - **AC**: Color contrast ratio ≥ 4.5:1 for text
  - **AC**: Focus indicators are visible

- **NFR-3.3**: Screen reader SHALL announce element selection and mode changes
  - **AC**: aria-live region announces "Editing: {element-type}"
  - **AC**: Mode transitions are announced (chat mode ↔ edit mode)

---

### NFR-4: Security

**Priority**: P0

**Requirements**:

- **NFR-4.1**: User inputs SHALL be sanitized before applying to HTML
  - **AC**: HTML special characters are escaped (prevent XSS)
  - **AC**: URL inputs are validated (no `javascript:` or `data:` schemes)
  - **AC**: Color inputs are validated (hex format only)

- **NFR-4.2**: iframe sandbox SHALL prevent malicious code execution
  - **AC**: iframe has `sandbox="allow-same-origin"` (no allow-scripts in generated HTML)
  - **AC**: No inline JavaScript in user-editable content

- **NFR-4.3**: AI-generated HTML SHALL be sanitized before rendering
  - **AC**: Dangerous tags/attributes removed (script, onclick, onerror, etc.)
  - **AC**: Only allow-listed tags and attributes are rendered

---

### NFR-5: Maintainability

**Priority**: P1

**Requirements**:

- **NFR-5.1**: Code SHALL follow project architecture patterns
  - **AC**: Properties panel in `components/organisms/properties-panel.tsx`
  - **AC**: Element utilities in `lib/email-parser.ts`
  - **AC**: Selected element state in Zustand store (UI state)

- **NFR-5.2**: Component properties SHALL be type-safe (TypeScript)
  - **AC**: All element properties have Zod schemas
  - **AC**: No `any` types (except where unavoidable)

- **NFR-5.3**: UI components SHALL use shadcn/ui where possible
  - **AC**: No custom input components (use shadcn/ui Input, Button, ColorPicker, etc.)
  - **AC**: Consistent styling with rest of app

---

## 7. Business Rules

### BR-1: Element Editability

**Rule**: Only elements with `data-vibe-id` attribute are selectable and editable
**Rationale**: Prevents users from editing structural elements (html, body, meta tags)
**Validation**: Click events only attach to elements with `[data-vibe-id]` attribute

---

### BR-2: Single Selection Constraint

**Rule**: Only one element can be selected at a time
**Rationale**: Simplifies UI and state management, reduces cognitive load
**Validation**: Selecting new element deselects previous (enforced in state update logic)

---

### BR-3: Properties by Element Type

**Rule**: Each element type has a predefined set of editable properties
**Rationale**: Prevents users from applying irrelevant properties (e.g., alt text on button)
**Validation**: Properties panel conditionally renders controls based on element.tagName

**Property Matrix**:

| Element Type | Editable Properties |
|--------------|---------------------|
| p, span | content, fontSize, color, fontWeight, fontStyle, textAlign |
| h1-h6 | content, fontSize, color, fontWeight, textAlign |
| img | src, alt, width, height, alignment (via container) |
| button | content, backgroundColor, color, borderRadius, fontSize |
| a | content, href, color, textDecoration |
| div, section, td | backgroundColor, padding |

---

### BR-4: AI Edit Scope

**Rule**: When element is selected, AI edits apply only to that element
**Rationale**: Preserve user's work on other parts of email
**Validation**: AI system prompt enforces element-specific edits, backend validation checks only selected element changed

---

### BR-5: ID Persistence

**Rule**: Unchanged elements must retain their `data-vibe-id` across AI regenerations
**Rationale**: Enables users to select, edit, ask AI to refine, and maintain context
**Validation**: AI system prompt explicitly instructs to preserve IDs, backend tests verify ID stability

---

### BR-6: Chat Mode vs Edit Mode

**Rule**: User is in "chat mode" when no element selected, "edit mode" when element selected
**Rationale**: Clear mental model for how prompts are interpreted
**Validation**: UI shows correct mode indicator, AI tools are invoked based on mode

---

## 8. Data Requirements

### Entity: SelectedElement

**Stored in**: Zustand store (extends `useEmailStore` or new `useEditorStore`)

**Attributes**:
- `selectedElementId`: string | null - The `data-vibe-id` of currently selected element
- `elementType`: string | null - HTML tag name (e.g., 'h1', 'button', 'img')
- `elementProperties`: ElementProperties | null - Current properties of selected element

**Relationships**: N/A (UI state only)

**Validation Rules**:
- `selectedElementId` must exist in current email HTML (if not null)
- `elementType` must be one of allowed types (p, h1-h6, img, button, a, div, section, span)

---

### Type: ElementProperties

**Definition** (TypeScript):

```typescript
interface ElementProperties {
  id: string; // data-vibe-id value
  tagName: string; // HTML tag (lowercase)
  attributes: Record<string, string>; // HTML attributes (src, href, alt, etc.)
  styles: Record<string, string>; // Inline styles (fontSize, color, etc.)
  textContent: string; // Inner text content (for text elements)
  innerHTML: string; // Full inner HTML (for containers)
}
```

**Validation**: Use Zod schema for type safety

---

### Entity: Email (Updated)

**Extends**: Existing `useEmailStore` state

**New Attributes**:
- No changes to existing fields (subject, jsxBody, htmlBody)
- All HTML in `htmlBody` now includes `data-vibe-id` attributes on editable elements

**Migration**: No data migration needed (new field is added by AI, not breaking change)

---

## 9. Integration Requirements

### INT-1: Iframe ↔ Parent Communication

**Type**: postMessage API (browser standard)

**Purpose**: Enable parent app to receive click events from iframe and send selection highlights

**Operations**:
- **Iframe → Parent**: Send click event with element's `data-vibe-id`
  - Message: `{ type: 'ELEMENT_CLICKED', vibeId: string }`
- **Parent → Iframe**: Send selection state (highlight element)
  - Message: `{ type: 'SELECT_ELEMENT', vibeId: string | null }`

**Error Handling**: If iframe fails to load or postMessage fails, show error toast to user

**Fallback**: N/A (feature requires iframe interaction, no fallback possible)

**Security**: Validate postMessage origin (must be same-origin)

---

### INT-2: AI Model API (Gemini 2.5 Flash)

**Type**: REST API (via AI SDK)

**Purpose**: Generate and modify email HTML with element IDs

**Operations**:
- **Existing**: `createEmailTool` - Generate new email HTML (already includes data-vibe-id instruction)
- **New**: `modifyEmailTool` - Modify specific element by ID
  - Input: `{ vibeId: string, currentHtml: string, prompt: string }`
  - Output: Updated HTML with only specified element changed

**Error Handling**:
- If AI fails to preserve IDs → show warning to user, regenerate email
- If AI modifies wrong elements → backend validation rejects response, show error

**SLA**: 95th percentile response time < 3 seconds

---

### INT-3: Email Store (Zustand)

**Type**: Internal state management

**Purpose**: Store email HTML and selected element state

**Operations**:
- **Read**: Get current email HTML, selected element ID
- **Write**: Update email HTML (after property edits), update selected element ID

**Reactivity**: All components re-render when store updates (Zustand built-in reactivity)

---

## 10. User Interface Requirements

### UI-1: Properties Panel

**Purpose**: Display and edit properties of selected element

**Layout**:
- **Header**: Element type (e.g., "Heading 1"), close button
- **Body**: Property controls (grouped by type: Content, Typography, Colors, Spacing)
- **Footer** (optional): "Apply" button (if not auto-apply), "Reset" button

**Responsive Behavior**:
- **Mobile**: Full-screen overlay (replaces entire chat area)
- **Tablet/Desktop**: Sidebar panel (replaces chat messages area, same width)

**Key Elements**:
- Close button (X icon, top-right corner)
- Element type badge (e.g., "Heading 1" with icon)
- Property groups (collapsible sections: Content, Typography, Colors, Spacing)
- Input controls (shadcn/ui components)

**User Flow**:
1. User selects element in preview
2. Panel slides in from right (or fades in)
3. User edits properties
4. Preview updates in real-time
5. User clicks X or selects another element → panel closes/updates

---

### UI-2: Selected Element Indicator

**Purpose**: Show which element is currently selected (in prompt textarea area)

**Layout**:
- **Position**: Above file upload button, below file sources (if any)
- **Content**: Badge with text "Editing: {element-type}" and X button

**Key Elements**:
- Badge component (shadcn/ui Badge, subtle variant)
- Element type label (e.g., "Heading 1", "Button")
- Close button (X icon)

**User Flow**:
1. User selects element → badge appears
2. User sees context while typing prompt
3. User clicks X → element deselects, badge disappears

---

### UI-3: Email Preview (Enhanced)

**Purpose**: Display email with click-to-select functionality

**Layout**:
- **Unchanged**: Email displays in iframe, responsive sizing (desktop/mobile toggle)
- **Enhanced**: Click events trigger element selection

**Key Enhancements**:
- Hover state: Element outlines appear on hover (subtle, 1px dashed border, gray)
- Selected state: Element has 2px solid border (primary color)
- Cursor: Changes to pointer on hoverable elements

**User Flow**:
1. User hovers over element → subtle outline appears
2. User clicks element → solid border appears, properties panel opens
3. User edits properties → changes appear in preview immediately
4. User clicks another element → previous selection deselects, new one selects

---

### UI-4: Mode Indicator (Optional Enhancement)

**Purpose**: Clarify whether user is in chat mode or edit mode

**Layout**:
- **Position**: Top of chat/properties panel area (or in prompt textarea header)
- **Content**: Tab-like toggle or badge

**Key Elements**:
- "Chat Mode" label (active when no element selected)
- "Edit Mode" label (active when element selected)

**User Flow**:
1. User sees "Chat Mode" by default
2. User selects element → indicator changes to "Edit Mode"
3. User deselects element → indicator returns to "Chat Mode"

**Note**: This is optional (P1 priority), as selected element indicator may provide sufficient clarity

---

## 11. Risk Assessment

### Risk 1: Iframe Click Event Handling Complexity

**Category**: Technical
**Severity**: High
**Likelihood**: Medium

**Impact**:
- Nested elements may cause wrong element to be selected (event bubbling)
- Click events may not propagate correctly from iframe to parent
- Performance issues with event listeners on many elements

**Mitigation Strategy**:
- Use event delegation (single listener on iframe document, not per element)
- Use `event.target` (deepest element) for selection, not `event.currentTarget`
- Test thoroughly with deeply nested email structures
- Implement click event throttling (prevent multiple rapid clicks)

**Contingency Plan**:
- If event delegation fails, fall back to attaching listeners per element (higher memory cost)
- If performance is poor, limit selectable element types (only top-level elements)

**Owner**: nextjs-builder agent (technical implementation)

---

### Risk 2: AI Fails to Preserve Element IDs

**Category**: Technical
**Severity**: Critical
**Likelihood**: Medium

**Impact**:
- User selects element, asks AI to modify it → AI regenerates entire email
- All element IDs change → selected element is lost
- User loses context, must re-select element

**Mitigation Strategy**:
- Emphasize ID preservation in AI system prompt (multiple times, bold, caps)
- Provide AI with examples of correct behavior (few-shot learning)
- Backend validation: Check that unchanged elements kept same IDs, reject response if not
- Implement ID recovery logic: Try to match elements by content/position if ID changes

**Contingency Plan**:
- If AI consistently fails, implement client-side ID injection (add IDs after AI response)
- If recovery fails, show warning to user and deselect element

**Owner**: ai-sdk-expert agent (AI integration)

---

### Risk 3: Properties Panel State Management Complexity

**Category**: Technical
**Severity**: Medium
**Likelihood**: High

**Impact**:
- State synchronization issues between properties panel, iframe preview, and store
- Race conditions: User edits property, AI modifies same element simultaneously
- Stale data: Properties panel shows old values after AI updates email

**Mitigation Strategy**:
- Use single source of truth: Zustand store for selected element state
- Parse element properties from HTML on every selection (don't cache)
- Debounce user input updates (300ms for text, immediate for others)
- Lock properties panel during AI request (disable inputs, show loading state)

**Contingency Plan**:
- If state sync fails, force re-render of properties panel (re-parse from HTML)
- If race conditions persist, implement optimistic updates with rollback

**Owner**: nextjs-builder agent, parent agent

---

### Risk 4: HTML Parsing Performance

**Category**: Technical
**Severity**: Medium
**Likelihood**: Low

**Impact**:
- Large email HTML (> 100KB) causes slow parsing
- UI freezes when selecting elements or updating properties
- Poor user experience, feels laggy

**Mitigation Strategy**:
- Use DOMParser (browser native, optimized)
- Limit email HTML size (warn user if > 100KB)
- Profile parsing performance with realistic email sizes
- Optimize: Cache parsed DOM, only re-parse when HTML changes

**Contingency Plan**:
- If parsing is slow, show loading spinner during parse (< 200ms acceptable)
- If consistently slow, consider Web Worker for parsing (off main thread)

**Owner**: nextjs-builder agent (performance optimization)

---

### Risk 5: User Breaks Email Structure

**Category**: User Behavior
**Severity**: Medium
**Likelihood**: Low

**Impact**:
- User deletes required text content (e.g., unsubscribe link)
- User sets invalid CSS values (e.g., negative dimensions)
- Email renders incorrectly or violates email client guidelines

**Mitigation Strategy**:
- Input validation: Enforce min/max values (e.g., font size: 8-72px)
- Required content warnings: Show warning if user deletes critical elements
- Preview validation: Check email renders correctly before allowing send
- Undo/redo (future): Allow users to revert mistakes

**Contingency Plan**:
- If email is broken, show validation errors with suggestions to fix
- Provide "Reset to last valid state" button

**Owner**: ux-ui-designer agent (validation rules), nextjs-builder agent (implementation)

---

### Risk 6: Browser Compatibility

**Category**: Technical
**Severity**: Low
**Likelihood**: Low

**Impact**:
- Older browsers don't support DOMParser, postMessage, or CSS features
- Feature doesn't work on Safari, Firefox, or mobile browsers
- Users on unsupported browsers have degraded experience

**Mitigation Strategy**:
- Test on major browsers: Chrome, Firefox, Safari, Edge (desktop + mobile)
- Use polyfills for missing features (if available)
- Feature detection: Show warning if browser unsupported
- Graceful degradation: Fall back to chat-only mode if visual editing fails

**Contingency Plan**:
- If browser compatibility is poor, document supported browsers
- If critical browsers fail, prioritize fixes for those browsers

**Owner**: nextjs-builder agent (cross-browser testing)

---

### Risk 7: Security: XSS via User Input

**Category**: Security
**Severity**: Critical
**Likelihood**: Low

**Impact**:
- User injects malicious HTML/JS via property inputs
- XSS attack steals user data, session tokens, or performs actions as user
- Reputation damage, legal liability

**Mitigation Strategy**:
- Sanitize ALL user inputs before inserting into HTML
- Use DOMPurify or similar library to remove dangerous tags/attributes
- Escape HTML special characters (<, >, &, ", ')
- Validate URLs (no `javascript:`, `data:`, or other dangerous schemes)
- Content Security Policy (CSP) headers to prevent inline scripts

**Contingency Plan**:
- If XSS vulnerability found, immediately patch and deploy fix
- Notify affected users, force password reset if needed

**Owner**: code-reviewer agent (security audit), nextjs-builder agent (implementation)

---

## 12. Success Metrics (KPIs)

### User Adoption

**Metric**: Percentage of users who use visual editing vs chat-only
**Target**: 60% of users use visual editing within 30 days of launch
**Measurement**: Track events: `element_selected`, `property_edited`
**Rationale**: Feature is valuable if majority of users prefer it over chat

---

### Editing Efficiency

**Metric**: Time to complete common editing tasks (change button color, update heading text)
**Target**: 50% reduction in task completion time vs chat-only (baseline: 30s → target: 15s)
**Measurement**: User testing (task completion time), analytics (time between generation and final state)
**Rationale**: Visual editing should be faster than describing edits in chat

---

### User Satisfaction

**Metric**: User satisfaction score (CSAT) for editing workflow
**Target**: CSAT ≥ 4.5/5
**Measurement**: Post-task survey: "How satisfied are you with the email editing experience?"
**Rationale**: High satisfaction indicates feature meets user needs

---

### Error Rate

**Metric**: Percentage of editing sessions with errors (element not selected, property not applied, AI failed to modify)
**Target**: < 5% of sessions have errors
**Measurement**: Track error events: `selection_failed`, `property_update_failed`, `ai_edit_failed`
**Rationale**: Low error rate indicates robust implementation

---

### Feature Usage Depth

**Metric**: Average number of properties edited per selected element
**Target**: ≥ 2 properties edited per element (indicates users explore full functionality)
**Measurement**: Analytics: count property changes per `element_selected` event
**Rationale**: Users engaging deeply with properties panel understand its value

---

## 13. Implementation Phases

### Phase 1: MVP - Core Visual Editing (P0 Features)

**Timeline**: 2-3 weeks

**Includes**:
- ✅ Click-to-select elements in iframe
- ✅ Visual highlight on selected element
- ✅ Properties panel (replaces chat messages)
- ✅ Edit text content, font size, color, alignment
- ✅ Edit image URL, alt text, dimensions
- ✅ Edit button text, colors, border radius
- ✅ Selected element indicator in prompt textarea
- ✅ AI integration: Modify selected element via prompt
- ✅ Element ID system (`data-vibe-id` generation and preservation)

**Success Criteria**:
- Users can select any text, image, or button element
- Users can edit core properties in properties panel
- Changes apply to preview in real-time
- AI understands and modifies selected element only

**Deliverables**:
- `PreviewerEmail` component with click handlers
- `PropertiesPanel` component (organism)
- `ElementEditor` components (molecules: TextEditor, ImageEditor, ButtonEditor)
- `useEditorStore` Zustand store (selected element state)
- `email-parser.ts` utility (parse/update element by ID)
- Updated `modifyEmailTool` in AI tools
- Unit tests for element parsing and updating
- E2E tests for selection and editing flow

---

### Phase 2: Enhanced UX (P1 Features)

**Timeline**: 1-2 weeks

**Includes**:
- Edit container properties (background color, padding)
- Hover state (subtle outline on hoverable elements)
- Mode indicator (Chat Mode / Edit Mode toggle)
- Improved validation (inline error messages, input constraints)
- Keyboard shortcuts (Tab to navigate elements, Enter to select, Escape to deselect)
- Accessibility improvements (ARIA labels, screen reader announcements)

**Success Criteria**:
- All element types are editable (including containers)
- Users discover editable elements via hover
- Mode transitions are clear and intuitive
- Feature is keyboard-accessible

---

### Phase 3: Advanced Features (P2/P3 - Future Enhancements)

**Timeline**: Future sprints

**Includes**:
- Undo/redo functionality
- Element presets (save/load styles)
- Advanced CSS editing (custom properties)
- HTML inspector (view/edit raw HTML)
- Drag-and-drop element reordering
- Add/delete elements
- Multi-select elements
- Responsive editing (different properties per device size)

**Success Criteria**: TBD based on user feedback from MVP

---

## 14. Open Questions

- [ ] **Q1**: Should property changes auto-apply or require "Apply" button?
  - **Owner**: ux-ui-designer agent
  - **Due**: Before Phase 1 implementation
  - **Recommendation**: Auto-apply for better UX (user expects real-time editing)

- [ ] **Q2**: How to handle undo/redo? Browser undo or custom implementation?
  - **Owner**: nextjs-builder agent
  - **Due**: Before Phase 2
  - **Recommendation**: Phase 1 uses browser undo (for text inputs), Phase 3 adds custom undo/redo

- [ ] **Q3**: Should we show element hierarchy (parent/child relationships) in properties panel?
  - **Owner**: ux-ui-designer agent
  - **Due**: Before Phase 2
  - **Recommendation**: Not in MVP (adds complexity), consider for Phase 3 advanced mode

- [ ] **Q4**: How to handle email templates with dynamic content (merge tags, variables)?
  - **Owner**: business-analyst agent (this doc)
  - **Due**: Before Phase 1
  - **Recommendation**: Out of scope for MVP (treat merge tags as static text), address in future phases

- [ ] **Q5**: Should AI auto-select element after generating/modifying it?
  - **Owner**: ux-ui-designer agent
  - **Due**: Before Phase 1
  - **Recommendation**: Yes, auto-select modified element (provides context for further edits)

- [ ] **Q6**: How to handle elements that are duplicates (e.g., multiple buttons with same style)?
  - **Owner**: ux-ui-designer agent
  - **Due**: Before Phase 1
  - **Recommendation**: Each element has unique ID, user selects specific instance (no bulk editing in MVP)

- [ ] **Q7**: Should we limit which element types are selectable (e.g., exclude div, only allow semantic elements)?
  - **Owner**: business-analyst agent, ux-ui-designer agent
  - **Due**: Before Phase 1
  - **Recommendation**: Allow all elements with `data-vibe-id` (AI decides which elements get IDs based on editability)

---

## 15. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Iframe allows same-origin scripts | ⏳ Pending | Test postMessage in dev environment | TBD |
| Users prefer visual editing over chat for simple edits | ⏳ Pending | User interviews, prototype testing | TBD |
| AI can reliably preserve element IDs | ⏳ Pending | Test AI responses with ID preservation prompts | TBD |
| HTML parsing is performant (< 10ms for 50KB HTML) | ⏳ Pending | Performance benchmarking with DOMParser | TBD |
| Properties panel fits in chat messages space | ⏳ Pending | UX mockup, measure dimensions | TBD |

---

## 16. Glossary

**Element**: An HTML element in the email preview (e.g., heading, button, image)

**Selectable Element**: An element with `data-vibe-id` attribute that can be selected for editing

**Properties Panel**: UI panel that displays editable properties of selected element

**Selected Element Indicator**: Badge in prompt textarea showing currently selected element

**data-vibe-id**: Custom HTML attribute used to uniquely identify editable elements (format: `vibe-{type}-{uuid}`)

**Chat Mode**: UI state when no element is selected, prompts generate new emails or make broad changes

**Edit Mode**: UI state when element is selected, prompts modify only that element

**Element Properties**: Attributes, styles, and content of an HTML element (text, colors, sizes, etc.)

**Real-time Preview**: Email preview updates immediately as user edits properties (no explicit "Apply" step)

**AI Tool**: Server-side function invoked by AI SDK to perform actions (e.g., `createEmailTool`, `modifyEmailTool`)

**Zustand Store**: Client-side state management library used for UI state (selected element, email HTML)

**React Email**: Library for building email templates with React components (AI generates code using this)

---

## 17. References

**Related Documents**:
- Session context: `.claude/tasks/context_session_visual-edits-20251204.md`
- Critical constraints: `.claude/knowledge/critical-constraints.md`
- Architecture patterns: `.claude/knowledge/architecture-patterns.md`

**Technical Specs**:
- Next.js 15: https://nextjs.org/docs
- React 19: https://react.dev/
- Zustand: https://zustand-demo.pmnd.rs/
- shadcn/ui: https://ui.shadcn.com/
- AI SDK: https://sdk.vercel.ai/docs
- React Email: https://react.email/docs/introduction

**Existing Implementation**:
- Email store: `/src/stores/email.store.ts`
- Email preview: `/src/components/organisms/previewer-email.tsx`
- Chat component: `/src/components/organisms/chat.tsx`
- Prompt textarea: `/src/components/molecules/prompt-textarea.tsx`
- AI tools: `/src/ai/tools.ts`

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | TBD | Pending | |
| Technical Lead | TBD | Pending | |
| UX Designer | TBD | Pending | |

---

## 19. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-04 | business-analyst | Initial requirements document created |

---

## Next Steps

**For Parent Agent**:
1. Review this requirements document
2. Invoke specialized agents for detailed planning:
   - **ux-ui-designer**: Design properties panel UI, element selection interaction patterns
   - **shadcn-builder**: Select shadcn/ui components for properties panel controls
   - **ai-sdk-expert**: Design AI prompt augmentation strategy, `modifyEmailTool` implementation
   - **nextjs-builder**: Create technical implementation plan (component architecture, state management, iframe integration)
3. Parent agent executes implementation plans step-by-step
4. Code-reviewer agent reviews implementation for quality and security

**For Stakeholders**:
1. Review this document for accuracy and completeness
2. Approve or request changes to scope, priorities, or requirements
3. Answer open questions (Section 14)
4. Validate assumptions (Section 15)

---

**Document Status**: ✅ Ready for Review
