# Responsive View Toggle - UX/UI Design Plan

**Created**: 2025-11-15
**Session**: N/A (Direct implementation request)
**Complexity**: Medium
**User Impact**: High - Critical for mobile/tablet usability

## 1. User Context

### User Goals
- **Primary Goal**: Access both Chat and Email Preview on mobile/tablet devices
- **Secondary Goals**:
  - Seamless switching between Chat and Preview modes
  - Automatic preview display when email is generated
  - Maintain context when switching between views
- **Success Criteria**:
  - Users can easily toggle between Chat/Preview on small screens
  - No confusion about which view is active
  - Smooth transitions without layout jumps

### User Personas
- **Primary**: Mobile users creating emails on-the-go
- **Context**: Using phone/tablet to generate and preview emails
- **Pain Points**:
  - Cannot see both chat and preview simultaneously on small screens
  - Need to verify email content before sending
  - Want to continue chatting after seeing preview

### User Journey
1. **Mobile User enters app** → Sees Chat view (default) → Can type message
2. **Generates email** → Auto-switches to Preview → Sees generated email
3. **Wants to modify** → Taps "Chat" button → Returns to conversation
4. **Desktop User** → Sees both views side-by-side → No change needed

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Active view content (Chat OR Preview)
2. **Secondary**: View toggle buttons in header
3. **Tertiary**: Additional header actions

### Layout Strategy
- **Structure**: Full viewport single-panel view (mobile/tablet) vs split view (desktop)
- **Grid**: Dynamic based on breakpoint and active view
- **Spacing**: Full height (`100dvh - header`), no gaps on mobile
- **Breakpoints**:
  - **Mobile/Tablet (< 1024px)**: Single view at 100% width, toggle buttons in header
  - **Desktop (≥ 1024px)**: Split view (460px Chat + 1fr Preview), no toggle needed

### Visual Hierarchy
- **Focal Point**: Active view content fills entire viewport
- **Visual Flow**: Header → Toggle buttons → Content
- **Grouping**: Toggle buttons grouped as segmented control
- **Contrast**: Active button clearly distinguished from inactive

## 3. Interaction Design

### Primary Actions (Mobile/Tablet Only)

- **Action**: "Chat" button
  - **Type**: Segmented control (left side)
  - **Location**: Header, center position
  - **State**:
    - Default: Active when chat is visible
    - Hover: Subtle background change
    - Active: Bold text, filled background
    - Disabled: Never disabled
  - **Feedback**: Instant view switch with slide transition

- **Action**: "Preview" button
  - **Type**: Segmented control (right side)
  - **Location**: Header, center position
  - **State**:
    - Default: Active when preview is visible
    - Hover: Subtle background change
    - Active: Bold text, filled background
    - Disabled: Greyed out when no email generated
  - **Feedback**: Instant view switch with slide transition

### Micro-interactions
- **Hover Effects**: Subtle background color change on buttons
- **Focus States**: Visible outline for keyboard navigation
- **Loading States**: N/A (instant switch)
- **Transitions**:
  - View switch: 300ms slide animation (direction based on which button clicked)
  - Button state: 150ms background/color transition
- **Success/Error**: Visual feedback when email generation completes

### User Input
- **Input Type**: Button toggle (segmented control)
- **Validation**: N/A
- **Error Messages**: N/A
- **Placeholder/Helper**: Tooltip on hover (optional)

## 4. Component Selection

### shadcn/ui Components Needed
- **Toggle Group**: For the segmented control (Chat/Preview buttons)
  - Alternative: Custom button group with radio-like behavior
- **Button**: If building custom toggle group

**Note**: Will coordinate with shadcn-builder agent for component selection

### Custom Components Needed
- **ViewToggle** (molecule): Segmented control for Chat/Preview switch
  - Why not using shadcn: May need custom styling for mobile-first design
  - Could use shadcn ToggleGroup as foundation

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/stores/ui.text-map.ts` (NEW)

**Keys to Define**:
```typescript
export const UI_TEXT = {
  viewToggle: {
    chat: 'Chat',
    preview: 'Preview',
    ariaLabel: 'Switch between chat and preview',
    ariaChatLabel: 'Show chat view',
    ariaPreviewLabel: 'Show email preview'
  }
} as const;
```

**Tone**: Clear, concise
**Voice**: Active, imperative

### Microcopy
- **Empty States**: N/A
- **Error States**: N/A
- **Success States**: N/A
- **Loading States**: N/A

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**: Header contains navigation toggle
- **Headings**: N/A (buttons are controls, not headings)
- **Lists**: N/A

### Keyboard Navigation
- **Tab Order**: Header title → Chat button → Preview button → Content
- **Shortcuts**:
  - Left/Right arrows to switch between Chat/Preview (when focused)
  - Alt+1 for Chat (optional)
  - Alt+2 for Preview (optional)
- **Focus Management**: Focus stays on button after activation
- **Escape Hatch**: N/A

### Screen Reader Experience
- **ARIA Labels**:
  - `aria-label="Switch between chat and preview"` on toggle group
  - `aria-pressed="true/false"` on each button
  - `aria-disabled="true"` on Preview when no email
- **ARIA Descriptions**: `aria-describedby` if tooltip present
- **Live Regions**: `aria-live="polite"` announcement when view changes
- **Hidden Content**: Inactive view is `display: none` (not aria-hidden)

### Visual Accessibility
- **Color Contrast**:
  - Active button: 4.5:1 minimum
  - Inactive button: 4.5:1 minimum
  - Disabled button: 3:1 minimum
- **Color Independence**: Don't rely only on color (use text weight, background)
- **Text Size**: 14px minimum on buttons
- **Touch Targets**: 44x44px minimum on mobile
- **Motion**: Respect `prefers-reduced-motion` for view transitions

## 7. Responsive Design

### Mobile (< 640px)
- **Layout**: Single column, 100% width
- **Navigation**: Toggle buttons visible in header
- **Actions**: Full-width view toggle
- **Content**: Active view fills `100dvh - header height`
- **Default**: Chat view on initial load
- **Auto-switch**: Switch to Preview when email generated

### Tablet (640px - 1023px)
- **Layout**: Same as mobile (single view)
- **Navigation**: Toggle buttons visible in header
- **Actions**: Same as mobile
- **Content**: Same as mobile

### Desktop (≥ 1024px)
- **Layout**: Split view (460px + 1fr)
- **Navigation**: Toggle buttons HIDDEN
- **Actions**: N/A (both views always visible)
- **Additional**: Maintain existing animation behavior

## 8. States & Feedback

### Loading States
- **Initial Load**: Chat view shown by default
- **Email Generation**: Auto-switch to Preview on completion
- **Action Feedback**: Immediate view switch (no loading)

### Error States
- **No Email Generated**: Preview button disabled/greyed out
- **System Errors**: N/A (no errors from view toggle itself)
- **Recovery**: Generate email to enable Preview

### Empty States
- **No Email**: Preview button disabled with tooltip "Generate an email first"
- **No Messages**: Chat view shows empty conversation
- **First Use**: Start on Chat view

### Success States
- **Email Generated**: Auto-switch to Preview + enable Preview button
- **View Switched**: Instant feedback via transition

## 9. User Flow Diagram

```
[App Loads on Mobile]
    ↓
[Default: Chat View Visible]
    ↓
[User types message] → [Generates email]
    ↓
[Email Generation Complete]
    ↓
[Auto-switch to Preview View]
    ↓
[Preview button now enabled + active]
    ↓
[User Decision] → [Tap "Chat" button] → [Slide back to Chat view]
                → [Stay in Preview] → [View/interact with email]

[App Loads on Desktop]
    ↓
[Both Chat and Preview visible]
    ↓
[No toggle needed - split view always shown]
```

## 10. Design Specifications

### Spacing Scale
- **Toggle Group**:
  - Container: `px-1 py-1` (tight padding around buttons)
  - Gap between buttons: 0 (seamless segmented control)
  - Buttons: `px-4 py-2` (comfortable tap targets)

### Typography
- **Button Text**:
  - Size: `text-sm` (14px)
  - Weight: `font-medium` (500) for active, `font-normal` (400) for inactive
  - Line-height: `leading-none`

### Color Usage
- **Active Button**:
  - Background: `bg-background` (white/dark)
  - Text: `text-foreground`
  - Border: Implicit via segmented control
- **Inactive Button**:
  - Background: `transparent`
  - Text: `text-muted-foreground`
  - Hover: `bg-muted/50`
- **Disabled Button**:
  - Background: `transparent`
  - Text: `text-muted-foreground/50`
  - Cursor: `cursor-not-allowed`

## 11. Performance Considerations

- **Critical Path**: View toggle state loads immediately (from Zustand)
- **Lazy Loading**: N/A
- **Image Optimization**: N/A
- **Animation Budget**:
  - Single 300ms transition per view switch
  - GPU-accelerated (transform, not position)
  - Respects `prefers-reduced-motion`

## 12. Implementation Coordination

### State Management Strategy

**New Zustand Store**: `src/stores/ui.store.ts`

```typescript
interface UIStore {
  activeView: 'chat' | 'preview';
  setActiveView: (view: 'chat' | 'preview') => void;
  toggleView: () => void;
}
```

**Why Zustand?**
- UI state (not server data) ✅
- Shared between Header and Page components ✅
- Needs persistence across component re-renders ✅

### Agent Collaboration
- **shadcn-builder**: Provide requirements for Toggle Group or custom button group
- **domain-architect**: N/A (no business logic)
- **Parent**: Implement in sequence:
  1. Create UI store
  2. Create text map
  3. Build ViewToggle component
  4. Modify Header
  5. Modify page.tsx for responsive behavior

### Files Impacted

**NEW FILES**:
- `src/stores/ui.store.ts` - View state management
- `src/stores/ui.text-map.ts` - Text content for UI
- `src/components/molecules/view-toggle.tsx` - Toggle component

**MODIFIED FILES**:
- `src/components/layout/header.tsx` - Add ViewToggle (conditional on breakpoint)
- `src/app/page.tsx` - Add responsive view switching logic
- `src/app/globals.css` - Add transition utilities if needed

**OPTIONAL FILES**:
- `src/hooks/use-responsive-view.ts` - Custom hook for view logic (if complex)

## 13. Technical Implementation Details

### Breakpoint Detection
Use Tailwind's responsive utilities + optional JavaScript hook:

**Option A: Pure CSS (Recommended)**
```tsx
{/* Mobile/Tablet: Show toggle */}
<div className="lg:hidden">
  <ViewToggle />
</div>

{/* Desktop: Hide toggle */}
<div className="hidden lg:block">
  {/* ... */}
</div>
```

**Option B: JavaScript Hook**
```tsx
const isMobile = useMediaQuery('(max-width: 1023px)');
```

### View Switching Logic in page.tsx

```tsx
const { activeView } = useUIStore();
const isMobile = useMediaQuery('(max-width: 1023px)');

// Desktop: Always show both
// Mobile: Show only active view
const showChat = !isMobile || activeView === 'chat';
const showPreview = !isMobile || activeView === 'preview';
```

### Auto-switch on Email Generation

In `chat.tsx`, when email generation completes:
```tsx
const { setActiveView } = useUIStore();

// After successful email generation
setActiveView('preview');
```

### Animation Strategy

**Mobile View Switch**:
```tsx
<AnimatePresence mode="wait">
  {activeView === 'chat' && (
    <motion.div
      key="chat"
      initial={{ x: direction === 'left' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === 'left' ? 100 : -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Chat />
    </motion.div>
  )}
  {activeView === 'preview' && (
    <motion.div key="preview" {...same}>
      <Previewer />
    </motion.div>
  )}
</AnimatePresence>
```

## 14. Important Notes

⚠️ **Auto-switch behavior**: When email is generated on mobile, automatically switch to Preview view for better UX

⚠️ **State persistence**: Consider persisting `activeView` in localStorage for user preference (optional enhancement)

💡 **Mobile-first**: Default to Chat view on initial load (mobile/tablet)

💡 **Content visibility**: Use `display: none` for hidden views (not `visibility: hidden` or `opacity: 0`) to prevent unnecessary rendering

📝 **Desktop unchanged**: Maintain existing split-view behavior for desktop users

🎨 **Consistency**: Match existing design system colors and spacing

💡 **Future enhancement**: Could add swipe gestures for view switching on mobile

## 15. Success Metrics

- **Usability**: Users can switch views in < 1 second
- **Efficiency**: Zero confusion about active view (clear visual feedback)
- **Satisfaction**: Smooth animations, no jank
- **Accessibility**:
  - Screen reader announces view changes
  - Keyboard-only navigation works
  - Touch targets meet 44px minimum
- **Performance**:
  - View switch completes in 300ms
  - No layout shift during transition
  - 60fps animation

## 16. Implementation Checklist

**Phase 1: State Management**
- [ ] Create `src/stores/ui.store.ts` with `activeView` state
- [ ] Create `src/stores/ui.text-map.ts` with button labels
- [ ] Add auto-switch logic to `chat.tsx` when email generated

**Phase 2: Component Creation**
- [ ] Create `src/components/molecules/view-toggle.tsx`
- [ ] Implement segmented control UI
- [ ] Add accessibility attributes (aria-pressed, aria-label)
- [ ] Add keyboard navigation support

**Phase 3: Layout Integration**
- [ ] Modify `header.tsx` to show ViewToggle on mobile/tablet
- [ ] Hide ViewToggle on desktop (≥1024px)
- [ ] Update header layout for centered toggle

**Phase 4: Responsive Behavior**
- [ ] Modify `page.tsx` to conditionally render views based on `activeView`
- [ ] Add view switching animations (slide transitions)
- [ ] Ensure desktop behavior unchanged (split view always shown)
- [ ] Test breakpoint transitions (1023px → 1024px)

**Phase 5: Polish & Accessibility**
- [ ] Add `prefers-reduced-motion` support
- [ ] Test keyboard navigation (Tab, Arrow keys)
- [ ] Test screen reader announcements
- [ ] Verify touch target sizes (44x44px minimum)
- [ ] Test on actual mobile devices

**Phase 6: Testing**
- [ ] Test view switching on mobile (iOS Safari, Android Chrome)
- [ ] Test view switching on tablet (iPad, Android tablet)
- [ ] Test desktop unchanged behavior
- [ ] Test auto-switch when email generated
- [ ] Test disabled state when no email
- [ ] Test with keyboard only
- [ ] Test with screen reader

## 17. Code Snippets (Reference)

### UI Store Structure
```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';

interface UIStore {
  activeView: 'chat' | 'preview';
  setActiveView: (view: 'chat' | 'preview') => void;
  toggleView: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: 'chat',
  setActiveView: (view) => set({ activeView: view }),
  toggleView: () => set((state) => ({
    activeView: state.activeView === 'chat' ? 'preview' : 'chat'
  }))
}));
```

### ViewToggle Component (Conceptual)
```tsx
// src/components/molecules/view-toggle.tsx
'use client';

import { useUIStore } from '@/stores/ui.store';
import { UI_TEXT } from '@/stores/ui.text-map';
import { useEmailStore } from '@/stores/email.store';

export const ViewToggle = () => {
  const { activeView, setActiveView } = useUIStore();
  const { subject } = useEmailStore();

  const hasEmail = !!subject;

  return (
    <div
      role="tablist"
      aria-label={UI_TEXT.viewToggle.ariaLabel}
      className="inline-flex rounded-md bg-muted p-1"
    >
      <button
        role="tab"
        aria-selected={activeView === 'chat'}
        aria-label={UI_TEXT.viewToggle.ariaChatLabel}
        onClick={() => setActiveView('chat')}
        className={/* active/inactive styles */}
      >
        {UI_TEXT.viewToggle.chat}
      </button>

      <button
        role="tab"
        aria-selected={activeView === 'preview'}
        aria-label={UI_TEXT.viewToggle.ariaPreviewLabel}
        aria-disabled={!hasEmail}
        disabled={!hasEmail}
        onClick={() => setActiveView('preview')}
        className={/* active/inactive/disabled styles */}
      >
        {UI_TEXT.viewToggle.preview}
      </button>
    </div>
  );
};
```

### Page Layout (Conceptual)
```tsx
// src/app/page.tsx
'use client';

import { useUIStore } from '@/stores/ui.store';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Home() {
  const { activeView } = useUIStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const showChat = isDesktop || activeView === 'chat';
  const showPreview = isDesktop || activeView === 'preview';

  return (
    <div>
      <Header />
      <main className="grid">
        <AnimatePresence mode="wait">
          {showChat && <Chat key="chat" />}
          {showPreview && <Previewer key="preview" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
```

---

## Next Steps

1. **Parent reviews this UX plan**
2. **Coordinate with shadcn-builder** for Toggle Group component (if needed)
3. **Parent implements** following the phase checklist above
4. **Test on multiple devices** (mobile, tablet, desktop)
5. **Iterate based on user feedback**

---

**Design Philosophy Applied**:
- ✅ Mobile-first approach
- ✅ Accessibility from the start
- ✅ Clear user feedback on all interactions
- ✅ Consistent with existing design patterns
- ✅ Performance-conscious animations
- ✅ Content before chrome (toggle doesn't dominate header)
