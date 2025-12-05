# Download Email Button - UX/UI Design Plan

**Created**: 2025-12-04
**Session**: download-email-html-20251204
**Complexity**: Low
**User Impact**: Medium - Convenient feature for email management

## 1. User Context

### User Goals
- **Primary Goal**: Download generated email HTML for local storage, sharing, or external use
- **Secondary Goals**:
  - Quick access without complex navigation
  - Save email for offline viewing or backup
  - Share email HTML with colleagues or clients
- **Success Criteria**:
  - User can download email in one click
  - Downloaded file has meaningful name
  - Action feels immediate and confident

### User Personas
- **Primary**: Business professionals generating marketing/sales emails
- **Context**: After generating email, want to save/share the HTML version
- **Pain Points**:
  - No way to export generated email currently
  - Need to manually copy-paste HTML from browser
  - Want to keep record of generated emails

### User Journey
1. **User generates email** → Email appears in preview → User reviews content
2. **User wants to save** → Sees download button in bottom-right → Recognizes download action
3. **User clicks download** → File downloads immediately → Success feedback shown
4. **Downloaded file** → Opens in browser/email client → Content matches preview exactly

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Email preview content (main focus)
2. **Secondary**: Download button (supporting action, non-intrusive)
3. **Tertiary**: Device toggle and other header controls

### Layout Strategy
- **Structure**: Floating action button (FAB) positioned absolutely
- **Grid**: Independent of main preview layout
- **Spacing**: Fixed position relative to preview container
- **Breakpoints**:
  - Mobile (< 640px): Bottom-right with 16px margin from edges
  - Tablet (640px - 1024px): Bottom-right with 20px margin
  - Desktop (> 1024px): Bottom-right with 24px margin

### Visual Hierarchy
- **Focal Point**: Email content remains primary focus
- **Visual Flow**: Eyes naturally settle on preview → notice button in periphery
- **Grouping**: Button floats independently, not grouped with other controls
- **Contrast**: Sufficient contrast against preview background, uses elevation (shadow)

## 3. Interaction Design

### Primary Actions

- **Action**: Download button
  - **Type**: Floating Action Button (FAB) with icon
  - **Location**: Bottom-right corner of preview container
  - **State**:
    - Default: Visible with shadow, subtle presence
    - Hover: Lifts (increased shadow), background darkens slightly
    - Active: Scales down slightly (0.95), immediate feedback
    - Focus: Visible ring for keyboard navigation
    - Disabled: Hidden (only shown when htmlBody exists)
  - **Feedback**:
    - Click → Button animates briefly → File downloads
    - Optional: Toast notification "Email downloaded successfully"

### Micro-interactions
- **Hover Effects**:
  - Shadow elevation increases (shadow-md → shadow-lg)
  - Background subtle darkening (opacity shift)
  - Cursor changes to pointer
  - Optional: Tooltip appears "Download email"
- **Focus States**:
  - Visible focus ring (ring-2 ring-primary)
  - High contrast for keyboard users
- **Loading States**: N/A (download is instant)
- **Transitions**:
  - Hover: 200ms ease-out for shadow and background
  - Click: 100ms scale animation (bounce-out)
  - Appearance: 300ms fade-in when htmlBody loads
- **Success/Error**:
  - Success: Brief scale pulse animation
  - Optional: Toast notification
  - Error (rare): Toast with error message

### User Input
- **Input Type**: Button click (primary interaction)
- **Validation**: Button only visible when htmlBody exists
- **Error Messages**:
  - If download fails: "Failed to download email. Please try again."
- **Placeholder/Helper**:
  - Tooltip on hover: "Download email as HTML"
  - ARIA label for screen readers

## 4. Component Selection

### shadcn/ui Components Needed
- **Button**: Foundation for download button styling
  - Variant: `ghost` or `secondary` (non-primary to avoid drawing too much attention)
  - Size: `icon` (icon-only button, 44x44px minimum for touch)

### Custom Components Needed
- **DownloadEmailButton** (molecule): Floating download button with specific positioning
  - Why not pure shadcn: Needs custom positioning logic and conditional rendering based on htmlBody
  - Uses shadcn Button as foundation with custom wrapper

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/components/molecules/download-email-button.text-map.ts` (NEW)

**Keys to Define**:
```typescript
export const DOWNLOAD_EMAIL_TEXT = {
  button: {
    ariaLabel: 'Download email as HTML file',
    tooltip: 'Download email',
  },
  feedback: {
    success: 'Email downloaded successfully',
    error: 'Failed to download email. Please try again.',
  },
  fileName: {
    prefix: 'email',
    fallback: 'generated-email',
  },
} as const;
```

**Tone**: Clear, action-oriented
**Voice**: Active, imperative

### Microcopy
- **Empty States**: N/A (button hidden when no email)
- **Error States**: "Failed to download. Please try again."
- **Success States**: "Email downloaded" (optional toast)
- **Loading States**: N/A

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**: Button within main preview section
- **Headings**: N/A (button is a control)
- **Lists**: N/A

### Keyboard Navigation
- **Tab Order**:
  - Header controls → Device toggle → Email preview → Download button → Preview content
- **Shortcuts**:
  - Enter/Space: Trigger download (when focused)
  - Optional: Ctrl+S / Cmd+S global shortcut for download (future enhancement)
- **Focus Management**:
  - Focus remains on button after download
  - Visible focus indicator
- **Escape Hatch**: N/A (single action, no modal)

### Screen Reader Experience
- **ARIA Labels**:
  - `aria-label="Download email as HTML file"` on button
- **ARIA Descriptions**:
  - Optional: `aria-describedby` for additional context
- **Live Regions**:
  - `aria-live="polite"` announcement after successful download
  - "Email downloaded successfully" announced to screen reader users
- **Hidden Content**:
  - Button removed from DOM when htmlBody is empty (not just hidden)

### Visual Accessibility
- **Color Contrast**:
  - Button background vs preview: 4.5:1 minimum
  - Icon vs button background: 4.5:1 minimum
- **Color Independence**:
  - Download icon (Download/DownloadCloud from lucide-react)
  - Not relying on color alone
- **Text Size**: N/A (icon-only button)
- **Touch Targets**: 44x44px minimum (size="icon" variant)
- **Motion**:
  - Respect `prefers-reduced-motion` for animations
  - Reduce/eliminate scale and fade animations

## 7. Responsive Design

### Mobile (< 640px)
- **Layout**: Fixed position, bottom-right
- **Positioning**: `bottom-4 right-4` (16px from edges)
- **Size**: 44x44px (meets touch target minimum)
- **Visibility**: Floats above email preview
- **Z-index**: High enough to stay above preview content

### Tablet (640px - 1024px)
- **Layout**: Fixed position, bottom-right
- **Positioning**: `bottom-5 right-5` (20px from edges)
- **Size**: 48x48px (larger touch target)
- **Visibility**: Same as mobile

### Desktop (> 1024px)
- **Layout**: Fixed position, bottom-right
- **Positioning**: `bottom-6 right-6` (24px from edges)
- **Size**: 40x40px (mouse interaction, can be slightly smaller)
- **Additional**: Hover effects more prominent
- **Tooltip**: More likely to be seen on hover

## 8. States & Feedback

### Loading States
- **Initial Load**: Button hidden (no htmlBody yet)
- **Email Generating**: Button remains hidden
- **Email Loaded**: Button fades in (300ms transition)

### Error States
- **Download Failed**:
  - Toast notification with error message
  - Button remains active (user can retry)
- **No File Access**: Browser-level error (rare)

### Empty States
- **No Email Generated**: Button completely hidden
- **Email Cleared**: Button fades out smoothly

### Success States
- **Download Started**:
  - Brief scale pulse animation (1.0 → 1.1 → 1.0)
  - Optional: Success toast appears
- **File Downloaded**: Browser downloads HTML file with meaningful name

## 9. User Flow Diagram

```
[Email Generated Successfully]
    ↓
[htmlBody exists in store]
    ↓
[Download Button Fades In] (bottom-right corner)
    ↓
[User hovers button] → [Tooltip shows "Download email"]
    ↓
[User clicks button]
    ↓
[Download triggered] → [createObjectURL + anchor click]
    ↓
[Browser downloads file] → "email-{subject}-{timestamp}.html"
    ↓
[Success feedback] → [Optional: Toast notification]
    ↓
[User can click again] → [Downloads again with new timestamp]
```

## 10. Design Specifications

### Spacing Scale
- **Button Size**:
  - Mobile: `size-11` (44px)
  - Tablet: `size-12` (48px)
  - Desktop: `size-10` (40px)
- **Position**:
  - Mobile: `bottom-4 right-4`
  - Tablet: `bottom-5 right-5`
  - Desktop: `bottom-6 right-6`
- **Icon Size**: `size-5` (20px) inside button

### Typography
- N/A (icon-only button)

### Color Usage
- **Button Background**:
  - Light mode: `bg-background` with `border` or `bg-secondary`
  - Dark mode: `bg-secondary/50`
  - Shadow: `shadow-md` (default), `shadow-lg` (hover)
- **Icon Color**:
  - Light mode: `text-foreground` or `text-secondary-foreground`
  - Dark mode: `text-foreground`
- **Hover**:
  - Background: Slightly darker (opacity shift)
  - Shadow: Elevated

### Icon Choice
- **Primary**: `Download` icon from lucide-react
- **Alternative**: `DownloadCloud` for visual variety
- **Rationale**: Universally recognized download symbol

## 11. Performance Considerations

- **Critical Path**: Button renders after htmlBody loads (conditional)
- **Lazy Loading**: N/A (button is lightweight)
- **Download Performance**:
  - Uses `Blob` + `createObjectURL` for instant download
  - No server request needed
  - Memory cleaned up after download (revokeObjectURL)
- **Animation Budget**:
  - Minimal: fade-in (300ms), hover (200ms), click scale (100ms)
  - GPU-accelerated transforms

## 12. Implementation Coordination

### Agent Collaboration
- **shadcn-builder**: Not needed (using existing Button component)
- **domain-architect**: Not needed (no domain logic)
- **Parent**: Direct implementation

### Files Impacted
**NEW FILES**:
- `src/components/molecules/download-email-button.tsx` - Download button component
- `src/components/molecules/download-email-button.text-map.ts` - Text content

**MODIFIED FILES**:
- `src/components/organisms/previewer-email.tsx` - Add download button to preview

**UTILITY FUNCTIONS** (optional):
- `src/lib/download-utils.ts` - Helper function for downloading files (if reusable)

## 13. Technical Implementation Details

### Download Mechanism
```typescript
const handleDownload = () => {
  const { htmlBody, subject } = useEmailStore.getState();

  if (!htmlBody) return;

  // Create blob from HTML content
  const blob = new Blob([htmlBody], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Generate filename
  const sanitizedSubject = subject
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .slice(0, 50);
  const timestamp = new Date().getTime();
  const filename = `email-${sanitizedSubject || 'generated'}-${timestamp}.html`;

  // Trigger download
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  // Optional: Show success feedback
  // toast.success(DOWNLOAD_EMAIL_TEXT.feedback.success);
};
```

### Button Positioning
```tsx
// Inside PreviewerEmail component, after the email preview div
{htmlBody && (
  <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6">
    <DownloadEmailButton />
  </div>
)}
```

### Component Structure
```tsx
// src/components/molecules/download-email-button.tsx
'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmailStore } from '@/stores/email.store';
import { DOWNLOAD_EMAIL_TEXT } from './download-email-button.text-map';

export const DownloadEmailButton = () => {
  const { htmlBody, subject } = useEmailStore();

  const handleDownload = () => {
    // Implementation as shown above
  };

  if (!htmlBody) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleDownload}
      aria-label={DOWNLOAD_EMAIL_TEXT.button.ariaLabel}
      title={DOWNLOAD_EMAIL_TEXT.button.tooltip}
      className="shadow-md hover:shadow-lg transition-all"
    >
      <Download className="size-5" />
    </Button>
  );
};
```

## 14. Important Notes

⚠️ **Visibility condition**: Button MUST only render when `htmlBody` exists (not during loading or empty states)

⚠️ **Filename sanitization**: Remove special characters from subject line to create valid filename

💡 **Timestamp in filename**: Prevents overwrites when downloading multiple versions

💡 **Cleanup**: Always call `URL.revokeObjectURL()` to prevent memory leaks

📝 **Toast notifications**: Optional but recommended for better UX feedback

🎨 **Non-intrusive**: Button should be noticeable but not distract from email content

💡 **Future enhancement**: Could add format options (HTML/PDF/Text) in dropdown

## 15. Success Metrics

- **Usability**: User discovers button within 3 seconds of email generation
- **Efficiency**: Download completes immediately (no server delay)
- **Satisfaction**: Clear feedback that action succeeded
- **Accessibility**:
  - Screen reader announces button and download action
  - Keyboard-only navigation works perfectly
  - Touch targets meet 44px minimum on mobile
  - Color contrast meets WCAG AA (4.5:1)
- **Performance**:
  - Button renders in < 50ms after htmlBody loads
  - Download initiates in < 100ms after click
  - No memory leaks from blob URLs

## 16. Implementation Checklist

**Phase 1: Component Creation**
- [ ] Create `download-email-button.text-map.ts` with all text content
- [ ] Create `download-email-button.tsx` component
- [ ] Implement download logic with Blob API
- [ ] Add filename sanitization logic
- [ ] Add cleanup (revokeObjectURL)

**Phase 2: Integration**
- [ ] Import component into `previewer-email.tsx`
- [ ] Position button in bottom-right corner
- [ ] Add conditional rendering (only when htmlBody exists)
- [ ] Test on different preview states (loading, empty, content)

**Phase 3: Styling & Responsiveness**
- [ ] Add responsive positioning (mobile/tablet/desktop)
- [ ] Implement hover effects (shadow elevation)
- [ ] Add focus states for keyboard navigation
- [ ] Add click animation (scale pulse)
- [ ] Test on different device sizes

**Phase 4: Accessibility**
- [ ] Add aria-label to button
- [ ] Add title attribute for tooltip
- [ ] Test keyboard navigation (Tab + Enter)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify color contrast ratios
- [ ] Add prefers-reduced-motion support

**Phase 5: Testing**
- [ ] Test download on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test filename generation with various subject lines
- [ ] Test with special characters in subject
- [ ] Test multiple downloads (timestamp uniqueness)
- [ ] Test memory cleanup (no blob URL leaks)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test with keyboard only
- [ ] Test with screen reader

**Phase 6: Optional Enhancements**
- [ ] Add toast notification for success feedback
- [ ] Add tooltip component (instead of title attribute)
- [ ] Add error handling for download failures
- [ ] Consider adding download analytics

## 17. Alternative Considerations

### Alternative 1: Dropdown with Format Options
Instead of single download button, could offer dropdown with multiple formats:
- Download as HTML
- Download as Text
- Download as PDF (future)

**Pros**: More flexibility for users
**Cons**: More complex UI, may be overkill for v1

### Alternative 2: Download in Header
Position download button in header next to device toggle.

**Pros**: More discoverable, grouped with other controls
**Cons**: Clutters header, less spatial relationship with preview content

### Alternative 3: Copy to Clipboard Option
Instead of download, offer "Copy HTML" button.

**Pros**: Faster for quick sharing
**Cons**: Less permanent than file download, no local save

**Recommendation**: Start with floating download button (simplest, most intuitive), consider alternatives as enhancements

## 18. Edge Cases

- **Very long subject line**: Truncate to 50 characters for filename
- **Empty subject**: Use fallback "generated-email"
- **Special characters in subject**: Sanitize to alphanumeric + hyphens
- **htmlBody becomes null**: Button fades out gracefully
- **Multiple rapid clicks**: Debounce not needed (downloads are instant)
- **Browser blocks download**: User will see browser's download prompt
- **Mobile storage full**: Browser-level error (out of our control)

---

## Next Steps

1. **Parent reviews this UX plan**
2. **Parent implements following the checklist above**
3. **Test on multiple browsers and devices**
4. **Gather user feedback on discoverability**

---

**Design Philosophy Applied**:
- ✅ User-first: Download is a common need, easily accessible
- ✅ Accessibility: Keyboard, screen reader, touch-friendly
- ✅ Non-intrusive: Floating button doesn't obstruct content
- ✅ Immediate feedback: Download happens instantly
- ✅ Mobile-first: Touch targets meet minimum sizes
- ✅ Consistency: Uses existing button component and design tokens
- ✅ Performance: No server requests, efficient blob handling
