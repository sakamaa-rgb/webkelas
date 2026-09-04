'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import { ClassProfileProvider } from '@/context/ClassProfileContext';
import { MusicProvider } from '@/context/MusicContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current page is one of the auth/login/register, admin, or student dashboard pages
  const isAuthOrAdminPage =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/siswa/dashboard') ||
    pathname === '/pengunjung/login' ||
    pathname === '/siswa/login' ||
    pathname === '/siswa/register';

  return (
    <ClassProfileProvider>
      <MusicProvider>
        {!isAuthOrAdminPage && <Navbar />}
        <main className={!isAuthOrAdminPage ? "flex-1 pt-16 min-w-0" : "min-h-screen min-w-0"}>
          {children}
        </main>
        {!isAuthOrAdminPage && <Footer />}
        <MusicPlayer />
      </MusicProvider>
    </ClassProfileProvider>
  );
}

