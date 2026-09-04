'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Mail, Lock, IdCard, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { initialStudents } from '@/data/seedData';

export default function SiswaRegisterPage() {
  const [nisn, setNisn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find matching student in students list from localStorage or initialStudents
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

      const query = nisn.trim().toLowerCase();
      const matched = currentStudentsList.find(
        (s) => (s.nisn && s.nisn.toLowerCase() === query) || s.id.toLowerCase() === query
      );

      if (!matched) {
        setError('NISN/ID tidak terdaftar di database kelas. Pastikan format benar (contoh: 026).');
        setLoading(false);
        return;
      }

      // Check if already registered
      const registeredAccounts = JSON.parse(
        localStorage.getItem('class_registered_students') || '[]'
      );

      const alreadyRegistered = registeredAccounts.find(
        (acc: any) => acc.nisn === (matched.nisn || matched.id) || acc.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (alreadyRegistered) {
        setError('Akun ini sudah diregistrasi sebelumnya. Silakan langsung login.');
        setLoading(false);
        return;
      }

      // Register student
      const newAccount = {
        id: matched.id,
        name: matched.name,
        nisn: matched.nisn || matched.id,
        email: email.trim(),
        password: password,
        kelas: matched.kelas || 'XI PPLG 3'
      };

      registeredAccounts.push(newAccount);
      localStorage.setItem('class_registered_students', JSON.stringify(registeredAccounts));

      setSuccess(`Registrasi berhasil untuk ${matched.name}! Silakan login.`);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#5b21b6] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-[100px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-[440px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Top Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <UserPlus className="w-8 h-8" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight mb-1">
          Registrasi Siswa
        </h1>
        <p className="text-xs text-purple-200/60 text-center mb-6">
          Klaim akun PPLG 3 Anda
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
            <Link
              href="/siswa/login"
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Lanjut ke Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* NISN Input */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                NISN (Harus terdaftar oleh Admin)
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 026"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Masukkan Email aktif"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Buat password baru (min 6 kar)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-purple-400 focus:bg-white/[0.1] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-white/60">
          Sudah punya akun?{' '}
          <Link
            href="/siswa/login"
            className="text-purple-300 font-semibold hover:underline"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
