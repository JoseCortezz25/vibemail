'use client';

import { Image, Plus } from 'lucide-react';
import { RefObject, SetStateAction, useState } from 'react';
import { Dispatch } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface InputUploadFiles {
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const InputUploadFiles = ({
  setFiles,
  fileInputRef
}: InputUploadFiles) => {
  const validFiles = ['image/png,image/jpeg,image/jpg,image/webp'];
  const [selectedTypeFiles, setSelectedTypeFiles] = useState<string>(
    validFiles[0]
  );

  const handleClick = (type: 'images') => {
    setSelectedTypeFiles(type === 'images' ? validFiles[0] : validFiles[1]);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }, 100);
  };

  return (
    <>
      <input
        id="file-upload"
        type="file"
        className="absolute hidden h-0 w-0"
        onChange={event => {
          if (event.target.files) {
            setFiles(event.target.files);
          }
        }}
        multiple
        ref={fileInputRef}
        accept={selectedTypeFiles}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer rounded-[10px] bg-gray-100 p-2">
          <Plus className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[300px] rounded-xl">
          <DropdownMenuItem
            className="cursor-pointer rounded-lg"
            onClick={() => handleClick('images')}
          >
            <Image className="size-4" />
            <span>Upload images</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
