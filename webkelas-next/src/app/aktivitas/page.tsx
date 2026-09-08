'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Compass, 
  Users, 
  Code2, 
  Sparkles, 
  Star, 
  Award, 
  Calendar, 
  MapPin, 
  Maximize2, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Laptop, 
  Trophy, 
  Flag, 
  ChevronRight, 
  ShieldCheck, 
  HeartHandshake,
  Terminal,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  User
} from 'lucide-react';
import { 
  ekstrakurikulerList as initialEkskul, 
  organisasiMembers as initialOrg, 
  journeyMilestones as initialJourney, 
  EkstrakurikulerItem, 
  OrganisasiMember, 
  JourneyMilestone,
  AktivitasPhotoConfig,
  defaultPhotoConfig,
  matchesEkskulCategory,
  getAvailableEkskulCategories
} from '@/data/aktivitasData';
import { useClassProfile } from '@/context/ClassProfileContext';

// Komponen Adaptive Image Frame dengan Pengaturan Ukuran Dinamis
function AdaptiveImageFrame({
  src,
  alt,
  orientation,
  config,
  className = '',
  onClick,
  priority = false
}: {
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait' | 'square';
  config: AktivitasPhotoConfig;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}) {
  const isPortrait = orientation === 'portrait';
  const forceContain = config.objectFit === 'contain';

  return (
    <div 
      className={`relative overflow-hidden w-full bg-slate-950 select-none group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {isPortrait && forceContain ? (
        // SMART ADAPTIVE COMPOSITION UNTUK PORTRAIT:
        // Latar belakang blurred dari foto yang sama + subjek utuh di depan tanpa crop wajah/badan
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* 1. Blurred enlarged backdrop */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover scale-125 blur-xl opacity-40 brightness-75 transition-transform duration-500 group-hover:scale-135"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-slate-950/60" />
          </div>

          {/* 2. Uncropped full subject (Contain) */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Subtle Portrait Badge */}
          {config.showPortraitBadge && (
            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/90 shadow-sm">
              Portrait (Adaptive Contain)
            </div>
          )}
        </div>
      ) : (
        // LANDSCAPE atau Mode Full Cover: Cover dengan focal point optimal
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={`object-cover ${isPortrait ? 'object-top' : 'object-center'} transition-transform duration-500 group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
          
          {isPortrait && config.showPortraitBadge && (
            <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/90 shadow-sm">
              9:16 Pas
            </div>
          )}
        </div>
      )}

      {/* Hover Lightbox Prompt Overlay */}
      <div className="absolute inset-0 z-20 bg-blue-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Lihat Foto Penuh</span>
        </span>
      </div>
    </div>
  );
}

export default function AktivitasPage() {
  const { profile } = useClassProfile();

  // Dynamic state for datasets and photo sizing configuration
  const [ekskulList, setEkskulList] = useState<EkstrakurikulerItem[]>(initialEkskul);
  const [orgList, setOrgList] = useState<OrganisasiMember[]>(initialOrg);
  const [journeyList, setJourneyList] = useState<JourneyMilestone[]>(initialJourney);
  const [photoConfig, setPhotoConfig] = useState<AktivitasPhotoConfig>(defaultPhotoConfig);

  // Main Section Tabs & Filter States (Mirrors /jadwal UX)
  const [activeMainTab, setActiveMainTab] = useState<'ekskul' | 'organisasi' | 'dicoding'>('ekskul');
  const [selectedEkskulFilter, setSelectedEkskulFilter] = useState<string>('Semua');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<'Semua' | 'MPK' | 'OSIS'>('Semua');

  // Compute available categories dynamically
  const availableEkskulCategories = useMemo(() => {
    return getAvailableEkskulCategories(ekskulList);
  }, [ekskulList]);

  // Filtered Ekskul items based on selected category
  const filteredEkskulList = useMemo(() => {
    return ekskulList.filter((item) => matchesEkskulCategory(item, selectedEkskulFilter));
  }, [ekskulList, selectedEkskulFilter]);

  // Filtered Organisasi items
  const filteredOrgList = useMemo(() => {
    if (selectedOrgFilter === 'Semua') return orgList;
    return orgList.filter((item) => item.organisasi === selectedOrgFilter);
  }, [orgList, selectedOrgFilter]);

  // Sync hash URL on mount or hash change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('organisasi')) {
        setActiveMainTab('organisasi');
      } else if (hash.includes('dicoding')) {
        setActiveMainTab('dicoding');
      } else if (hash.includes('ekskul')) {
        setActiveMainTab('ekskul');
      }
    }
  }, []);

  // State untuk modal lightbox foto
  const [lightboxData, setLightboxData] = useState<{
    src: string;
    title: string;
    subtitle?: string;
    badge?: string;
    description?: string;
  } | null>(null);

  // State untuk modal detail organisasi
  const [selectedOrgMember, setSelectedOrgMember] = useState<OrganisasiMember | null>(null);

  // Load datasets & photo config from localStorage on mount & listen for real-time changes
  useEffect(() => {
    const loadAllData = () => {
      try {
        const savedConfig = localStorage.getItem('class_aktivitas_photo_config');
        if (savedConfig) setPhotoConfig(JSON.parse(savedConfig));

        const savedEkskul = localStorage.getItem('class_aktivitas_ekskul');
        if (savedEkskul) {
          try {
            const parsed = JSON.parse(savedEkskul);
            const sanitized = Array.isArray(parsed) ? parsed.filter((item: any) => {
              const id = (item.id || '').toLowerCase();
              const name = (item.nama || '').toLowerCase();
              return !['ekskul-itclub', 'ekskul-pmr', 'ekskul-musik'].includes(id) &&
                     !name.includes('it club') && !name.includes('palang merah') && !name.includes('seni musik');
            }) : [];
            
            const sanitizedIds = new Set(sanitized.map((i: any) => i.id));
            const missingInSanitized = initialEkskul.some((i: any) => !sanitizedIds.has(i.id));

            if (sanitized.length === 0 || initialEkskul.length > sanitized.length || missingInSanitized) {
              setEkskulList(initialEkskul);
              localStorage.setItem('class_aktivitas_ekskul', JSON.stringify(initialEkskul));
            } else {
              setEkskulList(sanitized);
            }
          } catch {
            setEkskulList(initialEkskul);
          }
        } else {
          setEkskulList(initialEkskul);
          localStorage.setItem('class_aktivitas_ekskul', JSON.stringify(initialEkskul));
        }

        const savedOrg = localStorage.getItem('class_aktivitas_org');
        if (savedOrg) {
          try {
            const parsed = JSON.parse(savedOrg);
            if (Array.isArray(parsed)) {
              const enriched = parsed.map((m: any) => ({
                ...m,
                fitMode: m.fitMode || 'cover',
                orientation: m.orientation || 'portrait',
                objectPosition: m.objectPosition || 'top'
              }));
              setOrgList(enriched);
            } else {
              setOrgList(initialOrg);
            }
          } catch {
            setOrgList(initialOrg);
          }
        } else {
          setOrgList(initialOrg);
        }

        const savedJourney = localStorage.getItem('class_aktivitas_journey');
        if (savedJourney) {
          try {
            const parsed = JSON.parse(savedJourney);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setJourneyList(parsed);
            } else {
              setJourneyList(initialJourney);
            }
          } catch {
            setJourneyList(initialJourney);
          }
        } else {
          setJourneyList(initialJourney);
        }
      } catch (err) {
        console.warn('Error loading custom aktivitas data:', err);
      }
    };

    loadAllData();

    // Listeners for live changes from admin panel
    const handleConfigUpdated = (e: any) => {
      if (e.detail) setPhotoConfig(e.detail);
      else loadAllData();
    };

    window.addEventListener('class_aktivitas_config_updated', handleConfigUpdated);
    window.addEventListener('class_aktivitas_updated', loadAllData);
    window.addEventListener('storage', loadAllData);

    return () => {
      window.removeEventListener('class_aktivitas_config_updated', handleConfigUpdated);
      window.removeEventListener('class_aktivitas_updated', loadAllData);
      window.removeEventListener('storage', loadAllData);
    };
  }, []);

  // Keyboard navigation untuk close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxData(null);
        setSelectedOrgMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Menghitung rasio frame secara dinamis untuk setiap foto
  // Khusus Full Cover auto-ratio ATAU saat aspectRatio === 'auto':
  // Foto portrait langsung berukuran 9 / 16 pas tanpa crop brutal!
  const getFrameRatioStyle = useCallback((orientation: 'landscape' | 'portrait' | 'square'): React.CSSProperties => {
    const isAuto = photoConfig.aspectRatio === 'auto' || 
      (photoConfig.objectFit === 'cover' && photoConfig.fullCoverMode === 'auto-ratio');

    if (isAuto) {
      if (orientation === 'portrait') {
        return { aspectRatio: '9 / 16' };
      }
      if (orientation === 'square') {
        return { aspectRatio: '1 / 1' };
      }
      return { aspectRatio: '16 / 10' };
    }

    const parts = photoConfig.aspectRatio.split('/');
    if (parts.length === 2) {
      return { aspectRatio: `${parts[0]} / ${parts[1]}` };
    }
    return { aspectRatio: '16 / 10' };
  }, [photoConfig.aspectRatio, photoConfig.objectFit, photoConfig.fullCoverMode]);

  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900"
      style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-blue-50/40 to-slate-50">
        {/* Playful Decorative Doodle Elements (Hardware-Accelerated Safe on Mobile & Desktop) */}
        <div className="absolute top-10 left-[8%] w-12 h-12 text-blue-400/40 animate-aktivitas-float pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
        <div className="absolute top-32 right-[10%] w-8 h-8 text-amber-400/60 animate-aktivitas-float pointer-events-none" style={{ animationDelay: '1.5s' }}>
          <Star className="w-full h-full fill-amber-300" />
        </div>
        <div className="absolute bottom-6 left-[15%] flex gap-1.5 opacity-40 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200/25 blur-3xl animate-aktivitas-glow pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-200/25 blur-3xl animate-aktivitas-glow pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Mini Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold tracking-wide shadow-xs mb-5 animate-in fade-in zoom-in duration-300">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin duration-3000" />
            <span>Kegiatan & Perjalanan Siswa</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>{profile.className || 'XI PPLG 3'}</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight mb-5">
            Aktivitas{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {profile.className || 'XI PPLG 3'}
            </span>
          </h1>

          {/* Hero Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal mb-8">
            Halaman ini merangkum berbagai kegiatan siswa XI PPLG 3, mulai dari ekstrakurikuler, 
            kontribusi siswa dalam organisasi sekolah, hingga perjalanan mengikuti event dan Dicoding Journey.
          </p>

          {/* Main Tab Switcher (Modeled after Jadwal & Piket) */}
          <div className="flex justify-center">
            <div className="p-1 sm:p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 flex gap-1 sm:gap-2 shadow-md max-w-full overflow-x-auto">
              <button
                onClick={() => {
                  setActiveMainTab('ekskul');
                  if (typeof window !== 'undefined') window.history.replaceState(null, '', '#ekskul');
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer ${
                  activeMainTab === 'ekskul'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-base sm:text-lg">🏫</span>
                <span>Ekstrakurikuler</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeMainTab === 'ekskul' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {ekskulList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab('organisasi');
                  if (typeof window !== 'undefined') window.history.replaceState(null, '', '#organisasi');
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer ${
                  activeMainTab === 'organisasi'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-base sm:text-lg">👥</span>
                <span>Organisasi Siswa</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeMainTab === 'organisasi' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {orgList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab('dicoding');
                  if (typeof window !== 'undefined') window.history.replaceState(null, '', '#dicoding-journey');
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer ${
                  activeMainTab === 'dicoding'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-base sm:text-lg">💻</span>
                <span>Dicoding Journey</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeMainTab === 'dicoding' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {journeyList.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: EKSTRAKURIKULER
          ========================================================================= */}
      {activeMainTab === 'ekskul' && (
        <section id="ekskul" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 animate-in fade-in duration-300">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>🏫 Section 01</span>
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span>Bakat & Minat</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Ekstrakurikuler Siswa
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl">
                Pilih opsi kegiatan di bawah untuk melihat dokumentasi foto dan profil siswa per ekskul secara terpisah dan rapi.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs self-start md:self-auto">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Sistem Foto Adaptif (
                {photoConfig.objectFit === 'cover' && photoConfig.fullCoverMode === 'auto-ratio'
                  ? 'Full Cover Auto 9:16'
                  : photoConfig.aspectRatio === 'auto'
                  ? 'Auto Rasio'
                  : `Rasio ${photoConfig.aspectRatio}`}
                )
              </span>
            </div>
          </div>

          {/* Category Filter Pills (Modeled after Day Buttons in /jadwal) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mb-10 px-2">
            {availableEkskulCategories.map((cat) => {
              const count = cat === 'Semua' 
                ? ekskulList.length 
                : ekskulList.filter((item) => matchesEkskulCategory(item, cat)).length;
              const isSelected = selectedEkskulFilter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedEkskulFilter(cat)}
                  className={`relative px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ekstrakurikuler Cards Grid */}
          {filteredEkskulList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4">
                🏫
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Belum ada foto untuk {selectedEkskulFilter}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Dokumentasi foto kegiatan siswa untuk ekstrakurikuler ini belum tersedia.
              </p>
              <button
                onClick={() => setSelectedEkskulFilter('Semua')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Tampilkan Semua Eskul
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
              {filteredEkskulList.map((item, idx) => {
                const badgeClasses = (item.badgeColor ? {
                  amber: 'bg-amber-50 text-amber-700 border-amber-200',
                  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  blue: 'bg-blue-50 text-blue-700 border-blue-200',
                  rose: 'bg-rose-50 text-rose-700 border-rose-200',
                  purple: 'bg-purple-50 text-purple-700 border-purple-200',
                  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                }[item.badgeColor] : null) || 'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl aktivitas-card-hover animate-card-fade-up stagger-${(idx % 6) + 1} flex flex-col overflow-hidden`}
                  >
                    {/* ADAPTIVE IMAGE FRAME WITH CONFIGURABLE ASPECT RATIO */}
                    <div style={getFrameRatioStyle(item.orientation)} className="w-full overflow-hidden">
                      <AdaptiveImageFrame
                        src={item.foto}
                        alt={item.nama}
                        orientation={item.orientation}
                        config={photoConfig}
                        className="h-full"
                        onClick={() => setLightboxData({
                          src: item.foto,
                          title: item.nama,
                          subtitle: item.kategori,
                          badge: item.orientation === 'portrait' ? 'Portrait Mode' : 'Landscape',
                          description: item.deskripsi
                        })}
                      />
                    </div>

                    {/* Card Content */}
                    <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${
                      photoConfig.cardHeight === 'compact' ? 'space-y-2' : ''
                    }`}>
                      <div>
                        {/* Category Badge & Tagline */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClasses}`}>
                            {item.kategori}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 italic truncate max-w-[150px]">
                            {item.tagline}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.nama}
                        </h3>

                        {/* Nama Siswa / i */}
                        {item.siswa && (
                          <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl w-fit">
                            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{item.siswa}</span>
                          </div>
                        )}

                        {/* Description */}
                        {item.deskripsi && (
                          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          SECTION 2: ORGANISASI SISWA (SPOTLIGHT MPK & OSIS)
          ========================================================================= */}
      {activeMainTab === 'organisasi' && (
        <section id="organisasi" className="py-12 sm:py-20 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-y border-slate-200/80 scroll-mt-20 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                <span>👥 Section 02</span>
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                <span>Student Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Organisasi Siswa XI PPLG 3
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Siswa XI PPLG 3 yang turut berkontribusi dan berperan aktif dalam organisasi sekolah (MPK & OSIS).
              </p>

              {/* Organisasi Filter Pills (Modeled after Day Selector in /jadwal) */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {(['Semua', 'MPK', 'OSIS'] as const).map((org) => {
                  const count = org === 'Semua' ? orgList.length : orgList.filter((m) => m.organisasi === org).length;
                  const isSelected = selectedOrgFilter === org;
                  return (
                    <button
                      key={org}
                      onClick={() => setSelectedOrgFilter(org)}
                      className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      <span>{org === 'Semua' ? 'Semua Organisasi' : org}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Featured Organization Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {filteredOrgList.map((member, idx) => {
                const isMpk = member.organisasi === 'MPK';
                const isMiddle = idx === 1;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedOrgMember(member)}
                    className={`group relative bg-white rounded-3xl border aktivitas-card-hover animate-card-fade-up stagger-${idx + 1} cursor-pointer flex flex-col overflow-hidden ${
                      isMpk
                        ? 'border-emerald-200/90 shadow-sm hover:shadow-emerald-500/15 hover:border-emerald-300'
                        : 'border-blue-200/90 shadow-sm hover:shadow-blue-500/15 hover:border-blue-300'
                    } ${isMiddle ? 'md:scale-[1.03] md:z-10 shadow-md ring-1 ring-blue-100' : ''}`}
                  >
                    {/* Decorative Header Banner */}
                    <div className={`h-2.5 w-full ${isMpk ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`} />

                    {/* Playful Top Badge */}
                    <div className="p-6 pb-4 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Active Beyond The Classroom
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        isMpk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isMpk ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        {member.organisasi}
                      </span>
                    </div>

                    {/* Student Photo Frame - Adaptive & Clean Fit (No Black Bars) */}
                    <div className="px-5 sm:px-6">
                      <div 
                        className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner group transition-all ${
                          member.orientation === 'landscape' ? 'aspect-[16/10]' : member.orientation === 'square' ? 'aspect-[1/1]' : 'aspect-[3/4]'
                        }`}
                      >
                        {member.fitMode === 'contain' ? (
                          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
                            {/* Blurred backdrop with pleasant opacity */}
                            <Image
                              src={member.foto}
                              alt=""
                              fill
                              aria-hidden="true"
                              className="object-cover blur-xl opacity-60 scale-125 brightness-90"
                            />
                            <div className="absolute inset-0 bg-slate-950/25" />
                            {/* Subject in front */}
                            <Image
                              src={member.foto}
                              alt={member.nama}
                              fill
                              className="object-contain drop-shadow-xl z-10 transition-transform duration-500 group-hover:scale-105 p-1.5"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        ) : (
                          // Default: Clean edge-to-edge cover with object-top for perfect faces & uniforms
                          <div className="relative w-full h-full bg-slate-100">
                            <Image
                              src={member.foto}
                              alt={member.nama}
                              fill
                              className={`object-cover ${
                                member.objectPosition === 'bottom' 
                                  ? 'object-bottom' 
                                  : member.objectPosition === 'center' 
                                  ? 'object-center' 
                                  : 'object-top'
                              } transition-transform duration-500 group-hover:scale-105`}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                          </div>
                        )}

                        {/* Hover Overlay Lightbox Trigger */}
                        <div className="absolute inset-0 z-20 bg-blue-900/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Lihat Foto Penuh</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Student Name */}
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                          {member.nama}
                        </h3>

                        {/* Official Role / Jabatan */}
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-extrabold">
                          <Award className={`w-4 h-4 ${isMpk ? 'text-emerald-600' : 'text-blue-600'}`} />
                          <span>{member.jabatan}</span>
                        </div>

                        {/* Brief Role Preview */}
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {member.roleDescription}
                        </p>
                      </div>

                      {/* Bottom CTA / Action */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400">Representing XI PPLG 3</span>
                        <span className={`flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                          isMpk ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          <span>Detail Profil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: DICODING JOURNEY & UJI LEVEL (PENGGANTI NAMA PPLG)
          ========================================================================= */}
      {activeMainTab === 'dicoding' && (
        <section id="dicoding-journey" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 animate-in fade-in duration-300">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>💻 Section 03</span>
            <span className="w-1 h-1 rounded-full bg-purple-500" />
            <span>Dicoding Journey</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Dicoding Journey & Uji Level
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Perjalanan bertahap siswa XI PPLG 3 mulai dari persiapan fondasi software engineering, 
            eksplorasi coding intensif, hackathon challenge, hingga uji kompetensi resmi bersertifikasi Dicoding.
          </p>
        </div>

        {/* GAMIFIED INTERACTIVE TIMELINE */}
        <div className="relative">
          {/* Vertical Central Progress Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-12 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-30" />

          {/* Vertical Left Progress Line (Mobile) */}
          <div className="md:hidden absolute left-5 top-4 bottom-12 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-30" />

          <div className="space-y-12 md:space-y-16">
            {journeyList.map((item, idx) => {
              const isEven = idx % 2 === 0;

              const badgeColors = {
                blue: 'bg-blue-50 text-blue-700 border-blue-200',
                purple: 'bg-purple-50 text-purple-700 border-purple-200',
                amber: 'bg-amber-50 text-amber-700 border-amber-200',
                rose: 'bg-rose-50 text-rose-700 border-rose-200',
                emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }[item.badgeType] || 'bg-blue-50 text-blue-700 border-blue-200';

              const iconNodes = {
                flag: <Flag className="w-4 h-4 text-white" />,
                code: <Code2 className="w-4 h-4 text-white" />,
                laptop: <Laptop className="w-4 h-4 text-white" />,
                star: <Star className="w-4 h-4 text-white fill-white" />,
                trophy: <Trophy className="w-4 h-4 text-white fill-white" />
              }[item.iconType] || <Sparkles className="w-4 h-4 text-white" />;

              const nodeBg = {
                blue: 'bg-blue-600 ring-blue-200',
                purple: 'bg-purple-600 ring-purple-200',
                amber: 'bg-amber-500 ring-amber-200',
                rose: 'bg-rose-600 ring-rose-200',
                emerald: 'bg-emerald-600 ring-emerald-200'
              }[item.badgeType] || 'bg-blue-600 ring-blue-200';

              return (
                <div
                  key={item.step}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Checkpoint Node Indicator */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ${nodeBg} animate-timeline-node transition-transform duration-300 hover:scale-110`}>
                      {iconNodes}
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase shadow-xs">
                      {item.step}
                    </span>
                  </div>

                  {/* Content Card Side (Half Width on Desktop) */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0">
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-xl aktivitas-card-hover animate-card-fade-up">
                      {/* Top Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${badgeColors}`}>
                          {item.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.tanggal}</span>
                        </span>
                      </div>

                      {/* Step Stage & Title */}
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                        Tahap {item.step} • {item.stageName}
                      </div>
                      <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.deskripsi}
                      </p>

                      {/* Key Highlights */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {item.highlights.map((tag, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Photo Side (Half Width on Desktop) with Adaptive Frame */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0">
                    <div style={getFrameRatioStyle(item.orientation)} className="w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md aktivitas-card-hover animate-card-fade-up">
                      <AdaptiveImageFrame
                        src={item.foto}
                        alt={item.title}
                        orientation={item.orientation}
                        config={photoConfig}
                        className="h-full"
                        onClick={() => setLightboxData({
                          src: item.foto,
                          title: item.title,
                          subtitle: `Tahap ${item.step}: ${item.stageName}`,
                          badge: item.badge,
                          description: item.deskripsi
                        })}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* =========================================================================
          LIGHTBOX MODAL (ADAPTIVE FULL RATIO PREVIEW)
          ========================================================================= */}
      {lightboxData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-lightbox-backdrop"
          onClick={() => setLightboxData(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-lightbox-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxData(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-all border border-white/10"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Container - Fully Preserving Original Ratio */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black flex items-center justify-center">
              <Image
                src={lightboxData.src}
                alt={lightboxData.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            </div>

            {/* Lightbox Caption & Info */}
            <div className="p-5 sm:p-6 bg-slate-900/95 border-t border-slate-800 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {lightboxData.badge && (
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-bold">
                      {lightboxData.badge}
                    </span>
                  )}
                  {lightboxData.subtitle && (
                    <span className="text-xs font-semibold text-slate-400">
                      {lightboxData.subtitle}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Tekan [Esc] untuk menutup
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                {lightboxData.title}
              </h4>

              {lightboxData.description && (
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {lightboxData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORGANISASI DETAIL MODAL
          ========================================================================= */}
      {selectedOrgMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-lightbox-backdrop"
          onClick={() => setSelectedOrgMember(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-lightbox-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Strip */}
            <div className={`h-2.5 w-full ${selectedOrgMember.organisasi === 'MPK' ? 'bg-emerald-500' : 'bg-blue-600'}`} />

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrgMember(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              {/* Photo Frame - Clean Portrait Fit */}
              <div className="relative w-36 h-48 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-md mb-5">
                <Image
                  src={selectedOrgMember.foto}
                  alt={selectedOrgMember.nama}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                  selectedOrgMember.organisasi === 'MPK' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  ● {selectedOrgMember.organisasi}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  {selectedOrgMember.highlightTag}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedOrgMember.nama}
              </h3>

              {/* Official Role */}
              <div className="mt-1 text-sm font-extrabold text-blue-600">
                {selectedOrgMember.jabatan}
              </div>

              {/* School Label */}
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {selectedOrgMember.badgeLabel} • SMK Negeri 1 Ciomas
              </p>

              {/* Role Description */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
                <strong className="block font-bold text-slate-800 mb-1">
                  Kontribusi & Peran:
                </strong>
                {selectedOrgMember.roleDescription}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrgMember(null)}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-md active:scale-95"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
