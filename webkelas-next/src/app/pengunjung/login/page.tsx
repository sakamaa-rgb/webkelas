'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, School, LogIn, ArrowLeft, Users } from 'lucide-react';

export default function PengunjungLoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !kelas.trim()) {
      setError('Nama dan Kelas/Instansi wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userIdentifier = `${name.trim()} (${kelas.trim()})`;
      localStorage.setItem('class_web_user', userIdentifier);
      localStorage.setItem('class_user_role', 'visitor');
      localStorage.setItem('class_visitor_name', name.trim());
      localStorage.setItem('class_visitor_kelas', kelas.trim());

      router.push('/');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#065f46] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/20 blur-[100px] pointer-events-none" />

      {/* Main Login Glass Card (Matching Screenshot 3) */}
      <div className="w-full max-w-[420px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Top Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <Users className="w-8 h-8" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight mb-1">
          Portal Pengunjung
        </h1>
        <p className="text-xs text-emerald-200/60 text-center mb-8">
          Jelajahi XI PPLG 3 Engineering
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Nama Lengkap Input */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Masukkan nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-emerald-400 focus:bg-white/[0.1] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Kelas / Instansi Input */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Kelas / Instansi
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Contoh: X PPLG 1, Guru, dll."
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-emerald-400 focus:bg-white/[0.1] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
