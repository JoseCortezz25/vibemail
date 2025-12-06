import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode } from 'react';

export const DialogModal = ({
  image,
  children
}: {
  image: string;
  children: ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-h-[90%] max-w-[90%]">
        <img
          src={image}
          alt="Dialog Image"
          className="h-full min-h-[300px] w-full min-w-[300px] object-cover"
        />
      </DialogContent>
    </Dialog>
  );
};
