# Settings Panel - shadcn/ui Component Selection Plan

**Created**: 2025-12-07
**Session**: settings-panel-20251207
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add sheet
```

**Components**:

#### `sheet`
- **Purpose**: Slide-in panel from the edge of the screen for settings UI
- **Radix Primitive**: `@radix-ui/react-dialog`
- **Key Props**: `open`, `onOpenChange`, `side` (top, right, bottom, left)
- **Accessibility**: Built-in focus trap, keyboard navigation (ESC to close), ARIA dialog attributes
- **Use Case**: Primary container for the settings panel, triggered from header

### Existing Components to Reuse

#### `form`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/form.tsx`
- **Usage**: React Hook Form integration for API key input and model selection
- **Already has**: FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription
- **Integration**: Uses react-hook-form and zod for validation

#### `input`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/input.tsx`
- **Usage**: Text input for API key field
- **Features**: Built-in validation states (aria-invalid), focus states, disabled states
- **Type**: Will use `type="password"` for API key security

#### `select`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/select.tsx`
- **Usage**: Dropdown for AI model provider selection (OpenAI, Gemini, etc.)
- **Features**: Keyboard navigation, search, custom trigger styling
- **Components**: Select, SelectTrigger, SelectContent, SelectItem, SelectValue

#### `button`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/button.tsx`
- **Usage**: Form submit button, sheet trigger in header
- **Variants**: default, destructive, outline, primary, secondary, ghost, link
- **Sizes**: default, sm, lg, icon

#### `label`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/label.tsx`
- **Usage**: Accessible labels for form fields
- **Integration**: Works with FormLabel from form component

#### `separator`
- **Location**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/separator.tsx`
- **Usage**: Visual separator between form content and footer credits section
- **Radix Primitive**: `@radix-ui/react-separator`

## 2. Component Composition Strategy

### Primary Composition: `Sheet`

**Base Component**: `sheet` from `@/components/ui/sheet`
**Composition Approach**: Sheet wraps the entire settings form

**Example Structure**:
```typescript
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// Trigger from header
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <SettingsIcon />
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>
        Configure your AI provider settings
      </SheetDescription>
    </SheetHeader>

    {/* Form content here */}

    <SheetFooter>
      {/* Credits section */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Composition Patterns

**Pattern**: "Sheet with Form"
**Components**: `sheet`, `form`, `input`, `select`, `button`, `label`, `separator`
**Structure**:
```typescript
<Sheet>
  <SheetTrigger asChild>
    <Button>...</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>...</SheetTitle>
      <SheetDescription>...</SheetDescription>
    </SheetHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Provider</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-..." {...field} />
              </FormControl>
              <FormDescription>
                Your API key will be stored locally
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>

    <Separator className="my-4" />

    <SheetFooter>
      {/* Creator credits */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## 3. Component Variants and Customization

### Using Built-in Variants

**Component**: `sheet`
**Available Variants**:
- `side`: "top" | "right" | "bottom" | "left" (use "right" for settings panel)
- `className`: Additional Tailwind classes for custom width/styling

**Component**: `button`
**For Sheet Trigger**:
- `variant`: "ghost" (minimal styling for header icon)
- `size`: "icon" (square button for icon-only trigger)

**For Form Submit**:
- `variant`: "primary" or "default"
- `size`: "default"

**Component**: `input`
**For API Key**:
- `type`: "password" (masks the API key)
- `className`: "w-full" (full width in form)

**Usage Example**:
```typescript
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Settings className="size-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-full sm:max-w-md">
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Custom Variants (if absolutely necessary)

**Not needed for this implementation** - shadcn provides all necessary variants.

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility

**Sheet Component (Dialog Primitive)**:
- **Keyboard Navigation**: ESC to close, TAB to navigate between form fields
- **ARIA Attributes**: `role="dialog"`, `aria-labelledby`, `aria-describedby`
- **Focus Management**: Auto-focus on first focusable element, focus trap within sheet
- **Screen Reader**: Announces dialog open/close, reads title and description

**Form Components**:
- **Labels**: Properly associated with inputs via htmlFor/id
- **Error States**: aria-invalid on inputs, error messages linked via aria-describedby
- **Descriptions**: Helper text linked to inputs for screen readers

**Select Component**:
- **Keyboard Navigation**: Arrow keys to navigate options, Enter to select
- **ARIA Attributes**: `role="combobox"`, `aria-expanded`, `aria-controls`
- **Search**: Type to filter options (built into Radix)

**Input Component**:
- **Validation States**: aria-invalid for errors, visual focus indicators
- **Password Security**: type="password" masks characters

### Accessibility Requirements
**Note**: Pass to UX designer for full a11y plan. shadcn handles primitives.

- **Labels**: Use FormLabel for all form fields (already handled by form component)
- **Descriptions**: Use FormDescription for API key security note
- **Error States**: Use FormMessage for validation errors (react-hook-form + zod)
- **Focus Order**: Logical tab order: provider select -> API key input -> submit button
- **Color Contrast**: Ensure text meets WCAG AA standards (handled by Tailwind theme)

## 5. Installation Verification

After installation, verify:

1. **Component exists**: `/home/ajosecortes/development/projects/vibemail/src/components/ui/sheet.tsx`
2. **Dependencies installed**: Check `package.json` for `@radix-ui/react-dialog`
3. **Types available**: TypeScript recognizes Sheet components
4. **Imports work**: Can import from `@/components/ui/sheet`

**Verification Command**:
```bash
ls -la /home/ajosecortes/development/projects/vibemail/src/components/ui/sheet.tsx
```

## 6. Integration Notes

### Props to Configure

**Sheet**:
- `open`: boolean (controlled state for sheet visibility)
- `onOpenChange`: (open: boolean) => void (callback for state changes)

**SheetContent**:
- `side`: "right" (slide in from right)
- `className`: "w-full sm:max-w-md" (responsive width)

**Form**:
- `form`: useForm hook from react-hook-form
- `onSubmit`: form.handleSubmit(onSubmit)

**Select**:
- `value`: Current provider (from Zustand store)
- `onValueChange`: Update provider in store

**Input**:
- `type`: "password"
- `value`: Current API key (from Zustand store)
- `onChange`: Update API key in store

### Event Handlers Needed

**Sheet**:
- `onOpenChange`: Sync with state (Zustand or local useState)

**Form**:
- `onSubmit`: Save settings to localStorage, update Zustand store

**Select**:
- `onValueChange`: (value: string) => { /* update provider */ }

**Input**:
- `onChange`: (e) => { /* update API key */ } (handled by react-hook-form)

### Styling Considerations

**Tailwind Classes**:
- SheetContent: `w-full sm:max-w-md` (responsive width)
- Form: `space-y-4` (vertical spacing between fields)
- Footer: `text-sm text-muted-foreground` (subtle credits)

**CSS Variables**:
- Uses Tailwind CSS v4 theme variables (automatic)
- `--background`, `--foreground`, `--muted`, `--accent`, etc.

**Dark Mode**:
- Automatic with shadcn (uses Tailwind dark mode classes)
- All components have dark mode variants built-in

## 7. Important Notes

**NEVER modify shadcn source files** in `/home/ajosecortes/development/projects/vibemail/src/components/ui/`

**Composition over modification**: Wrap Sheet in a custom component if needed, don't edit sheet.tsx

**Check registry first**: Sheet is the only missing component - all others exist

**Use variants**: Sheet already has `side` variant for right-side panel

**Coordinate with UX designer**: For text maps, full component architecture, and user flow

## 8. Next Steps for Parent Agent

1. Run installation command:
   ```bash
   pnpm dlx shadcn@latest add sheet
   ```

2. Verify sheet component exists:
   ```bash
   ls -la /home/ajosecortes/development/projects/vibemail/src/components/ui/sheet.tsx
   ```

3. Coordinate with UX designer for:
   - Text maps for labels, placeholders, error messages, descriptions
   - Full settings panel component architecture
   - Footer credits section design
   - Form validation schema (zod)

4. Coordinate with Next.js builder for:
   - localStorage integration strategy
   - Zustand store updates
   - Form submission logic

5. Implement composition as specified above

6. Test accessibility features:
   - Keyboard navigation (TAB, ESC, Enter)
   - Screen reader announcements
   - Focus trap within sheet
   - Form validation states
