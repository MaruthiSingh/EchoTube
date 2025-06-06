// filepath: f:\Maruthi\Hackathons\cactro\youtube-dashboard\src\app\layout.tsx
'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Head from './head';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='{inter.className}'>
        <Head />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}