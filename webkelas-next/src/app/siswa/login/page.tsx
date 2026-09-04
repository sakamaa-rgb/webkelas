'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft, GraduationCap } from 'lucide-react';
import { initialStudents } from '@/data/seedData';

export default function SiswaLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Harap isi Email/NISN dan Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Check registered accounts from localStorage first
      const registeredAccounts = JSON.parse(
        localStorage.getItem('class_registered_students') || '[]'
      );

      const query = identifier.trim().toLowerCase();

      // Find in registered accounts
      const registered = registeredAccounts.find(
        (acc: any) =>
          (acc.email && acc.email.toLowerCase() === query) ||
          (acc.nisn && acc.nisn.toLowerCase() === query)
      );

      if (registered) {
        if (registered.password === password) {
          localStorage.setItem('class_web_user', registered.name);
          localStorage.setItem('class_user_role', 'student');
          localStorage.setItem('class_student_id', registered.id);
          router.push('/siswa/dashboard');
          return;
        } else {
          setError('Password salah.');
          setLoading(false);
          return;
        }
      }

      // Check against current students list from localStorage or initialStudents
      let currentStudentsList = initialStudents;
      try {
        const savedStudents = localStorage.getItem('class_students_list') || localStorage.getItem('class_web_students');
        if (savedStudents) {
          const parsed = JSON.parse(savedStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentStudentsList = parsed;
          }
        }
      } catch (e) {
        console.error(e);
      }

      const foundStudent = currentStudentsList.find(
        (s) =>
          (s.nisn && s.nisn.toLowerCase() === query) ||
          s.id.toLowerCase() === query ||
          s.name.toLowerCase().includes(query)
      );

      if (foundStudent) {
        // Allow student login
        localStorage.setItem('class_web_user', foundStudent.name);
        localStorage.setItem('class_user_role', 'student');
        localStorage.setItem('class_student_id', foundStudent.id);
        router.push('/siswa/dashboard');
      } else {
        // Demo fallback or error
        setError('Email/NISN atau Password salah. Atau akun belum diregistrasi.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#5b21b6] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-[100px] pointer-events-none" />

      {/* Main Login Glass Card (Matching Screenshot 4) */}
      <div className="w-full max-w-[420px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Top Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <GraduationCap className="w-8 h-8" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight mb-1">
          Portal Siswa
        </h1>
        <p className="text-xs text-purple-200/60 text-center mb-8">
          Akses khusus siswa PPLG 3
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email atau NISN Input */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Email atau NISN
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Masukkan Email / NISN"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : 'Masuk'}</span>
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-xs text-white/60">
          Belum punya akun?{' '}
          <Link
            href="/siswa/register"
            className="text-purple-300 font-semibold hover:underline"
          >
            Registrasi Akun Siswa
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
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
