'use client';

import {
  Message,
  MessageActions,
  MessageContent
} from '@/components/ui/message';
import { cn } from '@/lib/utils';
import { Check, Copy, File, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FileUIPart, UIMessage } from 'ai';
import { useRef, useState } from 'react';
import { getMessageText } from '@/lib/message-utils';
import { DialogModal } from '../organisms/dialog';

interface MessageUserProps {
  message: UIMessage;
  onEdit: (id: string, newText: string, newImages?: FileUIPart[]) => void;
  onReload: () => void;
  onDelete: (id: string) => void;
}

export const MessageUser = ({
  message,
  onEdit,
  onReload,
  onDelete
}: MessageUserProps) => {
  const textContent = getMessageText(message);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [editInput, setEditInput] = useState(textContent);
  const [isEditing, setIsEditing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Get file parts from message
  const imageAttachments = message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('image/')
  ) as FileUIPart[];

  const filesAttachments = message.parts?.filter(
    part =>
      part.type === 'file' &&
      (part as FileUIPart).mediaType?.startsWith('application/pdf')
  ) as FileUIPart[];

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditInput(textContent);
  };

  const handleSave = () => {
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
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

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
        <div
          className={cn(
            'grid max-w-[60%] gap-2 md:max-w-[40%]',
            imageAttachments && imageAttachments.length > 1
              ? 'grid-cols-2'
              : 'grid-cols-1'
          )}
        >
          {imageAttachments &&
            imageAttachments.map((attachment, index) => (
              <DialogModal
                image={(attachment as FileUIPart).url}
                key={`${message.id}-${index}`}
              >
                <img
                  key={`${message.id}-${index}`}
                  src={(attachment as FileUIPart).url}
                  alt={(attachment as FileUIPart).filename || 'image'}
                  className="h-full w-full cursor-pointer object-cover"
                />
              </DialogModal>
            ))}
        </div>

        <div>
          {filesAttachments &&
            filesAttachments.map((attachment: FileUIPart, index) => (
              <div
                className="bg-brand-green-light/10 flex cursor-pointer items-center gap-3 rounded-md p-2"
                key={`${message.id}-${index}`}
              >
                <div className="bg-brand-green/10 text-brand-green flex h-[45px] w-[45px] items-center justify-center rounded-md">
                  <File className="size-5" />
                </div>
                <span className="text-brand-green mr-1 text-sm font-semibold">
                  {attachment.filename || 'file.pdf'}
                </span>
              </div>
            ))}
        </div>

        {isEditing ? (
          <div
            className="bg-accent relative flex w-full min-w-[180px] flex-col gap-2 rounded-3xl px-5 pt-3.5 pb-2.5"
            style={{
              width: contentRef.current?.offsetWidth
            }}
          >
            <textarea
              className="w-full resize-none bg-transparent outline-none"
              value={editInput}
              onChange={e => setEditInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  handleEditCancel();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <MessageContent className="text-foreground rounded-[15px] !rounded-tr-[0px] bg-gray-100/60 px-[16px] py-[12px]">
            {textContent}
          </MessageContent>
        )}

        <MessageActions
          className={cn(
            'flex w-full gap-2 self-end transition-opacity duration-200 group-hover:opacity-100 md:opacity-0',
            message.role === 'user'
              ? 'hidden justify-end md:flex'
              : 'justify-start'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => handleCopy(textContent)}
          >
            {copyMessage === textContent ? (
              <Check className="text-green-500" />
            ) : (
              <Copy className="transition-transform duration-500 group-hover/item:rotate-[-10deg]" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="group/item transition-all duration-500 hover:bg-red-500/10"
            onClick={handleDelete}
          >
            <Trash className="size-4 transition-transform duration-500 group-hover/item:text-red-500" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
