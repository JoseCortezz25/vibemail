# Email Editor Components Documentation

Complete set of components for building a visual email editor, similar to v0 or Lovable.

## 📦 Components Overview

### Atoms (Building Blocks)

#### `EmailField`
A labeled input field for email-related data.

**Props:**
- `label`: Field label text
- `value`: Current value
- `onChange`: Callback when value changes
- `type`: 'text' | 'email'
- `required`: Whether field is required
- `disabled`: Whether field is disabled
- `placeholder`: Placeholder text

**Usage:**
```tsx
<EmailField
  label="Subject"
  value={subject}
  onChange={setSubject}
  placeholder="Enter subject"
/>
```

#### `FormatButton`
Button for text formatting actions with tooltip.

**Props:**
- `icon`: Lucide icon component
- `label`: Button label (shown in tooltip)
- `onClick`: Click handler
- `isActive`: Whether button is in active state
- `disabled`: Whether button is disabled

**Usage:**
```tsx
<FormatButton
  icon={Bold}
  label="Bold"
  onClick={() => applyFormat('bold')}
  isActive={isBold}
/>
```

---

### Molecules (Functional Components)

#### `EmailToolbar`
Complete formatting toolbar for email editor.

**Features:**
- Text formatting (bold, italic, underline)
- Text alignment (left, center, right)
- Lists (bullet, numbered)
- Media insertion (link, image)

**Props:**
- `onFormat`: Callback when format button clicked
- `activeFormats`: Array of currently active formats
- `disabled`: Disable all buttons

**Usage:**
```tsx
<EmailToolbar
  onFormat={handleFormat}
  activeFormats={['bold', 'alignLeft']}
/>
```

#### `EmailHeader`
Grouped header fields (recipient, subject).

**Props:**
- `data`: Object with `to` and `subject`
- `onChange`: Callback with partial data updates
- `disabled`: Disable all fields

**Usage:**
```tsx
<EmailHeader
  data={{ to: 'user@example.com', subject: 'Hello' }}
  onChange={(data) => setEmailData({ ...emailData, ...data })}
/>
```

#### `EmailContentEditor`
Content editing area with toolbar.

**Props:**
- `content`: Email content
- `onChange`: Callback when content changes
- `disabled`: Disable editing
- `minHeight`: Minimum editor height

**Usage:**
```tsx
<EmailContentEditor
  content={emailContent}
  onChange={setEmailContent}
  minHeight="300px"
/>
```

---

### Organisms (Complete Features)

#### `EmailEditor`
Complete email composition interface.

**Features:**
- Header fields (recipient, subject)
- Content editor with toolbar
- State management
- Change callbacks

**Props:**
- `initialEmail`: Initial email data
- `onChange`: Callback when email changes
- `disabled`: Disable entire editor

**Usage:**
```tsx
<EmailEditor
  initialEmail={{ subject: 'Draft', content: 'Hello...' }}
  onChange={(email) => console.log('Email changed:', email)}
/>
```

#### `EmailPreview`
Read-only preview of email.

**Features:**
- Shows sender, recipient, subject
- Renders formatted content
- Supports HTML and text formats
- Empty state

**Props:**
- `email`: Email object to preview
- `from`: Sender email address

**Usage:**
```tsx
<EmailPreview
  email={currentEmail}
  from="sender@example.com"
/>
```

---

## 🎨 Viewing in Storybook

Start Storybook:
```bash
pnpm storybook
```

### Available Stories

**Atoms:**
- `Atoms/EmailField` - Interactive field examples
- `Atoms/FormatButton` - Button states and interactions

**Molecules:**
- `Molecules/EmailToolbar` - Formatting toolbar
- `Molecules/EmailHeader` - Email header fields
- `Molecules/EmailContentEditor` - Content editor

**Organisms:**
- `Organisms/EmailEditor` - Complete editor with templates
- `Organisms/EmailPreview` - Email preview variations

### Interactive Stories

Each component has an "Interactive" story that allows you to:
- Modify props in real-time
- See state changes
- Test user interactions
- View data output

---

## 🏗️ Architecture

### Atomic Design Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── email-field.tsx
│   │   └── format-button.tsx
│   ├── molecules/
│   │   ├── email-toolbar.tsx
│   │   ├── email-header.tsx
│   │   └── email-content-editor.tsx
│   └── organisms/
│       ├── email-editor.tsx
│       └── email-preview.tsx
└── domains/
    └── email-editor/
        ├── schema.ts (Zod schemas & types)
        └── index.ts
```

### Domain Model

```typescript
type Email = {
  to: string;
  subject: string;
  content: string;
  format: 'text' | 'html';
};
```

---

## 🎯 Next Steps

### Integration Ideas

1. **Connect with AI Chat**
   - Use AI to generate email content
   - Preview AI-generated emails
   - Edit AI suggestions

2. **Rich Text Editor**
   - Integrate TipTap or similar
   - Add actual formatting logic
   - Support HTML editing

3. **Templates**
   - Pre-built email templates
   - Template selection UI
   - Custom template creation

4. **Attachments**
   - File upload support
   - Image insertion
   - Preview attachments

---

## 📝 Notes

- All components follow **Screaming Architecture** principles
- Client components only when necessary (`'use client'`)
- Named exports throughout
- Full TypeScript support with Zod schemas
- Accessible with ARIA labels
- Responsive design with Tailwind CSS

---

## 🧪 Testing

All components are fully documented in Storybook with:
- Default states
- Edge cases
- Interactive examples
- Accessibility features

Run Storybook to explore all variations:
```bash
pnpm storybook
```
