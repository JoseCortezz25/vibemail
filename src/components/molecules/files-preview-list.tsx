import { Source } from '../atoms/source';

interface FilesPreviewListProps {
  files: FileList;
  onFileRemove: (file: File) => void;
}

export function FilesPreviewList({
  files,
  onFileRemove
}: FilesPreviewListProps) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {Array.from(files).map((file, index) => (
        <Source
          key={index}
          filename={file.name}
          onRemove={() => onFileRemove(file)}
        />
      ))}
    </div>
  );
}
