'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Sparkles, 
  Globe, 
  Mail, 
  X, 
  UserCheck, 
  Award,
  Hash,
  ChevronRight
} from 'lucide-react';
import { initialStudents } from '@/data/seedData';
import { Student } from '@/types/database';
import { useClassProfile } from '@/context/ClassProfileContext';
import { getStudents } from '@/lib/supabase/dataService';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

export default function SiswaPage() {
  const { profile } = useClassProfile();
  const [students, setStudents] = useState<Student[]>(initialStudents);

  React.useEffect(() => {
    const loadStudents = () => {
      const saved = localStorage.getItem('class_students_list') || localStorage.getItem('class_web_students');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const hasOldNurul = Array.isArray(parsed) && parsed.some((s: Student) => s.id === '031' && s.name.toLowerCase().includes('nurul'));
          if (hasOldNurul) {
            localStorage.setItem('class_students_list', JSON.stringify(initialStudents));
            localStorage.setItem('class_web_students', JSON.stringify(initialStudents));
            setStudents(initialStudents);
            return;
          }
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
            return;
          }
        } catch {
          // fallback
        }
      }
      setStudents(initialStudents);
    };

    loadStudents();

    // Live sync from Supabase cloud database
    getStudents().then((data) => {
      if (data && data.length > 0) {
        setStudents(data);
        try {
          localStorage.setItem('class_students_list', JSON.stringify(data));
          localStorage.setItem('class_web_students', JSON.stringify(data));
        } catch (e) {}
      }
    });

    window.addEventListener('storage', loadStudents);
    window.addEventListener('class_students_updated', loadStudents);
    return () => {
      window.removeEventListener('storage', loadStudents);
      window.removeEventListener('class_students_updated', loadStudents);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.includes(searchQuery)
    );
  }, [searchQuery, students]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title & Search Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Direktori Siswa</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Data Siswa{' '}
          <span className="text-blue-600">
            {profile.className || 'XI PPLG 3'}
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500">
          Total {students.length} siswa calon pengembang perangkat lunak handal dari {profile.schoolName || 'SMK'}.
        </p>

        {/* Search Input Bar (Matching original .search-wrapper) */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau nomor absen siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-sm"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {filteredStudents.length} Siswa
            </span>
          </div>
        </div>
      </div>

      {/* Student Grid (Matching original .students-grid & .student-card) */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">Siswa tidak ditemukan.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs text-blue-600 font-bold hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-5 shadow-xs transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden desktop-card-hover"
            >
              {/* Absen badge */}
              <div className="absolute top-3 left-3 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                #{student.id}
              </div>

              {/* Avatar Photo */}
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-500 transition-all my-2 shadow-xs bg-slate-100">
                <Image
                  src={student.photo || '/assets/uploads/logo/logo_1787282041.jpeg'}
                  alt={student.name}
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Name */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                {student.name}
              </h3>

              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                XI PPLG 3
              </p>

              {/* Quick links indicator */}
              {(student.github_link || student.portfolio_link) && (
                <div className="flex items-center gap-1.5 mt-2 text-blue-600">
                  {student.github_link && <GithubIcon className="w-3.5 h-3.5" />}
                  {student.portfolio_link && <Globe className="w-3.5 h-3.5" />}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg mb-4 bg-slate-100">
                <Image
                  src={selectedStudent.photo || '/assets/uploads/logo/logo_1787282041.jpeg'}
                  alt={selectedStudent.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  Absen #{selectedStudent.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">
                  XI PPLG 3
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {selectedStudent.name}
              </h2>

              {selectedStudent.nisn && (
                <p className="text-xs text-slate-500 mt-1">
                  NISN: <strong className="font-mono text-slate-700">{selectedStudent.nisn}</strong>
                </p>
              )}

              {/* Action Links */}
              <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                {selectedStudent.github_link ? (
                  <a
                    href={selectedStudent.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <GithubIcon className="w-4 h-4 text-white" />
                    Buka Profil GitHub
                  </a>
                ) : null}

                {selectedStudent.portfolio_link ? (
                  <a
                    href={selectedStudent.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 flex items-center justify-center gap-2 transition-colors border border-blue-200"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    Kunjungi Portofolio
                  </a>
                ) : null}

                {selectedStudent.email && (
                  <a
                    href={`mailto:${selectedStudent.email}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-rose-500" />
                    Kirim Email ({selectedStudent.email})
                  </a>
                )}

                <div className="text-[11px] text-slate-400 pt-2 text-center">
                  Siswa Rekayasa Perangkat Lunak & Gim • {profile.schoolName || 'SMK'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
