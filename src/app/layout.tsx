import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AIDevtools } from '@ai-sdk-tools/devtools';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Maily',
  description: 'Maily is a tool that helps you create emails using AI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {process.env.NODE_ENV === 'development' && <AIDevtools />}
        <Toaster richColors />
      </body>
    </html>
  );
}
