// 'use client' required for:
// - Form interactions and edit state
// - Copy to clipboard functionality
// - Button click handlers
'use client';

import {
  Message,
  MessageActions,
  MessageContent
} from '@/components/ui/message';
import { cn } from '@/lib/utils';
import type { FileUIPart, UIMessage } from 'ai';
import { useRef } from 'react';
import { getMessageText } from '@/lib/message-utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useMessageEdit } from '@/hooks/use-message-edit';
import { MessageAttachmentsGrid } from '@/components/molecules/message-attachments-grid';
import { MessageFilesList } from '@/components/molecules/message-files-list';
import { MessageEditForm } from '@/components/molecules/message-edit-form';
import { MessageActionButtons } from '@/components/molecules/message-action-buttons';

interface MessageUserProps {
  message: UIMessage;
  onEdit: (id: string, newText: string, newImages?: FileUIPart[]) => void;
  onReload: () => void;
  onDelete: (id: string) => void;
}

export function MessageUser({
  message,
  onEdit,
  onReload,
  onDelete
}: MessageUserProps) {
  const textContent = getMessageText(message);
  const contentRef = useRef<HTMLDivElement>(null);

  // Custom hooks for business logic
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const {
    isEditing,
    editInput,
    setEditInput,
    startEditing,
    cancelEditing,
    saveEdit
  } = useMessageEdit({
    message,
    initialText: textContent,
    onEdit,
    onReload
  });

  // Filter attachments by type
  const imageAttachments = (message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('image/')
  ) || []) as FileUIPart[];

  const filesAttachments = (message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('application/pdf')
  ) || []) as FileUIPart[];

  return (
    <Message
      key={message.id}
      data-message-id={message.id}
      className={cn(
        'group',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-full flex-1 flex-col items-end space-y-2 text-sm sm:max-w-[75%]'
        )}
      >
        <MessageAttachmentsGrid
          attachments={imageAttachments}
          messageId={message.id}
        />

        <MessageFilesList files={filesAttachments} />

        {isEditing ? (
          <MessageEditForm
            value={editInput}
            onChange={setEditInput}
            onSave={saveEdit}
            onCancel={cancelEditing}
            width={contentRef.current?.offsetWidth}
          />
        ) : (
          <MessageContent
            ref={contentRef}
            className="text-foreground rounded-[15px] !rounded-tr-[0px] bg-gray-100/60 px-[16px] py-[12px]"
          >
            {textContent}
          </MessageContent>
        )}

        <MessageActions>
          <MessageActionButtons
            onCopy={() => copyToClipboard(textContent)}
            onEdit={startEditing}
            onDelete={() => onDelete(message.id)}
            isCopied={isCopied(textContent)}
            showForUser={message.role === 'user'}
          />
        </MessageActions>
      </div>
    </Message>
  );
}
