import { MessageFileImage } from '../atoms/message-file-image';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface MessageFilesSectionProps {
  fileParts?: FileUIPart;
}

export function MessageFilesSection({ fileParts }: MessageFilesSectionProps) {
  if (!fileParts) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <MessageFileImage mimeType={fileParts.mimeType} data={fileParts.data} />
    </div>
  );
}
