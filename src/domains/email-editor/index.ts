/**
 * Email Editor Domain
 *
 * This domain handles all email editing functionality including
 * composition, formatting, and preview.
 */

// Schemas and types
export { emailSchema, emailEditorStateSchema } from './schema';
export type { Email, EmailEditorState, EmailFormat } from './schema';

// Components are exported from their respective locations:
// - Atoms: @/components/atoms/*
// - Molecules: @/components/molecules/*
// - Organisms: @/components/organisms/*
