'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface FreeLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FreeLimitDialog({ open, onOpenChange }: FreeLimitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="Vibemail"
            width={88}
            height={88}
            className="rounded-xl"
            priority
          />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-balance">
            Has consumido tus 10 generaciones gratis
          </DialogTitle>
          <DialogDescription className="text-balance">
            Para seguir creando emails, añade tu API key en Settings. A partir
            de ahí usarás tus propios créditos.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>
            Entendido, añadiré mi API key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
