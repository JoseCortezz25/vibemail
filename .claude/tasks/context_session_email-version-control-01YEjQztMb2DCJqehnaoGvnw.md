# Session Context: Email Version Control

**Session ID**: `email-version-control-01YEjQztMb2DCJqehnaoGvnw`
**Created**: 2025-12-11
**Status**: Planning

---

## 📋 User Request

**Original request (Spanish):**
> "Ayúdame a planear lo que sería el control de versiones de cada email generado. Pensaba en algún lado un selector donde seleccionar las versiones para regresar"

**Translation:**
> "Help me plan what the version control for each generated email would be. I was thinking of a selector somewhere to select versions to go back to"

---

## 🎯 Objective

Design and plan a version control system for AI-generated emails that allows users to:
1. View a history of all generated email versions
2. Select and restore previous versions
3. Navigate between versions easily via a UI selector

---

## 📊 Current State Analysis

### Existing Email System

**Store**: `src/stores/email.store.ts`
- Current fields: `subject`, `jsxBody`, `htmlBody`, `isLoading`
- Only stores the **current** email version
- No history or versioning capability

**Generation**: `src/actions/generate.ts`
- Uses Google Gemini AI to generate emails
- Creates React Email templates
- Returns: `subject`, `jsxBody`, `htmlBody`

**Preview**: `src/components/organisms/previewer-email.tsx`
- Displays current email in iframe
- Supports desktop/mobile views
- Has visual editing mode

**Domains**:
- `src/domains/chat` - Chat interface
- `src/domains/visual-editing` - Visual editing functionality
- No dedicated email domain exists yet

---

## 🤔 Key Questions to Explore

1. **Data Model**:
   - What metadata should each version include? (timestamp, user prompt, version number)
   - Should versions be persisted to database or kept in memory?
   - Maximum number of versions to retain?

2. **UX/UI Design**:
   - Where should the version selector be placed?
   - What information should be displayed for each version?
   - How to visually distinguish versions?
   - Should there be a diff/comparison view?

3. **Technical Architecture**:
   - New domain: `src/domains/email-versioning`?
   - Storage: Zustand store vs database (React Query)?
   - Server Actions for persistence?

4. **User Workflows**:
   - What happens when user restores an old version?
   - Can user branch from an old version?
   - Should restore create a new version or replace current?

---

## 📝 Session Log

### Entry 1: Initial Context Gathering (2025-12-11)

**Agent**: Parent (Sonnet 4.5)
**Actions**:
- Read critical constraints
- Explored email-related files
- Analyzed current store structure
- Identified domains structure

**Findings**:
- No existing versioning system
- Store is simple (UI state only, matches critical constraints)
- Email generation is AI-driven, each generation is unique
- No email-specific domain exists

**Next Steps**:
- Invoke business-analyst agent to refine requirements
- Invoke ux-ui-designer agent to design selector interface
- Create implementation plan

---

## 🎯 Agents to Invoke

1. **business-analyst**: Refine requirements, define user stories, edge cases
2. **ux-ui-designer**: Design version selector UI and user flows ✅ COMPLETED
3. **nextjs-builder** (if needed): Plan technical architecture

---

### Entry 2: UX/UI Design Complete (2025-12-11)

**Agent**: ux-ui-designer (Sonnet 4.5)
**Actions**:
- Read critical constraints and session context
- Researched existing UI patterns (Sheet component, device toggle, settings panel)
- Analyzed text map patterns and shadcn/ui component usage
- Reviewed visual editing UX plan for design consistency
- Created comprehensive UX/UI plan for email version control

**Key Design Decisions**:

1. **UI Pattern**: Dropdown menu (not full Sheet panel) for quick access
   - Positioned in preview toolbar, right of device toggle
   - Opens below trigger, shows scrollable version list
   - Mobile uses Sheet component (full-screen) for better UX

2. **Version Display**:
   - Version number (v1, v2, v3)
   - Relative timestamp ("2 minutes ago", "Yesterday")
   - Prompt snippet (first 60 chars, full text in tooltip)
   - "Current" badge for active version
   - Restore button for previous versions

3. **Interaction Flow**:
   - Click selector → Dropdown opens → Select version → Confirmation dialog → Restore
   - Reassurance message: "Your current version won't be lost"
   - Success feedback: Toast + green border flash

4. **Component Strategy**:
   - Uses existing shadcn components: Button, Badge, Dialog, Separator, Tooltip, ScrollArea
   - New components: VersionSelector, VersionList, VersionItem, RestoreConfirmationDialog
   - Text map: `src/constants/version-selector.text-map.ts`

5. **Accessibility**:
   - Full keyboard navigation (Arrow keys, Tab, Enter, Escape)
   - Screen reader announcements for version changes
   - ARIA labels for all interactive elements
   - 44px touch targets on mobile/tablet

6. **Responsive Design**:
   - Mobile: Icon-only button, Sheet with simplified version list
   - Tablet: Compact button, dropdown with medium layout
   - Desktop: Full button with text, optimal dropdown with all metadata

7. **Version Management**:
   - Recommendation: Store last 50 versions per email
   - Auto-prune oldest when limit reached
   - Automatic version creation on AI generation (not manual edits)
   - LocalStorage for anonymous users, database for logged-in users

**Plan Location**: `.claude/plans/ux-email-versioning-design.md`

**Findings**:
- Existing design system is well-established (shadcn/ui + custom components)
- Mobile-first responsive patterns consistent across app
- Text maps comprehensively externalize all user-facing text
- Visual editing UX plan provides excellent design precedent
- Sheet component pattern already used for settings panel

**Recommendations**:
- **Version Storage**: Zustand store for UI state + optional database persistence
- **Version Numbering**: Sequential per email (v1, v2, v3...)
- **Restore Strategy**: Non-destructive (current version stays in history)
- **Branching**: Linear history in v1 (restore + generate creates new version from that point)

**Next Steps**:
1. Domain architect defines `EmailVersion` interface and store structure
2. Shadcn-builder verifies ScrollArea and confirms component availability
3. Parent implements phase-by-phase (8 phases defined in plan)
4. Test with real users for usability validation

**Collaboration Needed**:
- **domain-architect**: Version data structure, store design, persistence strategy
- **shadcn-builder**: Verify ScrollArea, Dropdown Menu components
- **nextjs-builder**: Server actions for persistence (if database used)
- **ai-sdk-expert**: Hook version creation into generate action

**Files to Create**:
- `src/components/molecules/version-selector.tsx`
- `src/components/molecules/version-list.tsx`
- `src/components/atoms/version-item.tsx`
- `src/components/atoms/version-badge.tsx`
- `src/components/molecules/restore-confirmation-dialog.tsx`
- `src/constants/version-selector.text-map.ts`
- `src/stores/version.store.ts` (or extend email.store.ts)
- `src/lib/version-utils.ts`
- `src/lib/relative-time.ts`

**Files to Modify**:
- `src/components/organisms/previewer-email.tsx` (add selector to toolbar)
- `src/stores/email.store.ts` (add version methods)
- `src/actions/generate.ts` (auto-create versions)

---

### Entry 3: Business Requirements Analysis (2025-12-11)

**Agent**: business-analyst (Sonnet 4.5)
**Actions**:
- Read session context and UX designer's work
- Analyzed email store structure and generation flow
- Applied business analysis framework
- Created comprehensive requirements document

**Deliverable**: `/home/user/vibemail/.claude/plans/ba-email-versioning-requirements.md`

**Key Decisions Made**:

1. **Data Model** (Complements UX design):
   - Store: id, versionNumber, createdAt, prompt, subject, jsxBody, htmlBody, isCurrent, restoredFrom, sizeKB
   - Storage: IndexedDB (not localStorage) for large data capacity
   - Retention: Maximum 10 versions default (configurable up to 50 as UX suggests)
   - Version numbering: Sequential (v1, v2, v3...), never reset
   - Indexed by: createdAt, versionNumber, isCurrent

2. **User Stories Defined** (15 stories across 4 epics):
   - Epic 1 - Version History Management (P0): Auto-create, view timeline, preview, restore
   - Epic 2 - Version Retention and Storage (P0): Retention policy, metadata storage
   - Epic 3 - Version Comparison (P2): Side-by-side comparison, subject change indicators
   - Epic 4 - UX Enhancements (P1-P2): Search/filter, manual deletion, export

3. **Business Rules Defined** (10 rules):
   - BR-1: Versions created ONLY on successful AI generation (not visual edits)
   - BR-2: Version creation happens BEFORE email store update
   - BR-3: Failed AI generations do NOT create versions
   - BR-4: Maximum 10 versions retained by default, oldest deleted first (FIFO)
   - BR-5: Version numbers NEVER reset or reuse (maintain historical context)
   - BR-6: Restoration creates NEW version (non-destructive)
   - BR-7: Cannot restore current version (no-op)
   - BR-8: Prompt field required, truncated to 500 chars max
   - BR-9: Version IDs must be globally unique (UUIDs)
   - BR-10: Restored versions inherit content, NOT timestamp

4. **Technical Approach** (Aligns with critical constraints):
   - Use React Query for version state management (persistent data, like server state)
   - New domain: `/domains/email-versioning/`
   - Integration: Hook into `src/actions/generate.ts` after successful generateObject
   - No changes to existing email store (read-only dependency)
   - IndexedDB for persistence (database: "vibemail", store: "email_versions")

5. **Functional Requirements** (16 FRs across 5 categories):
   - FR-1: Version Data Management (creation, storage, retention)
   - FR-2: Version Restoration (non-destructive, labeled)
   - FR-3: Version History Display (chronological, current indicator, preview)
   - FR-4: Version Comparison (side-by-side, diff highlighting)
   - FR-5: Version Search/Filter (by prompt or subject)

6. **Non-Functional Requirements** (18 NFRs across 6 categories):
   - Performance: Version list <200ms, restore <500ms, preview <300ms
   - Storage: Max 100KB per version, 1MB total per session, handle 50 versions
   - Usability: 30-second learning curve, 2-click restore, keyboard navigable
   - Accessibility: WCAG 2.1 AA, ARIA labels, screen reader support
   - Reliability: No silent failures, survives refresh, handles corruption
   - Maintainability: Dedicated domain, versioned schema, testable, Storybook docs

7. **User Workflows Documented** (5 workflows):
   - Workflow 1: Generate email with automatic versioning
   - Workflow 2: Restore previous version (with confirmation)
   - Workflow 3: Compare two versions side-by-side
   - Workflow 4: Search for specific version
   - Workflow 5: Automatic version cleanup (FIFO)

8. **Edge Cases Identified** (10 scenarios):
   - EC-1: Rapid sequential generations → Queue management needed
   - EC-2: Browser storage quota exceeded → Force delete oldest, retry
   - EC-3: Corrupted version data → Validate with Zod, skip invalid
   - EC-4: Concurrent tab/window usage → Broadcast Channel API for sync
   - EC-5: Very large emails >500KB → Dynamic retention policy
   - EC-6: Version restoration during active edit → Dirty state check
   - EC-7: Subject-only changes → Accept duplication for simplicity (MVP)
   - EC-8: Empty/invalid prompts → Use fallback: subject or "Untitled email"
   - EC-9: Browser refresh during generation → Accept lost request (expected)
   - EC-10: Version number overflow → Number type supports up to 2^53

9. **Success Metrics Defined** (9 KPIs):
   - User adoption: 30% create 3+ versions within 30 days
   - Engagement: 5 versions per session average
   - Restoration rate: 15% of multi-version sessions use restore
   - 7-day retention: 20% higher for version control users
   - Storage efficiency: <800KB per user (80% of limit)
   - Error rate: <1% version creation failures
   - NPS score: 40+ for version control feature
   - Support tickets: 50% reduction in "lost email" complaints
   - Feature discovery: 60% of new users discover within first session

10. **Risks Assessed** (6 risks with mitigation):
    - RISK-1: Storage quota exceeded → Aggressive retention, compression
    - RISK-2: Performance degradation → Virtualized list, lazy load, indexing
    - RISK-3: User confusion → Clear onboarding, simple UI, user testing
    - RISK-4: React Query learning curve → Training, code reviews, pair programming
    - RISK-5: IndexedDB corruption → Schema validation, graceful handling, repair tool
    - RISK-6: Low feature discovery → Toast notifications, badges, tutorial overlay

**Open Questions for Product Team** (10 questions):
- Q1: Client-side (IndexedDB) or backend persistence? → Recommend IndexedDB for MVP
- Q2: Storage quota per user? → Recommend 1MB (configurable)
- Q3: Should visual edits create versions? → Recommend NO for MVP (AI only)
- Q4: Version history always visible or hidden? → Aligns with UX: dropdown/hidden
- Q5: How to indicate current version? → Aligns with UX: checkmark + "Current" badge
- Q6: React Query or Zustand for version state? → React Query (persistent data)
- Q7: Multi-tab sync needed? → Phase 2 feature (Broadcast Channel API)
- Q8: Lazy-load previews? → Yes (performance optimization)
- Q9: Should there be "favorite/pin" feature? → Phase 3 enhancement
- Q10: Restore confirmation or one-click? → Confirmation (prevents accidents)

**Reconciliation with UX Design**:

UX designer proposed dropdown UI with 50 versions; Business analyst recommends:
- **Agree**: Dropdown approach (desktop), Sheet (mobile) - excellent UX
- **Agree**: Sequential version numbering (v1, v2, v3...)
- **Agree**: Non-destructive restore (current version stays in history)
- **Agree**: Automatic version creation on AI generation only
- **Adjust**: Start with 10 version retention for MVP, increase to 50 after validating storage/performance
- **Complement**: UX defines "how it looks", BA defines "what it stores and how it behaves"
- **Align**: Both recommend Zustand/React Query hybrid (UX for UI state, RQ for data persistence)

**Implementation Phases** (3 phases):
- Phase 1 (1-2 weeks): Core MVP - Auto-save, view history, restore, retention (P0 features)
- Phase 2 (1 week): Enhanced UX - Search, delete, accessibility, error handling (P1 features)
- Phase 3 (2 weeks): Advanced - Comparison, export, diff, tagging (P2 features)

**Next Steps**:
1. Product team reviews both UX design plan and BA requirements document
2. Product team answers open questions (Q1-Q10) to finalize scope
3. Technical lead reviews feasibility and estimates effort
4. Reconcile UX dropdown design with BA data model (ensure alignment)
5. Invoke nextjs-builder or domain-architect to create technical implementation plan
6. Begin Phase 1 implementation

**Assumptions Requiring Validation**:
- Users want historical versions (not just undo/redo) → User interviews
- 10 versions sufficient for most users → Analytics on generation patterns
- Users understand "version" terminology → User testing with prototype
- Automatic creation preferred over manual save → User testing
- IndexedDB reliable enough for MVP → Browser compatibility research ✅ Done

**Document Stats**:
- 68-page comprehensive requirements document
- 20 sections covering all feature aspects
- 15 user stories across 4 epics (P0, P1, P2 prioritized)
- 16 functional requirements
- 18 non-functional requirements (performance, storage, usability, accessibility, reliability, maintainability)
- 10 business rules
- 5 complete user workflows (step-by-step)
- 10 edge cases analyzed with solutions
- 9 success metrics (KPIs)
- 6 risks assessed with mitigation strategies
- 10 open questions requiring stakeholder decisions

**Status**: Requirements complete, ready for Product, UX, and Engineering review

**Files Created**:
- `/home/user/vibemail/.claude/plans/ba-email-versioning-requirements.md`

**Collaboration Needed**:
- **Product Manager**: Review and approve scope, priorities, answer open questions
- **UX Designer**: Validate workflows align with UI design (already done by ux-ui-designer agent)
- **Technical Lead**: Review architecture approach (React Query + IndexedDB), estimate effort
- **nextjs-builder**: Create implementation plan based on requirements and UX design
- **domain-architect** (optional): Define domain structure and patterns

---

_This session file follows append-only protocol. New entries will be added below._
