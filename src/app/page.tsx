'use client';

import { Chat } from '@/components/organisms/chat';
import { Header } from '@/components/layout/header';
import { Previewer } from '@/components/organisms/previewer';
import { useEmailStore } from '@/stores/email.store';
import { AnimatePresence, motion } from 'motion/react';

export default function Home() {
  const { isLoading, subject, htmlBody, jsxBody } = useEmailStore();

  const showPreviewer = isLoading || !!(subject || htmlBody || jsxBody);

  return (
    <div className="max-h-screen max-w-full items-center justify-items-center">
      <Header />
      <motion.main
        className="no-scrollbar grid h-full w-full"
        animate={{
          gridTemplateColumns: showPreviewer ? '460px 1fr' : '1fr'
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <Chat />

        <AnimatePresence mode="wait">
          {showPreviewer && (
            <motion.div
              key="previewer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="h-full max-h-[calc(100dvh-57px)] w-full max-w-[calc(100dvw-460px)]"
            >
              <Previewer />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
