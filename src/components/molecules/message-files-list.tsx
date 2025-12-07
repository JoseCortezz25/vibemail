import type { FileUIPart } from 'ai';
import { MessageAttachmentFile } from '../atoms/message-attachment-file';

interface MessageFilesListProps {
  files: FileUIPart[];
}

export function MessageFilesList({ files }: MessageFilesListProps) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div>
      {files.map((file, index) => (
        <MessageAttachmentFile key={index} filename={file.filename} />
      ))}
    </div>
  );
}
