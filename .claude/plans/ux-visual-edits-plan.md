# Visual Edits Feature - UX/UI Design Plan

**Created**: 2025-12-04
**Session**: visual-edits-20251204
**Complexity**: High
**User Impact**: Critical - Core feature enabling direct manipulation

## 1. User Context

### User Goals
- **Primary Goal**: Visually select and edit email elements without writing prompts
- **Secondary Goals**:
  - Quickly tweak text, colors, images, and styling
  - See real-time preview of changes
  - Combine visual edits with AI chat for complex modifications
  - Understand which element is currently selected
- **Success Criteria**:
  - User can select any editable element in one click
  - Selected element is clearly highlighted
  - Properties panel shows relevant edit options
  - Changes preview instantly in the iframe
  - User can switch between chat and edit modes seamlessly

### User Personas
- **Primary**: Marketing professionals creating email campaigns
- **Context**: After generating initial email, need to make precise adjustments (color tweaks, text changes, image swaps)
- **Pain Points**:
  - Describing changes in text is slow and ambiguous
  - Want direct manipulation like in design tools (Figma, Canva)
  - Need to see exactly what they're editing
  - Current chat-only interface requires too many back-and-forth iterations

### User Journey
1. **Email Generated** → User reviews in preview → Wants to change button color
2. **Hovers over button** → Subtle highlight appears → User understands it's selectable
3. **Clicks button** → Button gets bold highlight → Properties panel replaces chat area
4. **Sees "Button Properties"** → Edits background color → Change reflects immediately
5. **Wants to edit text** → Clicks text element → Properties update → Edits content
6. **Done editing** → Clicks outside or close button → Returns to chat mode → Can continue with AI

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Email preview with selected element (main focus)
2. **Secondary**: Properties panel with edit controls (active when element selected)
3. **Tertiary**: Selected element indicator above prompt (context awareness)

### Layout Strategy
- **Structure**:
  - Left side: Email preview (iframe) with selectable elements
  - Right side: Properties panel (replaces Conversation component when active)
  - Bottom: Prompt area with selected element indicator
- **Grid**: Existing two-column layout maintained
- **Spacing**: Properties panel uses same container as chat messages
- **Mode States**:
  - **Chat Mode**: Conversation component visible, standard prompt textarea
  - **Edit Mode**: Properties panel visible, prompt shows selected element, can still send chat messages

### Visual Hierarchy
- **Focal Point**: Selected element in preview (most prominent visual)
- **Visual Flow**:
  1. Eye goes to highlighted element in preview
  2. Natural flow to properties panel on right
  3. Glance down to see selected element context in prompt area
- **Grouping**:
  - Properties grouped by category (Content, Style, Layout)
  - Related controls clustered together
- **Contrast**: High contrast border on selected element, clear visual separation

### Breakpoints & Responsive Strategy
- **Mobile (< 640px)**:
  - Visual editing DISABLED (too complex for small screens)
  - Show message: "Visual editing available on tablet and desktop"
  - Chat mode only
- **Tablet (640px - 1024px)**:
  - Split view: Preview on left (60%), Properties on right (40%)
  - Properties panel slides in from right when element selected
  - Can toggle between full preview and split view
- **Desktop (> 1024px)**:
  - Full split view: Preview (65%), Properties (35%)
  - Properties panel fixed position
  - Optimal experience

## 3. Interaction Design

### Element Selection in Preview

#### Hover States (Selectability Indicator)
- **Visual**:
  - Thin dashed outline appears (2px, --color-primary with 0.5 opacity)
  - Cursor changes to pointer
  - Subtle background overlay (rgba(0,0,0,0.02))
- **Timing**: Instant on hover, no delay
- **Elements**: All editable elements (headings, paragraphs, buttons, images, links, divs with content)
- **Non-editable**: Body, html, meta tags (no hover effect)

#### Selected State (Active Element)
- **Visual**:
  - Solid border (3px, --color-primary)
  - Slight shadow/glow effect for depth
  - Element scrolls into view if partially hidden
  - Border animates in smoothly (150ms ease-out)
- **Behavior**:
  - Clicking selected element again does NOT deselect (keeps it active)
  - Clicking different element switches selection
  - Clicking outside iframe or "Done" button exits edit mode
- **Persistence**: Selection persists until user clicks outside or closes panel

#### Click Behavior
- **Single Click**: Selects element and opens properties panel
- **Outside Click**: Deselects and closes properties panel
- **Iframe Scroll**: Selection border stays attached to element
- **Element Removed**: If element deleted via AI, panel closes automatically

### Properties Panel (Replaces Conversation)

#### Panel Structure
- **Header**:
  - Element type badge (e.g., "Button", "Heading", "Image")
  - Close button (X) to exit edit mode
  - Element path breadcrumb (e.g., "Body > Section > Button")
- **Content**: Scrollable area with property groups
- **Footer**:
  - "Apply Changes" button (primary action)
  - "Cancel" button (reverts changes)

#### Property Organization (Tabs)
Use **Tabs** component (to be added via shadcn-builder) with 3 tabs:

1. **Content Tab** (Default):
   - Text content (for text elements)
   - Image source (for images)
   - Link URL (for links and buttons)
   - Alt text (for images)

2. **Style Tab**:
   - Colors: Background, Text, Border
   - Typography: Font size, Font weight, Line height, Text align
   - Spacing: Padding, Margin
   - Border: Width, Style, Radius

3. **Layout Tab**:
   - Width, Height
   - Display properties
   - Position (if needed)
   - Alignment

#### Property Controls by Element Type

**Text Elements (h1, h2, h3, p, span)**:
- Content: Textarea for text editing
- Style: Color picker, font size slider, text align buttons
- Layout: Width, alignment

**Button Elements**:
- Content: Button text, Link URL
- Style: Background color, text color, border color, border radius
- Layout: Padding, width

**Image Elements**:
- Content: Image URL input, Alt text, File upload button
- Style: Border radius, border color
- Layout: Width, height, object-fit

**Link Elements**:
- Content: Link text, URL
- Style: Color, text decoration
- Layout: Display type

### Selected Element Indicator (Prompt Area)

#### Location
Above the file upload area in PromptTextarea component, similar to how file sources are shown.

#### Visual Design
```
┌────────────────────────────────────────┐
│  [Icon] Editing: Button "Get Started" │  [✕]
│  Body > Section > Button               │
└────────────────────────────────────────┘
```

- **Background**: Light background (--color-muted)
- **Border**: Subtle border
- **Icon**: Element type icon (Type icon for text, Image icon for images, etc.)
- **Text**: "Editing: {element-type} {preview-text}"
- **Breadcrumb**: Parent path shown below in smaller text
- **Close**: X button to deselect

#### Behavior
- Appears when element selected
- Dismissible via X button
- Clicking indicator scrolls to element in preview (if out of view)
- Updates when different element selected

### Mode Switching (Chat ↔ Edit)

#### Automatic Mode Detection
- **Edit Mode Triggered**: When user clicks element in preview
- **Chat Mode Triggered**: When user closes properties panel or clicks outside

#### Visual Transitions
- **Chat → Edit**:
  - Conversation component fades out (200ms)
  - Properties panel fades in (200ms) with slight slide from right
  - Selected element indicator slides down into view
- **Edit → Chat**:
  - Properties panel fades out (200ms)
  - Conversation component fades in (200ms)
  - Selected element indicator slides up and disappears

#### Prompt Behavior in Edit Mode
- Prompt textarea remains functional
- User can type: "Make this button larger" (context: current selection)
- AI understands selected element context
- Send button works normally

### Micro-interactions

#### Hover Effects
- **Element in Preview**: Dashed outline + pointer cursor (instant)
- **Property Controls**: Standard shadcn hover states
- **Tabs**: Background change on hover

#### Focus States
- **Keyboard Navigation**: Tab through property controls
- **Focus Ring**: Visible ring-2 ring-primary on all inputs
- **Tab Selection**: Arrow keys to switch between tabs

#### Loading States
- **Applying Changes**:
  - "Apply" button shows spinner
  - Properties panel disabled (opacity 0.6)
  - Selected element border pulses
- **AI Processing Edit**: Standard "Thinking..." message below prompt

#### Transitions
- **Element Selection**: Border animates in (150ms ease-out)
- **Panel Appearance**: Slide + fade (200ms ease-out)
- **Property Changes**: Preview updates immediately (optimistic)
- **Color Picker**: Smooth color transitions

#### Success/Error Feedback
- **Changes Applied**:
  - Brief success message toast: "Changes applied"
  - Border briefly flashes green
- **Invalid Edit**:
  - Toast error: "Cannot apply changes. {reason}"
  - Input shows red border
  - Error message below input

## 4. Component Selection

### shadcn/ui Components Needed

**Note**: Coordinate with shadcn-builder agent for implementation

1. **Tabs**: For Content/Style/Layout organization in properties panel
2. **Input**: Text inputs for URLs, alt text, etc.
3. **Textarea**: For text content editing
4. **Select**: Dropdown for font weight, text align, display properties
5. **Slider**: Font size, border radius, padding/margin controls
6. **Button**: Apply, Cancel, Close actions
7. **Label**: Form labels for all inputs
8. **Separator**: Visual dividers between property groups
9. **Badge**: Element type indicator
10. **Tooltip**: Help text for property controls
11. **ScrollArea**: Scrollable properties panel content
12. **Popover**: Color picker popover
13. **Toast**: Success/error feedback (sonner already installed)

### Custom Components Needed

1. **PropertyPanel** (organism): Main container replacing Conversation
   - Manages tabs, property rendering, apply/cancel logic

2. **ElementSelector** (molecule): Indicator above prompt
   - Shows selected element context
   - Dismissible

3. **ColorPicker** (molecule): Color selection control
   - Uses Popover + color input
   - Shows color preview

4. **PropertyGroup** (molecule): Reusable property section
   - Groups related controls with label

5. **ElementHighlight** (utility): Manages hover/selection borders in iframe
   - Injects styles into iframe document
   - Handles click events

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/components/organisms/property-panel.text-map.ts` (NEW)

**Keys to Define**:
```typescript
export const PROPERTY_PANEL_TEXT = {
  header: {
    title: 'Element Properties',
    close: 'Close properties panel',
  },
  tabs: {
    content: 'Content',
    style: 'Style',
    layout: 'Layout',
  },
  actions: {
    apply: 'Apply Changes',
    cancel: 'Cancel',
    applying: 'Applying...',
  },
  properties: {
    // Content properties
    textContent: 'Text Content',
    imageUrl: 'Image URL',
    linkUrl: 'Link URL',
    altText: 'Alt Text',
    uploadImage: 'Upload Image',

    // Style properties
    backgroundColor: 'Background Color',
    textColor: 'Text Color',
    borderColor: 'Border Color',
    fontSize: 'Font Size',
    fontWeight: 'Font Weight',
    textAlign: 'Text Align',
    borderRadius: 'Border Radius',
    borderWidth: 'Border Width',
    padding: 'Padding',
    margin: 'Margin',

    // Layout properties
    width: 'Width',
    height: 'Height',
    display: 'Display',
    alignment: 'Alignment',
  },
  elementTypes: {
    button: 'Button',
    heading: 'Heading',
    paragraph: 'Paragraph',
    image: 'Image',
    link: 'Link',
    div: 'Container',
    section: 'Section',
  },
  feedback: {
    success: 'Changes applied successfully',
    error: 'Failed to apply changes',
    invalidValue: 'Invalid value',
    required: 'This field is required',
  },
  placeholder: {
    textContent: 'Enter text content...',
    url: 'https://example.com',
    altText: 'Describe the image...',
    color: '#000000',
  },
  help: {
    backgroundColor: 'Background color of the element',
    borderRadius: 'Rounds the corners (0-50px)',
    padding: 'Inner spacing',
    margin: 'Outer spacing',
  },
  emptyState: {
    noSelection: 'No element selected',
    selectElement: 'Click an element in the preview to edit its properties',
  },
  mobileDisabled: {
    title: 'Visual editing unavailable',
    message: 'Visual editing is available on tablet and desktop devices only. Please use a larger screen or continue using chat mode.',
  },
} as const;
```

**Text Map**: `src/components/molecules/element-selector.text-map.ts` (NEW)

```typescript
export const ELEMENT_SELECTOR_TEXT = {
  label: 'Editing',
  close: 'Deselect element',
  elementPath: 'Element path',
} as const;
```

**Tone**: Clear, technical but approachable
**Voice**: Active, imperative (buttons), descriptive (labels)

### Microcopy

- **Empty States**: "Click an element in the preview to edit" (encouraging)
- **Error States**: Specific messages per error type (validation, structure, AI)
- **Success States**: "Changes applied" (brief confirmation)
- **Loading States**: "Applying changes..." (progress indication)
- **Help Text**: Tooltips for complex properties

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - Properties panel as `<aside role="complementary">`
  - Element selector as informative region
  - Tabs as proper tablist
- **Headings**:
  - h2: "Element Properties"
  - h3: Property group names (if used)
- **Lists**: Property groups could use definition lists (dl/dt/dd)

### Keyboard Navigation

#### Tab Order
1. Email preview (focusable for keyboard selection)
2. Properties panel tabs (arrow keys to switch)
3. Property controls (inputs, selects, sliders)
4. Apply/Cancel buttons
5. Close button (panel header)
6. Prompt textarea

#### Shortcuts
- **Tab**: Navigate through controls
- **Arrow Keys**:
  - Left/Right: Switch tabs
  - Up/Down: Increment/decrement slider values
- **Enter**: Apply changes (when in properties panel)
- **Escape**: Close properties panel, deselect element
- **Space**: Activate buttons

#### Focus Management
- **Element Selected**: Focus moves to first input in Content tab
- **Tab Switch**: Focus moves to first control in new tab
- **Panel Closed**: Focus returns to preview or last focused element
- **Changes Applied**: Focus returns to prompt textarea

### Screen Reader Experience

#### ARIA Labels
- **Properties Panel**: `aria-label="Element properties panel"`
- **Tabs**: Standard tablist/tab/tabpanel ARIA
- **Element Selector**: `aria-label="Currently editing {element-type}"`
- **Close Buttons**: `aria-label="Close properties panel"`
- **Color Pickers**: `aria-label="{property-name} color picker"`

#### ARIA Descriptions
- **Property Inputs**: `aria-describedby` linking to help text
- **Element Path**: `aria-label="Element location: {breadcrumb}"`

#### Live Regions
- **Changes Applied**: `aria-live="polite"` announces success
- **Validation Errors**: `aria-live="assertive"` announces errors immediately
- **Element Selection**: Announce "Selected {element-type}, properties panel opened"

#### Hidden Content
- **Visual-only indicators**: Screen reader text alternatives
- **Breadcrumb separators**: aria-hidden="true"

### Visual Accessibility

#### Color Contrast
- **Selected Border**: High contrast against all backgrounds (use outline + background)
- **Panel Text**: 4.5:1 minimum against background
- **Input Labels**: 4.5:1 contrast
- **Disabled States**: 3:1 contrast (WCAG exception)

#### Color Independence
- **Selection**: Border + label (not color only)
- **Validation**: Icon + message + border (not color only)
- **Element Types**: Icon + text badge

#### Text Size
- **Panel Labels**: 14px minimum
- **Help Text**: 12px minimum (with good contrast)
- **Breadcrumb**: 12px acceptable (secondary info)

#### Touch Targets
- **Tabs**: 44px minimum height
- **Close Button**: 44x44px
- **Apply/Cancel**: 44px height minimum
- **Property Controls**: Adequate spacing between

#### Motion
- **prefers-reduced-motion**:
  - Disable slide animations
  - Disable border animations
  - Keep instant transitions
  - Keep fade transitions (less jarring)

## 7. Responsive Design

### Mobile (< 640px)
- **Visual Editing**: DISABLED
- **Fallback UI**:
  - Message overlaying preview: "Visual editing available on larger screens"
  - Chat mode remains fully functional
  - Can still use AI chat to make edits
- **Reason**: Properties panel too complex for mobile, preview too small to accurately select elements

### Tablet (640px - 1024px)
- **Layout**: Split view with collapsible properties panel
- **Preview**: 60% width when panel open, 100% when closed
- **Properties Panel**:
  - 40% width, slides in from right
  - Overlay mode possible (covers preview partially)
  - Scrollable content
- **Element Selection**: Slightly larger touch targets (48x48px min)
- **Tabs**: Horizontal, full width
- **Property Controls**: Stacked vertically, larger inputs

### Desktop (> 1024px)
- **Layout**: Fixed split view
- **Preview**: 65% width
- **Properties Panel**: 35% width, fixed position
- **Element Selection**: Precise mouse interaction
- **Hover States**: Fully visible and responsive
- **Tabs**: Compact, side-by-side
- **Property Controls**: Optimal sizing, some side-by-side
- **Additional Features**:
  - Tooltips on property help icons
  - Color picker popover more spacious

## 8. States & Feedback

### Loading States

#### Initial Page Load
- Preview loads first
- Element selection enabled after iframe ready

#### Applying Changes
- "Apply" button shows spinner
- Properties panel inputs disabled (opacity 0.6)
- Selected element border pulses slowly
- User can cancel to stop

#### AI Processing (if using chat during edit)
- Standard "Thinking..." indicator below prompt
- Properties panel remains open
- User can continue editing other properties

### Error States

#### Validation Errors
- **Invalid Color**: "Please enter a valid color (hex or color name)"
- **Invalid URL**: "Please enter a valid URL"
- **Required Field**: "This field is required"
- **Visual**: Red border, error icon, message below input

#### Structure Errors
- **Element Removed**: "Selected element no longer exists. Panel closed."
- **HTML Invalid**: "Cannot apply changes. This would create invalid HTML."
- **Visual**: Toast notification, panel closes

#### System Errors
- **Apply Failed**: "Failed to apply changes. Please try again."
- **Iframe Communication Error**: "Cannot connect to preview. Please refresh."
- **Visual**: Toast notification, properties remain editable (can retry)

### Empty States

#### No Element Selected
- Properties panel shows:
  - Icon (mouse pointer clicking square)
  - "No element selected"
  - "Click an element in the preview to edit its properties"
- Panel remains closed until selection made

#### No Email Generated
- Visual editing not available
- Standard empty state: "Generate an email to start editing"

### Success States

#### Changes Applied
- Brief toast: "Changes applied"
- Selected element border briefly pulses green (500ms)
- Properties panel remains open (user might make more edits)
- Focus returns to first input (ready for next edit)

#### Element Deselected
- Properties panel slides out smoothly
- Selected element indicator fades away
- Focus returns to prompt textarea
- User back in chat mode

## 9. User Flow Diagram

```
[Email Generated & Displayed]
    ↓
[User Hovers Element in Preview]
    ↓
[Dashed Outline Appears] (hover state)
    ↓
[User Clicks Element]
    ↓
[Element Gets Solid Border + Selection] ──→ [Screen Reader Announces Selection]
    ↓
[Conversation Fades Out]
    ↓
[Properties Panel Slides In from Right] ──→ [Focus Moves to First Input]
    ↓
[Element Selector Appears Above Prompt]
    ↓
[User Sees "Content" Tab Active]
    ↓
[User Edits Text Content] ──→ [Preview Updates in Real-time (optimistic)]
    ↓
[User Switches to "Style" Tab] ──→ [Arrow Keys to Navigate]
    ↓
[User Changes Background Color] ──→ [Opens Color Picker Popover]
    ↓
[User Clicks "Apply Changes"]
    ↓
[Apply Button Shows Spinner]
    ↓
[Changes Sent to AI/Store] ──→ [HTML Updated]
    ↓
[Success Toast Appears] ──→ [Screen Reader Announces Success]
    ↓
[Properties Panel Remains Open]
    ↓
[User Can:]
    → [Edit Same Element Again]
    → [Click Different Element] → [Panel Updates with New Properties]
    → [Click Close/Outside] → [Exit Edit Mode] → [Back to Chat]
    → [Type in Prompt] → [Send Message with Context]
```

### Alternative Flow: Error Handling

```
[User Applies Changes]
    ↓
[Validation Error Detected]
    ↓
[Error Message Appears Below Input] ──→ [Screen Reader Announces Error]
    ↓
[Input Gets Red Border + Error Icon]
    ↓
[User Corrects Value]
    ↓
[Error Clears Automatically]
    ↓
[User Clicks Apply Again] → [Success]
```

## 10. Design Specifications

### Spacing Scale

#### Property Panel
- **Panel Padding**: `p-6` (24px)
- **Section Spacing**: `space-y-6` (24px between groups)
- **Input Spacing**: `space-y-3` (12px between inputs)
- **Tabs Margin**: `mb-4` (16px below tabs)

#### Element Selection
- **Selector Padding**: `p-3` (12px inside)
- **Selector Margin**: `mb-2` (8px below indicator, above file uploads)
- **Border Width Selected**: `3px` solid
- **Border Width Hover**: `2px` dashed

#### Responsive Spacing
- **Mobile**: Not applicable (disabled)
- **Tablet**: `p-4` (16px panel padding)
- **Desktop**: `p-6` (24px panel padding)

### Typography

#### Property Panel
- **Panel Title**: `text-lg font-semibold` (18px, 600 weight)
- **Tab Labels**: `text-sm font-medium` (14px, 500 weight)
- **Property Labels**: `text-sm font-medium` (14px, 500 weight)
- **Help Text**: `text-xs text-muted-foreground` (12px, muted)
- **Validation Errors**: `text-xs text-destructive` (12px, red)

#### Element Selector
- **Label "Editing"**: `text-xs font-medium text-muted-foreground` (12px, 500 weight)
- **Element Name**: `text-sm font-semibold` (14px, 600 weight)
- **Breadcrumb**: `text-xs text-muted-foreground` (12px, muted)

### Color Usage

#### Selection States
- **Hover Border**: `hsl(var(--primary) / 0.5)` dashed
- **Selected Border**: `hsl(var(--primary))` solid
- **Selected Background Overlay**: `rgba(var(--primary-rgb) / 0.05)`

#### Property Panel
- **Background**: `hsl(var(--background))`
- **Border**: `hsl(var(--border))`
- **Tab Active**: `hsl(var(--background))`
- **Tab Inactive**: `hsl(var(--muted))`

#### Element Selector
- **Background**: `hsl(var(--muted))`
- **Border**: `hsl(var(--border))`
- **Text**: `hsl(var(--foreground))`

#### Feedback Colors
- **Success**: `hsl(var(--success))` or green-500
- **Error**: `hsl(var(--destructive))`
- **Warning**: `hsl(var(--warning))` or amber-500

### Border & Radius
- **Panel Border**: `border` (1px)
- **Panel Radius**: `rounded-lg` (8px)
- **Element Selector Radius**: `rounded-md` (6px)
- **Input Radius**: `rounded-md` (6px, shadcn default)
- **Selection Border Radius**: Matches element's border-radius

## 11. Performance Considerations

### Critical Path
1. Iframe loads HTML first (existing behavior)
2. Event listeners attached to iframe after mount
3. Element selection logic initialized
4. Properties panel pre-rendered but hidden (faster transition)

### Lazy Loading
- Color picker component lazy loaded on first use
- Image upload component lazy loaded when needed
- Property controls rendered only when tab active

### Iframe Communication
- **PostMessage API**: For cross-origin iframe communication (if needed)
- **Direct DOM Access**: If same-origin (faster, preferred)
- **Debouncing**: Property changes debounced (300ms) before sending to AI
- **Optimistic Updates**: Preview updates immediately, synced to store after

### Animation Budget
- **Selection Border**: Transform-based animation (GPU-accelerated)
- **Panel Slide**: Translate + opacity (GPU-accelerated)
- **Hover Effects**: Border changes only (lightweight)
- **Total Budget**: < 16ms per frame (60fps)

### Memory Management
- Event listeners cleaned up on unmount
- Intersection observers for large property lists
- Virtual scrolling if property list exceeds 50 items (unlikely)

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- Add Tabs component
- Add Slider component (if not present)
- Add ScrollArea component (if not present)
- Verify all input components available

**ai-sdk-expert**:
- Define how AI understands selected element context
- Structure for sending visual edits to AI
- Streaming response handling during edit mode

**domain-architect** (if needed):
- Visual edit state management (separate store or extend email store?)
- Selected element state structure
- Undo/redo for edits (future enhancement)

**Parent**:
- Implement iframe interaction logic
- Wire up properties panel to email store
- Integrate with existing conversation component
- Test cross-component communication

### Files Impacted

**NEW FILES**:
- `src/components/organisms/property-panel.tsx` - Main properties panel
- `src/components/organisms/property-panel.text-map.ts` - Text content
- `src/components/molecules/element-selector.tsx` - Selected element indicator
- `src/components/molecules/element-selector.text-map.ts` - Text content
- `src/components/molecules/color-picker.tsx` - Color selection control
- `src/components/molecules/property-group.tsx` - Reusable property section
- `src/components/atoms/property-label.tsx` - Consistent property labels
- `src/lib/iframe-interaction.ts` - Iframe element selection logic
- `src/lib/element-parser.ts` - Parse element properties from HTML
- `src/lib/html-updater.ts` - Update HTML with new property values
- `src/stores/visual-edit.store.ts` - Visual edit state (selected element, mode)

**MODIFIED FILES**:
- `src/components/organisms/previewer-email.tsx` - Add element selection handlers
- `src/components/molecules/prompt-textarea.tsx` - Add element selector indicator
- `src/app/page.tsx` or main layout - Conditional rendering of Conversation vs PropertyPanel
- `src/stores/email.store.ts` - Possibly add methods for updating specific elements

**UTILITY FUNCTIONS**:
- `src/lib/css-parser.ts` - Parse inline styles to property object
- `src/lib/css-builder.ts` - Build inline styles from property object
- `src/lib/element-validator.ts` - Validate property changes before applying

## 13. Important Notes

⚠️ **Iframe security**: Ensure same-origin or proper postMessage setup for element access

⚠️ **HTML structure preservation**: Validate edits don't break HTML structure or email rendering

⚠️ **Mobile disabled**: Clearly communicate visual editing requires larger screen

💡 **Optimistic updates**: Show changes immediately, sync to store async for better UX

💡 **Context-aware AI**: AI should understand "make this bigger" refers to selected element

📝 **Undo/redo**: Future enhancement, not in v1 (would require history tracking)

🎨 **Design system consistency**: Use existing shadcn components, match current UI patterns

💡 **Keyboard-first**: All actions accessible via keyboard, not just mouse

🔒 **Validation critical**: Prevent users from breaking email HTML structure

## 14. Success Metrics

### Usability
- User can select element in < 2 clicks
- User discovers visual editing within 30 seconds of email generation
- Properties panel layout is immediately understandable
- User can make 3 common edits (text, color, image) in < 1 minute

### Efficiency
- Visual edits 3x faster than describing in chat
- Average time to change button color: < 15 seconds
- Average time to edit text: < 20 seconds

### Satisfaction
- User prefers visual editing over chat for simple changes
- Reduced frustration with ambiguous text descriptions
- Feeling of control and direct manipulation

### Accessibility
- Screen reader users can navigate entire properties panel
- Keyboard-only users can select elements and edit properties
- All touch targets meet 44px minimum on tablet
- Color contrast meets WCAG AA for all text (4.5:1)

### Performance
- Panel opens in < 200ms
- Property changes preview in < 100ms
- No lag when typing in property inputs
- Iframe element selection response time < 100ms

## 15. Technical Implementation Strategy

### Phase 1: Iframe Interaction (Foundation)
1. Set up element detection in iframe (mouse hover)
2. Add hover state styles injection
3. Implement click detection and selection
4. Create selected element state management
5. Add keyboard navigation for element selection (Tab to cycle)

### Phase 2: Element Selector Indicator
1. Create ElementSelector component
2. Add to PromptTextarea component
3. Display selected element info
4. Add close/deselect functionality
5. Test with different element types

### Phase 3: Properties Panel Shell
1. Create PropertyPanel component structure
2. Add tabs (Content, Style, Layout)
3. Implement show/hide transitions
4. Replace Conversation component conditionally
5. Add close button functionality

### Phase 4: Property Controls
1. Build property controls for each element type
2. Add form validation
3. Implement real-time preview updates (optimistic)
4. Add Apply/Cancel buttons
5. Wire up to email store

### Phase 5: Advanced Features
1. Add color picker component
2. Add image upload for image elements
3. Implement property grouping
4. Add help tooltips
5. Test all property types

### Phase 6: AI Integration
1. Send selected element context with chat messages
2. Update AI system prompt to understand visual edit context
3. Handle AI responses that modify selected element
4. Test combined visual + chat workflow

### Phase 7: Polish & Accessibility
1. Add all ARIA labels and descriptions
2. Test keyboard navigation thoroughly
3. Test with screen readers
4. Add prefers-reduced-motion support
5. Test color contrast
6. Mobile disabled state UI

### Phase 8: Error Handling & Edge Cases
1. Handle element deletion during editing
2. Handle HTML structure changes
3. Add comprehensive validation
4. Error messages for all failure modes
5. Graceful degradation

## 16. State Management Design

### Visual Edit Store Structure

```typescript
// src/stores/visual-edit.store.ts
interface VisualEditStore {
  // Selection state
  selectedElement: {
    id: string; // Unique identifier for element
    type: string; // 'button', 'heading', 'paragraph', 'image', etc.
    path: string[]; // ['body', 'section', 'button'] for breadcrumb
    properties: Record<string, any>; // Current property values
    rect: DOMRect; // Position/size for highlighting
  } | null;

  // Mode state
  isEditMode: boolean; // true when properties panel open

  // Draft changes (not yet applied)
  draftChanges: Record<string, any>;

  // Actions
  selectElement: (element: HTMLElement) => void;
  deselectElement: () => void;
  updateDraftProperty: (key: string, value: any) => void;
  applyChanges: () => Promise<void>;
  cancelChanges: () => void;

  // Utilities
  getPropertyValue: (key: string) => any;
  hasUnsavedChanges: () => boolean;
}
```

### Integration with Email Store

Option A: Separate store (recommended):
- `useVisualEditStore` manages selection and draft changes
- `useEmailStore` manages final HTML
- Properties panel reads from visualEditStore
- Apply button updates emailStore

Option B: Extend email store:
- Add visual edit properties to existing emailStore
- Single source of truth
- More coupled but simpler

**Recommendation**: Separate store (Option A) for better separation of concerns

## 17. Accessibility Testing Checklist

Before launch, verify:

**Keyboard Navigation**:
- [ ] Tab through all property controls in order
- [ ] Arrow keys switch between tabs
- [ ] Escape closes properties panel
- [ ] Enter applies changes
- [ ] Focus visible at all times

**Screen Reader**:
- [ ] Panel opening is announced
- [ ] Element type is announced
- [ ] Property labels are read correctly
- [ ] Help text is associated with inputs
- [ ] Validation errors are announced immediately
- [ ] Success message is announced

**Visual**:
- [ ] Color contrast 4.5:1 for all text
- [ ] Focus indicators visible
- [ ] No information conveyed by color alone
- [ ] Text size minimum 14px (12px for secondary)
- [ ] Touch targets minimum 44px on tablet

**Motion**:
- [ ] Animations disabled with prefers-reduced-motion
- [ ] No flashing or rapid animations

## 18. Security Considerations

### Iframe Interaction
- Ensure Content Security Policy allows iframe manipulation
- Sanitize any user input before injecting to iframe
- Validate element paths to prevent XSS

### HTML Modification
- Parse and validate HTML before applying changes
- Prevent injection of malicious scripts
- Validate CSS values (colors, URLs) before applying

### Image Upload
- Validate file types (images only)
- Check file size limits
- Sanitize filenames
- Use secure upload endpoint

## 19. Future Enhancements (Post-V1)

### Undo/Redo
- Track edit history
- Cmd/Ctrl+Z for undo
- Visual history timeline

### Drag & Drop Reordering
- Drag elements to reorder
- Visual drop zones
- Preserve structure

### Copy/Paste Elements
- Select element → Copy → Paste elsewhere
- Duplicate common elements

### Style Presets
- Save color schemes
- Button style presets
- Quick apply

### Advanced CSS Properties
- Flexbox/Grid controls
- Advanced typography
- Shadows and effects

### Multi-Select
- Select multiple elements
- Bulk property changes

### Real-time Collaboration
- Multiple users editing
- Cursor presence
- Conflict resolution

## 20. Edge Cases & Validation

### Element Selection
- **Nested elements**: Select innermost element on click
- **Overlapping elements**: Use z-index to determine clickable element
- **Iframe scrolling**: Selection border stays attached
- **Element hidden**: Cannot select if display:none

### Property Changes
- **Invalid color**: Validate hex/rgb/color name
- **Invalid URL**: Validate format before applying
- **Negative values**: Prevent negative padding/margin/sizes
- **Conflicting styles**: Warn if change breaks layout

### HTML Structure
- **Element removed by AI**: Close panel, show message
- **Parent element changed**: Re-calculate element path
- **Invalid HTML**: Reject changes that create invalid structure

### Performance
- **Large emails**: Limit selectable elements (performance)
- **Many rapid edits**: Debounce apply to reduce updates
- **Memory leaks**: Clean up event listeners on unmount

---

## Next Steps

1. **Parent reviews this UX plan**
2. **Business analyst creates requirements document** (if needed)
3. **Shadcn-builder adds required components** (Tabs, Slider, ScrollArea)
4. **AI SDK expert defines context integration** (selected element in prompts)
5. **Parent implements following phase-by-phase approach above**
6. **Code reviewer validates implementation** (accessibility, performance)

---

## Collaboration Needed

**shadcn-builder**:
- Need: Tabs, Slider, ScrollArea components
- Timeline: Before Phase 3 implementation

**ai-sdk-expert**:
- Need: Selected element context structure
- Question: How should AI prompts include visual edit context?
- Timeline: Before Phase 6 implementation

**domain-architect** (optional):
- Question: Separate visual-edit store or extend email store?
- Recommendation: Separate store for separation of concerns

---

**Design Philosophy Applied**:

- ✅ **User-First**: Direct manipulation faster than text descriptions
- ✅ **Accessibility**: Full keyboard + screen reader support from day 1
- ✅ **Responsive**: Mobile disabled gracefully, tablet optimized, desktop best
- ✅ **Consistency**: Uses existing shadcn components and design patterns
- ✅ **Performance**: Optimistic updates, GPU-accelerated animations
- ✅ **Feedback**: Clear visual feedback for every action
- ✅ **Error Prevention**: Validation prevents breaking HTML structure
- ✅ **Progressive Enhancement**: Visual editing enhances, doesn't replace chat

---

**Key Innovation**:
This design combines visual WYSIWYG editing with AI chat context awareness, allowing users to quickly make precise edits visually while maintaining the power of natural language for complex changes. The selected element context flows into chat messages, making the AI understand "make this bigger" automatically.
