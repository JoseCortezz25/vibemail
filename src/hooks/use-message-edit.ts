'use client';

import { useState, useCallback } from 'react';
import type { FileUIPart, UIMessage } from 'ai';

interface UseMessageEditProps {
  message: UIMessage;
  initialText: string;
  onEdit: (id: string, newText: string, newImages?: FileUIPart[]) => void;
  onReload: () => void;
}

export function useMessageEdit({
  message,
  initialText,
  onEdit,
  onReload
}: UseMessageEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(initialText);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditInput(initialText);
  }, [initialText]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditInput(initialText);
  }, [initialText]);

  const saveEdit = useCallback(() => {
    const currentImages = message.parts?.filter(
      part =>
        part.type === 'file' &&
        (part as FileUIPart).mediaType?.startsWith('image/')
    ) as FileUIPart[];

    if (onEdit) {
      onEdit(message.id, editInput, currentImages);
    }
    onReload();
    setIsEditing(false);
  }, [message, editInput, onEdit, onReload]);

  return {
    isEditing,
    editInput,
    setEditInput,
    startEditing,
    cancelEditing,
    saveEdit
  };
}
