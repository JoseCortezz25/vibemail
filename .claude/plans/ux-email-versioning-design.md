# Email Version Control - UX/UI Design Plan

**Created**: 2025-12-11
**Session**: email-version-control-01YEjQztMb2DCJqehnaoGvnw
**Complexity**: Medium
**User Impact**: High - Critical feature for iterative email refinement

## 1. User Context

### User Goals
- **Primary Goal**: View history of all generated email versions and restore previous versions
- **Secondary Goals**:
  - Quickly compare different versions
  - Understand what prompt generated each version
  - Experiment freely knowing they can revert changes
  - Branch from a previous version to explore alternatives
- **Success Criteria**:
  - User can access version history in 1 click
  - Version list clearly shows current vs previous versions
  - User can restore a version in 2 clicks
  - Version metadata (timestamp, prompt) helps identify desired version
  - No data loss when switching versions

### User Personas
- **Primary**: Marketing professionals iterating on email campaigns
- **Context**: After generating initial email, user asks AI for modifications. Some changes are good, others aren't. User wants to go back to a previous version without re-prompting.
- **Pain Points**:
  - Current system only shows latest version (no history)
  - Lost good versions when AI generates unwanted changes
  - No way to compare versions side-by-side
  - Can't remember what prompt created which version
  - Fear of losing progress discourages experimentation

### User Journey
1. **Email Generated (v1)** → User reviews → Wants improvement
2. **Asks AI for changes** → v2 generated → User reviews → Some parts good, some not
3. **Asks for more changes** → v3 generated → User reviews → Worse than v2
4. **Clicks version dropdown** → Sees v1, v2, v3 with timestamps and prompts
5. **Hovers v2** → Sees metadata: "2 minutes ago, 'Make the CTA button bigger'"
6. **Clicks v2** → Confirmation dialog: "Restore this version?"
7. **Confirms** → v2 becomes current → Can continue editing from there

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Version selector trigger (always visible near preview)
2. **Secondary**: Version list dropdown (accessed on demand)
3. **Tertiary**: Version details (timestamp, prompt snippet, metadata)

### Layout Strategy
- **Structure**: Version selector as dropdown button in preview header area
- **Dropdown**: Opens below selector, shows scrollable list of versions
- **Detailed View**: Optional Sheet panel for advanced comparison (future enhancement)
- **Position**: Near device toggle (desktop/mobile) in preview controls
- **Spacing**: Consistent with existing toolbar spacing

### Visual Hierarchy
- **Focal Point**: Version selector button (subtle when collapsed, prominent when active)
- **Visual Flow**:
  1. User's eye naturally scans toolbar above preview
  2. Version selector positioned logically near other preview controls
  3. Dropdown opens directly below, maintaining spatial relationship
- **Grouping**:
  - Current version clearly separated (badge + styling)
  - Previous versions grouped by recency
  - Related metadata clustered together
- **Contrast**: Current version uses accent color, previous versions muted

### Breakpoints & Responsive Strategy
- **Mobile (< 640px)**:
  - Version selector button shown (icon only)
  - Dropdown full width, slides up from bottom (Sheet component)
  - Simplified view: version number, timestamp, restore button
  - No prompt snippets (space constrained)
- **Tablet (640px - 1024px)**:
  - Version selector button with text label
  - Dropdown right-aligned below button
  - Shows version number, timestamp, prompt snippet (1 line)
  - Restore button on hover
- **Desktop (> 1024px)**:
  - Full selector with icon + text
  - Dropdown optimal width (400px)
  - Shows all metadata: version, timestamp, full prompt preview
  - Hover state shows restore button + copy prompt button

## 3. Interaction Design

### Version Selector Button (Trigger)

#### Default State
- **Visual**:
  - Icon: History/Clock icon (from lucide-react)
  - Text: "v{current-number}" or "Version {number}"
  - Badge: Small indicator showing total version count
  - Style: Secondary button styling, matches device toggle aesthetic
- **Location**: In preview toolbar, to the right of device toggle (Desktop/Mobile)
- **Behavior**: Clicks opens dropdown

#### Active State (Dropdown Open)
- **Visual**:
  - Button background changes to accent color
  - Dropdown indicator rotates 180°
  - Button stays highlighted while dropdown open
- **Behavior**: Click again closes dropdown

#### States Based on Version Count
- **No versions** (0): Disabled state, tooltip: "No versions available"
- **Single version** (1): Disabled state, tooltip: "Only one version exists"
- **Multiple versions** (2+): Enabled, shows count badge

### Version Dropdown (List)

#### Structure
```
┌─────────────────────────────────────────────┐
│  Version History                   [Close]  │
├─────────────────────────────────────────────┤
│                                             │
│  [CURRENT]                                  │
│  Version 3                     [✓ Current]  │
│  Just now                                   │
│  "Make the button colors more vibrant"      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Version 2                      [Restore]   │
│  2 minutes ago                              │
│  "Add a hero image at the top"              │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Version 1                      [Restore]   │
│  5 minutes ago                              │
│  "Create a welcome email for new users"     │
│                                             │
└─────────────────────────────────────────────┘
```

#### Version Item Components
Each version item shows:

1. **Version Number**:
   - Text: "Version {number}" (human-friendly numbering)
   - Style: `text-sm font-semibold`
   - Position: Top left

2. **Current Badge** (if current):
   - Badge component with checkmark icon
   - Text: "Current"
   - Variant: success/default with accent color
   - Position: Top right

3. **Restore Button** (if not current):
   - Button component, variant: ghost, size: sm
   - Text: "Restore"
   - Icon: RotateCcw (counter-clockwise arrow)
   - Position: Top right
   - Behavior: Click triggers confirmation dialog

4. **Timestamp**:
   - Relative time: "Just now", "2 minutes ago", "1 hour ago", "Yesterday", "Dec 10, 2025"
   - Style: `text-xs text-muted-foreground`
   - Position: Below version number

5. **Prompt Snippet**:
   - First 60 characters of the prompt that generated this version
   - Style: `text-xs text-muted-foreground italic`
   - Truncation: "..." if exceeds 60 chars
   - Position: Below timestamp
   - Behavior: Tooltip shows full prompt on hover

6. **Divider**:
   - Separator component between versions
   - Style: subtle, muted

#### Dropdown Behavior
- **Max Height**: 400px (shows ~4-5 versions before scrolling)
- **Scroll**: ScrollArea component for smooth scrolling
- **Ordering**: Newest first (v3, v2, v1)
- **Current Version**: Always shown at top (even if not newest)
- **Loading State**: Skeleton loading for version list
- **Empty State**: Should not occur (at least one version always exists)

### Hover & Focus States

#### Version Item Hover
- **Non-current version**:
  - Background: `hover:bg-accent/50`
  - Restore button becomes more prominent
  - Cursor: pointer
  - Transition: smooth 150ms

- **Current version**:
  - Background: `bg-accent` (already highlighted)
  - No hover change (already active)
  - Cursor: default

#### Keyboard Navigation
- **Tab**: Focus moves through version items
- **Arrow Down/Up**: Navigate between versions
- **Enter**:
  - If on current version: close dropdown
  - If on previous version: open restore confirmation
- **Escape**: Close dropdown
- **Home/End**: Jump to first/last version

### Restore Confirmation Dialog

#### When to Show
- User clicks "Restore" button on a previous version
- Prevents accidental restoration

#### Dialog Structure
```
┌──────────────────────────────────────────────┐
│  Restore Version 2?                   [X]    │
├──────────────────────────────────────────────┤
│                                              │
│  This will replace your current email with   │
│  Version 2 from 2 minutes ago.               │
│                                              │
│  Prompt: "Add a hero image at the top"       │
│                                              │
│  Your current version (v3) will remain in    │
│  the version history and can be restored     │
│  later.                                      │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ [ Preview of v2 - optional future ]    │ │
│  └────────────────────────────────────────┘ │
│                                              │
│          [Cancel]    [Restore Version 2]     │
│                                              │
└──────────────────────────────────────────────┘
```

#### Dialog Content
- **Title**: "Restore Version {number}?"
- **Description**: Clear explanation of what will happen
- **Prompt Display**: Shows the prompt that created this version
- **Reassurance**: Current version won't be lost
- **Preview** (optional, v2): Thumbnail or iframe preview of version
- **Actions**:
  - **Cancel**: Secondary button, closes dialog
  - **Restore**: Primary button, destructive variant, executes restore

#### Restore Process
1. User confirms → Dialog shows loading state
2. Store updates current email to selected version
3. Success toast: "Version {number} restored"
4. Dropdown closes automatically
5. Preview updates with restored content
6. Selector button updates to show new current version

### Micro-interactions

#### Hover Effects
- **Selector Button**: Background color change, subtle scale (1.02)
- **Version Item**: Background highlight, restore button fade-in
- **Restore Button**: Standard button hover (scale, color)

#### Focus States
- **Selector Button**: Ring-2 ring-primary
- **Version Items**: Ring-2 ring-primary (keyboard navigation)
- **Restore Button**: Ring-2 ring-primary

#### Loading States
- **Opening Dropdown**:
  - Button shows brief loading state (< 100ms)
  - Dropdown skeleton while loading versions
- **Restoring Version**:
  - Dialog buttons disabled
  - Restore button shows spinner: "Restoring..."
  - Preview shows loading overlay

#### Transitions
- **Dropdown Open**: Fade + slide down (150ms ease-out)
- **Dropdown Close**: Fade + slide up (150ms ease-out)
- **Version Highlight**: Background color transition (150ms)
- **Dialog Appearance**: Fade + scale up (200ms)

#### Success/Error Feedback
- **Restore Success**:
  - Toast: "Version {number} restored successfully"
  - Brief green flash on preview border (500ms)
  - Dropdown closes smoothly

- **Restore Error**:
  - Toast: "Failed to restore version. Please try again."
  - Dialog remains open (user can retry or cancel)
  - Error message shown below actions

## 4. Component Selection

### shadcn/ui Components Needed

**Already Available**:
1. **Button**: Selector trigger, restore buttons
2. **Badge**: Current version indicator
3. **Separator**: Between version items
4. **Dialog**: Restore confirmation
5. **Tooltip**: Full prompt preview on hover
6. **Dropdown Menu**: Could use this, but custom dropdown might be better
7. **Card**: Version item containers (optional)

**Coordinate with shadcn-builder**:
- Verify ScrollArea is available for version list scrolling
- Confirm Dialog component supports custom content structure
- Check if Popover could be used instead of custom dropdown

### Custom Components Needed

1. **VersionSelector** (molecule):
   - Button trigger + dropdown logic
   - Manages open/close state
   - Coordinates with version store

2. **VersionList** (molecule):
   - Scrollable list of version items
   - Handles keyboard navigation
   - Empty/loading states

3. **VersionItem** (atom):
   - Individual version display
   - Shows: number, timestamp, prompt, badge/button
   - Hover states

4. **RestoreConfirmationDialog** (molecule):
   - Custom dialog for restore confirmation
   - Shows version details
   - Handles restore action

5. **VersionBadge** (atom):
   - "Current" badge with checkmark
   - Uses shadcn Badge as foundation

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/constants/version-selector.text-map.ts` (NEW)

**Keys to Define**:
```typescript
export const VERSION_SELECTOR_TEXT = {
  // Selector button
  trigger: {
    label: 'Version History',
    ariaLabel: 'Open version history',
    currentVersion: 'Current: Version {number}',
    versionCount: '{count} versions',
  },

  // Dropdown header
  dropdown: {
    title: 'Version History',
    close: 'Close version history',
    closeAriaLabel: 'Close version history dropdown',
  },

  // Version items
  version: {
    number: 'Version {number}',
    current: 'Current',
    currentAriaLabel: 'Current version',
    restore: 'Restore',
    restoreAriaLabel: 'Restore version {number}',
  },

  // Timestamps (relative)
  timestamp: {
    justNow: 'Just now',
    minutesAgo: '{count} {plural} ago', // "2 minutes ago"
    hoursAgo: '{count} {plural} ago',
    yesterday: 'Yesterday',
    daysAgo: '{count} days ago',
    date: '{date}', // Fallback: "Dec 10, 2025"
  },

  // Prompt display
  prompt: {
    label: 'Prompt',
    noPrompt: 'No prompt available',
    viewFull: 'View full prompt',
    truncated: '... (click to see full prompt)',
  },

  // Restore dialog
  restoreDialog: {
    title: 'Restore Version {number}?',
    description: 'This will replace your current email with Version {number} from {timestamp}.',
    promptLabel: 'Prompt',
    reassurance: 'Your current version will remain in the version history and can be restored later.',
    cancel: 'Cancel',
    confirm: 'Restore Version {number}',
    confirming: 'Restoring...',
  },

  // Feedback messages
  feedback: {
    restoreSuccess: 'Version {number} restored successfully',
    restoreError: 'Failed to restore version. Please try again.',
    loadError: 'Failed to load version history',
  },

  // Empty/disabled states
  emptyState: {
    noVersions: 'No versions available',
    onlyOneVersion: 'Only one version exists',
    generateFirst: 'Generate an email to create versions',
  },

  // Tooltips
  tooltips: {
    selectorDisabled: 'No version history available yet',
    currentVersion: 'This is the currently displayed version',
    restoreVersion: 'Switch back to this version',
    viewPrompt: 'View the full prompt that created this version',
  },

  // Accessibility
  accessibility: {
    versionList: 'List of email versions',
    versionItem: 'Version {number}, created {timestamp}',
    currentVersionAnnouncement: 'Currently viewing version {number}',
    restoredAnnouncement: 'Version {number} has been restored',
  },
} as const;

export type VersionSelectorTextMap = typeof VERSION_SELECTOR_TEXT;
```

**Tone**: Clear, reassuring, technical but friendly
**Voice**: Active voice for actions, descriptive for labels

### Microcopy

- **Empty States**: "Generate an email to create versions" (encouraging first use)
- **Error States**: Specific, actionable: "Failed to restore version. Please try again."
- **Success States**: Brief confirmation: "Version 2 restored successfully"
- **Loading States**: "Loading versions..." / "Restoring..."
- **Reassurance**: "Your current version won't be lost" (reduces restore anxiety)

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - Selector button: `<button>` with aria-label
  - Dropdown: `role="menu"` or custom region
  - Version list: `role="list"` with `role="listitem"`
  - Dialog: Native Dialog component (proper focus trap)

- **Headings**:
  - h2: "Version History" (dropdown header)
  - h3: "Restore Version {number}?" (dialog title)

- **Lists**: Version list as semantic `<ul>` with `<li>` items

### Keyboard Navigation

#### Selector Button
- **Tab**: Focus on button
- **Enter/Space**: Open dropdown
- **Arrow Down**: Open dropdown and focus first item

#### Dropdown (Version List)
- **Tab**: Navigate through version items and restore buttons
- **Arrow Down**: Move to next version
- **Arrow Up**: Move to previous version
- **Home**: Jump to first version
- **End**: Jump to last version
- **Enter**:
  - On current version: close dropdown
  - On previous version: open restore dialog
- **Escape**: Close dropdown, return focus to selector button

#### Restore Dialog
- **Tab**: Move between Cancel and Restore buttons
- **Enter**: Confirm restore (if on Restore button)
- **Escape**: Cancel and close dialog
- **Focus**: Trapped within dialog (cannot tab outside)

### Screen Reader Experience

#### ARIA Labels
- **Selector Button**:
  - `aria-label="Version history. Current: Version {number}. {count} versions available"`
  - `aria-expanded="true/false"` (dropdown state)
  - `aria-haspopup="menu"`

- **Dropdown**:
  - `aria-label="Version history menu"`
  - `role="menu"` or `role="region"`

- **Version Items**:
  - `aria-label="Version {number}, created {timestamp}. Prompt: {snippet}"`
  - Current version: `aria-current="true"`

- **Restore Button**:
  - `aria-label="Restore version {number} from {timestamp}"`

- **Dialog**:
  - `aria-labelledby` pointing to title
  - `aria-describedby` pointing to description

#### ARIA Descriptions
- **Prompt Truncation**: `aria-describedby` links to full prompt (hidden)
- **Current Badge**: `aria-label="Current version"` on badge
- **Version Count**: Announced in selector button label

#### Live Regions
- **Restore Success**: `aria-live="polite"` announces "Version {number} restored"
- **Restore Error**: `aria-live="assertive"` announces error immediately
- **Version List Update**: `aria-live="polite"` when new version added

#### Hidden Content
- **Full Prompt**: Visually truncated but full text in aria-label or describedby
- **Timestamp Format**: Human-readable format for screen readers
- **Icon-only Elements**: Text alternatives for all icons

### Visual Accessibility

#### Color Contrast
- **Selector Button**: 4.5:1 contrast against toolbar background
- **Version Items**: 4.5:1 contrast for text against item background
- **Current Badge**: 4.5:1 contrast (accent color with sufficient contrast)
- **Restore Button**: 4.5:1 contrast in all states

#### Color Independence
- **Current Version**: Badge + "Current" text (not color only)
- **Restore Button**: Icon + text (not color only)
- **Hover State**: Background + border change (not color only)

#### Text Size
- **Selector Button**: 14px minimum
- **Version Number**: 14px (semibold for emphasis)
- **Timestamp**: 12px (acceptable for secondary info, good contrast)
- **Prompt Snippet**: 12px (muted but readable)

#### Touch Targets
- **Selector Button**: 44x44px minimum (mobile/tablet)
- **Restore Button**: 44x44px minimum (mobile/tablet)
- **Version Items**: 60px min height (mobile) for easy tapping
- **Dialog Buttons**: 44px height minimum

#### Motion
- **prefers-reduced-motion**:
  - Disable dropdown slide animation (use fade only)
  - Disable selector button scale on hover
  - Disable dialog scale animation
  - Keep fade transitions (less jarring than instant)

## 7. Responsive Design

### Mobile (< 640px)
- **Selector Button**:
  - Icon only (History icon) with version number badge
  - 44x44px touch target
  - Position: Top right of preview toolbar

- **Dropdown**:
  - Full-screen Sheet component (slides up from bottom)
  - Header with "Version History" title + close button
  - Version items: simplified layout
    - Version number + Current badge
    - Timestamp (relative)
    - No prompt snippet (space constrained)
    - Restore button full width below timestamp
  - Max 80vh height, scrollable

- **Dialog**:
  - Full-screen or 90% width
  - Buttons stacked vertically, full width
  - No preview thumbnail

### Tablet (640px - 1024px)
- **Selector Button**:
  - Icon + "v{number}" text
  - Compact width (auto)
  - Position: Right of device toggle

- **Dropdown**:
  - Popover-style dropdown (not full-screen)
  - Width: 350px
  - Max height: 400px
  - Right-aligned below selector button
  - Version items: medium layout
    - Version number + badge/button
    - Timestamp
    - Prompt snippet (1 line, truncated)
  - Scrollable if > 4-5 versions

- **Dialog**:
  - 500px width, centered
  - Buttons side-by-side (Cancel / Restore)
  - Optional preview thumbnail (small)

### Desktop (> 1024px)
- **Selector Button**:
  - Full layout: Icon + "Version History" text + dropdown arrow
  - Or: Icon + "v{number}" + count badge
  - Optimal width (auto)
  - Position: Right of device toggle

- **Dropdown**:
  - Optimal width: 400px
  - Max height: 500px (shows ~5-6 versions)
  - Right-aligned below selector button
  - Version items: full layout
    - Version number + badge/button
    - Timestamp
    - Prompt snippet (2 lines max, truncated)
  - Hover states fully visible
  - Tooltips show full prompt

- **Dialog**:
  - 600px width, centered
  - Buttons side-by-side, optimal sizing
  - Optional preview iframe (medium size, 300x200px)

## 8. States & Feedback

### Loading States

#### Opening Dropdown
- Selector button briefly shows loading indicator (< 100ms)
- Dropdown shows skeleton:
  - 3-4 skeleton version items
  - Shimmer animation
  - Maintains expected height (no layout shift)

#### Restoring Version
- Dialog:
  - Restore button disabled
  - Spinner + "Restoring..." text
  - Cancel button remains enabled (can abort)
- Preview:
  - Loading overlay: "Updating preview..."
  - Existing content dims slightly
- Selector:
  - Disabled during restore process

### Error States

#### Load Error (Failed to Fetch Versions)
- Dropdown shows error state:
  - Error icon
  - Message: "Failed to load version history"
  - Retry button: "Try Again"
  - Visual: Muted background, error icon color

#### Restore Error
- Toast notification: "Failed to restore version. Please try again."
- Dialog remains open (allows retry)
- Error message shown below buttons (optional)
- Restore button re-enabled (can try again)

#### Network Error
- Toast: "Network error. Check your connection and try again."
- Restore dialog closes
- Selector remains functional

### Empty States

#### No Versions (Should Not Occur)
- Selector button disabled
- Tooltip: "No versions available"
- If somehow opened:
  - Dropdown shows: "No versions found"
  - Message: "Generate an email to create version history"

#### Single Version Only
- Selector button disabled (no need to switch)
- Tooltip: "Only one version exists"
- Or: Selector enabled but shows info message:
  - "You're viewing the only version"
  - "Generate variations to see version history"

### Success States

#### Version Restored
- Toast: "Version {number} restored successfully" (3 seconds)
- Brief green flash on preview border (500ms pulse)
- Dropdown closes automatically (smooth slide up)
- Selector button updates: "v{number}" changes to restored version
- Preview updates with restored content (smooth transition)
- Screen reader announces: "Version {number} has been restored"

#### New Version Created (Automatic)
- Version list updates automatically
- New version appears at top
- Previous "Current" badge moves to new version
- No toast (seamless background update)
- Screen reader announces: "New version created" (if user in version list)

## 9. User Flow Diagram

### Primary Flow: Restoring a Version

```
[User Viewing Email (v3)]
    ↓
[User Wants to Go Back to Previous Version]
    ↓
[Clicks Version Selector Button]
    ↓
[Dropdown Opens] ──→ [Screen Reader: "Version history menu opened"]
    ↓
[Sees Version List: v3 (Current), v2, v1]
    ↓
[Hovers v2] ──→ [Background Highlights] ──→ [Tooltip: Full Prompt]
    ↓
[Reads: "Version 2, 2 minutes ago, 'Add a hero image'"]
    ↓
[Clicks "Restore" Button on v2]
    ↓
[Restore Dialog Opens] ──→ [Focus Moves to Dialog]
    ↓
[Reads Confirmation: "Restore Version 2?"]
    ↓
[Sees Reassurance: "Current version won't be lost"]
    ↓
[Decision Point]
    ├─→ [Clicks "Cancel"] ──→ [Dialog Closes] ──→ [Back to Dropdown]
    └─→ [Clicks "Restore Version 2"]
            ↓
        [Restore Button Shows Spinner: "Restoring..."]
            ↓
        [Store Updates Email to v2 Content]
            ↓
        [Success!]
            ↓
        [Toast: "Version 2 restored successfully"] ──→ [Screen Reader Announces]
            ↓
        [Dialog Closes Smoothly]
            ↓
        [Dropdown Closes]
            ↓
        [Preview Updates to v2 Content] ──→ [Green Flash on Border]
            ↓
        [Selector Button Updates: "v2"]
            ↓
        [User Continues Working with v2]
            ↓
        [User Can Generate New Version (v4) from v2]
```

### Alternative Flow: Browsing Versions

```
[User Opens Version Dropdown]
    ↓
[Sees Multiple Versions]
    ↓
[Uses Arrow Keys to Navigate] ──→ [Keyboard Navigation]
    ↓
[Hovers Different Versions]
    ↓
[Reads Timestamps and Prompts]
    ↓
[Decides Current Version is Best]
    ↓
[Presses Escape or Clicks Outside]
    ↓
[Dropdown Closes]
    ↓
[Continues with Current Version]
```

### Error Flow: Restore Failed

```
[User Attempts to Restore v2]
    ↓
[Clicks "Restore" in Dialog]
    ↓
[Restore Process Starts]
    ↓
[Network/System Error Occurs]
    ↓
[Error Toast: "Failed to restore version"]
    ↓
[Dialog Remains Open]
    ↓
[Error Message Below Buttons: "Please try again"]
    ↓
[User Can:]
    ├─→ [Click "Restore" Again] ──→ [Retry]
    └─→ [Click "Cancel"] ──→ [Close Dialog]
```

## 10. Design Specifications

### Spacing Scale

#### Selector Button
- **Button Padding**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Icon-Text Gap**: `gap-2` (8px between icon and text)
- **Badge Offset**: `-top-1 -right-1` (overlaps button slightly)

#### Dropdown
- **Dropdown Padding**: `p-2` (8px around version list)
- **Header Padding**: `px-4 py-3` (16px horizontal, 12px vertical)
- **Version Item Padding**: `p-3` (12px all around)
- **Item Gap**: `space-y-1` (4px between items)
- **Section Gap**: `space-y-2` (8px between current and previous sections)

#### Dialog
- **Dialog Content Padding**: `p-6` (24px)
- **Title Margin**: `mb-4` (16px below title)
- **Description Margin**: `mb-6` (24px below description)
- **Button Gap**: `gap-3` (12px between Cancel and Restore)

### Typography

#### Selector Button
- **Button Text**: `text-sm font-medium` (14px, 500 weight)
- **Version Number**: `text-sm font-semibold` (14px, 600 weight)

#### Dropdown
- **Header Title**: `text-base font-semibold` (16px, 600 weight)
- **Version Number**: `text-sm font-semibold` (14px, 600 weight)
- **Timestamp**: `text-xs text-muted-foreground` (12px, muted)
- **Prompt Snippet**: `text-xs text-muted-foreground italic` (12px, muted, italic)
- **Badge Text**: `text-xs font-medium` (12px, 500 weight)
- **Restore Button**: `text-xs font-medium` (12px, 500 weight)

#### Dialog
- **Dialog Title**: `text-lg font-semibold` (18px, 600 weight)
- **Description**: `text-sm text-muted-foreground` (14px, muted)
- **Prompt Label**: `text-xs font-medium` (12px, 500 weight)
- **Prompt Content**: `text-sm` (14px)
- **Button Text**: `text-sm font-medium` (14px, 500 weight)

### Color Usage

#### Selector Button
- **Default**: `bg-background border-border` (secondary button style)
- **Hover**: `hover:bg-accent hover:text-accent-foreground`
- **Active (Open)**: `bg-accent text-accent-foreground`
- **Disabled**: `opacity-50 cursor-not-allowed`

#### Dropdown
- **Background**: `bg-popover border-border`
- **Shadow**: `shadow-lg` (depth)
- **Version Item Default**: `bg-transparent`
- **Version Item Hover**: `hover:bg-accent/50`
- **Current Version Background**: `bg-accent/20` (subtle highlight)

#### Badges & Buttons
- **Current Badge**:
  - `bg-green-500/10 text-green-700 border-green-500/20`
  - Or: Use shadcn Badge with variant="success"
- **Restore Button**:
  - Default: `variant="ghost" size="sm"`
  - Hover: `hover:bg-accent hover:text-accent-foreground`

#### Dialog
- **Restore Button**:
  - `variant="default"` (primary action)
  - Background: `bg-primary text-primary-foreground`
  - Hover: `hover:bg-primary/90`
- **Cancel Button**:
  - `variant="outline"`
  - Background: `bg-background border-border`

#### Feedback Colors
- **Success Toast**: Green background, checkmark icon
- **Error Toast**: Red background, X icon
- **Preview Flash (Success)**: Green border pulse: `border-green-500`

### Border & Radius
- **Selector Button**: `rounded-md border` (6px radius, 1px border)
- **Dropdown**: `rounded-lg border` (8px radius, 1px border)
- **Version Item**: `rounded-md` (6px radius when hovered)
- **Badge**: `rounded-full` (fully rounded pill shape)
- **Dialog**: `rounded-lg` (8px radius)
- **Restore Button**: `rounded-md` (6px radius)

### Shadows & Elevation
- **Selector Button**: `shadow-sm` (subtle)
- **Dropdown**: `shadow-lg` (elevated above content)
- **Dialog**: `shadow-xl` (highest elevation)
- **Version Item Hover**: No shadow (background change only)

## 11. Performance Considerations

### Critical Path
1. Selector button renders immediately (part of preview toolbar)
2. Version list loaded lazily when dropdown opened
3. Restore action updates store, then preview re-renders

### Lazy Loading
- **Dropdown Content**: Only rendered when dropdown opens (not pre-rendered)
- **Version List**: Fetched on first dropdown open, cached thereafter
- **Dialog**: Rendered on-demand when restore clicked
- **Prompt Tooltips**: Loaded lazily on hover

### Data Management
- **Version Storage**: Versions stored in Zustand store or database (TBD with domain architect)
- **Cache Strategy**: Version list cached, invalidated when new version created
- **Restore**: Updates store, triggers preview re-render
- **Optimistic Updates**: Button state updates immediately, success toast after confirmation

### Animation Budget
- **Dropdown Open/Close**: Translate + opacity (GPU-accelerated) < 150ms
- **Version Hover**: Background color only (lightweight) < 150ms
- **Dialog Appearance**: Scale + opacity (GPU-accelerated) < 200ms
- **Toast Animation**: Slide + fade (GPU-accelerated) < 300ms
- **Total Budget**: All animations < 16ms per frame (60fps)

### Memory Management
- **Version Limit**: Consider limiting stored versions (e.g., 50 max) to prevent unbounded growth
- **Cleanup**: Old versions pruned automatically (configurable threshold)
- **Event Listeners**: Cleanup on component unmount
- **Large Prompt Snippets**: Truncate in UI, full text in tooltip (lazy load)

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- Verify components: Button, Badge, Separator, Dialog, Tooltip, ScrollArea
- Check if Dropdown Menu component suitable or need custom dropdown
- Confirm Dialog supports custom content structure

**domain-architect**:
- Design version data structure:
  ```typescript
  interface EmailVersion {
    id: string;
    versionNumber: number;
    subject: string;
    jsxBody: string;
    htmlBody: string;
    prompt: string;
    timestamp: Date;
    isCurrent: boolean;
  }
  ```
- Decide: Zustand store vs database persistence (recommendation: both)
- Define store methods: `addVersion()`, `restoreVersion()`, `getVersionHistory()`
- Maximum versions to retain (recommendation: 50)

**nextjs-builder** (if server actions needed):
- Server action for persisting versions to database (if persistence required)
- Server action for fetching version history (if server-side)
- Validation: Ensure restored HTML is safe

**ai-sdk-expert**:
- When new email generated, automatically create new version
- Pass version context to AI if needed (e.g., "Based on version 2...")
- Future: AI could suggest "This change is significant, create checkpoint?"

**Parent**:
- Implement version selector component
- Wire up to version store
- Test restore flow end-to-end
- Integrate with existing preview component

### Files Impacted

**NEW FILES**:
- `src/components/molecules/version-selector.tsx` - Main selector component
- `src/components/molecules/version-list.tsx` - Scrollable version list
- `src/components/atoms/version-item.tsx` - Individual version display
- `src/components/atoms/version-badge.tsx` - "Current" badge component
- `src/components/molecules/restore-confirmation-dialog.tsx` - Restore dialog
- `src/constants/version-selector.text-map.ts` - All text content
- `src/stores/version.store.ts` or extend `email.store.ts` - Version state
- `src/lib/version-utils.ts` - Helper functions (format timestamp, truncate prompt)
- `src/lib/relative-time.ts` - Relative time formatting ("2 minutes ago")

**MODIFIED FILES**:
- `src/components/organisms/previewer-email.tsx` - Add version selector to toolbar
- `src/stores/email.store.ts` - Add version tracking methods (or separate store)
- `src/actions/generate.ts` - Automatically create version on email generation

**UTILITY FUNCTIONS**:
- `formatRelativeTime(date: Date): string` - "2 minutes ago", "Yesterday", etc.
- `truncatePrompt(prompt: string, maxLength: number): string` - Truncate with ellipsis
- `getVersionTitle(version: EmailVersion): string` - "Version {number}"
- `validateVersion(version: EmailVersion): boolean` - Validate before restore

### Data Flow

```
[AI Generates Email]
    ↓
[generate.ts creates new version]
    ↓
[Version Store: addVersion({ subject, htmlBody, jsxBody, prompt, timestamp })]
    ↓
[Email Store: setEmail(latest version)]
    ↓
[Preview renders latest version]

--- User Restores Version ---

[User selects version from dropdown]
    ↓
[Clicks "Restore"]
    ↓
[Dialog confirms]
    ↓
[Version Store: restoreVersion(versionId)]
    ↓
[Email Store: setEmail(selected version content)]
    ↓
[Preview re-renders with restored version]
    ↓
[Version Store: marks selected version as current]
```

## 13. Important Notes

**Version Storage Strategy**:
- Recommendation: Store last 50 versions per user
- Older versions auto-pruned (configurable)
- Consider database persistence for logged-in users
- LocalStorage fallback for anonymous users (with quota limits)

**Version Numbering**:
- Simple sequential: v1, v2, v3...
- Resets per email? Or continuous per session?
- Recommendation: Per email (each email has own version history)

**"Current" Version Logic**:
- Current version is the one displayed in preview
- When user restores v2, v2 becomes current (not a new v4)
- Branching: If user restores v2 and generates new email, that becomes v4
- Linear history maintained (no git-like branching in v1)

**Automatic Version Creation**:
- Every AI generation creates new version (automatic)
- Manual edits (visual editing) do NOT create versions (only AI generations)
- Rationale: Versions tied to AI prompts, not manual tweaks

**Persistence**:
- Anonymous users: LocalStorage (last 20 versions, 5MB limit)
- Logged-in users: Database (last 50 versions per email)
- Sync strategy: Store to LocalStorage immediately, sync to DB async

**Edge Cases**:
- User at max versions (50) → Remove oldest when adding new
- User restores version, then closes browser → Current version persisted
- Concurrent sessions → Last write wins (simple conflict resolution)

**Future Enhancements** (not v1):
- Version preview thumbnails (iframe screenshot)
- Side-by-side comparison view
- Diff highlighting (show what changed)
- Version tagging/naming ("Final draft", "Client review")
- Version branching (create alternative from any version)
- Export version history
- "Fork" a version to create separate email

## 14. Success Metrics

### Usability
- User discovers version selector within 10 seconds of second email generation
- User can restore a version in < 5 seconds (2 clicks + confirmation)
- Version list is immediately understandable (labels clear)
- User correctly identifies current vs previous versions 100% of the time

### Efficiency
- Restoring version 3x faster than re-prompting AI
- Average restore time: < 5 seconds (including confirmation)
- No confusion about which version is active

### Satisfaction
- User feels safe experimenting (knows they can revert)
- Reduced frustration with unwanted AI changes
- Increased confidence in iterative refinement
- Positive feedback: "I can try different directions without worry"

### Accessibility
- Screen reader users can navigate version list with keyboard
- All actions achievable without mouse
- Color blind users can distinguish current vs previous (badge + text)
- Touch targets 44px minimum on mobile/tablet

### Performance
- Dropdown opens in < 150ms
- Version list loads in < 300ms
- Restore completes in < 500ms
- No lag when scrolling version list (even with 50 versions)

## 15. Implementation Phases

### Phase 1: Data Structure & Storage
1. Create `EmailVersion` interface
2. Set up version store (Zustand)
3. Add methods: `addVersion`, `getVersions`, `restoreVersion`
4. Test version storage and retrieval
5. Implement version limit (max 50, auto-prune)

### Phase 2: Selector Button
1. Create `VersionSelector` component (button only)
2. Add to preview toolbar
3. Display current version number
4. Disabled state if only 1 version
5. Test button states

### Phase 3: Version List Dropdown
1. Create `VersionList` component
2. Create `VersionItem` atom
3. Implement dropdown open/close logic
4. Show version number, timestamp, prompt snippet
5. Add Current badge to active version
6. Test with multiple versions

### Phase 4: Restore Functionality
1. Create `RestoreConfirmationDialog` component
2. Wire up restore button to dialog
3. Implement restore action (update store)
4. Update preview when restored
5. Add success toast
6. Test restore flow

### Phase 5: Polish & Interactions
1. Add hover states
2. Implement keyboard navigation
3. Add tooltips (full prompt)
4. Smooth transitions (dropdown, dialog)
5. Loading states (skeleton, spinner)
6. Error handling and error states

### Phase 6: Accessibility
1. Add all ARIA labels and descriptions
2. Test keyboard navigation
3. Test with screen reader (NVDA/VoiceOver)
4. Ensure focus management correct
5. Add prefers-reduced-motion support
6. Verify color contrast

### Phase 7: Responsive Design
1. Implement mobile layout (Sheet instead of dropdown)
2. Implement tablet layout
3. Test all breakpoints
4. Adjust touch targets for mobile/tablet
5. Test on real devices

### Phase 8: Integration & Testing
1. Hook up to AI generation (auto-create version)
2. Test with visual editing (no version created)
3. Test version limit enforcement
4. Test with edge cases (empty, single version)
5. End-to-end testing
6. Performance testing (50 versions)

## 16. Edge Cases & Validation

### Version Storage
- **Max versions reached**: Remove oldest, add newest
- **LocalStorage quota exceeded**: Remove old versions until within quota
- **Invalid version data**: Skip corrupted versions, show error toast

### Version List
- **Empty list**: Should not occur (at least current version exists)
- **Single version**: Disable selector, show tooltip
- **50+ versions**: Limit to 50, prune oldest automatically

### Restore Action
- **Restore current version**: No-op, close dialog with message "Already viewing this version"
- **Restore while loading**: Disable restore button until ready
- **Network error during restore**: Show error, allow retry
- **Invalid version data**: Show error, prevent restore

### UI States
- **Dropdown too tall**: Scroll after 5-6 versions (max-height: 500px)
- **Prompt too long**: Truncate to 60 chars, show full in tooltip
- **Timestamp very old**: Format as date instead of relative time ("Dec 10, 2025")

### Concurrent Actions
- **User opens dropdown while AI generating**: Show loading state in list
- **New version created while dropdown open**: List updates live (or on re-open)
- **User switches pages**: Close dropdown, don't lose version state

## 17. Text Formatting & Localization (Future)

### Relative Time Formatting
- **Just now**: 0-10 seconds ago
- **X minutes ago**: 10 seconds - 60 minutes
- **X hours ago**: 60 minutes - 24 hours
- **Yesterday**: 24-48 hours ago
- **X days ago**: 2-7 days ago
- **Date**: > 7 days (e.g., "Dec 10, 2025")

### Prompt Truncation
- **Length**: 60 characters for desktop, 40 for mobile
- **Method**: Truncate at word boundary, add "..."
- **Full Text**: Available in tooltip (desktop) or tap to expand (mobile)

### Pluralization
- **English**: "1 minute ago" vs "2 minutes ago"
- **Future i18n**: Use pluralization library (e.g., i18next)

### Number Formatting
- **Version Numbers**: "Version 1", "Version 2" (not "Version 01")
- **Counts**: "3 versions" (not "03 versions")

## 18. Security Considerations

### Version Data Validation
- **HTML Sanitization**: Validate restored HTML is safe (prevent XSS)
- **Prompt Storage**: Sanitize prompts before storing (prevent injection)
- **Version ID**: Use UUIDs (prevent enumeration attacks)

### LocalStorage Security
- **No Sensitive Data**: Never store API keys, personal data in versions
- **Size Limits**: Enforce max version size (prevent quota abuse)
- **Clear on Logout**: Clear version history on logout (if auth added)

### Database Persistence (Future)
- **User Isolation**: Versions scoped to user (cannot access others' versions)
- **Rate Limiting**: Limit version creation rate (prevent abuse)
- **Audit Log**: Track version restores (optional, for analytics)

## 19. Analytics & Monitoring (Optional)

### Events to Track
- **Version Selector Opened**: User discovers feature
- **Version Restored**: User successfully restores version
- **Restore Cancelled**: User opened dialog but cancelled
- **Version List Viewed**: User browsed versions without restoring
- **Error Occurred**: Track restore errors, load errors

### Metrics to Monitor
- **Average Versions Per Email**: How much do users iterate?
- **Restore Rate**: % of users who restore vs always use latest
- **Time to Restore**: How long does restore take?
- **Most Common Restore Pattern**: Users restore to v-1? v-2? Earlier?

## 20. User Education & Onboarding

### First-Time Experience
- **Tooltip on First Email**: "Your email versions are saved here"
- **Badge Indicator**: Show "New" badge on selector after 2nd version created
- **Empty State**: "Generate more emails to see version history"

### Contextual Help
- **Tooltip on Selector**: "View and restore previous email versions"
- **Dialog Reassurance**: "Your current version won't be lost"
- **Help Icon**: Optional help icon in dropdown header linking to docs

### Documentation (Future)
- **Help Article**: "Understanding Email Versions"
- **Video Tutorial**: Quick 30-second demo
- **FAQ**: "Can I go back to a previous version?" → Yes, here's how

---

## Summary: Key Design Decisions

**UI Pattern**: Dropdown menu (not full Sheet panel) for quick access
**Placement**: Preview toolbar, right of device toggle
**Version Display**: Number, timestamp, prompt snippet, current badge
**Restore Flow**: Click restore → Confirmation dialog → Success toast
**Mobile Strategy**: Sheet component for full-screen list (simplified)
**Accessibility**: Full keyboard navigation, screen reader support
**Performance**: Lazy loading, GPU-accelerated animations
**Storage**: Zustand store + optional database persistence
**Versioning**: Automatic on AI generation, not on manual edits
**Limit**: 50 versions max per email, auto-prune oldest

---

## Next Steps

1. **Parent reviews this UX plan**
2. **Domain architect designs version data structure**
3. **Shadcn-builder verifies component availability**
4. **Parent implements phase-by-phase**
5. **Test with real users** (usability testing)
6. **Code reviewer validates** (accessibility, performance)

---

## Collaboration Needed

**domain-architect**:
- Define `EmailVersion` interface
- Design version store structure
- Decide persistence strategy (LocalStorage + DB?)
- Define max versions limit

**shadcn-builder**:
- Verify ScrollArea component available
- Check Dropdown Menu vs custom dropdown recommendation
- Confirm Dialog supports custom content

**nextjs-builder** (if needed):
- Server actions for version persistence (if database)
- API routes for fetching versions (if server-side)

**ai-sdk-expert**:
- Hook version creation into generate action
- Ensure each generation creates new version automatically

---

**Design Philosophy Applied**:

- User-First: Reduces fear of experimentation, empowers iterative refinement
- Accessibility: Full keyboard + screen reader support from day 1
- Responsive: Mobile-optimized Sheet, desktop-optimized dropdown
- Consistency: Uses existing shadcn components (Button, Badge, Dialog, Separator)
- Performance: Lazy loading, efficient rendering, GPU animations
- Feedback: Clear visual indicators (current badge, restore confirmation, success toast)
- Error Prevention: Confirmation dialog prevents accidental restores
- Recognition over Recall: Shows prompt snippet so user remembers version context

---

**Key Innovation**:

This design treats versions as a time-travel feature with clear visual affordances. The dropdown provides quick access without cluttering the UI, while the confirmation dialog reduces anxiety about restoring. Prompt snippets help users identify versions without needing perfect memory. The current badge makes it impossible to lose track of which version is active.
