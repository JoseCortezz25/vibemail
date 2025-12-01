import { Paperclip, X } from 'lucide-react';

interface Source {
  filename: string;
  onRemove?: () => void;
}

export const Source = ({ filename, onRemove }: Source) => {
  return (
    <div
      className="bg-secondary flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm"
      onClick={e => e.stopPropagation()}
    >
      <Paperclip className="size-4" />
      <span className="max-w-[120px] truncate">{filename}</span>
      <button
        onClick={onRemove ? onRemove : undefined}
        className="cursor-pointer rounded-full p-1 transition-all duration-300 hover:bg-red-200/30 hover:text-red-600"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
