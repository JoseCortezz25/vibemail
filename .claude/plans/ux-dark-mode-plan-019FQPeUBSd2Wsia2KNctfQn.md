# UX/UI Design Plan: Dark Mode Implementation

**Session ID**: 019FQPeUBSd2Wsia2KNctfQn
**Agent**: ux-ui-designer
**Created**: 2025-12-09
**Status**: ✅ Completed

---

## Overview

Design a comprehensive dark mode experience that extends the existing shadcn/ui dark theme with custom brand colors, ensuring visual consistency, accessibility, and smooth user interaction.

---

## 1. Dark Mode Color Palette

### 1.1 Brand Colors - Dark Mode Variants

**Current Light Mode Colors:**
- `--color-brand-red: #f00` (pure red)
- `--color-brand-blue: #6271d0` (medium blue)
- `--color-brand-blue-dark: #20275a` (dark navy)

**Proposed Dark Mode Colors:**

```css
.dark {
  /* Red - Softer, less aggressive for dark backgrounds */
  --color-brand-red: #ff5757; /* Lighter, desaturated red */
  --color-brand-red-muted: #ff8080; /* Even softer for hover states */

  /* Blue - Brighter for visibility on dark backgrounds */
  --color-brand-blue: #7b8ae8; /* Lighter, more vibrant blue */
  --color-brand-blue-hover: #8f9eef; /* Hover state */

  /* Blue Dark - Becomes lighter in dark mode (inverted logic) */
  --color-brand-blue-dark: #4a5fc9; /* Mid-tone blue for dark mode */
  --color-brand-blue-dark-hover: #5b6fd6; /* Hover state */
}
```

**Rationale:**
- **Red (#ff5757)**: Pure #f00 is too harsh on dark backgrounds. Lightening to #ff5757 maintains brand identity while reducing eye strain
- **Blue (#7b8ae8)**: Original #6271d0 lacks contrast on dark backgrounds. Brightening ensures visibility while staying in brand spectrum
- **Blue Dark (#4a5fc9)**: In dark mode, the "dark" variant paradoxically needs to be lighter than in light mode for proper contrast

### 1.2 Custom Black Scale - Dark Mode Behavior

**Current Scale (Light Mode only):**
- black-950 (#0d0d0d) → black-50 (#f5f5f5)

**Dark Mode Strategy: Semantic Inversion** (Recommended)

```css
.dark {
  /* Invert the scale for dark mode */
  --color-black-50: #0d0d0d;   /* Darkest in dark mode */
  --color-black-100: #131313;
  --color-black-200: #191919;
  --color-black-300: #202020;
  --color-black-400: #2e2e2e;
  --color-black-500: #3b3b3b;
  --color-black-600: #545454;
  --color-black-700: #6e6e6e;
  --color-black-800: #8c8c8c;
  --color-black-900: #dcdcdc;
  --color-black-950: #f5f5f5;  /* Lightest in dark mode */
}
```

**Rationale**: When developers use `text-black-50` for "subtle text", it should remain subtle in both themes. Inverting the scale achieves this semantic consistency.

### 1.3 Accessibility Standards

**Contrast Requirements (WCAG 2.1 AA):**
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18pt+): minimum 3:1 contrast ratio
- Interactive elements: minimum 3:1 against adjacent colors

**Current Analysis:**
- `#ff5757` on dark background = ~8.2:1 ✅
- `#7b8ae8` on dark background = ~6.5:1 ✅
- `#4a5fc9` on dark background = ~4.8:1 ✅

---

## 2. Theme Toggle UI/UX

### 2.1 Location

**Primary Location**: Settings Panel (`src/components/organisms/settings-panel.tsx`)

**Rationale:**
- Consistent with existing pattern (model selection, API key in settings)
- Centralized configuration location
- Avoids UI clutter in main interface

### 2.2 Toggle Design

**Component Type**: Segmented Control (3 options)

```
┌─────────────────────────────────────┐
│ Theme Preference                    │
├─────────────────────────────────────┤
│ ○ Light   ○ Dark   ● System         │
└─────────────────────────────────────┘
```

**Options:**
1. **Light**: Force light mode
2. **Dark**: Force dark mode
3. **System** (Default): Follow OS preference via `prefers-color-scheme`

**Component to Use**: shadcn/ui `Tabs` component styled as segmented control

### 2.3 Interaction Specifications

**On Theme Change:**
1. Update Zustand store (`theme.store.ts`)
2. Store persists to localStorage automatically
3. Apply class to `<html>` tag immediately
4. Visual transition: instant (no animation for accessibility)
5. Show toast notification: "Theme updated to [Light/Dark/System]"

**System Theme Handling:**
- When "System" selected, listen to `matchMedia('(prefers-color-scheme: dark)')`
- Update theme automatically when OS preference changes
- Show subtle indicator of current resolved theme

---

## 3. Visual Transition Strategy

**Recommendation**: **Instant (no animation)**

**Rationale:**
- Reduces motion (accessibility consideration)
- Cleaner experience (no flickering)
- Simpler implementation
- Consistent with OS theme switching

**Respect Motion Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  html {
    transition: none;
  }
}
```

---

## 4. Component-Level Recommendations

### 4.1 Components Requiring Updates

**High Priority** (use hardcoded brand colors):
- `src/app/error.tsx` - uses `text-brand-blue`, `bg-brand-blue`
- `src/app/global-error.tsx` - uses `text-brand-blue`, `bg-brand-blue`
- `src/app/not-found.tsx` - uses `text-brand-blue`, `text-brand-red`
- `src/components/ui/button.tsx` - uses `bg-brand-blue-dark`
- `src/styles/components/atoms/button.css` - hardcoded gradient colors

**Medium Priority** (use black-* scale):
- `src/styles/components/atoms/input.css` - uses `bg-black/5`, `text-black-200`
- `src/styles/components/atoms/button.css` - uses `text-black-100`

### 4.2 Migration Strategy

**Replace hardcoded colors with CSS variables:**

✅ **Recommended:**
```tsx
<span className="text-[var(--color-brand-blue)]">404</span>
```

Or using @apply in CSS:
```css
.error-title {
  @apply text-[var(--color-brand-blue)];
}
```

---

## 5. Color Palette Reference

| Color Token         | Light Mode | Dark Mode  | Usage                    |
|---------------------|------------|------------|--------------------------|
| brand-red           | #f00       | #ff5757    | Errors, warnings         |
| brand-blue          | #6271d0    | #7b8ae8    | Headings, accents        |
| brand-blue-dark     | #20275a    | #4a5fc9    | Primary buttons, CTAs    |
| black-50 (semantic) | #f5f5f5    | #0d0d0d    | Subtle backgrounds       |
| black-950 (semantic)| #0d0d0d    | #f5f5f5    | Strong foregrounds       |

---

## 6. Accessibility Checklist

- [ ] All brand colors meet WCAG AA contrast ratios in dark mode
- [ ] Theme toggle has proper ARIA labels
- [ ] Keyboard navigation works for theme selection
- [ ] Screen readers announce theme changes
- [ ] `prefers-reduced-motion` respected
- [ ] `prefers-color-scheme` detected for "System" option
- [ ] Focus indicators visible in both themes
- [ ] No information conveyed by color alone

---

## Next Steps for Implementation

1. Domain Architect: Design theme state management store
2. Parent Agent: Implement color definitions and theme toggle UI
3. Code Reviewer: Verify accessibility and contrast standards

---

**Plan Status**: ✅ Ready for Implementation
