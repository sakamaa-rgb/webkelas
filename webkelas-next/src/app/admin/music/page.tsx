'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMusicRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin?tab=music');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
      Membuka Kelola Musik...
    </div>
  );
}
