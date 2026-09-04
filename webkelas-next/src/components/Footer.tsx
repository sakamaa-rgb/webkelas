'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, Heart, Code2, Sparkles } from 'lucide-react';
import { useClassProfile } from '@/context/ClassProfileContext';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const { profile, contact } = useClassProfile();

  const igHandle = contact.instagram ? contact.instagram.replace('@', '').trim() : '';
  const waNumber = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';
  const emailAddr = contact.email ? contact.email.trim() : '';

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                {profile.className || 'XI PPLG 3'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                Class Web
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {profile.description || `Website resmi kelas ${profile.className || 'XI PPLG 3'}, ${profile.schoolName || 'SMK'}. Berinovasi, berkarakter, dan siap berkarya.`}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Built with React, Next.js, TypeScript, Tailwind & Supabase</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Navigasi Cepat
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/struktur" className="hover:text-blue-400 transition-colors">Struktur Kelas</Link>
              <Link href="/siswa" className="hover:text-blue-400 transition-colors">Daftar Siswa</Link>
              <Link href="/jadwal" className="hover:text-blue-400 transition-colors">Jadwal & Piket</Link>
              <Link href="/projects" className="hover:text-blue-400 transition-colors">Proyek Siswa</Link>
              <Link href="/galeri" className="hover:text-blue-400 transition-colors">Dokumentasi</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Hubungi Kami
            </h4>
            <p className="text-sm text-slate-400">
              Punya ide kolaborasi atau ingin menyapa kami?
            </p>
            <div className="flex items-center gap-3 pt-1">
              {igHandle && (
                <a
                  href={`https://instagram.com/${igHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-pink-500 hover:text-pink-400 transition-all flex items-center justify-center text-slate-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center justify-center text-slate-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {emailAddr && (
                <a
                  href={`mailto:${emailAddr}`}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center text-slate-300"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {profile.className || 'XI PPLG 3'} - {profile.schoolName || 'SMK'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Tim PDD & Siswa {profile.className || 'PPLG 3'}
          </p>
        </div>
      </div>
    </footer>
  );
}
