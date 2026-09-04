'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  ChevronRight
} from 'lucide-react';
import { initialStructure } from '@/data/seedData';
import { StructureMember } from '@/types/database';
import { useClassProfile } from '@/context/ClassProfileContext';
import { getStructure } from '@/lib/supabase/dataService';

export default function StrukturPage() {
  const { profile } = useClassProfile();
  const [structureList, setStructureList] = React.useState<StructureMember[]>(initialStructure);

  React.useEffect(() => {
    const loadStructure = () => {
      const saved = localStorage.getItem('class_web_structure');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStructureList(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStructureList(initialStructure);
    };

    loadStructure();

    // Live sync from Supabase cloud database
    getStructure().then((data) => {
      if (data && data.length > 0) {
        setStructureList(data);
        try { localStorage.setItem('class_web_structure', JSON.stringify(data)); } catch (e) {}
      }
    });

    window.addEventListener('storage', loadStructure);
    window.addEventListener('class_structure_updated', loadStructure);
    return () => {
      window.removeEventListener('storage', loadStructure);
      window.removeEventListener('class_structure_updated', loadStructure);
    };
  }, []);


  const waliKelas = structureList.find((m) => m.role === 'Wali Kelas');
  const ketua = structureList.find((m) => m.role === 'Ketua Kelas');
  const wakil = structureList.find((m) => m.role === 'Wakil Ketua');
  const sekretaris = structureList.filter((m) => m.role.toLowerCase().includes('sekretaris'));
  const bendahara = structureList.filter((m) => m.role.toLowerCase().includes('bendahara'));
  const seksi = structureList.filter((m) => m.role.toLowerCase().includes('pdd'));

  const MemberCard = ({ member }: { member: StructureMember }) => (
    <Link
      href={`/struktur/${member.id}`}
      className="group relative rounded-3xl bg-white border border-slate-200 hover:border-blue-400 p-6 shadow-xs transition-all duration-300 flex flex-col items-center text-center w-full max-w-[260px] desktop-card-hover"
    >
      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-500 transition-colors mb-4 shadow-md bg-slate-50">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-blue-600 shadow-sm flex items-center gap-1">
            Lihat Detail
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 mb-2">
        {member.role}
      </span>

      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {member.name}
      </h3>

      {member.expertise && (
        <p className="text-xs text-slate-500 font-medium mt-1">
          {member.expertise}
        </p>
      )}
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Struktur Kepengurusan</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Bagan Organisasi Kelas{' '}
          <span className="text-blue-600">
            {profile.className || 'XI PPLG 3'}
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
          Struktur organisasi kepemimpinan kelas {profile.className || 'XI PPLG 3'} {profile.schoolName || 'SMK'} masa bakti 2026 - 2027. Klik kartu anggota untuk membuka halaman detail lengkap.
        </p>
      </div>

      {/* Organizational Hierarchy Tree with Connectors */}
      <div className="space-y-12 flex flex-col items-center">
        {/* Tier 1: Wali Kelas */}
        {waliKelas && (
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Pembimbing & Wali Kelas
            </div>
            <MemberCard member={waliKelas} />
            <div className="w-0.5 h-10 border-l-2 border-dashed border-blue-300 mt-2" />
          </div>
        )}

        {/* Tier 2: Ketua & Wakil */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Pimpinan Kelas
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {ketua && <MemberCard member={ketua} />}
            {wakil && <MemberCard member={wakil} />}
          </div>
          <div className="w-0.5 h-10 border-l-2 border-dashed border-blue-300 mt-2" />
        </div>

        {/* Tier 3: Sekretaris */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Sekretaris & Administrasi
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {sekretaris.map((s) => (
              <MemberCard key={s.id} member={s} />
            ))}
          </div>
          <div className="w-0.5 h-10 border-l-2 border-dashed border-blue-300 mt-2" />
        </div>

        {/* Tier 4: Bendahara */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Bendahara & Keuangan
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {bendahara.map((b) => (
              <MemberCard key={b.id} member={b} />
            ))}
          </div>
          <div className="w-0.5 h-10 border-l-2 border-dashed border-blue-300 mt-2" />
        </div>

        {/* Tier 5: Divisi PDD */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Divisi Kreatif & Dokumentasi (PDD)
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {seksi.map((sek) => (
              <MemberCard key={sek.id} member={sek} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
