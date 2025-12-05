# Visual Edits Feature - shadcn/ui Component Selection Plan

**Created**: 2025-12-04
**Session**: visual-edits-20251204
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add label slider switch badge tabs accordion card separator form
```

**Components**:

#### `label`
- **Purpose**: Labels for all form inputs in properties panel
- **Radix Primitive**: N/A (native HTML `<label>`)
- **Key Props**: `htmlFor` for accessibility
- **Accessibility**: Associates label text with form inputs via `for` attribute

#### `slider`
- **Purpose**: Edit numeric properties like font size, image width/height, opacity
- **Radix Primitive**: `@radix-ui/react-slider`
- **Key Props**: `value`, `onValueChange`, `min`, `max`, `step`
- **Accessibility**: Keyboard navigation (arrow keys), ARIA slider role

#### `switch`
- **Purpose**: Toggle boolean properties (bold, italic, underline) and mode switching (chat ↔ edit)
- **Radix Primitive**: `@radix-ui/react-switch`
- **Key Props**: `checked`, `onCheckedChange`
- **Accessibility**: ARIA switch role, keyboard toggle (Space/Enter)

#### `badge`
- **Purpose**: Display selected element indicator above prompt input
- **Radix Primitive**: N/A (styled component)
- **Key Props**: `variant` (default, secondary, destructive, outline)
- **Accessibility**: Semantic HTML, proper color contrast

#### `tabs`
- **Purpose**: Organize properties panel into categories (Content, Style, Layout)
- **Radix Primitive**: `@radix-ui/react-tabs`
- **Key Props**: `value`, `onValueChange`, tabs composition
- **Accessibility**: Arrow key navigation, automatic focus management

#### `accordion`
- **Purpose**: Collapsible property sections within each tab (Text Properties, Spacing, etc.)
- **Radix Primitive**: `@radix-ui/react-accordion`
- **Key Props**: `type` (single/multiple), `collapsible`, `value`
- **Accessibility**: Arrow key navigation, expandable/collapsible with keyboard

#### `card`
- **Purpose**: Container for properties panel with consistent styling
- **Radix Primitive**: N/A (styled component)
- **Key Props**: Composition (`Card`, `CardHeader`, `CardTitle`, `CardContent`)
- **Accessibility**: Semantic structure with proper headings

#### `separator`
- **Purpose**: Visual dividers between property groups
- **Radix Primitive**: `@radix-ui/react-separator`
- **Key Props**: `orientation` (horizontal/vertical)
- **Accessibility**: ARIA separator role

#### `form`
- **Purpose**: Form validation and state management for properties panel
- **Radix Primitive**: Wraps React Hook Form
- **Key Props**: Integrates with `react-hook-form` and `zod`
- **Accessibility**: Error announcements, validation feedback

### Existing Components to Reuse

#### `input`
- **Location**: `@/components/ui/input.tsx`
- **Usage**: Text inputs for editing text content, alt text, CSS values (color hex, etc.)
- **Already has**: Focus states, validation states (aria-invalid)

#### `textarea`
- **Location**: `@/components/ui/textarea.tsx`
- **Usage**: Multi-line text editing for longer content (paragraphs, etc.)
- **Already has**: Auto-resize behavior, focus states

#### `select`
- **Location**: `@/components/ui/select.tsx`
- **Usage**: Dropdowns for font family, alignment (left/center/right), element type
- **Already has**: Full composition (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`)

#### `button`
- **Location**: `@/components/ui/button.tsx`
- **Usage**: Action buttons (Apply, Reset, Deselect, Upload Image)
- **Already has**: Multiple variants (default, destructive, outline, ghost, secondary)

#### `tooltip`
- **Location**: `@/components/ui/tooltip.tsx`
- **Usage**: Help text for property inputs
- **Already has**: Full composition with TooltipProvider

#### `dropdown-menu`
- **Location**: `@/components/ui/dropdown-menu.tsx`
- **Usage**: Context menu for element actions (Delete, Duplicate, etc.)
- **Already has**: Full composition with menu items, separators, sub-menus

## 2. Component Composition Strategy

### Primary Composition: Properties Panel

**Base Component**: `card` + `tabs` + `accordion`
**Composition Approach**: Multi-level nesting for organized property editing

**Example Structure**:
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Card>
  <CardHeader>
    <CardTitle>Element Properties</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="content">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <Accordion type="multiple">
          <AccordionItem value="text">
            <AccordionTrigger>Text Properties</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-content">Content</Label>
                  <Input id="text-content" value="..." onChange={...} />
                </div>
                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Slider id="font-size" min={8} max={72} step={1} value={[16]} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

### Composition Patterns

**Pattern 1**: Selected Element Badge
**Components**: `badge` + `button`
**Structure**:
```typescript
<div className="flex items-center gap-2">
  <Badge variant="secondary">
    <span>Text Element Selected</span>
  </Badge>
  <Button variant="ghost" size="sm" onClick={handleDeselect}>
    <XIcon className="h-4 w-4" />
  </Button>
</div>
```

**Pattern 2**: Property Input with Label
**Components**: `label` + `input`/`slider`/`select` + `tooltip`
**Structure**:
```typescript
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label htmlFor="property-id">Property Name</Label>
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Help text explaining this property</p>
      </TooltipContent>
    </Tooltip>
  </div>
  <Input id="property-id" value={...} onChange={...} />
</div>
```

**Pattern 3**: Mode Toggle
**Components**: `switch` + `label`
**Structure**:
```typescript
<div className="flex items-center gap-2">
  <Switch id="edit-mode" checked={isEditMode} onCheckedChange={setEditMode} />
  <Label htmlFor="edit-mode">Edit Mode</Label>
</div>
```

## 3. Component Variants and Customization

### Using Built-in Variants

**Component**: `badge`
**Available Variants**:
- `variant`: default, secondary, destructive, outline
- `className`: Additional Tailwind classes

**Usage Example**:
```typescript
<Badge variant="secondary" className="gap-2">
  <ElementIcon className="h-3 w-3" />
  <span>Heading 1</span>
</Badge>
```

**Component**: `button`
**Available Variants**:
- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: default, sm, lg, icon
- `className`: Additional Tailwind classes

**Usage Example**:
```typescript
<Button variant="outline" size="sm">
  Reset Properties
</Button>
```

**Component**: `tabs`
**Available Variants**:
- Uses composition (`TabsList`, `TabsTrigger`, `TabsContent`)
- `className`: Style individual parts

**Usage Example**:
```typescript
<Tabs defaultValue="content" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="content">Content</TabsTrigger>
    <TabsTrigger value="style">Style</TabsTrigger>
    <TabsTrigger value="layout">Layout</TabsTrigger>
  </TabsList>
</Tabs>
```

### Custom Variants (if absolutely necessary)

**⚠️ ONLY if shadcn doesn't provide what's needed**

**Color Picker**: shadcn doesn't provide a color picker component
**Approach**: Use native `<input type="color">` wrapped with shadcn `Input` styling
**Do NOT modify**: `@/components/ui/` files

**Alternative**: Consider third-party library like `react-colorful` and wrap with shadcn styling

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility
- **Keyboard Navigation**:
  - Tabs: Arrow keys to navigate between tabs
  - Accordion: Arrow keys + Space/Enter to expand/collapse
  - Slider: Arrow keys to adjust value
  - Switch: Space/Enter to toggle

- **ARIA Attributes**:
  - All Radix primitives include proper ARIA roles and states
  - `slider`: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
  - `switch`: `role="switch"`, `aria-checked`
  - `tabs`: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`
  - `accordion`: `role="region"`, `aria-expanded`, `aria-controls`

- **Focus Management**:
  - Radix handles focus trapping and restoration
  - Visible focus indicators on all interactive elements

- **Screen Reader**:
  - Labels announce properly with `htmlFor` attribute
  - Form validation errors announced via `aria-invalid` and `aria-describedby`
  - State changes (expanded/collapsed, checked/unchecked) announced

### Accessibility Requirements
**Note**: Pass to UX designer for full a11y plan. shadcn handles primitives.

- **Labels**: Ensure all form inputs have associated `<Label>` components
- **Descriptions**: Use `aria-describedby` for helper text and error messages
- **Error States**: Use `aria-invalid` on inputs with validation errors
- **Focus Order**: Logical tab order through properties panel
- **Keyboard Shortcuts**: Consider adding shortcuts for common actions (will be handled by parent component logic)

## 5. Installation Verification

After installation, verify:

1. **Components exist**:
   - `@/components/ui/label.tsx`
   - `@/components/ui/slider.tsx`
   - `@/components/ui/switch.tsx`
   - `@/components/ui/badge.tsx`
   - `@/components/ui/tabs.tsx`
   - `@/components/ui/accordion.tsx`
   - `@/components/ui/card.tsx`
   - `@/components/ui/separator.tsx`
   - `@/components/ui/form.tsx`

2. **Dependencies installed**: Check `package.json` for new Radix UI packages:
   - `@radix-ui/react-slider`
   - `@radix-ui/react-switch`
   - `@radix-ui/react-tabs`
   - `@radix-ui/react-accordion`
   - `@radix-ui/react-separator`
   - `@radix-ui/react-label` (might be included)

3. **Types available**: TypeScript recognizes component exports

4. **Imports work**: Test import in development:
   ```typescript
   import { Label } from "@/components/ui/label"
   import { Slider } from "@/components/ui/slider"
   // etc.
   ```

## 6. Integration Notes

### Props to Configure

**Slider** (Font Size, Width, Height, Opacity):
- `min`: Minimum value (e.g., 8 for font size)
- `max`: Maximum value (e.g., 72 for font size)
- `step`: Increment value (e.g., 1)
- `value`: Array with current value `[16]`
- `onValueChange`: Callback with new value array

**Switch** (Bold, Italic, Edit Mode):
- `checked`: Boolean state
- `onCheckedChange`: Callback with new boolean

**Select** (Font Family, Alignment, Element Type):
- `value`: Current selected value
- `onValueChange`: Callback with new string value
- Populate `SelectItem` components with options

**Input** (Text Content, CSS Values):
- `value`: Current string value
- `onChange`: Standard React change handler
- `type`: "text", "color", "number", etc.

**Badge** (Selected Element Indicator):
- `variant`: "secondary" for subtle indicator
- Content: Icon + element type text

**Tabs** (Property Categories):
- `defaultValue`: Initial tab (e.g., "content")
- `value`: Controlled tab state
- `onValueChange`: Callback with new tab value

**Accordion** (Collapsible Sections):
- `type`: "single" (only one open) or "multiple" (many open)
- `collapsible`: Allow closing the only open item
- `value`: Controlled state for open items

### Event Handlers Needed

**Properties Panel**:
- `onPropertyChange(property: string, value: any)`: Generic property change handler
- `onTextContentChange(text: string)`: Update text element content
- `onStyleChange(property: string, value: string)`: Update CSS property
- `onDeselect()`: Clear selected element
- `onReset()`: Reset properties to original values

**Mode Toggle**:
- `onModeChange(isEditMode: boolean)`: Switch between chat and edit modes

**Element Selection**:
- `onElementSelect(element: ElementInfo)`: Called when element clicked in preview
- `onElementDeselect()`: Clear selection

### Styling Considerations

- **Tailwind Classes**:
  - Use `space-y-4` for vertical spacing between property groups
  - Use `grid grid-cols-2 gap-4` for side-by-side inputs
  - Use `w-full` for full-width inputs

- **CSS Variables**:
  - shadcn uses CSS variables for theming (already configured)
  - Properties panel inherits theme colors automatically

- **Dark Mode**:
  - All shadcn components support dark mode automatically
  - No additional configuration needed

## 7. Important Notes

⚠️ **NEVER modify shadcn source files** in `@/components/ui/`
⚠️ **Composition over modification**: Wrap, don't edit
💡 **Check registry first**: Component might already exist
💡 **Use variants**: Don't create new components for style changes
📝 **Coordinate with UX designer**: For full component architecture
🎨 **Color Picker**: Not provided by shadcn - use native `<input type="color">` or third-party library
📝 **React Hook Form**: The `form` component integrates with `react-hook-form` (already in stack as dependency of zod)

## 8. Next Steps for Parent Agent

1. **Run installation commands**:
   ```bash
   pnpm dlx shadcn@latest add label slider switch badge tabs accordion card separator form
   ```

2. **Verify components** in `@/components/ui/`:
   - Check all 9 new component files exist
   - Verify package.json has new Radix UI dependencies

3. **Coordinate with UX designer** for full component design:
   - Properties panel layout and organization
   - Property fields for each element type (text, image, button, etc.)
   - Interaction patterns (how properties update preview)
   - Text maps for property labels and help text

4. **Implement composition** as specified:
   - Create properties panel organism with tabs + accordion structure
   - Add selected element badge to prompt area
   - Implement mode toggle (chat ↔ edit)
   - Wire up form state management

5. **Test accessibility features**:
   - Keyboard navigation through all controls
   - Screen reader announcements
   - Focus management
   - ARIA attributes present

6. **Consider React Hook Form integration**:
   - Use shadcn's `form` component with React Hook Form
   - Add zod schemas for property validation
   - Handle form submission and reset
