# Settings Panel - UX/UI Design Plan

**Created**: 2025-12-07
**Session**: settings-panel-20251207
**Complexity**: Medium
**User Impact**: High

## 1. User Context

### User Goals
- **Primary Goal**: Configure AI provider API key and select preferred model for email generation
- **Secondary Goals**:
  - Quickly access settings without leaving current workflow
  - Understand which AI models are available
  - See who created the application
  - Have confidence that API key is stored securely (client-side only)
- **Success Criteria**:
  - User can save API key and model in under 30 seconds
  - Settings persist across browser sessions
  - Clear feedback when settings are saved successfully

### User Personas
- **Primary**: Technical user comfortable with AI APIs who wants to use their own API key
- **Context**:
  - When: First-time setup OR when switching models/updating API key
  - Where: From any page in the application via header
  - Why: Need to configure AI provider before generating emails OR update expired/changed API key
- **Pain Points**:
  - API keys are long and error-prone to type
  - Unclear which AI model to select
  - Security concerns about API key storage
  - Need to re-configure after clearing browser data

### User Journey

**First-Time User (Empty State)**:
1. User lands on app → Tries to generate email → Realizes they need API key
2. Clicks settings icon in header → Sheet slides in from right
3. Sees empty form with helpful placeholder text → Understands what's needed
4. Selects model from dropdown → Pastes API key → Clicks Save
5. Sees success toast → Sheet auto-closes → Can now use the app

**Returning User (Update Settings)**:
1. User wants to switch models or update API key → Clicks settings icon
2. Sheet opens with current values pre-filled → Makes changes
3. Clicks Save → Sees success feedback → Continues workflow

**Error Scenario**:
1. User tries to save with empty API key → Sees inline validation error
2. Corrects the error → Saves successfully

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Form inputs (Model selector + API key input) - user's main focus
2. **Secondary**: Section labels and helper text - guides user
3. **Tertiary**: Footer with creator credit - acknowledgment, not critical to task

### Layout Strategy
- **Structure**: Sheet component (slide-in panel from right side)
- **Grid**: Single column form layout, full-width inputs for easy interaction
- **Spacing**: Comfortable density - enough white space to feel clean but not wasteful
- **Breakpoints**:
  - Mobile (< 640px): Full-width sheet (takes ~90% of viewport), larger touch targets
  - Tablet (640px - 1024px): Sheet width ~400px, comfortable form spacing
  - Desktop (> 1024px): Sheet width ~450px, maintains right-side positioning

### Visual Hierarchy
- **Focal Point**: Model selector (first input user encounters, logical first step)
- **Visual Flow**: Top-to-bottom natural reading flow
  1. Sheet header with title
  2. Model selector (with label)
  3. API key input (with label + security indicator)
  4. Save button (primary action)
  5. Footer credit (visual separation)
- **Grouping**: Form fields in a Card component for visual containment
- **Contrast**: Primary button stands out, footer is subtle, sheet overlay darkens background

## 3. Interaction Design

### Primary Actions
- **Action**: "Save Settings"
  - **Type**: Primary button
  - **Location**: Bottom of form, above footer (sticky positioning on mobile)
  - **State**:
    - Default: Full color, ready to click
    - Hover: Subtle background change (darker)
    - Active: Pressed state
    - Loading: Shows spinner + "Saving..." text
    - Disabled: Grayed out when form is invalid
  - **Feedback**:
    - On click: Button shows loading state
    - On success: Toast appears, sheet auto-closes after 500ms delay
    - On error: Toast with error message, sheet stays open

### Secondary Actions
- **Action**: Close sheet (X button in header)
  - **Type**: Ghost button with icon
  - **Location**: Top-right of sheet header
  - **Behavior**: Closes sheet without saving (safe - localStorage already persisted if previously saved)

- **Action**: Sheet backdrop click
  - **Type**: Implicit close action
  - **Location**: Anywhere outside the sheet
  - **Behavior**: Same as close button - dismisses sheet

### Micro-interactions
- **Hover Effects**:
  - Buttons: Subtle background color shift
  - Select dropdown: Border highlight on focus
  - Input field: Border highlight on focus
- **Focus States**:
  - Keyboard navigation: Clear focus ring (blue glow) around active element
  - Tab order: Model selector → API key → Save button → Close button
- **Loading States**:
  - Save button: Spinner icon + text change to "Saving..."
  - No skeleton needed (form is simple)
- **Transitions**:
  - Sheet open/close: 300ms slide-in from right with ease-out
  - Toast: 200ms fade-in from top
  - Success feedback: Subtle green checkmark animation in toast
- **Success/Error**:
  - Success: Green toast with checkmark icon + "Settings saved successfully"
  - Error: Red toast with error icon + specific error message

### User Input

**Model Selector (Select Component)**:
- **Input Type**: Dropdown select (shadcn/ui Select)
- **Validation**: Required (always has a default selected)
- **Error Messages**: None needed (always valid, defaults to current model)
- **Placeholder/Helper**: Label "AI Model" + current selection visible
- **Options**:
  - GPT-5.1 (2025-11-13)
  - GPT-5 Mini (2025-08-07)
  - GPT-5 Nano (2025-08-07)
  - Gemini 3 Pro Preview
  - Gemini 2.5 Pro
  - Gemini 2.5 Flash

**API Key Input (Input Component)**:
- **Input Type**: Password type for security (masks characters)
- **Validation**:
  - Real-time: Required field (cannot be empty)
  - On blur: Show error if empty
  - On submit: Block save if empty
- **Error Messages**:
  - Empty: "API key is required"
  - Format (optional future): "API key appears invalid"
- **Placeholder/Helper**:
  - Placeholder: "Enter your API key"
  - Helper text below: "Your API key is stored locally in your browser and never sent to our servers"
- **Security Indicator**:
  - Lock icon next to label
  - Password type (masked characters)
  - Helper text emphasizes local storage

## 4. Component Selection

### shadcn/ui Components Needed
- **Sheet**: Main container for settings panel
  - SheetTrigger: Settings icon button in header
  - SheetContent: The slide-in panel itself
  - SheetHeader: Title area with close button
  - SheetTitle: "Settings" heading
  - SheetDescription: Optional subtitle (can skip for simplicity)
  - SheetFooter: Creator credit area

- **Card**: Visual container for form fields (optional, could use div with border)
  - Provides subtle visual separation for form section

- **Select**: Model dropdown
  - SelectTrigger: Shows current selection
  - SelectContent: Dropdown menu
  - SelectItem: Each model option
  - SelectValue: Display of selected value

- **Input**: API key input field (already exists)

- **Label**: Form labels for inputs (already exists)

- **Button**: Save button and close button (already exists)

- **Toast (Sonner)**: Success/error feedback (already configured)

**Note**: Sheet component needs to be added via shadcn-builder agent (not currently in codebase based on earlier search)

### Custom Components Needed
- **None**: All functionality can be achieved with shadcn/ui components + standard form handling

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/constants/settings-panel.text-map.ts`

**Keys to Define**:

**Headings**:
- `sheet.title`: "Settings"
- `sheet.description`: "Configure your AI provider and model preferences"

**Form Labels**:
- `form.labels.model`: "AI Model"
- `form.labels.apiKey`: "API Key"

**Form Helpers**:
- `form.helpers.apiKey`: "Your API key is stored locally in your browser and never sent to our servers"

**Model Options (Display Names)**:
- `models.gpt51`: "GPT-5.1 (2025-11-13)"
- `models.gpt5Mini`: "GPT-5 Mini (2025-08-07)"
- `models.gpt5Nano`: "GPT-5 Nano (2025-08-07)"
- `models.gemini3ProPreview`: "Gemini 3 Pro Preview"
- `models.gemini25Pro`: "Gemini 2.5 Pro"
- `models.gemini25Flash`: "Gemini 2.5 Flash"

**Actions**:
- `actions.save`: "Save Settings"
- `actions.saving`: "Saving..."
- `actions.close`: "Close"

**Feedback Messages**:
- `feedback.success`: "Settings saved successfully"
- `feedback.errorSaving`: "Failed to save settings. Please try again."
- `feedback.errorRequired`: "API key is required"

**Placeholders**:
- `placeholders.apiKey`: "Enter your API key"

**Footer**:
- `footer.createdBy`: "Created by"
- `footer.creatorName`: "@JoseCortezz25"
- `footer.creatorLink`: "https://github.com/JoseCortezz25"

**Accessibility (ARIA)**:
- `aria.settingsButton`: "Open settings"
- `aria.closeSheet`: "Close settings"

**Tone**: Professional but friendly, reassuring about security
**Voice**: Direct 2nd person ("your API key", "configure your preferences")

### Microcopy

**Empty States**:
- When no API key is set: Placeholder text guides user to "Enter your API key"
- Helper text below assures security: "stored locally in your browser"

**Error States**:
- API key required: "API key is required" (clear, actionable)
- Save failed: "Failed to save settings. Please try again." (empathetic, suggests retry)

**Success States**:
- Save successful: "Settings saved successfully" (clear confirmation)
- Auto-close after success gives tactile feedback that action completed

**Loading States**:
- Save button text changes: "Save Settings" → "Saving..." (progress indicator)
- Button shows spinner during save

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - `<Sheet>` acts as dialog/modal landmark
  - `<form>` for form structure
  - `<footer>` for creator credit
- **Headings**:
  - h2: "Settings" (sheet title)
  - No deep heading hierarchy needed (simple form)
- **Lists**: Not applicable (no list content)

### Keyboard Navigation
- **Tab Order**:
  1. Settings icon button (header)
  2. Model selector
  3. API key input
  4. Save button
  5. Close button (X in header)
- **Shortcuts**:
  - Escape: Close sheet
  - Enter (on form): Submit form (save settings)
- **Focus Management**:
  - On open: Focus moves to model selector (first input)
  - On close: Focus returns to settings icon button
- **Escape Hatch**:
  - Escape key closes sheet
  - Backdrop click closes sheet
  - Close button (X) closes sheet

### Screen Reader Experience
- **ARIA Labels**:
  - Settings button: `aria-label="Open settings"`
  - Close button: `aria-label="Close settings"`
  - Sheet: `role="dialog"` `aria-labelledby="settings-title"`
- **ARIA Descriptions**:
  - API key input: `aria-describedby` points to helper text
  - Form: `aria-describedby` points to sheet description
- **Live Regions**:
  - Toast messages use `role="status"` for success
  - Toast messages use `role="alert"` for errors
  - Announced immediately by screen readers
- **Hidden Content**:
  - Sheet backdrop has `aria-hidden="true"` (not interactive)
  - Close icon has visible label for screen readers

### Visual Accessibility
- **Color Contrast**:
  - Text on background: Minimum 4.5:1 (WCAG AA)
  - Button text: Minimum 4.5:1
  - Error messages: Red with sufficient contrast (7:1 for AAA)
  - Focus ring: High contrast blue visible against all backgrounds
- **Color Independence**:
  - Errors shown with icon + text (not just red color)
  - Success shown with icon + text (not just green color)
  - Required fields have asterisk + text label
- **Text Size**:
  - Body text: 14px (desktop), 16px (mobile) - comfortable reading
  - Labels: 14px with medium weight for emphasis
  - Minimum touch target: 44x44px for all interactive elements
- **Touch Targets**:
  - Buttons: Minimum 44x44px on mobile
  - Input fields: Minimum 44px height on mobile
  - Select dropdown: Minimum 44px height on mobile
- **Motion**:
  - Respect `prefers-reduced-motion` for sheet slide animation
  - If reduced motion: Sheet appears/disappears instantly (no slide)
  - Toast still fades (minimal motion acceptable)

## 7. Responsive Design

### Mobile (< 640px)
- **Layout**:
  - Sheet takes ~95% of viewport width (almost full screen)
  - Single column form
  - Full-width inputs for easy tapping
- **Navigation**:
  - Settings icon in header (already exists)
  - Large touch target (44x44px minimum)
- **Actions**:
  - Save button full-width
  - Sticky positioning at bottom for easy reach
- **Content**:
  - Minimal padding to maximize form space
  - Footer text smaller but still legible (12px)
  - Helper text stacks below input (not inline)

### Tablet (640px - 1024px)
- **Layout**:
  - Sheet width ~400px from right edge
  - Comfortable padding around form
  - Inputs remain full-width within sheet
- **Navigation**:
  - Same settings icon button
- **Actions**:
  - Save button full-width within sheet (not viewport)
  - Natural spacing from footer

### Desktop (> 1024px)
- **Layout**:
  - Sheet width ~450px from right edge
  - Generous padding for comfortable reading
  - Inputs full-width within sheet
- **Navigation**:
  - Same settings icon button
  - Hover states visible on mouse interaction
- **Actions**:
  - Save button full-width within sheet
  - Clear hover effects
- **Additional**:
  - Footer link shows underline on hover
  - Tooltip potential on API key helper icon

## 8. States & Feedback

### Loading States
- **Initial Load**:
  - Sheet opens immediately (no loading)
  - Form pre-populated from localStorage (instant)
- **Action Feedback**:
  - Save button shows spinner + "Saving..." text
  - Button disabled during save (prevent double-submit)
- **Optimistic Updates**:
  - Not applicable (save is to localStorage, instant)

### Error States
- **Validation Errors**:
  - Inline below API key input: "API key is required"
  - Red border on input field
  - Error icon next to message
  - Announced to screen readers
- **System Errors**:
  - Toast notification (red background, error icon)
  - Message: "Failed to save settings. Please try again."
  - Sheet stays open (user can retry)
- **Recovery**:
  - User corrects API key → Error clears immediately
  - User clicks Save again → Retry save operation

### Empty States
- **No API Key Set (First Time)**:
  - Placeholder text in input: "Enter your API key"
  - Helper text guides user: "Your API key is stored locally..."
  - Model selector shows default (Gemini 2.5 Flash)
  - Form is ready to accept input (encouraging)
- **After Clearing Data**:
  - Same as first-time experience
  - No error message (neutral empty state)

### Success States
- **Save Confirmation**:
  - Toast appears: Green background, checkmark icon
  - Message: "Settings saved successfully"
  - Sheet auto-closes after 500ms delay
  - Toast persists for 3 seconds total
- **Next Steps**:
  - User returns to main workflow
  - Settings icon remains accessible for future changes

## 9. User Flow Diagram

```
[User on any page]
    ↓
[Clicks Settings icon in header]
    ↓
[Sheet slides in from right with 300ms animation]
    ↓
[Form appears - Focus moves to Model selector]
    ↓
[User interacts with form]
    ↓
[Decision: Make changes?]
    ↓ YES                              ↓ NO
[Select model / Enter API key]    [Click Close or Escape]
    ↓                                  ↓
[Click Save Settings]              [Sheet closes]
    ↓                                  ↓
[Button shows "Saving..."]         [Returns to main app]
    ↓
[Validation check]
    ↓ VALID                    ↓ INVALID
[Save to localStorage]      [Show error inline]
    ↓                              ↓
[Success toast appears]        [User corrects → Retry]
    ↓
[Sheet auto-closes 500ms]
    ↓
[Returns to main app with saved settings]
```

## 10. Design Specifications

### Spacing Scale
- **Tight**:
  - Between label and input: 8px (0.5rem)
  - Between form fields: 16px (1rem)
- **Normal**:
  - Sheet padding: 24px (1.5rem)
  - Card padding: 20px (1.25rem)
- **Relaxed**:
  - Between form and footer: 32px (2rem)
  - Sheet top/bottom padding: 24px (1.5rem)

### Typography
- **Headings**:
  - Sheet title (h2): 20px (1.25rem), font-weight: 600 (semibold)
- **Body**:
  - Form labels: 14px (0.875rem), font-weight: 500 (medium)
  - Helper text: 14px (0.875rem), font-weight: 400 (normal)
  - Input text: 14px (0.875rem)
- **Labels**:
  - 14px (0.875rem), medium weight

### Color Usage
- **Primary**:
  - Save button background (call-to-action)
  - Focus ring on inputs
- **Secondary**:
  - Close button (ghost variant)
  - Footer text (muted)
- **Accent**:
  - Sheet header border
  - Card border
- **Semantic**:
  - Success: Green toast background, checkmark icon
  - Error: Red toast background, red input border, error icon
  - Info: Helper text uses muted foreground color
  - Warning: Not used in this flow

## 11. Performance Considerations

- **Critical Path**:
  1. Sheet component loads (should be code-split if large)
  2. Form renders with current values from localStorage
  3. User interacts (no network delay)
- **Lazy Loading**:
  - Sheet component could be lazy-loaded (only loads when settings icon clicked)
  - Reduces initial bundle size
- **Image Optimization**:
  - No images in this feature
  - Icons are SVG (lucide-react)
- **Animation Budget**:
  - Sheet slide animation: 300ms (acceptable, feels smooth)
  - Toast fade: 200ms (minimal impact)
  - Respect prefers-reduced-motion to disable animations
  - Total animation time: <500ms per interaction

## 12. Implementation Coordination

### Agent Collaboration
- **shadcn-builder**:
  - Request Sheet component installation (not currently in project)
  - Confirm Card component exists (likely yes)
  - Verify Select, Input, Button, Label are ready
  - Ensure Sonner toast is properly configured

- **domain-architect**:
  - Not needed (localStorage only, no backend)
  - Zustand store already exists (model.store.ts)
  - May need to add localStorage persistence middleware to Zustand

- **nextjs-builder**:
  - Add localStorage persistence to Zustand store
  - Handle hydration properly (client-side only state)
  - Ensure "use client" directive on Sheet component

- **Parent**:
  1. Get Sheet component from shadcn-builder
  2. Create text map file
  3. Create SettingsSheet component
  4. Update header.tsx to wire up Sheet trigger
  5. Add localStorage persistence to model.store.ts
  6. Test keyboard navigation and accessibility
  7. Test responsive behavior on all breakpoints

### Files Impacted
- **Components**:
  - `src/components/ui/sheet.tsx` (NEW - from shadcn)
  - `src/components/organisms/settings-sheet.tsx` (NEW - main component)
  - `src/components/layout/header.tsx` (MODIFIED - add Sheet trigger)

- **Text Maps**:
  - `src/constants/settings-panel.text-map.ts` (NEW)

- **Stores**:
  - `src/stores/model.store.ts` (MODIFIED - add localStorage persistence)

- **Styles**:
  - No custom styles needed (shadcn components handle styling)

## 13. Important Notes

⚠️ **Security consideration**: API key stored in localStorage is visible to any JavaScript on the page. This is acceptable for a client-side app, but users should be informed (helper text does this).

⚠️ **Accessibility is mandatory**: All form inputs must have associated labels, keyboard navigation must work perfectly, and screen readers must announce all state changes.

💡 **Mobile-first**: Design prioritizes mobile experience - large touch targets, full-width inputs, minimal scrolling needed.

💡 **Content before chrome**: Form fields are the primary focus, footer credit is subtle and non-intrusive.

📝 **Iterate**: After initial implementation, consider user testing to refine:
  - Model selector labels (are they clear?)
  - API key validation (should we check format?)
  - Helper text effectiveness (do users understand local storage?)

🎨 **Consistency**: Sheet pattern can be reused for future settings panels (e.g., theme settings, email templates).

## 14. Success Metrics

- **Usability**:
  - Task completion rate: >95% of users successfully save settings
  - Time to complete: <30 seconds from opening sheet to saving
  - Error rate: <5% validation errors on first save attempt

- **Efficiency**:
  - Sheet open animation: <300ms
  - Save operation: <100ms (localStorage is instant)
  - Total interaction time: <5 seconds for experienced users

- **Satisfaction**:
  - User feedback: Positive sentiment about clear, simple interface
  - Confusion points: <10% of users ask "where are my settings?"

- **Accessibility**:
  - Screen reader testing: 100% of elements properly announced
  - Keyboard-only navigation: 100% of functions accessible without mouse
  - Color contrast: 100% WCAG AA compliance (aim for AAA)

- **Performance**:
  - Sheet component load: <500ms (if code-split)
  - Form render: <100ms
  - Total interaction latency: <200ms (perceived as instant)

## 15. Future Enhancements (Out of Scope for MVP)

- **Provider Selection**: Allow user to choose between OpenAI and Gemini (currently model determines provider)
- **API Key Validation**: Test API key on save to verify it works
- **Multiple API Keys**: Store different keys for OpenAI vs Gemini
- **Export/Import Settings**: Allow users to backup their settings
- **Theme Settings**: Add dark mode toggle in same sheet
- **Advanced Settings**: Rate limits, temperature, max tokens, etc.

---

**Ready for Implementation**: This plan provides complete specifications for the UX/UI design. Next steps:
1. shadcn-builder installs Sheet component
2. Parent creates text map file
3. Parent implements SettingsSheet component following this design
4. Parent adds localStorage persistence to Zustand store
5. Parent integrates into header.tsx
6. Parent tests accessibility and responsive behavior
