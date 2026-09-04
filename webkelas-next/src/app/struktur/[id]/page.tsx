'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Star, 
  Quote, 
  Calendar, 
  GraduationCap, 
  Compass,
  Sparkles
} from 'lucide-react';
import { StructureMember } from '@/types/database';
import { initialStructure } from '@/data/seedData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StructureDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const memberId = parseInt(resolvedParams.id, 10);

  const [member, setMember] = React.useState<StructureMember | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('class_web_structure');
      if (saved) {
        try {
          const list: StructureMember[] = JSON.parse(saved);
          const found = list.find((m) => m.id === memberId);
          if (found) return found;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialStructure.find((m) => m.id === memberId) || null;
  });

  React.useEffect(() => {
    const loadMember = () => {
      const saved = localStorage.getItem('class_web_structure');
      if (saved) {
        try {
          const list: StructureMember[] = JSON.parse(saved);
          const found = list.find((m) => m.id === memberId);
          if (found) {
            setMember(found);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setMember(initialStructure.find((m) => m.id === memberId) || null);
    };

    loadMember();
    window.addEventListener('storage', loadMember);
    window.addEventListener('class_structure_updated', loadMember);
    return () => {
      window.removeEventListener('storage', loadMember);
      window.removeEventListener('class_structure_updated', loadMember);
    };
  }, [memberId]);

  if (!member) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Anggota Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Data anggota struktur ini belum terdaftar atau telah diperbarui.</p>
        <Link href="/struktur" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25">
          <span>Kembali ke Struktur</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation (Matching original design) */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
        <Link 
          href="/struktur" 
          className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Struktur</span>
        </Link>
        <span className="text-slate-300">›</span>
        <span className="text-blue-600 font-bold">{member.name}</span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Sticky Photo & Identity Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Member Photo */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-5 shadow-inner">
              <Image
                src={member.photo || '/assets/uploads/logo/logo_1787282041.jpeg'}
                alt={member.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Role Badge (Purple-Blue Gradient) */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
                <User className="w-3.5 h-3.5" />
                {member.role.toUpperCase()}
              </span>
            </div>

            {/* Member Name */}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {member.name}
            </h1>

            {/* Expertise / Keahlian Pill */}
            {member.expertise && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {member.expertise}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detail Info Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Tentang Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2>Tentang</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {member.description || `${member.name} adalah anggota pengurus kelas XI PPLG 3.`}
            </p>
          </div>

          {/* 2. Pesan untuk Siswa Card (Dark Purple Card with quote styling) */}
          <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border-t-4 border-indigo-500">
            {/* Background Decorative Quote Watermark */}
            <div className="absolute right-6 bottom-4 text-slate-800 text-8xl font-serif font-black select-none pointer-events-none opacity-40 leading-none">
              ”
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              <Quote className="w-4 h-4 text-indigo-400" />
              <span>Pesan untuk Siswa</span>
            </div>

            <blockquote className="text-base sm:text-lg italic text-slate-100 leading-relaxed font-medium relative z-10">
              &ldquo;{member.message || 'Teruslah belajar, semangat dan pantang menyerah!!'}&rdquo;
            </blockquote>
          </div>

          {/* 3 & 4. Grid: Tahun Ajaran & Jurusan/Mata Pelajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tahun Ajaran */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tahun Ajaran
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {member.year || '2026 - 2027'}
                </p>
              </div>
            </div>

            {/* Jurusan / Mata Pelajaran */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Jurusan / Mata Pelajaran
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5 truncate">
                  {member.subject || 'PPLG (Software Engineering)'}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Motto Kelas Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Motto Kelas
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {member.motto || 'Code Your Dreams'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
