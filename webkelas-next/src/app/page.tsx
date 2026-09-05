'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Users, 
  Code2, 
  Calendar, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import TodayScheduleWidget from '@/components/TodayScheduleWidget';
import NetworkBackground from '@/components/NetworkBackground';
import { initialProjects, initialStructure } from '@/data/seedData';
import { useClassProfile } from '@/context/ClassProfileContext';

function TypewriterText({ 
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2200
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}) {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!words || words.length === 0) return;
    const fullWord = words[currentWordIndex % words.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullWord.length) {
        timer = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-center">
      <span className="text-blue-600 font-extrabold tracking-tight">
        {currentText}
      </span>
      <span 
        className="inline-block w-0.5 sm:w-[3px] h-[1.1em] bg-blue-600 ml-1 rounded-full animate-cursor-blink shadow-xs shadow-blue-500/50" 
        aria-hidden="true" 
      />
    </span>
  );
}

function AnimatedCounter({ 
  end, 
  suffix = '', 
  duration = 1600 
}: { 
  end: number; 
  suffix?: string; 
  duration?: number; 
}) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function HomePage() {
  const { profile } = useClassProfile();
  const [structureList, setStructureList] = React.useState(initialStructure);
  const [totalStudents, setTotalStudents] = React.useState(45);
  const [totalStructure, setTotalStructure] = React.useState(8);
  const [totalProjects, setTotalProjects] = React.useState(3);

  React.useEffect(() => {
    const loadHomeData = () => {
      const saved = localStorage.getItem('class_web_structure');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStructureList(parsed);
            setTotalStructure(parsed.length);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const savedStudents = localStorage.getItem('class_students_list') || localStorage.getItem('class_web_students');
      if (savedStudents) {
        try {
          const parsed = JSON.parse(savedStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTotalStudents(parsed.length);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const savedProjects = localStorage.getItem('class_projects_list');
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTotalProjects(parsed.length);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadHomeData();
    window.addEventListener('storage', loadHomeData);
    window.addEventListener('class_structure_updated', loadHomeData);
    window.addEventListener('class_students_updated', loadHomeData);
    window.addEventListener('class_projects_updated', loadHomeData);
    return () => {
      window.removeEventListener('storage', loadHomeData);
      window.removeEventListener('class_structure_updated', loadHomeData);
      window.removeEventListener('class_students_updated', loadHomeData);
      window.removeEventListener('class_projects_updated', loadHomeData);
    };
  }, []);

  const waliKelas = structureList.find(m => m.role === 'Wali Kelas') || initialStructure.find(m => m.role === 'Wali Kelas');
  const teacherName = waliKelas?.name || 'Mutia Oktavia S,Pd';

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION (Matching original 2-column layout & floating tech circle) */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Constellation / Network Node Canvas Effect */}
        <NetworkBackground className="opacity-75" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge with Pulsing Dot */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 font-mono text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span>{profile.schoolName || 'SMK Negeri 1 Ciomas'} • PPLG Department</span>
            </div>

            {/* Main Headline (X PPLG 3 Engineering Hub) */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.04]">
              <span className="block text-slate-900 tracking-tight animate-hero-title">
                {profile.className || 'X PPLG 3'}
              </span>
              <span className="block text-[#5865F2] tracking-tight animate-engineering-hub mt-1 sm:mt-2">
                Engineering Hub
              </span>
            </h1>

            {/* Wali Kelas Subtitle with Typewriter Animation */}
            <p className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center justify-center lg:justify-start gap-1.5 min-h-[36px]">
              <span>Wali Kelas:</span>
              <TypewriterText
                words={[
                  teacherName,
                  'Ibu Mutia Oktavia, S.Pd',
                  'Pembimbing XI PPLG 3',
                  'Ibu Guru Terbaik'
                ]}
              />
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Wadah kolaborasi, inovasi rekayasa perangkat lunak, dan arsip kebersamaan generasi calon software engineer masa depan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/siswa"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center gap-2 group active:scale-95 desktop-shimmer-btn desktop-btn-lift"
              >
                <Users className="w-4 h-4" />
                Kenali {totalStudents} Siswa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center gap-2 active:scale-95 desktop-btn-lift"
              >
                <Code2 className="w-4 h-4 text-blue-600" />
                Showcase Proyek
              </Link>
            </div>
          </div>

          {/* Right Hero Graphic (Circle with floating tech badges) */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            {/* Concentric Pulse Rings (Only on Desktop/Window to avoid mobile lag) */}
            <div className="hidden md:block absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full border border-blue-500/10 animate-ring-pulse pointer-events-none" />
            <div className="hidden md:block absolute w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full border border-purple-500/10 animate-ring-pulse pointer-events-none" />

            {/* Main Floating Center Circle (High-Fidelity Float & Halo on Desktop, Lightweight Float on Mobile) */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-500/15 border border-white flex flex-col items-center justify-center text-center p-6 animate-hero-entrance animate-desktop-hero animate-desktop-halo">
              {/* Official Class Logo with Entrance Pop-in and Floating Hover */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-xl shadow-blue-500/30 mb-3.5 animate-logo-entrance group cursor-pointer">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-white shadow-inner flex items-center justify-center border-2 border-white animate-icon-float">
                  <Image
                    src={profile.logo || '/assets/uploads/logo/logo_1787282041.jpeg'}
                    alt={profile.className || 'Logo XI PPLG 3'}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {profile.className || 'XI PPLG 3'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Software Engineering
              </p>

              {/* Floating Orbit Tech Badges with Staggered Entrance Animations */}
              {/* HTML5 */}
              <div className="absolute -top-2 right-6 animate-badge-pop-1">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center font-bold text-xs text-orange-600 animate-float-badge">
                  HTML
                </div>
              </div>
              {/* PHP */}
              <div className="absolute bottom-6 -right-2 animate-badge-pop-3">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center font-bold text-xs text-indigo-600 animate-float-badge" style={{ animationDelay: '-1.5s' }}>
                  PHP
                </div>
              </div>
              {/* JS */}
              <div className="absolute top-8 -left-3 animate-badge-pop-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center font-bold text-xs text-amber-500 animate-float-badge" style={{ animationDelay: '-2.5s' }}>
                  JS
                </div>
              </div>
              {/* MySQL */}
              <div className="absolute -bottom-2 left-8 animate-badge-pop-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center font-bold text-xs text-blue-600 animate-float-badge" style={{ animationDelay: '-3.5s' }}>
                  SQL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Authentic Dark Slate Band with Animated Counters & Responsive Layout) */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-10 sm:py-16 shadow-2xl border-y border-slate-800/80">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {/* Stat 1: Siswa Berbakat */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-blue-500/50 p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-2.5 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/25 transition-all">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                <AnimatedCounter end={totalStudents} />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Siswa Berbakat
              </p>
            </div>

            {/* Stat 2: Pengurus Kelas */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-sky-500/50 p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mb-2.5 text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/25 transition-all">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-300">
                <AnimatedCounter end={totalStructure} />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Pengurus Kelas
              </p>
            </div>

            {/* Stat 3: Proyek Aktif */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-purple-500/50 p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-2.5 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300">
                <AnimatedCounter end={totalProjects} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Proyek Aktif
              </p>
            </div>

            {/* Stat 4: Tahun Ajaran */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/50 p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-2.5 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                {profile.year || '2026/27'}
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                Tahun Ajaran
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S SCHEDULE & PIKET WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TodayScheduleWidget />
      </section>

      {/* 4. FEATURES SECTION (Authentic "Fitur Website Kelas" Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fitur Website Kelas
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Jelajahi berbagai menu dan dokumentasi aktivitas kelas kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Struktur */}
          <Link
            href="/struktur"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Struktur Organisasi
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Bagan kepengurusan kelas dari Wali Kelas, Ketua Kelas, hingga seksi-seksi.
            </p>
          </Link>

          {/* Card 2: Siswa */}
          <Link
            href="/siswa"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Data {totalStudents} Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Daftar biodata lengkap seluruh siswa dengan tautan GitHub dan portofolio.
            </p>
          </Link>

          {/* Card 3: Jadwal */}
          <Link
            href="/jadwal"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Jadwal & Piket
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Jadwal mata pelajaran mingguan dan daftar petugas piket kebersihan kelas.
            </p>
          </Link>

          {/* Card 4: Projects */}
          <Link
            href="/projects"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Proyek Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Koleksi karya inovasi web dan aplikasi yang dibuat oleh siswa kelas.
            </p>
          </Link>

          {/* Card 5: Galeri */}
          <Link
            href="/galeri"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
              Galeri Foto
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Arsip momen penting, perlombaan, upacara, dan kebersamaan di kelas.
            </p>
          </Link>

          {/* Card 6: Contact */}
          <Link
            href="/contact"
            className="group rounded-3xl bg-white border border-slate-200/80 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden desktop-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Contact Us
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Hubungi kami melalui Instagram, WhatsApp, atau Gmail untuk kolaborasi.
            </p>
          </Link>
        </div>
      </section>

      {/* 5. QUICK LINKS (Navigasi Cepat) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/struktur"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Bagan Struktur Kelas
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
          </Link>

          <Link
            href="/siswa"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Daftar Absen {totalStudents} Siswa
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
          </Link>

          <Link
            href="/projects"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Proyek & Karya Siswa
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
          </Link>
        </div>
      </section>
    </div>
  );
}
