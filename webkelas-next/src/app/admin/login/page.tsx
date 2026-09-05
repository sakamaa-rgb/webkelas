'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, LogIn, ArrowLeft, Code2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Default admin credentials: admin / admin123 or any user/pass during setup
      if (
        (username.trim().toLowerCase() === 'admin' && password === 'admin123') ||
        (username.trim() && password.length >= 4)
      ) {
        localStorage.setItem('class_web_admin', 'true');
        localStorage.setItem('class_web_user', 'Admin PPLG 3');
        localStorage.setItem('class_user_role', 'admin');
        router.push('/admin');
      } else {
        setError('Username atau password admin salah. (Default: admin / admin123)');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#172554] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Animated Blur Orbs (Safe on mobile, rich on desktop) */}
      <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-500/25 blur-[60px] sm:blur-[100px] pointer-events-none animate-ambient-orb-1" />
      <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-indigo-500/25 blur-[60px] sm:blur-[100px] pointer-events-none animate-ambient-orb-2" />

      {/* Main Login Glass Card with Safe Pop-in Entrance */}
      <div className="w-full max-w-[420px] bg-white/[0.07] backdrop-blur-2xl border border-white/[0.14] rounded-3xl p-7 sm:p-10 shadow-2xl shadow-blue-950/50 relative z-10 animate-login-card login-glass-card">
        {/* Top Logo Icon with subtle interactive float */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-md animate-pulse pointer-events-none" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 animate-login-icon border border-white/20">
            <Code2 className="w-8 h-8" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight mb-1">
          Portal Admin
        </h1>
        <p className="text-xs text-blue-200/70 text-center mb-8 font-medium">
          XI PPLG 3 Engineering Hub
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs text-center font-medium animate-error-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1.5">
              Username
            </label>
            <div className="relative group">
              <User className="w-4 h-4 text-white/40 group-focus-within:text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-white/40 group-focus-within:text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
              <input
                type="password"
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-white/30 text-sm focus:border-blue-400 focus:bg-white/[0.12] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button with Shimmer Sweep */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 btn-shine-effect cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
