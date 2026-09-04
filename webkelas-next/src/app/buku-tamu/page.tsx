'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BukuTamuRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/contact');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-blue-600"></div>
      <p className="text-sm text-slate-500 font-medium">Mengalihkan ke Hubungi Kami...</p>
    </div>
  );
}
