'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  ArrowRight, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useClassProfile } from '@/context/ClassProfileContext';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ContactPage() {
  const { profile, contact } = useClassProfile();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const rawIg = contact.instagram || '@xpplg.3rd';
  const igHandle = rawIg.replace('@', '').trim();
  const rawWa = contact.whatsapp || '+6281294862060';
  const waClean = rawWa.replace(/[^0-9]/g, '');
  const emailAddr = contact.email || 'classxpplg3@gmail.com';

  const copyToClipboard = (text: string, fieldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Kami</span>
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
          Ada pertanyaan atau ingin berkolaborasi? Hubungi kami melalui platform berikut.
        </p>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full">
        {/* CARD 1: INSTAGRAM */}
        <div className="group relative rounded-3xl p-8 sm:p-9 text-white overflow-hidden shadow-xl shadow-rose-500/15 hover:shadow-2xl hover:shadow-rose-500/35 transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] animate-card-pop-1">
          {/* Ambient decorative glowing orbs inside card */}
          <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-amber-400/20 blur-md pointer-events-none" />

          {/* Top Circular Icon with Frosted Glass & Floating Hover */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 border border-white/35 backdrop-blur-md flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <InstagramIcon className="w-9 h-9" />
          </div>

          {/* Title & Info */}
          <div className="relative z-10 mb-8 space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Instagram
            </h3>
            <div 
              onClick={(e) => copyToClipboard(`@${igHandle}`, 'ig', e)}
              className="inline-flex items-center gap-1.5 text-white/95 hover:text-white text-sm sm:text-base font-semibold cursor-pointer py-1 px-3 rounded-full hover:bg-white/15 transition-all"
              title="Klik untuk salin username"
            >
              <span>@{igHandle}</span>
              {copiedField === 'ig' ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              )}
            </div>
            {copiedField === 'ig' && (
              <p className="text-[11px] text-emerald-200 font-bold animate-fade-in">
                Username disalin!
              </p>
            )}
          </div>

          {/* Action Button */}
          <a
            href={`https://instagram.com/${igHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/25 hover:bg-white text-white hover:text-rose-600 border border-white/40 font-bold text-xs sm:text-sm backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 group/btn"
          >
            <span>Lihat konten kami</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* CARD 2: WHATSAPP */}
        <div className="group relative rounded-3xl p-8 sm:p-9 text-white overflow-hidden shadow-xl shadow-emerald-500/15 hover:shadow-2xl hover:shadow-emerald-500/35 transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] animate-card-pop-2">
          {/* Ambient decorative glowing orbs inside card */}
          <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-emerald-300/20 blur-md pointer-events-none" />

          {/* Top Circular Icon with Frosted Glass & Floating Hover */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 border border-white/35 backdrop-blur-md flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
            <MessageCircle className="w-9 h-9 fill-white/20" />
          </div>

          {/* Title & Info */}
          <div className="relative z-10 mb-8 space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              WhatsApp
            </h3>
            <div 
              onClick={(e) => copyToClipboard(rawWa, 'wa', e)}
              className="inline-flex items-center gap-1.5 text-white/95 hover:text-white text-sm sm:text-base font-semibold cursor-pointer py-1 px-3 rounded-full hover:bg-white/15 transition-all"
              title="Klik untuk salin nomor WhatsApp"
            >
              <span>{rawWa}</span>
              {copiedField === 'wa' ? (
                <Check className="w-3.5 h-3.5 text-emerald-200" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              )}
            </div>
            {copiedField === 'wa' && (
              <p className="text-[11px] text-emerald-100 font-bold animate-fade-in">
                Nomor disalin!
              </p>
            )}
          </div>

          {/* Action Button */}
          <a
            href={`https://wa.me/${waClean}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/25 hover:bg-white text-white hover:text-emerald-700 border border-white/40 font-bold text-xs sm:text-sm backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 group/btn"
          >
            <span>Chat langsung</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* CARD 3: GMAIL */}
        <div className="group relative rounded-3xl p-8 sm:p-9 text-white overflow-hidden shadow-xl shadow-blue-500/15 hover:shadow-2xl hover:shadow-blue-500/35 transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] animate-card-pop-3">
          {/* Ambient decorative glowing orbs inside card */}
          <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-sky-300/20 blur-md pointer-events-none" />

          {/* Top Circular Icon with Frosted Glass & Floating Hover */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 border border-white/35 backdrop-blur-md flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Mail className="w-9 h-9" />
          </div>

          {/* Title & Info */}
          <div className="relative z-10 mb-8 space-y-1.5 max-w-full">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Gmail
            </h3>
            <div 
              onClick={(e) => copyToClipboard(emailAddr, 'email', e)}
              className="inline-flex items-center gap-1.5 text-white/95 hover:text-white text-xs sm:text-sm font-semibold cursor-pointer py-1 px-3 rounded-full hover:bg-white/15 transition-all truncate max-w-full"
              title="Klik untuk salin alamat email"
            >
              <span className="truncate">{emailAddr}</span>
              {copiedField === 'email' ? (
                <Check className="w-3.5 h-3.5 text-cyan-200 flex-shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 flex-shrink-0" />
              )}
            </div>
            {copiedField === 'email' && (
              <p className="text-[11px] text-cyan-100 font-bold animate-fade-in">
                Email disalin!
              </p>
            )}
          </div>

          {/* Action Button */}
          <a
            href={`mailto:${emailAddr}`}
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/25 hover:bg-white text-white hover:text-blue-700 border border-white/40 font-bold text-xs sm:text-sm backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 group/btn"
          >
            <span>Kirim email</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Bottom Credit Pill (Matching user screenshot) */}
      <div className="mt-14 sm:mt-16 flex justify-center text-center">
        <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-600 font-medium text-xs sm:text-sm shadow-xs hover:border-blue-300 hover:bg-blue-50 transition-all">
          <Code2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Class {profile.className || 'XI PPLG 3'} • Software Engineering • {profile.schoolName || 'SMK Negeri 1 Ciomas'}
          </span>
        </div>
      </div>
    </div>
  );
}
