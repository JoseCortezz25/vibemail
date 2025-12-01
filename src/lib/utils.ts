import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base64ToImage = (base64: string) => {
  return `data:image/png;base64,${base64}`;
};

export const createFileParts = (images: FileList) => {
  return Array.from(images).map((image: File) => {
    return new Promise<{ type: 'file'; mediaType: string; url: string }>(
      resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            type: 'file' as const,
            mediaType: image.type,
            url: reader.result as string
          });
        };
        reader.readAsDataURL(image);
      }
    );
  });
};
