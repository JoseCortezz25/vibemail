# Download Email as HTML - shadcn/ui Component Selection Plan

**Created**: 2025-12-04
**Session**: download-email-html-20251204
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### Existing Components to Reuse

#### `button`
- **Location**: `@/components/ui/button.tsx`
- **Purpose**: Primary interactive element for triggering the download action
- **Radix Primitive**: `@radix-ui/react-slot` (for composition)
- **Key Props**:
  - `variant`: "default" | "destructive" | "outline" | "primary" | "secondary" | "ghost" | "link"
  - `size`: "default" | "sm" | "lg" | "icon"
  - `className`: Additional Tailwind classes for customization
- **Already has variants**:
  - `size="icon"` - Perfect for icon-only button (size-9 = 36px × 36px)
  - `variant="outline"` - Good for subtle floating button
  - `variant="ghost"` - Alternative for minimal style
- **Accessibility**: Built-in focus states, keyboard navigation, disabled states

#### `tooltip`
- **Location**: `@/components/ui/tooltip.tsx`
- **Purpose**: Provide accessible label/description for icon-only download button
- **Radix Primitive**: `@radix-ui/react-tooltip`
- **Key Components**:
  - `Tooltip` (Root wrapper with built-in TooltipProvider)
  - `TooltipTrigger` (Wraps the button)
  - `TooltipContent` (Shows the label text)
- **Key Props**:
  - `delayDuration`: Default is 0ms (instant)
  - `sideOffset`: Default is 0, can adjust spacing
  - `side`: "top" | "right" | "bottom" | "left" (default auto)
- **Accessibility**:
  - ARIA labels automatically applied
  - Keyboard accessible (hover with focus)
  - Screen reader announcements
  - Portal rendering (z-index 50)

### New Components to Install

**None required** - All necessary components already exist in the project!

✅ No installation commands needed.

## 2. Component Composition Strategy

### Primary Composition: Icon Button with Tooltip

**Base Components**: `Button` + `Tooltip` from `@/components/ui/`
**Composition Approach**: Wrap icon button with tooltip for accessibility

**Example Structure**:
```typescript
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Download } from "lucide-react" // Icon library

<Tooltip>
  <TooltipTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 shadow-lg hover:shadow-xl"
      onClick={handleDownload}
    >
      <Download className="size-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="left">
    Download as HTML
  </TooltipContent>
</Tooltip>
```

### Composition Patterns

**Pattern**: Tooltip-Wrapped Icon Button (Floating Action Button)
**Components**: `Tooltip` + `TooltipTrigger` + `TooltipContent` + `Button`
**Structure**:
```typescript
<Tooltip>                          {/* Root with built-in provider */}
  <TooltipTrigger asChild>         {/* Trigger delegates to child */}
    <Button size="icon">           {/* Icon-only button */}
      <Icon />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="left">     {/* Label positioned left of button */}
    Accessible label text
  </TooltipContent>
</Tooltip>
```

**Key Points**:
- `asChild` prop on `TooltipTrigger` ensures Button handles all click/focus events
- `side="left"` positions tooltip to the left of the button (since button is on right edge)
- Fixed positioning via `className` on Button (not wrapper)

## 3. Component Variants and Customization

### Using Built-in Variants

**Component**: `Button`
**Recommended Variants**:
- `variant="outline"`: Subtle, with border and background - **Recommended for floating button**
- `variant="ghost"`: Minimal style - Alternative option
- `size="icon"`: Fixed size (36px × 36px) for icon-only buttons

**Usage Example**:
```typescript
<Button
  variant="outline"
  size="icon"
  className="fixed bottom-6 right-6 shadow-lg hover:shadow-xl z-50"
>
  <Download />
</Button>
```

**Component**: `Tooltip`
**Customization Options**:
- `side`: Position tooltip relative to trigger ("left" recommended for right-edge button)
- `sideOffset`: Adjust spacing between tooltip and button (default 0)
- `delayDuration`: Delay before showing (default 0ms - instant)
- `className` on `TooltipContent`: Additional Tailwind classes

**Usage Example**:
```typescript
<TooltipContent
  side="left"
  sideOffset={8}
  className="text-xs"
>
  Download as HTML
</TooltipContent>
```

### Custom Variants (if absolutely necessary)

**⚠️ NOT NEEDED** - shadcn provides everything required:
- Icon button variant exists (`size="icon"`)
- Outline variant for subtle floating button
- Tooltip for accessibility
- Hover/focus states built-in

**Positioning**: Use Tailwind utility classes for floating position (not custom variants)
```typescript
className="fixed bottom-6 right-6 z-50"
```

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility

**Button Component**:
- **Keyboard Navigation**: Tab to focus, Enter/Space to activate
- **ARIA Attributes**: `role="button"` implicit
- **Focus Management**: Focus ring with `focus-visible:ring-ring/50`
- **Disabled State**: `disabled:pointer-events-none disabled:opacity-50`
- **Screen Reader**: Button content (icon) needs accessible label → provided by Tooltip

**Tooltip Component**:
- **ARIA Attributes**: Automatically adds `aria-describedby` to trigger
- **Keyboard Navigation**: Shows on focus (not just hover)
- **Screen Reader**: Content announced when focused
- **Portal Rendering**: z-index 50 ensures visibility
- **Animation**: Fade in/out with respect for `prefers-reduced-motion`

### Accessibility Requirements

**Note**: UX designer will create full a11y plan. shadcn handles primitives.

**Minimal Requirements**:
- ✅ **Icon Label**: Tooltip provides accessible label for icon-only button
- ✅ **Keyboard Access**: Both button and tooltip are keyboard accessible
- ✅ **Focus Indicator**: Built-in focus ring on button
- ✅ **State Feedback**: Disabled state if no HTML content available
- 💡 **Consider**: `aria-label` on Button as fallback for screen readers

**Recommended Implementation**:
```typescript
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      aria-label="Download email as HTML file"
      disabled={!hasHtmlContent}
    >
      <Download />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="left">
    Download as HTML
  </TooltipContent>
</Tooltip>
```

## 5. Installation Verification

✅ **All components already exist** - No installation needed!

**Verification Steps**:

1. **Component exists**: ✅ `@/components/ui/button.tsx`
2. **Component exists**: ✅ `@/components/ui/tooltip.tsx`
3. **Dependencies installed**: ✅ Check `package.json`
   - `@radix-ui/react-slot`
   - `@radix-ui/react-tooltip`
   - `class-variance-authority`
4. **Types available**: ✅ TypeScript recognizes components
5. **Imports work**: ✅ Can import from `@/components/ui/`

## 6. Integration Notes

### Props to Configure

**Button**:
- `variant="outline"` - Subtle floating button style
- `size="icon"` - Fixed size for icon-only button
- `onClick={handleDownload}` - Download action handler
- `disabled={!htmlBody}` - Disable when no content available
- `className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl"` - Floating position
- `aria-label="Download email as HTML file"` - Accessible label

**Tooltip**:
- `side="left"` - Position tooltip to left of button
- `sideOffset={8}` - Space between tooltip and button
- Content: "Download as HTML" or from text map

### Event Handlers Needed

**Button `onClick`**: Download action
```typescript
const handleDownload = () => {
  const htmlContent = useEmailStore.getState().htmlBody;
  if (!htmlContent) return;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'email.html';
  a.click();
  URL.revokeObjectURL(url);
};
```

### Styling Considerations

**Tailwind Classes** (for Button):
- `fixed bottom-6 right-6` - Positioning in bottom-right corner
- `z-50` - Ensure above email content (iframe typically z-auto)
- `shadow-lg hover:shadow-xl` - Elevation effect
- `transition-all` - Smooth hover animation (built into button variants)

**CSS Variables**:
- Uses shadcn theme variables (automatic with existing setup)
- `--ring` for focus ring
- `--primary` for button colors

**Dark Mode**:
- ✅ Automatic with shadcn (uses `dark:` variants in button)
- Tooltip uses `bg-foreground text-background` (inverts in dark mode)

**Responsive Considerations**:
- Consider adjusting position on mobile: `bottom-4 right-4 md:bottom-6 md:right-6`
- Icon size is consistent across breakpoints (`size-4` in button)

## 7. Important Notes

⚠️ **NEVER modify shadcn source files** in `@/components/ui/`
⚠️ **Composition over modification**: Use className for positioning, not new components
💡 **Icon library**: Project likely uses `lucide-react` for icons (check existing usage)
💡 **Text externalization**: Tooltip text should come from text map (per critical constraints)
💡 **Client component**: Download logic requires browser APIs → needs `"use client"`
📝 **Coordinate with UX designer**: For full interaction design and text content

**Icon Selection**:
- Check if `lucide-react` is installed: `grep "lucide-react" package.json`
- Use `Download` icon from lucide-react
- Alternative: `ArrowDownTray` if using Heroicons

**State Management**:
- Read `htmlBody` from `useEmailStore()` (Zustand store)
- Disable button when `!htmlBody` (no content to download)
- Consider loading state during download (optional enhancement)

## 8. Next Steps for Parent Agent

1. ✅ **No installation needed** - Components already exist
2. Verify icon library (`lucide-react` or `heroicons`)
3. Coordinate with UX designer for:
   - Exact tooltip text (externalize to text map)
   - Filename format for download
   - Loading/success feedback (toast notification?)
   - Mobile positioning adjustments
4. Implement composition as specified:
   - Create client component wrapper
   - Import Button + Tooltip from `@/components/ui/`
   - Add download logic with blob creation
   - Position as fixed element
5. Test accessibility:
   - Keyboard navigation (Tab, Enter)
   - Screen reader announcements
   - Focus indicators
   - Disabled state when no content

**Recommended File Structure**:
```
src/
├── domains/
│   └── email/
│       └── components/
│           └── download-button.tsx  // New component (UX designer will specify)
└── components/
    └── ui/
        ├── button.tsx        // ✅ Already exists
        └── tooltip.tsx       // ✅ Already exists
```

**Component Implementation Outline** (for UX designer):
```typescript
'use client';

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Download } from "lucide-react"; // Verify icon library
import { useEmailStore } from "@/stores/email.store";

export function DownloadEmailButton() {
  const htmlBody = useEmailStore(state => state.htmlBody);

  const handleDownload = () => {
    // Download logic here
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          disabled={!htmlBody}
          aria-label="Download email as HTML file"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl"
        >
          <Download className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        Download as HTML
      </TooltipContent>
    </Tooltip>
  );
}
```
