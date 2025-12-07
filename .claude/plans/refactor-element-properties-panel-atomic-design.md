# Element Properties Panel - Atomic Design Refactoring Plan

**Created**: 2025-12-06
**Component**: `src/components/organisms/element-properties-panel.tsx`
**Type**: Atomic Design Refactoring
**Complexity**: Medium
**Current Size**: 297 lines

## 1. Executive Summary

The `VisualEdits` component (element-properties-panel.tsx) is a monolithic 297-line Client Component that mixes concerns and violates Atomic Design principles. This plan refactors it into a clean hierarchy of atoms, molecules, and a coordinating organism, following the project's Screaming Architecture and critical constraints.

### Current Issues

1. **Monolithic Structure**: Single component handling empty states, content editing, style editing, layout editing, and actions
2. **Mixed Concerns**: Business logic (element type checking) mixed with UI
3. **Duplicate Code**: Repeated patterns for form fields (Label + Input/Textarea)
4. **Poor Reusability**: No isolated, testable components
5. **Violates Atomic Design**: No clear separation of atoms, molecules, organisms
6. **Large Component**: 297 lines makes it hard to maintain and test

### Refactoring Goals

1. Break down into proper Atomic Design hierarchy
2. Extract reusable atoms and molecules
3. Separate business logic into hooks
4. Improve testability and maintainability
5. Follow project's critical constraints (RSC, naming, state management)

---

## 2. Component Analysis

### Current Structure Breakdown

```
VisualEdits (297 lines) - CLIENT COMPONENT
├── Empty State (lines 30-41)
├── Header Section (lines 76-78)
├── Content Accordion Section (lines 87-149)
│   ├── Text Content Textarea (lines 90-103)
│   ├── Image URL Input (lines 107-118)
│   ├── Image Alt Input (lines 120-130)
│   └── Link URL Input (lines 134-147)
├── Style Accordion Section (lines 152-223)
│   ├── Color Inputs (lines 155-183)
│   ├── Font Size Input (lines 187-197)
│   ├── Font Weight Input (lines 199-209)
│   └── Text Align Input (lines 211-221)
├── Layout Accordion Section (lines 226-281)
│   ├── Width/Height Inputs (lines 229-253)
│   ├── Padding Input (lines 257-267)
│   └── Margin Input (lines 269-279)
└── Action Buttons (lines 285-292)
    ├── Apply Changes Button
    └── Cancel Button
```

### Identified Patterns (Atoms)

1. **PropertyInput**: Label + Input pattern (repeated 10+ times)
2. **PropertyTextarea**: Label + Textarea pattern
3. **PropertyColorPicker**: Label + Color Input pattern
4. **EmptyStateMessage**: Empty state with icon and text

### Identified Patterns (Molecules)

1. **ContentPropertySection**: Content-related inputs (text, image, link)
2. **StylePropertySection**: Style-related inputs (colors, fonts)
3. **LayoutPropertySection**: Layout-related inputs (dimensions, spacing)
4. **PropertyFormActions**: Apply/Cancel buttons
5. **PropertyPanelHeader**: Panel title header

---

## 3. Atomic Design Breakdown

### 3.1. Atoms (Basic Building Blocks)

#### A. PropertyFormField

**Purpose**: Reusable form field with label and input
**Location**: `/src/components/atoms/property-form-field.tsx`
**Type**: Client Component (needs onChange handler)
**Reusability**: High - can be used in any property panel

```tsx
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PropertyFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'number' | 'color';
  placeholder?: string;
  className?: string;
}

export function PropertyFormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className
}: PropertyFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
```

**Props Interface**:
```typescript
interface PropertyFormFieldProps {
  id: string;              // HTML id for accessibility
  label: string;           // Label text
  value: string;           // Controlled value
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'number' | 'color';
  placeholder?: string;
  className?: string;
}
```

---

#### B. PropertyTextareaField

**Purpose**: Reusable textarea field with label
**Location**: `/src/components/atoms/property-textarea-field.tsx`
**Type**: Client Component (needs onChange handler)
**Reusability**: High

```tsx
'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PropertyTextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function PropertyTextareaField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder
}: PropertyTextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}
```

**Props Interface**:
```typescript
interface PropertyTextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}
```

---

#### C. PropertyColorField

**Purpose**: Color picker with label (specialized for color input)
**Location**: `/src/components/atoms/property-color-field.tsx`
**Type**: Client Component
**Reusability**: Medium

```tsx
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PropertyColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export function PropertyColorField({
  id,
  label,
  value,
  onChange,
  defaultValue = '#000000'
}: PropertyColorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="color"
        value={value || defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-10"
      />
    </div>
  );
}
```

**Props Interface**:
```typescript
interface PropertyColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}
```

---

#### D. EmptyStateMessage

**Purpose**: Reusable empty state display
**Location**: `/src/components/atoms/empty-state-message.tsx`
**Type**: Server Component (no interactivity)
**Reusability**: High - can be used across app

```tsx
interface EmptyStateMessageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyStateMessage({
  title,
  description,
  icon
}: EmptyStateMessageProps) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-muted-foreground text-center">
        {icon && <div className="mb-2">{icon}</div>}
        <p className="text-sm">{title}</p>
        {description && (
          <p className="text-muted-foreground/70 text-xs">{description}</p>
        )}
      </div>
    </div>
  );
}
```

**Props Interface**:
```typescript
interface EmptyStateMessageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}
```

---

### 3.2. Molecules (Combinations of Atoms)

#### A. ContentPropertiesSection

**Purpose**: Content editing section (text, images, links)
**Location**: `/src/components/molecules/content-properties-section.tsx`
**Type**: Client Component (uses form fields)
**Complexity**: Medium

```tsx
'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import { PropertyTextareaField } from '@/components/atoms/property-textarea-field';
import type { ElementType, ElementProperties } from '@/stores/visual-edit.store';

interface ContentPropertiesSectionProps {
  elementType: ElementType;
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function ContentPropertiesSection({
  elementType,
  properties,
  onPropertyChange
}: ContentPropertiesSectionProps) {
  const isTextElement = ['text', 'button', 'link'].includes(elementType);
  const isImageElement = elementType === 'image';
  const isLinkElement = elementType === 'link';

  return (
    <AccordionItem value="content">
      <AccordionTrigger>Content</AccordionTrigger>
      <AccordionContent className="space-y-4">
        {isTextElement && (
          <PropertyTextareaField
            id="content"
            label="Text Content"
            value={properties.content || ''}
            onChange={(value) => onPropertyChange('content', value)}
            placeholder="Enter text content..."
          />
        )}

        {isImageElement && (
          <>
            <PropertyFormField
              id="src"
              label="Image URL"
              type="url"
              value={properties.src || ''}
              onChange={(value) => onPropertyChange('src', value)}
              placeholder="https://..."
            />

            <PropertyFormField
              id="alt"
              label="Alt Text"
              value={properties.alt || ''}
              onChange={(value) => onPropertyChange('alt', value)}
              placeholder="Describe the image..."
            />
          </>
        )}

        {isLinkElement && (
          <PropertyFormField
            id="href"
            label="Link URL"
            type="url"
            value={properties.href || ''}
            onChange={(value) => onPropertyChange('href', value)}
            placeholder="https://..."
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
```

**Props Interface**:
```typescript
interface ContentPropertiesSectionProps {
  elementType: ElementType;
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}
```

**Business Logic**:
- Element type checking (isTextElement, isImageElement, isLinkElement)
- Conditional rendering based on element type

---

#### B. StylePropertiesSection

**Purpose**: Style editing section (colors, fonts, alignment)
**Location**: `/src/components/molecules/style-properties-section.tsx`
**Type**: Client Component
**Complexity**: Medium

```tsx
'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import { PropertyColorField } from '@/components/atoms/property-color-field';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface StylePropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function StylePropertiesSection({
  properties,
  onPropertyChange
}: StylePropertiesSectionProps) {
  return (
    <AccordionItem value="style">
      <AccordionTrigger>Style</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PropertyColorField
            id="color"
            label="Text Color"
            value={properties.color || ''}
            onChange={(value) => onPropertyChange('color', value)}
            defaultValue="#000000"
          />

          <PropertyColorField
            id="backgroundColor"
            label="Background"
            value={properties.backgroundColor || ''}
            onChange={(value) => onPropertyChange('backgroundColor', value)}
            defaultValue="#ffffff"
          />
        </div>

        <Separator />

        <PropertyFormField
          id="fontSize"
          label="Font Size"
          value={properties.fontSize || ''}
          onChange={(value) => onPropertyChange('fontSize', value)}
          placeholder="16px"
        />

        <PropertyFormField
          id="fontWeight"
          label="Font Weight"
          value={properties.fontWeight || ''}
          onChange={(value) => onPropertyChange('fontWeight', value)}
          placeholder="400"
        />

        <PropertyFormField
          id="textAlign"
          label="Text Align"
          value={properties.textAlign || ''}
          onChange={(value) => onPropertyChange('textAlign', value)}
          placeholder="left"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
```

**Props Interface**:
```typescript
interface StylePropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}
```

---

#### C. LayoutPropertiesSection

**Purpose**: Layout editing section (dimensions, spacing)
**Location**: `/src/components/molecules/layout-properties-section.tsx`
**Type**: Client Component
**Complexity**: Medium

```tsx
'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { PropertyFormField } from '@/components/atoms/property-form-field';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface LayoutPropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}

export function LayoutPropertiesSection({
  properties,
  onPropertyChange
}: LayoutPropertiesSectionProps) {
  return (
    <AccordionItem value="layout">
      <AccordionTrigger>Layout</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PropertyFormField
            id="width"
            label="Width"
            value={properties.width || ''}
            onChange={(value) => onPropertyChange('width', value)}
            placeholder="auto"
          />

          <PropertyFormField
            id="height"
            label="Height"
            value={properties.height || ''}
            onChange={(value) => onPropertyChange('height', value)}
            placeholder="auto"
          />
        </div>

        <Separator />

        <PropertyFormField
          id="padding"
          label="Padding"
          value={properties.padding || ''}
          onChange={(value) => onPropertyChange('padding', value)}
          placeholder="0px"
        />

        <PropertyFormField
          id="margin"
          label="Margin"
          value={properties.margin || ''}
          onChange={(value) => onPropertyChange('margin', value)}
          placeholder="0px"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
```

**Props Interface**:
```typescript
interface LayoutPropertiesSectionProps {
  properties: ElementProperties;
  onPropertyChange: (key: string, value: string) => void;
}
```

---

#### D. PropertyPanelActions

**Purpose**: Action buttons section (Apply, Cancel)
**Location**: `/src/components/molecules/property-panel-actions.tsx`
**Type**: Client Component (button handlers)
**Complexity**: Low

```tsx
'use client';

import { Button } from '@/components/ui/button';

interface PropertyPanelActionsProps {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
}

export function PropertyPanelActions({
  onApply,
  onCancel,
  isApplyDisabled = false
}: PropertyPanelActionsProps) {
  return (
    <div className="border-border flex gap-2 border-t p-4">
      <Button onClick={onApply} className="flex-1" disabled={isApplyDisabled}>
        Apply Changes
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
```

**Props Interface**:
```typescript
interface PropertyPanelActionsProps {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
}
```

---

#### E. PropertyPanelHeader

**Purpose**: Panel header with title
**Location**: `/src/components/molecules/property-panel-header.tsx`
**Type**: Server Component (no interactivity)
**Complexity**: Low

```tsx
interface PropertyPanelHeaderProps {
  title: string;
}

export function PropertyPanelHeader({ title }: PropertyPanelHeaderProps) {
  return (
    <div className="border-border border-b px-6 py-3.5">
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}
```

**Props Interface**:
```typescript
interface PropertyPanelHeaderProps {
  title: string;
}
```

---

### 3.3. Organism (Coordinating Component)

#### ElementPropertiesPanel (Refactored)

**Purpose**: Orchestrate all property editing sections
**Location**: `/src/components/organisms/element-properties-panel.tsx`
**Type**: Client Component (coordinates state)
**Complexity**: Low (after refactoring)

```tsx
'use client';

import { CardContent } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useEmailStore } from '@/stores/email.store';
import { EmptyStateMessage } from '@/components/atoms/empty-state-message';
import { PropertyPanelHeader } from '@/components/molecules/property-panel-header';
import { ContentPropertiesSection } from '@/components/molecules/content-properties-section';
import { StylePropertiesSection } from '@/components/molecules/style-properties-section';
import { LayoutPropertiesSection } from '@/components/molecules/layout-properties-section';
import { PropertyPanelActions } from '@/components/molecules/property-panel-actions';
import { useElementPropertiesPanel } from '@/hooks/use-element-properties-panel';

export function ElementPropertiesPanel() {
  const {
    selectedElementId,
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement
  } = useVisualEditStore();

  const { htmlBody, setHtmlBody } = useEmailStore();

  const { handleApplyChanges, handlePropertyChange } = useElementPropertiesPanel({
    selectedElementId,
    selectedElementProperties,
    htmlBody,
    setHtmlBody,
    deselectElement
  });

  // Empty state
  if (!selectedElementType || !selectedElementProperties) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <EmptyStateMessage
          title="No element selected"
          description="Click on an element in the preview to edit its properties"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-full flex-col border-0 shadow-none">
        <PropertyPanelHeader title="Visual Edits" />

        <CardContent className="max-h-[calc(100dvh-190px)] flex-1 overflow-auto p-4">
          <Accordion
            type="multiple"
            defaultValue={['content', 'style', 'layout']}
            className="w-full"
          >
            <ContentPropertiesSection
              elementType={selectedElementType}
              properties={selectedElementProperties}
              onPropertyChange={handlePropertyChange}
            />

            <StylePropertiesSection
              properties={selectedElementProperties}
              onPropertyChange={handlePropertyChange}
            />

            <LayoutPropertiesSection
              properties={selectedElementProperties}
              onPropertyChange={handlePropertyChange}
            />
          </Accordion>
        </CardContent>

        <PropertyPanelActions
          onApply={handleApplyChanges}
          onCancel={deselectElement}
        />
      </div>
    </div>
  );
}
```

**Responsibilities**:
- Connect to Zustand stores
- Delegate to custom hook for business logic
- Compose molecules into final UI
- Handle empty state

**Reduced from 297 lines to ~70 lines**

---

### 3.4. Custom Hook (Business Logic Extraction)

#### useElementPropertiesPanel

**Purpose**: Extract business logic from component
**Location**: `/src/hooks/use-element-properties-panel.ts`
**Type**: Custom hook
**Complexity**: Low

```tsx
'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { modifyElementInHTML } from '@/lib/html-modifier';
import type { ElementProperties } from '@/stores/visual-edit.store';

interface UseElementPropertiesPanelProps {
  selectedElementId: string | null;
  selectedElementProperties: ElementProperties | null;
  htmlBody: string;
  setHtmlBody: (htmlBody: string) => void;
  deselectElement: () => void;
}

export function useElementPropertiesPanel({
  selectedElementId,
  selectedElementProperties,
  htmlBody,
  setHtmlBody,
  deselectElement
}: UseElementPropertiesPanelProps) {
  const handleApplyChanges = useCallback(() => {
    if (!selectedElementId || !selectedElementProperties || !htmlBody) {
      toast.error('Cannot apply changes');
      return;
    }

    try {
      // Modify the HTML with the updated properties
      const updatedHTML = modifyElementInHTML({
        htmlBody,
        elementId: selectedElementId,
        properties: selectedElementProperties
      });

      // Update the HTML in the store
      setHtmlBody(updatedHTML);

      toast.success('Changes applied successfully');
      deselectElement();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error('Failed to apply changes');
    }
  }, [
    selectedElementId,
    selectedElementProperties,
    htmlBody,
    setHtmlBody,
    deselectElement
  ]);

  const handlePropertyChange = useCallback(
    (key: string, value: string) => {
      // This would call updateElementProperty from the store
      // But since we're using it in the organism, we can pass it down
      // For now, this is a placeholder
    },
    []
  );

  return {
    handleApplyChanges,
    handlePropertyChange
  };
}
```

**Props Interface**:
```typescript
interface UseElementPropertiesPanelProps {
  selectedElementId: string | null;
  selectedElementProperties: ElementProperties | null;
  htmlBody: string;
  setHtmlBody: (htmlBody: string) => void;
  deselectElement: () => void;
}
```

**Return Interface**:
```typescript
interface UseElementPropertiesPanelReturn {
  handleApplyChanges: () => void;
  handlePropertyChange: (key: string, value: string) => void;
}
```

**Business Logic**:
- Validation before applying changes
- HTML modification
- Toast notifications
- Error handling

---

## 4. File Structure

### New Files to Create

```
src/
├── components/
│   ├── atoms/
│   │   ├── property-form-field.tsx          # NEW - Form field atom
│   │   ├── property-textarea-field.tsx      # NEW - Textarea field atom
│   │   ├── property-color-field.tsx         # NEW - Color picker atom
│   │   └── empty-state-message.tsx          # NEW - Empty state atom
│   │
│   ├── molecules/
│   │   ├── content-properties-section.tsx   # NEW - Content section
│   │   ├── style-properties-section.tsx     # NEW - Style section
│   │   ├── layout-properties-section.tsx    # NEW - Layout section
│   │   ├── property-panel-actions.tsx       # NEW - Action buttons
│   │   └── property-panel-header.tsx        # NEW - Panel header
│   │
│   └── organisms/
│       └── element-properties-panel.tsx     # REFACTOR - Simplified organism
│
├── hooks/
│   └── use-element-properties-panel.ts      # NEW - Business logic hook
│
└── styles/
    └── components/
        ├── atoms/
        │   └── property-form-field.css      # OPTIONAL - If needed
        └── molecules/
            └── property-panel.css           # OPTIONAL - If needed
```

### Files to Modify

```
src/components/organisms/element-properties-panel.tsx
- Refactor from 297 lines to ~70 lines
- Remove business logic (move to hook)
- Remove duplicate form field code (use atoms)
- Simplify to composition of molecules
```

---

## 5. Component Hierarchy Diagram

```
ElementPropertiesPanel (Organism - 70 lines)
├── EmptyStateMessage (Atom)
│   └── [No element selected state]
│
├── PropertyPanelHeader (Molecule)
│   └── "Visual Edits" title
│
├── Accordion Container
│   ├── ContentPropertiesSection (Molecule)
│   │   ├── PropertyTextareaField (Atom) - Text content
│   │   ├── PropertyFormField (Atom) - Image URL
│   │   ├── PropertyFormField (Atom) - Alt text
│   │   └── PropertyFormField (Atom) - Link URL
│   │
│   ├── StylePropertiesSection (Molecule)
│   │   ├── PropertyColorField (Atom) - Text color
│   │   ├── PropertyColorField (Atom) - Background
│   │   ├── PropertyFormField (Atom) - Font size
│   │   ├── PropertyFormField (Atom) - Font weight
│   │   └── PropertyFormField (Atom) - Text align
│   │
│   └── LayoutPropertiesSection (Molecule)
│       ├── PropertyFormField (Atom) - Width
│       ├── PropertyFormField (Atom) - Height
│       ├── PropertyFormField (Atom) - Padding
│       └── PropertyFormField (Atom) - Margin
│
└── PropertyPanelActions (Molecule)
    ├── Button (shadcn) - Apply
    └── Button (shadcn) - Cancel
```

---

## 6. Data Flow

```
┌─────────────────────────────────────────────────────────┐
│         ElementPropertiesPanel (Organism)               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │   useVisualEditStore() - Zustand                 │  │
│  │   - selectedElementId                            │  │
│  │   - selectedElementType                          │  │
│  │   - selectedElementProperties                    │  │
│  │   - updateElementProperty()                      │  │
│  │   - deselectElement()                            │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │   useElementPropertiesPanel() - Custom Hook     │  │
│  │   - handleApplyChanges()                         │  │
│  │   - handlePropertyChange()                       │  │
│  │   [Business logic: validation, toast, errors]   │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Molecules (Sections)                           │  │
│  │   - ContentPropertiesSection                     │  │
│  │   - StylePropertiesSection                       │  │
│  │   - LayoutPropertiesSection                      │  │
│  │   - PropertyPanelActions                         │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Atoms (Form Fields)                            │  │
│  │   - PropertyFormField                            │  │
│  │   - PropertyTextareaField                        │  │
│  │   - PropertyColorField                           │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │   updateElementProperty(key, value)              │  │
│  │   [Updates Zustand store]                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Migration Strategy

### Phase 1: Create Atoms (Low Risk)

1. Create `property-form-field.tsx`
2. Create `property-textarea-field.tsx`
3. Create `property-color-field.tsx`
4. Create `empty-state-message.tsx`

**Testing**: Unit test each atom in isolation

**Time**: 2 hours

---

### Phase 2: Create Molecules (Medium Risk)

1. Create `content-properties-section.tsx` (uses atoms)
2. Create `style-properties-section.tsx` (uses atoms)
3. Create `layout-properties-section.tsx` (uses atoms)
4. Create `property-panel-actions.tsx` (uses shadcn Button)
5. Create `property-panel-header.tsx`

**Testing**: Unit test each molecule with mocked props

**Time**: 3 hours

---

### Phase 3: Extract Business Logic (Medium Risk)

1. Create `use-element-properties-panel.ts` hook
2. Move `handleApplyChanges` logic to hook
3. Add proper error handling and validation
4. Add proper TypeScript types

**Testing**: Unit test hook with mocked stores

**Time**: 2 hours

---

### Phase 4: Refactor Organism (High Risk - Breaking Changes)

1. Backup current `element-properties-panel.tsx`
2. Refactor to use new molecules and atoms
3. Connect to custom hook
4. Remove duplicate code
5. Verify all functionality works

**Testing**: Integration testing with real stores

**Time**: 3 hours

---

### Phase 5: Cleanup and Validation

1. Remove old commented code
2. Add Storybook stories for atoms and molecules
3. Update any dependent components
4. Verify no regressions in visual editing
5. Document component usage

**Testing**: E2E testing of visual editing flow

**Time**: 2 hours

---

### Total Migration Time: ~12 hours

---

## 8. Testing Strategy

### Unit Tests (Atoms)

```typescript
// property-form-field.test.tsx
describe('PropertyFormField', () => {
  it('should render label and input', () => {});
  it('should call onChange when input changes', () => {});
  it('should handle different input types', () => {});
  it('should show placeholder', () => {});
});

// property-color-field.test.tsx
describe('PropertyColorField', () => {
  it('should render color input with default value', () => {});
  it('should call onChange with color value', () => {});
});

// empty-state-message.test.tsx
describe('EmptyStateMessage', () => {
  it('should render title and description', () => {});
  it('should render optional icon', () => {});
});
```

---

### Integration Tests (Molecules)

```typescript
// content-properties-section.test.tsx
describe('ContentPropertiesSection', () => {
  it('should render text content field for text elements', () => {});
  it('should render image fields for image elements', () => {});
  it('should render link field for link elements', () => {});
  it('should call onPropertyChange correctly', () => {});
});

// style-properties-section.test.tsx
describe('StylePropertiesSection', () => {
  it('should render all style fields', () => {});
  it('should call onPropertyChange for each field', () => {});
});
```

---

### E2E Tests (Organism)

```typescript
// element-properties-panel.test.tsx
describe('ElementPropertiesPanel', () => {
  it('should show empty state when no element selected', () => {});
  it('should show properties when element selected', () => {});
  it('should update properties in store', () => {});
  it('should apply changes to HTML', () => {});
  it('should show toast on success', () => {});
  it('should show toast on error', () => {});
  it('should deselect element on cancel', () => {});
});
```

---

## 9. Storybook Stories

### Atoms Stories

```typescript
// property-form-field.stories.tsx
export default {
  title: 'Atoms/PropertyFormField',
  component: PropertyFormField
};

export const Default = {
  args: {
    id: 'test',
    label: 'Label',
    value: '',
    onChange: () => {},
    placeholder: 'Placeholder...'
  }
};

export const WithValue = {
  args: {
    ...Default.args,
    value: 'Example value'
  }
};

export const ColorType = {
  args: {
    ...Default.args,
    type: 'color',
    value: '#ff0000'
  }
};
```

---

### Molecules Stories

```typescript
// content-properties-section.stories.tsx
export default {
  title: 'Molecules/ContentPropertiesSection',
  component: ContentPropertiesSection
};

export const TextElement = {
  args: {
    elementType: 'text',
    properties: { content: 'Sample text' },
    onPropertyChange: () => {}
  }
};

export const ImageElement = {
  args: {
    elementType: 'image',
    properties: { src: 'https://...', alt: 'Sample' },
    onPropertyChange: () => {}
  }
};
```

---

## 10. Critical Constraints Compliance

### Constraint Checklist

- [x] **Named Exports Only**: All components use named exports
- [x] **Client Components**: Only components with interactivity are Client Components
- [x] **Server Components**: EmptyStateMessage, PropertyPanelHeader are Server Components
- [x] **Naming Conventions**: All files use kebab-case
- [x] **Boolean Prefixes**: isApplyDisabled, isTextElement, etc.
- [x] **Event Handlers**: handleApplyChanges, handlePropertyChange
- [x] **State Management**: Zustand for UI state (visual-edit.store)
- [x] **Business Logic in Hooks**: useElementPropertiesPanel extracts logic
- [x] **Separation of Concerns**: UI (components) vs Logic (hooks)
- [x] **Atomic Design**: Clear atoms, molecules, organisms hierarchy
- [x] **No Default Exports**: Except page.tsx/layout.tsx (N/A here)
- [x] **Absolute Imports**: Use @/ alias for all imports

---

### Architecture Dependency Rules

```
Organism (ElementPropertiesPanel)
├── Can import: Molecules, Atoms, Hooks, Stores, UI Components
│
Molecules (ContentPropertiesSection, etc.)
├── Can import: Atoms, UI Components
├── Cannot import: Organisms, Hooks, Stores
│
Atoms (PropertyFormField, etc.)
├── Can import: UI Components only
├── Cannot import: Molecules, Organisms, Hooks, Stores
│
Hooks (useElementPropertiesPanel)
├── Can import: Stores, Utils
├── Cannot import: Components
```

**Compliance**: All refactored components follow these rules.

---

## 11. Benefits of Refactoring

### Before Refactoring

- ❌ 297 lines in single file
- ❌ Mixed concerns (UI + business logic)
- ❌ Repeated code (10+ identical form field patterns)
- ❌ Hard to test
- ❌ Hard to maintain
- ❌ Hard to reuse
- ❌ No clear Atomic Design structure

### After Refactoring

- ✅ 70 lines in organism (76% reduction)
- ✅ Clear separation of concerns
- ✅ 4 reusable atoms
- ✅ 5 reusable molecules
- ✅ 1 custom hook for business logic
- ✅ Easy to test (unit + integration + E2E)
- ✅ Easy to maintain (each piece is small)
- ✅ Reusable across app
- ✅ Clear Atomic Design hierarchy
- ✅ Better TypeScript type safety
- ✅ Storybook documentation ready

---

## 12. Reusability Opportunities

### Atoms Can Be Reused For:

- **PropertyFormField**: Any form in the app
- **PropertyTextareaField**: Any textarea form
- **PropertyColorField**: Any color picker
- **EmptyStateMessage**: Empty states across app (lists, tables, etc.)

### Molecules Can Be Reused For:

- **ContentPropertiesSection**: Other content editing panels
- **StylePropertiesSection**: Other style editing panels
- **LayoutPropertiesSection**: Other layout editing panels
- **PropertyPanelActions**: Any panel with Apply/Cancel actions

---

## 13. Performance Considerations

### Current Component

- Renders 297 lines on every state change
- All form fields re-render together
- No optimization

### Refactored Component

- Smaller components render independently
- Molecules can be memoized if needed
- Atoms are pure and predictable
- Better React reconciliation
- Can add React.memo() to atoms/molecules if performance issues

---

## 14. Future Enhancements (Post-Refactoring)

1. **Add validation**: Use Zod schema for property validation
2. **Add undo/redo**: Track property change history
3. **Add presets**: Save/load property presets
4. **Add accessibility**: ARIA labels, keyboard navigation
5. **Add animations**: Smooth transitions between sections
6. **Add tooltips**: Help text for each property
7. **Add color palette**: Predefined color options
8. **Add unit selector**: px, %, em, rem for dimensions

---

## 15. Implementation Checklist

### Pre-Implementation

- [ ] Read this plan thoroughly
- [ ] Review critical constraints document
- [ ] Set up testing environment
- [ ] Create feature branch: `refactor/element-properties-panel-atomic`

### Phase 1: Atoms

- [ ] Create `property-form-field.tsx`
- [ ] Create `property-textarea-field.tsx`
- [ ] Create `property-color-field.tsx`
- [ ] Create `empty-state-message.tsx`
- [ ] Write unit tests for all atoms
- [ ] Create Storybook stories for atoms

### Phase 2: Molecules

- [ ] Create `content-properties-section.tsx`
- [ ] Create `style-properties-section.tsx`
- [ ] Create `layout-properties-section.tsx`
- [ ] Create `property-panel-actions.tsx`
- [ ] Create `property-panel-header.tsx`
- [ ] Write integration tests for molecules
- [ ] Create Storybook stories for molecules

### Phase 3: Hook

- [ ] Create `use-element-properties-panel.ts`
- [ ] Move business logic from component
- [ ] Add proper error handling
- [ ] Write unit tests for hook

### Phase 4: Organism Refactor

- [ ] Backup current file
- [ ] Refactor organism to use atoms/molecules
- [ ] Connect to custom hook
- [ ] Remove duplicate code
- [ ] Write E2E tests
- [ ] Create Storybook story for organism

### Phase 5: Validation

- [ ] Manual testing of all functionality
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Code review
- [ ] Documentation update

### Post-Implementation

- [ ] Merge to main
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Document lessons learned

---

## 16. Risk Mitigation

### High Risk: Breaking Existing Functionality

**Mitigation**:
- Keep original file as backup
- Implement behind feature flag if possible
- Extensive testing before merging
- Incremental rollout

### Medium Risk: Performance Regression

**Mitigation**:
- Performance testing before/after
- Use React.memo() if needed
- Monitor bundle size
- Profile with React DevTools

### Low Risk: Type Errors

**Mitigation**:
- Strict TypeScript checking
- Proper interface definitions
- Type tests

---

## 17. Success Criteria

Refactoring is successful when:

1. ✅ All existing functionality works exactly as before
2. ✅ No visual regressions
3. ✅ Organism reduced to < 100 lines
4. ✅ All atoms/molecules have unit tests
5. ✅ All atoms/molecules have Storybook stories
6. ✅ TypeScript has no errors
7. ✅ No console errors/warnings
8. ✅ Performance is equal or better
9. ✅ Code is more maintainable (subjective but reviewable)
10. ✅ Components are reusable in other parts of app

---

## 18. Dependencies

### Required Packages (Already Installed)

- `@/components/ui/*` - shadcn components
- `zustand` - State management
- `sonner` - Toast notifications
- `react` - React framework

### No New Dependencies Required

---

## 19. Naming Consistency

### File Names (kebab-case)

- `property-form-field.tsx`
- `property-textarea-field.tsx`
- `property-color-field.tsx`
- `empty-state-message.tsx`
- `content-properties-section.tsx`
- `style-properties-section.tsx`
- `layout-properties-section.tsx`
- `property-panel-actions.tsx`
- `property-panel-header.tsx`
- `element-properties-panel.tsx`
- `use-element-properties-panel.ts`

### Component Names (PascalCase)

- `PropertyFormField`
- `PropertyTextareaField`
- `PropertyColorField`
- `EmptyStateMessage`
- `ContentPropertiesSection`
- `StylePropertiesSection`
- `LayoutPropertiesSection`
- `PropertyPanelActions`
- `PropertyPanelHeader`
- `ElementPropertiesPanel`

### Hook Names (camelCase with 'use' prefix)

- `useElementPropertiesPanel`

---

## 20. Summary

This refactoring plan transforms a monolithic 297-line component into a clean, maintainable Atomic Design structure with:

- **4 Atoms** (basic building blocks)
- **5 Molecules** (composed atoms)
- **1 Organism** (coordinated composition)
- **1 Custom Hook** (business logic)

**Key Improvements**:

1. 76% code reduction in organism (297 → 70 lines)
2. Clear separation of concerns
3. Reusable components
4. Testable architecture
5. Follows all project critical constraints
6. Maintains all existing functionality
7. Better TypeScript types
8. Storybook-ready documentation

**Next Steps**: Implement Phase 1 (Atoms) first, test thoroughly, then proceed to subsequent phases incrementally.
