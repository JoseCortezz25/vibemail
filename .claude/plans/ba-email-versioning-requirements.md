# Business Requirements: Email Version Control System

**Document Version**: 1.0
**Created**: 2025-12-11
**Author**: Business Analyst Agent
**Session ID**: email-version-control-01YEjQztMb2DCJqehnaoGvnw
**Status**: Draft for Review

---

## Executive Summary

This document defines the requirements for implementing a version control system for AI-generated emails in VibeMail. The system will enable users to view, restore, and compare historical versions of emails generated during their design process, similar to version control in software development or revision history in document editors.

**Key Value Proposition**: Users often generate multiple email variations through iterative AI prompts. Without version control, valuable iterations are lost when new versions are generated. This feature provides safety, experimentation freedom, and historical context for email design decisions.

---

## 1. Problem Statement

### Current Situation

- Users generate emails through AI prompts, creating multiple iterations
- Each new generation **overwrites** the previous version completely
- Users cannot revert to a previous version if they prefer an earlier design
- No historical record of email evolution exists
- Users hesitate to experiment with new prompts fearing they'll lose good versions
- Copy-pasting emails externally is the only way to "save" versions

### Desired Outcome

- Users can confidently experiment with AI prompts knowing previous versions are saved
- Users can browse historical versions with clear metadata (when created, what prompt triggered it)
- Users can restore any previous version as the current working email
- Users can compare versions side-by-side to see differences
- System automatically manages version history with clear retention policies

### Value Proposition

**For End Users**:
- Freedom to experiment without fear of losing work
- Ability to compare design iterations
- Historical record of email evolution
- Quick recovery from unwanted changes

**For Business**:
- Increased user confidence and satisfaction
- Reduced support tickets about "lost" email versions
- Differentiation from competitors
- Data for understanding user iteration patterns

---

## 2. Stakeholders

### Primary Users: Email Designers

**Profile**: Marketing professionals, founders, designers creating marketing emails

**Goals**:
- Create high-quality marketing emails through iterative AI generation
- Experiment with different email designs without risk
- Recover previous versions when needed
- Compare different design iterations

**Pain Points**:
- Fear of losing good email versions when trying new prompts
- Cannot undo AI generations (unlike typical undo/redo)
- Need to manually copy-paste emails to external tools to "save" them
- Cannot compare current vs previous versions

**Needs**:
- Automatic version saving on each AI generation
- Easy-to-use version selector interface
- Clear metadata showing what changed and when
- One-click restore to previous versions

**Technical Level**: Intermediate (familiar with web apps, may not understand technical version control concepts)

### Secondary Users: System Administrators

**Goals**:
- Ensure system performance and storage are optimized
- Monitor version history usage patterns
- Manage storage costs

**Needs**:
- Automatic cleanup of old versions
- Storage metrics and monitoring
- Configurable retention policies

### Decision Makers: Product Team

**Success Criteria**:
- Feature adoption rate above 30% of active users
- Reduced support tickets about lost emails
- Positive user feedback in surveys
- No significant performance degradation

---

## 3. Scope

### In Scope ✅

- **Automatic Version Creation**:
  - Create new version on each AI email generation
  - Store complete email data (subject, jsxBody, htmlBody)
  - Store version metadata (timestamp, user prompt, version number)

- **Version History UI**:
  - Timeline or list view of all versions
  - Version metadata display (date, time, prompt snippet)
  - Visual preview of each version

- **Version Restoration**:
  - Restore any previous version as current email
  - Restoration creates a new version (non-destructive)

- **Version Management**:
  - Automatic retention policy (keep last N versions)
  - Manual version deletion (optional)
  - Version counter/numbering

- **Basic Comparison**:
  - Side-by-side preview of two versions
  - Basic metadata comparison (subject changes)

### Out of Scope ❌

- **Granular Diff View**: Line-by-line code diff of JSX (future enhancement)
- **Version Branching**: Creating multiple parallel version branches
- **Version Tagging/Naming**: Custom labels or names for versions (future)
- **Collaborative Version Comments**: Team members commenting on versions
- **Version Merging**: Combining elements from multiple versions
- **Cross-Email Version Sharing**: Sharing versions between different email projects
- **Export Version History**: Downloading version history as files
- **Undo/Redo Separate from Versions**: Traditional undo/redo functionality

### Assumptions

1. **Session-Based Versioning**: Versions are scoped to the current user session (not persisted to database initially)
2. **No Authentication Required**: Version history works without user accounts (client-side only)
3. **Single Email at a Time**: User works on one email at a time, not managing multiple email projects
4. **AI Generation Only**: Versions are created only when AI generates new emails, not on manual edits via visual editor
5. **Browser Storage Limitations**: Client-side storage may limit number of versions (addressed by retention policy)
6. **No Conflict Resolution**: User cannot have conflicting versions (linear history)

### Dependencies

- **Technical**:
  - React Query for version state management (per critical constraints)
  - shadcn/ui components for version selector UI
  - Existing email store structure (subject, jsxBody, htmlBody)
  - Email generation system (src/actions/generate.ts)

- **UX/UI**:
  - Design system components from shadcn/ui
  - Responsive layout for version selector
  - Accessibility requirements (WCAG 2.1 AA)

---

## 4. User Stories and Features

### Epic 1: Version History Management

**Priority**: P0 (Critical for MVP)

---

#### US-1.1: Automatic Version Creation on AI Generation

**As a** email designer
**I want** each AI-generated email to be automatically saved as a new version
**So that** I never lose previous iterations when generating new emails

**Acceptance Criteria**:
- [ ] When AI generates a new email, system creates a new version entry
- [ ] Version entry includes: subject, jsxBody, htmlBody, timestamp, user prompt
- [ ] Version is assigned an incrementing version number (v1, v2, v3...)
- [ ] Current email in email store is also stored as "current working version"
- [ ] Version creation happens before updating the email store
- [ ] If AI generation fails, no version is created

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-1.2: View Version History Timeline

**As a** email designer
**I want** to see a chronological list of all email versions
**So that** I can understand the evolution of my email design

**Acceptance Criteria**:
- [ ] Version history displays all versions in reverse chronological order (newest first)
- [ ] Each version shows: version number, timestamp (relative: "2 minutes ago"), prompt snippet (first 50 chars)
- [ ] Current working version is visually indicated (badge, highlight)
- [ ] List is scrollable if more than 5 versions exist
- [ ] Empty state message shown when no versions exist yet
- [ ] Mobile-responsive layout (stacked on mobile, sidebar on desktop)

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-1.3: Preview Version Content

**As a** email designer
**I want** to preview the full content of any version without restoring it
**So that** I can review what each version contains before deciding to restore

**Acceptance Criteria**:
- [ ] Clicking/hovering on a version shows preview panel
- [ ] Preview shows: full subject line, HTML email preview (iframe)
- [ ] Preview shows full user prompt that created this version
- [ ] Preview is rendered using same preview component as main email preview
- [ ] Preview updates smoothly without jarring UI changes
- [ ] Preview closes when clicking outside or on close button

**Priority**: P1
**Estimated Effort**: Small

---

#### US-1.4: Restore Previous Version

**As a** email designer
**I want** to restore any previous version as my current working email
**So that** I can continue working from a preferred earlier iteration

**Acceptance Criteria**:
- [ ] Each version has a "Restore" button/action
- [ ] Clicking restore shows confirmation dialog: "Restore version X? This will create a new version."
- [ ] Confirming restore copies version data to current email store
- [ ] Restoration creates a NEW version (does not delete current)
- [ ] New version's prompt is labeled: "Restored from v{X}"
- [ ] Version counter continues incrementing (v1, v2, v3, restore v2 = v4)
- [ ] UI updates to show restored version as current
- [ ] User can undo restore by restoring the previous "current" version

**Priority**: P0
**Estimated Effort**: Medium

---

### Epic 2: Version Retention and Storage

**Priority**: P0 (Critical for MVP)

---

#### US-2.1: Automatic Version Retention Policy

**As a** system
**I want** to automatically limit the number of stored versions
**So that** browser storage doesn't grow indefinitely and performance remains good

**Acceptance Criteria**:
- [ ] System retains a maximum of 10 most recent versions by default
- [ ] When 11th version is created, oldest version is automatically deleted
- [ ] Retention count is configurable via environment variable
- [ ] Deletion is FIFO (First In, First Out) - oldest versions deleted first
- [ ] User is NOT notified of automatic deletions (transparent)
- [ ] Version numbers do NOT reset when versions are deleted (v1 deleted, v2 becomes oldest, but stays v2)

**Priority**: P0
**Estimated Effort**: Small

---

#### US-2.2: Version Storage Metadata

**As a** system
**I want** to store minimal but complete metadata for each version
**So that** users have context for each version without excessive storage

**Acceptance Criteria**:
- [ ] Each version stores: id (UUID), versionNumber (integer), createdAt (ISO timestamp), prompt (string), subject (string), jsxBody (string), htmlBody (string)
- [ ] Version size is calculated and stored (in KB)
- [ ] Total storage usage is tracked across all versions
- [ ] Metadata is stored in IndexedDB (not localStorage for large data)
- [ ] Metadata is retrieved efficiently (indexed by createdAt)

**Priority**: P1
**Estimated Effort**: Medium

---

### Epic 3: Version Comparison

**Priority**: P2 (Nice to Have)

---

#### US-3.1: Side-by-Side Version Comparison

**As a** email designer
**I want** to compare two versions side-by-side
**So that** I can see differences between iterations

**Acceptance Criteria**:
- [ ] User can select two versions to compare
- [ ] Comparison view shows both email previews side-by-side
- [ ] Comparison shows subject line diff (highlighted differences)
- [ ] Comparison shows metadata for both versions (timestamp, prompt)
- [ ] User can swap which version is on left vs right
- [ ] Comparison view is mobile-responsive (stacked vertically on mobile)
- [ ] User can restore either version from comparison view

**Priority**: P2
**Estimated Effort**: Large

---

#### US-3.2: Subject Line Change Indicator

**As a** email designer
**I want** to see which versions changed the subject line
**So that** I can quickly find versions with specific subject variations

**Acceptance Criteria**:
- [ ] Version list shows badge/indicator when subject line differs from previous version
- [ ] Indicator shows: "Subject changed" or similar label
- [ ] Hovering indicator shows previous vs new subject
- [ ] Indicator color-coded (subtle, not alarming)

**Priority**: P2
**Estimated Effort**: Small

---

### Epic 4: User Experience Enhancements

**Priority**: P1-P2

---

#### US-4.1: Version Search/Filter

**As a** email designer
**I want** to search versions by prompt text or subject
**So that** I can quickly find specific iterations

**Acceptance Criteria**:
- [ ] Search input filters versions in real-time
- [ ] Search matches against: prompt text, subject line
- [ ] Search is case-insensitive
- [ ] Empty search results shows helpful message
- [ ] Search clears easily with X button

**Priority**: P2
**Estimated Effort**: Small

---

#### US-4.2: Version Deletion (Manual)

**As a** email designer
**I want** to manually delete specific versions
**So that** I can clean up unwanted iterations

**Acceptance Criteria**:
- [ ] Each version has a delete button (trash icon)
- [ ] Delete shows confirmation dialog: "Delete version X? This cannot be undone."
- [ ] Deleted versions are removed permanently
- [ ] Cannot delete current working version
- [ ] After deletion, list updates smoothly
- [ ] Version numbers remain unchanged (gaps allowed)

**Priority**: P2
**Estimated Effort**: Small

---

#### US-4.3: Version Export (Individual)

**As a** email designer
**I want** to export a specific version as HTML file
**So that** I can save important versions outside the app

**Acceptance Criteria**:
- [ ] Each version has an "Export" button
- [ ] Export downloads HTML file with filename: "email-v{X}-{date}.html"
- [ ] Exported HTML includes subject in title tag
- [ ] Exported HTML is self-contained (inlined CSS)
- [ ] Export triggers browser download

**Priority**: P2
**Estimated Effort**: Small

---

## 5. Functional Requirements

### FR-1: Version Data Management

**Priority**: P0

**Requirements**:

- **FR-1.1**: System SHALL create a new version entry when AI successfully generates an email
  - **AC**: Version created with complete email data before email store update

- **FR-1.2**: System SHALL store version metadata including: id, versionNumber, createdAt, prompt, subject, jsxBody, htmlBody
  - **AC**: All fields populated correctly, timestamp in ISO 8601 format

- **FR-1.3**: System SHALL assign incrementing version numbers starting from v1
  - **AC**: First version is v1, subsequent versions increment by 1

- **FR-1.4**: System SHALL maintain version history in IndexedDB (not localStorage)
  - **AC**: Versions persisted across browser refreshes, retrieved quickly

- **FR-1.5**: System SHALL implement retention policy to keep maximum N versions (default: 10)
  - **AC**: Oldest versions automatically deleted when limit exceeded

---

### FR-2: Version Restoration

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL allow users to restore any previous version
  - **AC**: Restore button available on all non-current versions

- **FR-2.2**: System SHALL create a new version when restoring (non-destructive)
  - **AC**: Restored version becomes new entry, original remains in history

- **FR-2.3**: System SHALL update current email store with restored version data
  - **AC**: Email store subject, jsxBody, htmlBody match restored version

- **FR-2.4**: System SHALL label restored versions with origin metadata
  - **AC**: Prompt field indicates: "Restored from v{X}"

---

### FR-3: Version History Display

**Priority**: P0

**Requirements**:

- **FR-3.1**: System SHALL display version history in reverse chronological order
  - **AC**: Newest versions appear first in list

- **FR-3.2**: System SHALL indicate current working version visually
  - **AC**: Badge, highlight, or other visual indicator on current version

- **FR-3.3**: System SHALL show relative timestamps for recent versions
  - **AC**: Timestamps show "X minutes/hours ago" for versions within 24 hours

- **FR-3.4**: System SHALL display prompt snippet (first 50 characters) for each version
  - **AC**: Prompt truncated with ellipsis if longer than 50 chars

- **FR-3.5**: System SHALL provide preview capability for each version
  - **AC**: Clicking version shows full email preview without restoring

---

### FR-4: Version Comparison

**Priority**: P2

**Requirements**:

- **FR-4.1**: System SHALL allow users to select two versions for comparison
  - **AC**: Multi-select UI enables choosing exactly 2 versions

- **FR-4.2**: System SHALL display compared versions side-by-side
  - **AC**: Both email previews visible simultaneously

- **FR-4.3**: System SHALL highlight subject line differences in comparison
  - **AC**: Changed text highlighted or marked visually

---

### FR-5: Version Search and Filter

**Priority**: P2

**Requirements**:

- **FR-5.1**: System SHALL provide search input to filter versions
  - **AC**: Search box visible above version list

- **FR-5.2**: System SHALL filter versions by prompt text or subject line
  - **AC**: Versions matching search query shown, others hidden

- **FR-5.3**: System SHALL perform case-insensitive search
  - **AC**: Search for "welcome" matches "Welcome Email"

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

**Requirements**:

- **NFR-1.1**: Version list SHALL render within 200ms for up to 50 versions
  - **AC**: Measured using browser performance tools, 95th percentile < 200ms

- **NFR-1.2**: Version restoration SHALL complete within 500ms
  - **AC**: Time from click to email store update < 500ms

- **NFR-1.3**: IndexedDB operations SHALL be non-blocking
  - **AC**: UI remains responsive during version save/load operations

- **NFR-1.4**: Version preview SHALL load within 300ms
  - **AC**: Preview iframe renders email within 300ms of click

---

### NFR-2: Storage and Scalability

**Priority**: P0

**Requirements**:

- **NFR-2.1**: Each version SHALL occupy maximum 100KB storage (compressed)
  - **AC**: Average version size measured, compression used if needed

- **NFR-2.2**: Total version storage SHALL NOT exceed 1MB per user session
  - **AC**: With 10 versions at 100KB each = 1MB limit enforced

- **NFR-2.3**: System SHALL handle up to 50 versions without performance degradation
  - **AC**: Performance benchmarks pass with 50 test versions

---

### NFR-3: Usability

**Priority**: P1

**Requirements**:

- **NFR-3.1**: Users SHALL understand version history within 30 seconds of first use
  - **AC**: User testing shows 80% task success without guidance

- **NFR-3.2**: Version restoration SHALL require maximum 2 clicks
  - **AC**: Click version → Click restore → Confirm (2-3 clicks total)

- **NFR-3.3**: Version list SHALL be keyboard navigable
  - **AC**: All actions accessible via keyboard shortcuts

- **NFR-3.4**: Error messages SHALL be clear and actionable
  - **AC**: Errors explain what went wrong and how to fix

---

### NFR-4: Accessibility

**Priority**: P1

**Requirements**:

- **NFR-4.1**: Version history UI SHALL meet WCAG 2.1 AA standards
  - **AC**: Accessibility audit passes with no critical issues

- **NFR-4.2**: All interactive elements SHALL have ARIA labels
  - **AC**: Screen reader testing confirms all elements announced correctly

- **NFR-4.3**: Version list SHALL support screen reader navigation
  - **AC**: Version metadata announced in logical order

- **NFR-4.4**: Color SHALL NOT be the only indicator of current version
  - **AC**: Badge, icon, or text label also used (not just color)

---

### NFR-5: Reliability

**Priority**: P0

**Requirements**:

- **NFR-5.1**: Version creation SHALL NOT fail silently
  - **AC**: If version save fails, user is notified and email generation continues

- **NFR-5.2**: Version data SHALL survive browser refresh
  - **AC**: IndexedDB persists data across sessions

- **NFR-5.3**: Corrupted version data SHALL be handled gracefully
  - **AC**: Invalid versions skipped with error logged, app continues

- **NFR-5.4**: Concurrent version operations SHALL be queued
  - **AC**: Multiple rapid saves don't cause race conditions

---

### NFR-6: Maintainability

**Priority**: P1

**Requirements**:

- **NFR-6.1**: Version management code SHALL be in dedicated domain
  - **AC**: Code organized in /domains/email-versioning/

- **NFR-6.2**: Version schema SHALL be versioned and documented
  - **AC**: Schema changes tracked, migration path defined

- **NFR-6.3**: Version operations SHALL be testable
  - **AC**: Unit tests for create, restore, delete, list operations

- **NFR-6.4**: Version UI components SHALL be documented in Storybook
  - **AC**: Version selector, version list item, comparison view in Storybook

---

## 7. Business Rules

### BR-1: Version Creation Rules

**Rule**: New version created ONLY when AI successfully generates email
**Rationale**: Manual visual edits don't create versions (to prevent excessive version spam)
**Validation**: Check that version creation only happens in generateEmail server action success path

---

**Rule**: Version creation happens BEFORE email store update
**Rationale**: Ensures current state is saved before overwriting
**Validation**: Code review confirms version save precedes setEmail call

---

**Rule**: Failed AI generations do NOT create versions
**Rationale**: No value in saving failed/incomplete generations
**Validation**: Error handling in generateEmail skips version creation on failure

---

### BR-2: Version Retention Rules

**Rule**: System retains maximum 10 versions by default
**Rationale**: Balance between utility and storage constraints
**Validation**: Config constant MAX_VERSIONS = 10, enforced on version creation

---

**Rule**: Oldest versions deleted first (FIFO)
**Rationale**: Recent versions more valuable than old ones
**Validation**: Deletion logic sorts by createdAt ascending, deletes first item

---

**Rule**: Version numbers NEVER reset or reuse
**Rationale**: Maintains historical context even after deletions
**Validation**: Version counter always increments, never decrements

---

### BR-3: Version Restoration Rules

**Rule**: Restoration creates NEW version (non-destructive)
**Rationale**: Preserves ability to undo restoration
**Validation**: Restore operation calls createVersion with restored data

---

**Rule**: Restored version inherits data from source, NOT timestamp
**Rationale**: New version has new creation time, but old content
**Validation**: New version createdAt is current time, not source version's time

---

**Rule**: Cannot restore current version (no-op)
**Rationale**: Current version is already active
**Validation**: Restore button disabled on current version in UI

---

### BR-4: Version Metadata Rules

**Rule**: Prompt field is required for all versions
**Rationale**: Essential context for understanding what changed
**Validation**: Version schema validation enforces non-empty prompt

---

**Rule**: Prompt truncated to 500 characters max in storage
**Rationale**: Very long prompts waste storage
**Validation**: Prompt trimmed before saving, full prompt lost if over 500 chars

---

**Rule**: Version IDs must be globally unique (UUIDs)
**Rationale**: Prevent collisions if versions exported/shared in future
**Validation**: Use crypto.randomUUID() or similar UUID generator

---

## 8. Data Requirements

### Entity: EmailVersion

**Storage Location**: IndexedDB (database: "vibemail", store: "email_versions")

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|-----------------|
| `id` | string (UUID) | Yes | Unique identifier | UUID v4 format |
| `versionNumber` | number | Yes | Sequential version number | Integer >= 1, auto-increment |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp | Valid ISO 8601 datetime |
| `prompt` | string | Yes | User prompt that created this version | Max 500 chars, non-empty |
| `subject` | string | Yes | Email subject line | Max 200 chars, non-empty |
| `jsxBody` | string | Yes | React Email JSX template | Valid JSX string, non-empty |
| `htmlBody` | string | Yes | Rendered HTML email | Valid HTML, non-empty |
| `isCurrent` | boolean | Yes | Whether this is the current working version | Only one version can be current |
| `restoredFrom` | string (UUID) \| null | No | ID of version this was restored from | UUID or null |
| `sizeKB` | number | No | Storage size in KB | Float >= 0 |

**Indexes**:
- Primary key: `id`
- Index on: `createdAt` (for chronological sorting)
- Index on: `versionNumber` (for sequential access)
- Index on: `isCurrent` (for quick current version lookup)

**Relationships**:
- `restoredFrom`: References another EmailVersion.id (self-referential)

**Constraints**:
- Only one version can have `isCurrent = true` at a time
- `versionNumber` must be unique within a session
- `createdAt` must be in the past or present (not future)

**Sample Data**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "versionNumber": 1,
  "createdAt": "2025-12-11T10:30:00.000Z",
  "prompt": "Create a welcome email for new users",
  "subject": "Welcome to VibeMail!",
  "jsxBody": "<Email>...</Email>",
  "htmlBody": "<!DOCTYPE html><html>...</html>",
  "isCurrent": false,
  "restoredFrom": null,
  "sizeKB": 12.4
}
```

---

### Entity: VersionMetadata (App-Level Config)

**Storage Location**: localStorage (key: "vibemail_version_config")

**Attributes**:

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `maxVersions` | number | Yes | Maximum versions to retain | 10 |
| `currentVersionNumber` | number | Yes | Next version number to assign | 1 |
| `totalVersionsCreated` | number | No | Lifetime count of versions | 0 |
| `lastPruneDate` | string (ISO 8601) | No | Last automatic cleanup date | null |

---

## 9. Integration Requirements

### INT-1: Email Generation Integration

**Type**: Server Action Integration

**Purpose**: Create version when AI generates new email

**Operations**:

**Hook into generateEmail Server Action**:
- **Location**: `src/actions/generate.ts`
- **Integration Point**: After successful generateObject, before returning result
- **Action**: Call `versionRepository.createVersion()` with email data
- **Error Handling**: If version creation fails, log error but continue email generation (non-blocking)

**Example Flow**:
```typescript
// In generateEmail server action
const result = await generateObject({ ... });

// Create version (non-blocking)
try {
  await versionRepository.createVersion({
    prompt: prompt,
    subject: result.object.subject,
    jsxBody: result.object.jsxBody,
    htmlBody: result.object.htmlBody
  });
} catch (error) {
  console.error('Failed to create version:', error);
  // Continue anyway - version creation is enhancement, not critical
}

return JSON.stringify(result.object);
```

---

### INT-2: Email Store Integration

**Type**: Zustand Store Integration

**Purpose**: Synchronize current version with email store

**Operations**:

**Subscribe to Email Store Changes**:
- **Location**: `src/stores/email.store.ts`
- **Integration Point**: When setEmail is called
- **Action**: Update `isCurrent` flag on corresponding version
- **Note**: Only AI generations trigger version creation, not manual visual edits

**Current Version Retrieval**:
- **Hook**: `useCurrentEmailVersion()` - Returns version matching current email store state
- **Used For**: Displaying current version badge in version list

---

### INT-3: Visual Editor Integration (Future)

**Type**: Component Integration

**Purpose**: Optionally create version snapshots during visual editing

**Status**: OUT OF SCOPE for MVP (future enhancement)

**Planned Approach**:
- Visual edits do NOT create versions by default
- User can manually "Save snapshot" during visual editing
- Snapshots labeled differently from AI-generated versions

---

## 10. User Interface Requirements

### UI-1: Version History Sidebar

**Purpose**: Display version list and enable version selection

**Location**: Slide-out panel from right side of email preview screen

**Key Elements**:
- **Header**: "Version History" title + close button
- **Version List**: Scrollable list of version cards
- **Empty State**: "No versions yet. Generate your first email to get started."
- **Footer**: Total version count + storage usage (optional)

**Version Card Components**:
- Version number badge (v1, v2, v3...)
- Timestamp (relative: "2 mins ago" or absolute: "Dec 11, 10:30 AM")
- Prompt snippet (first 50 chars + "...")
- Current version indicator (checkmark icon + "Current" badge)
- Actions dropdown: Preview, Restore, Delete, Export

**Responsive Behavior**:
- **Desktop**: Sidebar 320px wide, overlays content
- **Tablet**: Sidebar 280px wide, overlays content
- **Mobile**: Full-screen modal, swipe down to close

**Accessibility**:
- Keyboard navigation: Arrow keys move between versions, Enter to preview, Ctrl+R to restore
- ARIA labels: "Version list", "Version 3 card", "Restore version 3 button"
- Focus management: Focus moves to sidebar when opened, returns to trigger button when closed

---

### UI-2: Version Preview Modal

**Purpose**: Show full version details without restoring

**Trigger**: Click on version card in sidebar

**Key Elements**:
- **Header**: "Version {X} Preview" + close button
- **Metadata Section**:
  - Version number
  - Created timestamp
  - Full user prompt (multi-line, scrollable if long)
  - Subject line
- **Email Preview**: iframe with full HTML email
- **Actions**: "Restore This Version" primary button, "Close" secondary button

**Layout**:
- **Desktop**: Modal 800px wide, centered
- **Mobile**: Full-screen modal

**Responsive Behavior**:
- Desktop: Side-by-side metadata and preview
- Mobile: Stacked metadata above preview

---

### UI-3: Version Comparison View (P2)

**Purpose**: Compare two versions side-by-side

**Trigger**: Select two versions, click "Compare" button

**Key Elements**:
- **Header**: "Comparing v{X} vs v{Y}" + close button
- **Metadata Comparison Table**:
  - Row: Version number | v3 | v5
  - Row: Created | 2 mins ago | Just now
  - Row: Prompt | Prompt X... | Prompt Y...
  - Row: Subject | Subject X | Subject Y (highlighted if different)
- **Email Previews**: Two iframes side-by-side
- **Actions**: "Restore v{X}" and "Restore v{Y}" buttons

**Layout**:
- **Desktop**: 50/50 split screen
- **Mobile**: Tabbed view (swipe between versions)

---

### UI-4: Restore Confirmation Dialog

**Purpose**: Confirm version restoration to prevent accidents

**Trigger**: Click "Restore" on any version

**Key Elements**:
- **Title**: "Restore Version {X}?"
- **Message**: "This will replace your current email with version {X}. Your current email will be saved as a new version."
- **Actions**: "Cancel" (secondary), "Restore" (primary, destructive style)

**Behavior**:
- Escape key closes dialog (cancel)
- Enter key confirms (restore)
- Focus on "Cancel" by default (safe default)

---

### UI-5: Version Deleted Toast

**Purpose**: Confirm successful version deletion

**Trigger**: After version successfully deleted

**Key Elements**:
- **Message**: "Version {X} deleted"
- **Action**: "Undo" button (optional, P2 feature)
- **Auto-dismiss**: 3 seconds

---

## 11. User Workflows

### Workflow 1: Generate Email with Automatic Versioning

**Actors**: Email Designer

**Preconditions**: User on email generation screen

**Steps**:
1. User enters prompt: "Create a welcome email for new customers"
2. User clicks "Generate Email" button
3. System shows loading state
4. AI generates email (subject, jsxBody, htmlBody)
5. System creates Version 1 with email data and prompt
6. System updates email store with new email
7. System displays generated email in preview
8. System shows notification: "Version 1 saved"

**Postconditions**: Version 1 exists in version history, email displayed in preview

**Edge Cases**:
- **AI generation fails**: No version created, error message shown
- **IndexedDB unavailable**: Version creation fails gracefully, email still displayed
- **Storage quota exceeded**: Oldest version deleted automatically, retry save

---

### Workflow 2: Restore Previous Version

**Actors**: Email Designer

**Preconditions**: Multiple versions exist (v1, v2, v3), user viewing v3

**Steps**:
1. User opens version history sidebar
2. User sees version list: v3 (Current), v2, v1
3. User clicks on v2 card to preview
4. Preview modal opens showing v2 details
5. User clicks "Restore This Version" button
6. Confirmation dialog appears: "Restore Version 2?"
7. User clicks "Restore"
8. System creates Version 4 with v2's email data
9. System updates email store with v2's data
10. System updates v4 as current version
11. System closes modal and sidebar
12. Email preview shows v2 content
13. Toast notification: "Version 2 restored as Version 4"

**Postconditions**: Version 4 is current, contains v2's data, version list shows v4 as current

**Edge Cases**:
- **User cancels restore**: Dialog closes, no changes
- **Restore fails**: Error toast shown, current version unchanged
- **User tries to restore current version**: Restore button disabled

---

### Workflow 3: Compare Two Versions

**Actors**: Email Designer

**Preconditions**: At least 2 versions exist

**Steps**:
1. User opens version history sidebar
2. User clicks "Compare" toggle button (enters comparison mode)
3. UI shows checkboxes next to each version
4. User selects v2 checkbox
5. User selects v5 checkbox
6. "Compare" button becomes enabled
7. User clicks "Compare" button
8. Comparison view opens showing v2 vs v5 side-by-side
9. User reviews subject differences (highlighted)
10. User reviews email previews
11. User decides to restore v2
12. User clicks "Restore v2" button
13. System follows restore workflow (Workflow 2)

**Postconditions**: Comparison view closed, v2 restored as new version

**Edge Cases**:
- **User selects only 1 version**: Compare button stays disabled, message shown
- **User selects 3+ versions**: Only last 2 selections kept
- **User closes comparison**: Returns to normal version list view

---

### Workflow 4: Search for Specific Version

**Actors**: Email Designer

**Preconditions**: Many versions exist (10+)

**Steps**:
1. User opens version history sidebar
2. User sees 10 versions listed
3. User clicks search input at top of sidebar
4. User types "welcome"
5. Version list filters in real-time
6. Only versions with "welcome" in prompt or subject shown
7. User finds desired version (v3)
8. User clears search (clicks X button)
9. All versions shown again

**Postconditions**: Version list restored to full view

**Edge Cases**:
- **No matches found**: Empty state: "No versions match 'xyz'"
- **Search cleared**: All versions reappear
- **Search too short (<2 chars)**: No filtering applied

---

### Workflow 5: Automatic Version Cleanup

**Actors**: System (automatic)

**Preconditions**: 10 versions exist (maximum), user generates new email

**Steps**:
1. User generates email (v11 about to be created)
2. System checks version count: 10 versions exist
3. System identifies oldest version: v1 (created 2 hours ago)
4. System deletes v1 from IndexedDB
5. System creates v11 with new email data
6. System updates version count: 10 versions
7. Version list shows: v11, v10, v9... v2 (v1 gone)

**Postconditions**: 10 versions remain, oldest deleted, new version created

**Edge Cases**:
- **Deletion fails**: New version still created, may exceed limit temporarily (graceful degradation)
- **Multiple versions same timestamp**: Delete by version number (lowest first)
- **Current version is oldest**: Still deleted (current flag moves to newest)

---

## 12. Edge Cases and Technical Considerations

### Edge Case 1: Rapid Sequential Generations

**Scenario**: User clicks "Generate" multiple times rapidly

**Current Behavior**: Multiple AI requests sent, race conditions possible

**Desired Behavior**:
- Requests queued, processed sequentially
- Each successful generation creates version in order
- Version numbers increment correctly (no skips or duplicates)

**Solution**:
- Implement request queue in email store
- Disable generate button while request in flight
- Use optimistic locking for version number assignment

---

### Edge Case 2: Browser Storage Quota Exceeded

**Scenario**: User exceeds IndexedDB storage quota (very large emails or many versions)

**Current Behavior**: IndexedDB write fails, version not saved

**Desired Behavior**:
- System detects quota exceeded error
- System force-deletes oldest N versions to free space
- System retries version save
- User notified: "Storage full. Oldest versions deleted to save new version."

**Solution**:
- Catch QuotaExceededError
- Delete oldest 3 versions
- Retry save operation
- Show toast notification

---

### Edge Case 3: Corrupted Version Data

**Scenario**: IndexedDB contains malformed/corrupted version entry

**Current Behavior**: Version list render fails, app crashes

**Desired Behavior**:
- Invalid versions skipped during load
- Error logged to console
- User sees valid versions only
- Option to "Clear corrupted data" in settings

**Solution**:
- Validate version schema on load using Zod
- Filter out invalid entries
- Log errors with version IDs
- Provide admin tool to purge invalid data

---

### Edge Case 4: Concurrent Tab/Window Usage

**Scenario**: User has VibeMail open in multiple browser tabs

**Current Behavior**: Each tab has independent IndexedDB connection, may have stale data

**Desired Behavior**:
- Version creation in Tab A visible in Tab B
- No version number conflicts between tabs
- Real-time sync across tabs

**Solution**:
- Use Broadcast Channel API to sync tabs
- Listen for 'version-created' events
- Refresh version list when event received
- Use UUID for version IDs (not sequential numbers across tabs)

---

### Edge Case 5: Very Large Emails (>500KB)

**Scenario**: User generates email with many images or very long content

**Current Behavior**: Version exceeds 100KB target size

**Desired Behavior**:
- System warns user: "This email is very large (500KB). Older versions may be deleted sooner."
- Version still saved (no hard limit)
- Retention policy may delete more aggressively (e.g., keep only 5 versions instead of 10)

**Solution**:
- Calculate version size before saving
- Adjust retention policy dynamically based on total storage used
- Provide compression option for large emails (optional)

---

### Edge Case 6: Version Restoration During Active Edit

**Scenario**: User manually editing email via visual editor, then restores old version

**Current Behavior**: Manual edits lost (no warning)

**Desired Behavior**:
- If user has unsaved visual edits, show warning: "You have unsaved edits. Restoring will discard them. Continue?"
- User can cancel and save edits first
- Or user confirms and edits are lost

**Solution**:
- Track "dirty" state in email store (hasUnsavedEdits flag)
- Check dirty flag before restore
- Show confirmation dialog if dirty

---

### Edge Case 7: Subject-Only Changes

**Scenario**: User generates new email where only subject changed (body identical)

**Current Behavior**: Full version created (duplicate body data)

**Desired Behavior**:
- Version still created (user might want to compare subjects)
- Storage optimized (don't duplicate body if identical)

**Solution** (Future Optimization):
- Store diffs instead of full data
- Version references previous version's body if unchanged
- For MVP: Accept duplication (simpler implementation)

---

### Edge Case 8: Empty or Invalid Prompts

**Scenario**: AI generation succeeds but with empty/default prompt

**Current Behavior**: Version created with empty prompt field

**Desired Behavior**:
- Version created with fallback prompt: "Email generated without prompt"
- Or use subject line as prompt if no user prompt

**Solution**:
- Validate prompt is non-empty before version creation
- Use fallback: prompt || subject || "Untitled email"

---

### Edge Case 9: Browser Refresh During Generation

**Scenario**: User refreshes browser while AI generating email

**Current Behavior**: Generation request lost, no version created

**Desired Behavior**:
- Generation continues server-side (Server Action completes)
- After refresh, no version or email available (expected)
- User sees last saved version (if any)

**Solution**:
- Accept current behavior (server actions are fire-and-forget)
- Consider adding request ID and polling for completion (future enhancement)

---

### Edge Case 10: Version Number Overflow

**Scenario**: User generates 1000+ emails in single session

**Current Behavior**: Version number keeps incrementing (v1001, v1002...)

**Desired Behavior**:
- Version numbers continue incrementing (no overflow issue with numbers)
- Display format handles large numbers gracefully

**Solution**:
- Use number type (supports up to 2^53 - safe for millions of versions)
- UI abbreviates if needed: "v1.2k" for version 1200
- No special handling needed for MVP

---

## 13. Success Metrics (KPIs)

### User Adoption

**Metric**: Percentage of active users who create at least 3 versions in a session
**Target**: 30% of active users within 30 days of launch
**Measurement**: Track version creation events, calculate unique users with 3+ versions / total active users
**Rationale**: Users creating 3+ versions are actively using the feature

---

### Feature Engagement

**Metric**: Average number of versions created per user session
**Target**: 5 versions per session
**Measurement**: Total versions created / total sessions
**Rationale**: Higher version counts indicate iterative email design behavior

---

### Version Restoration Rate

**Metric**: Percentage of sessions where user restores at least one version
**Target**: 15% of sessions with 3+ versions
**Measurement**: Sessions with restore action / sessions with 3+ versions
**Rationale**: Restoring versions demonstrates feature value (users recovering preferred iterations)

---

### User Retention (Feature-Specific)

**Metric**: 7-day retention rate for users who used version control
**Target**: 20% higher than users who didn't use version control
**Measurement**: Compare retention rates of two user cohorts
**Rationale**: Feature stickiness - users who understand version control return more often

---

### Storage Efficiency

**Metric**: Average storage used per user
**Target**: < 800KB per user (80% of 1MB limit)
**Measurement**: Sum of all version sizes per user
**Rationale**: Efficient storage prevents performance issues and quota errors

---

### Error Rate

**Metric**: Version creation failure rate
**Target**: < 1% of email generations
**Measurement**: Failed version saves / total email generations
**Rationale**: Low error rate ensures reliability

---

### User Satisfaction

**Metric**: NPS score for version control feature
**Target**: 40+ (considered good)
**Measurement**: In-app survey: "How likely are you to recommend the version history feature?" (0-10 scale)
**Rationale**: Direct user feedback on feature value

---

### Support Ticket Reduction

**Metric**: Support tickets related to "lost emails" or "undo generation"
**Target**: 50% reduction compared to pre-launch baseline
**Measurement**: Ticket count with tags "lost-email", "undo-generation"
**Rationale**: Feature should reduce frustration and support burden

---

### Feature Discovery

**Metric**: Percentage of new users who discover version history within first session
**Target**: 60% of new users
**Measurement**: Track "version-sidebar-opened" event on first session
**Rationale**: Good UI discoverability ensures users know feature exists

---

## 14. Implementation Phases

### Phase 1: Core MVP (P0 Features)

**Timeline**: 1-2 weeks

**Includes**:
- ✅ Automatic version creation on AI generation (US-1.1)
- ✅ Version history timeline/list UI (US-1.2)
- ✅ Version restoration (US-1.4)
- ✅ Version retention policy (US-2.1)
- ✅ IndexedDB storage (US-2.2)
- ✅ Basic version preview (US-1.3)

**Success Criteria**:
- Users can generate emails and see version history
- Users can restore previous versions
- Storage managed automatically

**Deliverables**:
- `/domains/email-versioning/` domain created
- Version repository with CRUD operations
- Version sidebar UI component
- Integration with email generation flow

---

### Phase 2: Enhanced UX (P1 Features)

**Timeline**: 1 week

**Includes**:
- Version search/filter (US-4.1)
- Subject change indicators (US-3.2)
- Manual version deletion (US-4.2)
- Improved error handling
- Accessibility audit and fixes

**Success Criteria**:
- Users can find specific versions quickly
- UI meets WCAG 2.1 AA standards
- Error states handled gracefully

**Deliverables**:
- Search functionality in version list
- Delete confirmation dialogs
- Accessibility improvements
- Error boundary components

---

### Phase 3: Advanced Features (P2)

**Timeline**: 2 weeks (future backlog)

**Includes**:
- Side-by-side version comparison (US-3.1)
- Version export as HTML (US-4.3)
- Visual diff highlighting
- Version tagging/naming
- Undo version deletion

**Success Criteria**:
- Users can compare versions visually
- Users can export favorite versions
- Enhanced version management capabilities

**Deliverables**:
- Comparison view component
- Export functionality
- Diff algorithm implementation
- Undo stack for deletions

---

## 15. Open Questions

### Storage Strategy

- [ ] **Q1**: Should versions be persisted to database or kept client-side only?
  - **Owner**: Technical Lead
  - **Due**: Before Phase 1 implementation
  - **Context**: IndexedDB is client-side. If users need cross-device access, need backend storage.
  - **Recommendation**: Start with IndexedDB for MVP, add backend persistence in Phase 2 if user demand exists

- [ ] **Q2**: What is acceptable storage quota per user?
  - **Owner**: Product Manager + DevOps
  - **Due**: Before Phase 1
  - **Context**: Need to balance feature richness vs storage costs
  - **Recommendation**: 1MB per user session (10 versions × 100KB each)

---

### User Experience

- [ ] **Q3**: Should visual edits create versions, or only AI generations?
  - **Owner**: UX Designer + Product Manager
  - **Due**: Before Phase 1
  - **Context**: Visual edits could create many versions, causing clutter
  - **Recommendation**: MVP = AI generations only. Phase 2 = manual "Save snapshot" button for visual edits

- [ ] **Q4**: Should version history be always visible or hidden by default?
  - **Owner**: UX Designer
  - **Due**: Before UI design
  - **Context**: Balance between discoverability and screen space
  - **Recommendation**: Hidden by default, prominent button to open. Badge shows version count.

- [ ] **Q5**: How to indicate current vs non-current versions visually?
  - **Owner**: UX Designer
  - **Due**: Before UI design
  - **Options**: Badge, checkbox, highlight, icon
  - **Recommendation**: Checkmark icon + "Current" badge (not just color)

---

### Technical Architecture

- [ ] **Q6**: Should version management use React Query or Zustand?
  - **Owner**: Technical Architect
  - **Due**: Before Phase 1
  - **Context**: Critical constraints say React Query for server state, Zustand for UI state
  - **Answer**: IndexedDB is client-side storage but data is more like server state (persistent, cached). Use React Query with IndexedDB adapter.

- [ ] **Q7**: How to handle version sync across multiple browser tabs?
  - **Owner**: Technical Lead
  - **Due**: Phase 1 or Phase 2?
  - **Context**: User might have multiple tabs open
  - **Recommendation**: Phase 2 feature using Broadcast Channel API

- [ ] **Q8**: Should version previews be lazy-loaded or pre-rendered?
  - **Owner**: Performance Engineer
  - **Due**: Before Phase 1
  - **Context**: Rendering 10 email iframes could be slow
  - **Recommendation**: Lazy load - only render preview when user clicks version

---

### Business Logic

- [ ] **Q9**: Should there be a "favorite" or "pin" version feature?
  - **Owner**: Product Manager
  - **Due**: Phase 2 or later
  - **Context**: Users might want to protect certain versions from auto-deletion
  - **Recommendation**: Phase 3 feature - "Pin version" excludes from retention policy

- [ ] **Q10**: Should version restoration require confirmation, or be one-click?
  - **Owner**: UX Designer + Product Manager
  - **Due**: Before Phase 1
  - **Context**: Balance between safety and friction
  - **Recommendation**: Require confirmation (prevents accidental restores)

---

## 16. Dependencies and Risks

### Technical Dependencies

**DEP-1**: IndexedDB browser support
**Status**: ✅ Supported in all modern browsers
**Risk**: Very Low
**Mitigation**: Provide localStorage fallback for older browsers (degraded experience)

---

**DEP-2**: React Query setup and configuration
**Status**: ⚠️ Not currently used in project
**Risk**: Medium
**Mitigation**: Add React Query to project dependencies, create IndexedDB client, define query hooks

---

**DEP-3**: Email generation system (src/actions/generate.ts)
**Status**: ✅ Already implemented
**Risk**: Low
**Mitigation**: Integrate version creation into existing success flow

---

**DEP-4**: Email store structure (src/stores/email.store.ts)
**Status**: ✅ Already implemented
**Risk**: Low
**Mitigation**: No changes needed to email store, only read its state

---

### External Dependencies

**DEP-5**: shadcn/ui components for UI
**Status**: ✅ Already in use
**Risk**: Very Low
**Mitigation**: Use existing components (Sheet, Card, Dialog, etc.)

---

**DEP-6**: UX design system and component library
**Status**: ✅ Established
**Risk**: Low
**Mitigation**: Follow existing design patterns, use design tokens

---

### Risk Assessment

**RISK-1**: Storage quota exceeded
**Category**: Technical
**Severity**: Medium
**Likelihood**: Low
**Impact**: Version creation fails, user frustration
**Mitigation**:
- Implement aggressive retention policy (10 versions max)
- Delete oldest versions when quota exceeded
- Compress large emails before storage
- Monitor storage usage per user

**Contingency**: If quota errors spike, reduce max versions to 5 temporarily

---

**RISK-2**: Performance degradation with many versions
**Category**: Technical
**Severity**: Medium
**Likelihood**: Medium
**Impact**: Slow version list rendering, laggy UI
**Mitigation**:
- Virtualized list for version history (only render visible items)
- Lazy load version previews
- Index IndexedDB by createdAt for fast queries
- Benchmark with 50+ test versions

**Contingency**: If performance issues persist, reduce max versions or add pagination

---

**RISK-3**: User confusion about version concept
**Category**: UX
**Severity**: High
**Likelihood**: Medium
**Impact**: Low feature adoption, user frustration
**Mitigation**:
- Clear onboarding tooltip: "Every time you generate an email, we save a version so you can go back"
- Visual indicators (badges, checkmarks) for current version
- Simple terminology: "Version 3" not "Commit abc123"
- User testing before launch

**Contingency**: Add help documentation, in-app tutorial

---

**RISK-4**: React Query learning curve for team
**Category**: Resource
**Severity**: Low
**Likelihood**: Medium
**Impact**: Slower development, potential bugs
**Mitigation**:
- Technical lead provides React Query training session
- Code review focuses on query patterns
- Use existing React Query examples from documentation

**Contingency**: Pair programming sessions for team knowledge sharing

---

**RISK-5**: IndexedDB data corruption
**Category**: Technical
**Severity**: High
**Likelihood**: Low
**Impact**: User loses all version history
**Mitigation**:
- Validate data schema on read (Zod validation)
- Gracefully handle corrupted entries (skip and log)
- Provide "Clear all data" option in settings
- Consider periodic export to localStorage as backup

**Contingency**: Add data repair tool to fix common corruption patterns

---

**RISK-6**: Feature discovery - users don't notice version history
**Category**: UX
**Severity**: Medium
**Likelihood**: High
**Impact**: Low feature adoption despite implementation
**Mitigation**:
- Prominent "Version History" button in header
- Badge showing version count (e.g., "v5")
- Toast notification when first version created: "Version 1 saved! Click here to view history"
- Tutorial overlay on first use

**Contingency**: Add feature announcement modal, email campaign to existing users

---

## 17. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Users want to see previous email iterations | ⏳ Pending | User interviews, surveys | TBD |
| 10 versions is sufficient for most users | ⏳ Pending | Analytics on session lengths, generation frequency | TBD |
| IndexedDB storage is reliable and performant | ✅ Validated | Technical research, browser compatibility | All modern browsers support |
| Users understand "version" terminology | ⏳ Pending | User testing with prototype | TBD |
| Version creation should be automatic (not manual) | ⏳ Pending | User testing: automatic vs manual save button | TBD |
| Version history should be client-side (no backend) | ⚠️ Debatable | Product decision: cross-device sync needed? | Recommend client-side for MVP |
| Visual edits should NOT create versions | ⏳ Pending | Product decision, UX testing | TBD |

---

## 18. Glossary

**Version**: A snapshot of an email's complete state (subject, jsxBody, htmlBody) at a specific point in time, created when AI generates a new email.

**Current Version**: The version currently displayed in the email preview and stored in the email store. Only one version can be current at a time.

**Restoration**: The act of copying a previous version's data to the current email store, creating a new version in the process (non-destructive operation).

**Version Number**: Sequential integer identifier for versions (v1, v2, v3...). Numbers never reset or reuse, even when versions are deleted.

**Retention Policy**: Automatic rule that limits the number of stored versions (default: 10) by deleting the oldest versions when the limit is exceeded.

**FIFO (First In, First Out)**: Deletion strategy where oldest versions are deleted first when retention limit is reached.

**Version Metadata**: Information about a version beyond the email content itself, including: timestamp, user prompt, version number, storage size.

**IndexedDB**: Browser-based database for storing large amounts of structured data locally (client-side), used for version persistence.

**Prompt Snippet**: Truncated version of user prompt (first 50 characters) displayed in version list for quick context.

**Current Version Badge**: Visual indicator (checkmark icon + "Current" label) showing which version is active in the email store.

**Version Preview**: Modal view showing the full details and rendered email of a version without restoring it.

**Side-by-Side Comparison**: UI view showing two versions' email previews simultaneously for visual comparison.

**Corrupted Version**: Version entry in IndexedDB that fails schema validation, typically due to data corruption or browser issues.

**Version Snapshot**: Manual save point created during visual editing (future feature, not part of MVP).

**Restored From**: Metadata field indicating which previous version (by ID) was used to create a restored version.

---

## 19. Next Steps

### For Product Team

1. **Review this requirements document** and provide feedback on scope, priorities, and assumptions
2. **Validate user stories** with target users (email designers, marketers)
3. **Approve MVP scope** (Phase 1) and timeline
4. **Answer open questions** (Q1-Q10) to unblock technical planning
5. **Define success metrics tracking** plan (analytics events, dashboards)

### For UX/UI Team

1. **Design version history sidebar** UI mockups (desktop and mobile)
2. **Design version preview modal** and restoration flow
3. **Create interaction prototypes** for user testing
4. **Conduct user testing** on version terminology and UI discoverability
5. **Deliver final designs** to engineering team

### For Engineering Team

1. **Review technical dependencies** (React Query setup, IndexedDB client)
2. **Create domain structure**: `/domains/email-versioning/`
3. **Implement version repository** (CRUD operations, retention policy)
4. **Integrate with email generation** Server Action
5. **Build version UI components** (sidebar, preview modal, version cards)
6. **Write unit and integration tests** for version management logic
7. **Conduct performance testing** with 50+ versions
8. **Implement accessibility** requirements (WCAG 2.1 AA)

### For QA Team

1. **Review test scenarios** based on user workflows and edge cases
2. **Create test plan** covering functional and non-functional requirements
3. **Set up test data** (sample emails, version histories)
4. **Execute manual testing** on all user flows
5. **Verify accessibility** with screen readers and keyboard navigation
6. **Perform load testing** for storage quota and performance

---

## 20. Appendix

### A. Related Documents

- **Session Context**: `.claude/tasks/context_session_email-version-control-01YEjQztMb2DCJqehnaoGvnw.md`
- **Critical Constraints**: `.claude/knowledge/critical-constraints.md`
- **Architecture Patterns**: `.claude/knowledge/architecture-patterns.md`
- **Email Store**: `src/stores/email.store.ts`
- **Email Generation**: `src/actions/generate.ts`

---

### B. References

**Version Control Inspiration**:
- Git version control concepts (commits, diffs, branching)
- Google Docs revision history
- Figma version history
- Notion page history

**Technical References**:
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [React Query Documentation](https://tanstack.com/query/latest)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

### C. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-11 | business-analyst agent | Initial requirements document created |

---

## Document Approval

This requirements document is ready for review by:

- [ ] **Product Owner**: Approve scope, priorities, and business rules
- [ ] **Technical Lead**: Validate technical feasibility and architecture approach
- [ ] **UX Lead**: Confirm user workflows and UI requirements
- [ ] **Stakeholder**: Sign off on success metrics and timelines

**Next Agent**: Once approved, invoke **ux-ui-designer** to create detailed UI mockups and interaction designs for version control interface.

---

**End of Document**
