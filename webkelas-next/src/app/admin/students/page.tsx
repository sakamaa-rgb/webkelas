'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminStudentsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin?tab=siswa');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-semibold">
      Mengarahkan ke Manajemen Data Siswa...
    </div>
  );
}
