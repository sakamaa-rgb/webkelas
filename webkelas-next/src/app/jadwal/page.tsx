'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  UserCheck,
  Paintbrush,
  Crown,
  Check,
  Coffee,
  RotateCcw,
  Lock,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { initialJadwalPelajaran, initialJadwalPiket, initialStudents } from '@/data/seedData';
import { Student, JadwalPelajaran, JadwalPiket } from '@/types/database';
import { getJadwalPiket, getJadwalPelajaran, getStudents } from '@/lib/supabase/dataService';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;
type DayType = typeof DAYS[number];

const getWeekKey = () => {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const getWeekNumber = () => {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export default function JadwalPage() {
  const [selectedDay, setSelectedDay] = useState<DayType>('Senin');
  const [activeTab, setActiveTab] = useState<'pelajaran' | 'piket'>('pelajaran');
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(initialJadwalPelajaran);
  const [piketList, setPiketList] = useState<JadwalPiket[]>(initialJadwalPiket);
  const [piketCompleted, setPiketCompleted] = useState<Record<number, boolean>>({});
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number | null>(null);
  const [currentTimeString, setCurrentTimeString] = useState<string>('');
  const [currentDayToday, setCurrentDayToday] = useState<string>('Senin');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  useEffect(() => {
    // Detect admin status
    const checkAdmin = () => {
      const isAdm = typeof window !== 'undefined' && localStorage.getItem('class_web_admin') === 'true';
      setIsAdmin(isAdm);
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);

    // Detect today
    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const nowDay = daysIndo[new Date().getDay()];
    setCurrentDayToday(nowDay);
    if (DAYS.includes(nowDay as any)) {
      setSelectedDay(nowDay as DayType);
    }

    // High-precision 1-second ticker for real-time live tracking
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
      setCurrentTimeString(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' WIB'
      );
      const daysIndoMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setCurrentDayToday(daysIndoMap[now.getDay()]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const loadAllData = () => {
      // Load persisted piket status with weekly auto-reset
      const currentWeek = getWeekKey();
      const savedWeek = localStorage.getItem('class_piket_week');

      if (savedWeek && savedWeek !== currentWeek) {
        // Automatic Reset: New week arrived (e.g. Monday morning)
        localStorage.setItem('class_piket_week', currentWeek);
        localStorage.setItem('class_piket_completed', JSON.stringify({}));
        setPiketCompleted({});
      } else {
        if (!savedWeek) {
          localStorage.setItem('class_piket_week', currentWeek);
        }
        const saved = localStorage.getItem('class_piket_completed');
        if (saved) {
          try {
            setPiketCompleted(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Load persisted piket list
      const savedPiketList = localStorage.getItem('class_piket_list');
      if (savedPiketList) {
        try {
          const parsed = JSON.parse(savedPiketList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPiketList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Load persisted students
      const savedStudents = localStorage.getItem('class_students_list') || localStorage.getItem('class_web_students');
      if (savedStudents) {
        try {
          const parsed = JSON.parse(savedStudents);
          const hasOldNurul = Array.isArray(parsed) && parsed.some((s: Student) => s.id === '031' && s.name.toLowerCase().includes('nurul'));
          if (hasOldNurul) {
            localStorage.setItem('class_students_list', JSON.stringify(initialStudents));
            localStorage.setItem('class_web_students', JSON.stringify(initialStudents));
            setStudentsList(initialStudents);
          } else if (Array.isArray(parsed) && parsed.length > 0) {
            setStudentsList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Load persisted jadwal pelajaran
      const savedJadwal = localStorage.getItem('class_jadwal_pelajaran');
      if (savedJadwal) {
        try {
          const parsed = JSON.parse(savedJadwal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasDhuha = parsed.some((p: any) => p.mata_pelajaran && p.mata_pelajaran.includes('DHUHA'));
            if (hasDhuha) {
              setJadwalList(parsed);
            } else {
              setJadwalList(initialJadwalPelajaran);
              localStorage.setItem('class_jadwal_pelajaran', JSON.stringify(initialJadwalPelajaran));
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadAllData();

    // Live sync from Supabase cloud database
    getJadwalPiket().then((data) => {
      if (data && data.length > 0) {
        setPiketList(data);
        try { localStorage.setItem('class_piket_list', JSON.stringify(data)); } catch (e) {}
      }
    });

    getJadwalPelajaran().then((data) => {
      if (data && data.length > 0) {
        setJadwalList(data);
        try { localStorage.setItem('class_jadwal_pelajaran', JSON.stringify(data)); } catch (e) {}
      }
    });

    getStudents().then((data) => {
      if (data && data.length > 0) {
        setStudentsList(data);
        try {
          localStorage.setItem('class_students_list', JSON.stringify(data));
          localStorage.setItem('class_web_students', JSON.stringify(data));
        } catch (e) {}
      }
    });

    window.addEventListener('storage', loadAllData);
    window.addEventListener('class_jadwal_updated', loadAllData);
    window.addEventListener('class_piket_updated', loadAllData);
    window.addEventListener('class_students_updated', loadAllData);


    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('storage', loadAllData);
      window.removeEventListener('class_jadwal_updated', loadAllData);
      window.removeEventListener('class_piket_updated', loadAllData);
      window.removeEventListener('class_students_updated', loadAllData);
    };
  }, []);

  const parseTimeToMinutes = (timeStr: string) => {
    const cleaned = timeStr.replace(':', '.');
    const [h, m] = cleaned.split('.').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const getSubjectCategory = (mapel: string) => {
    const m = mapel.toUpperCase();
    if (m.includes('UPACARA')) {
      return { label: 'Upacara Bendera', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (m.includes('PULANG')) {
      return { label: 'Pulang Sekolah', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    if (m.includes('DHUHA')) {
      return { label: 'Sholat Dhuha', color: 'bg-teal-100 text-teal-800 border-teal-200' };
    }
    if (m.includes('KOKURIKULER')) {
      return { label: 'Kokurikuler (3 Minggu)', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    if (m.includes('LITERASI') || m.includes('APEL') || m.includes('SENAM')) {
      return { label: 'Pembiasaan', color: 'bg-sky-100 text-sky-800 border-sky-200' };
    }
    if (m.includes('ISTIRAHAT') || m.includes('ISHOMA') || m.includes('SHOLJUM') || m.includes('SHOLAT')) {
      return { label: 'Istirahat', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    if (m.includes('PPLG') || m.includes('PRODUKTIF') || m.includes('BISNIS DIGITAL') || m.includes('KIK')) {
      return { label: 'Produktif', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
    }
    if (m.includes('MATEMATIKA')) {
      return { label: 'Eksak', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    if (m.includes('INGGRIS') || m.includes('INDONESIA')) {
      return { label: 'Bahasa', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    if (m.includes('PAI')) {
      return { label: 'Agama', color: 'bg-teal-100 text-teal-700 border-teal-200' };
    }
    if (m.includes('PJOK')) {
      return { label: 'Olahraga', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    }
    return { label: 'Umum', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const togglePiket = (id: number) => {
    // Restrict checking to Admin only
    if (!isAdmin) {
      setShowAdminNotice(true);
      return;
    }

    const currentWeek = getWeekKey();
    setPiketCompleted((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('class_piket_completed', JSON.stringify(updated));
        localStorage.setItem('class_piket_week', currentWeek);
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const getStudentPhotoByName = (name: string) => {
    const norm = name.trim().toLowerCase();
    const nicknameMap: Record<string, string> = {
      'nurul': '045',
      'm. aditya': '019',
      'aditya': '019',
      'raffi udin': '033',
      'raffi': '033',
      'rizky': '039',
      'alif': '021',
      'niko': '030',
      'salwa': '042',
      'ainun': '041',
      'salsa': '040',
      'refan': '026',
      'revand': '038',
      'candra': '022',
      'noval': '024',
      'hafiyz': '023',
      'rajib': '025',
      'anzas': '020',
      'dema': '010',
      'davin': '009',
      'bramantyo': '007',
      'bagus': '006',
      'faris': '012',
      'habib': '013',
      'ilham': '014',
      'intan': '015',
      'khaira': '016',
      'lulu': '017',
      'maisi': '018',
      'mutia': '027',
      'nadine': '028',
      'nazhril': '029',
      'nursyifa': '031',
      'oktavia': '032',
      'rafli': '034',
      'ranty': '035',
      'reisya': '036',
      'restu': '037',
      'taruna': '044',
      'azzam': '043',
      'crisna': '008',
      'asyifa': '005',
      'andini': '004',
      'alivia': '003',
      'aisyah': '002',
      'abyan': '001',
      'faneza': '011',
    };

    const directId = nicknameMap[norm];
    if (directId) {
      const s = studentsList.find((st) => st.id === directId || Number(st.id) === Number(directId));
      if (s && s.photo) return s.photo;
    }

    const student = studentsList.find((s) => {
      const sNorm = s.name.toLowerCase();
      return sNorm === norm || sNorm.includes(norm);
    });
    return student?.photo || '/assets/uploads/students/student_001_1778723200.png';
  };

  const filteredPelajaran = jadwalList
    .filter((j) => j.hari === selectedDay)
    .sort((a, b) => {
      const timeA = parseTimeToMinutes(a.jam_mulai) ?? a.urutan * 100;
      const timeB = parseTimeToMinutes(b.jam_mulai) ?? b.urutan * 100;
      return timeA - timeB;
    });
  const filteredPiket = piketList.filter((p) => p.hari === selectedDay);
  const pj = filteredPiket[0]?.pj || '-';
  const completedCount = filteredPiket.filter((p) => piketCompleted[p.id]).length;
  const percentComplete = filteredPiket.length > 0 ? Math.round((completedCount / filteredPiket.length) * 100) : 0;
  
  const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayActual = daysIndo[new Date().getDay()];
  const isToday = todayActual === selectedDay;

  // Realtime session calculations for selected day
  const activeSession = isToday
    ? filteredPelajaran.find((j) => {
        const s = parseTimeToMinutes(j.jam_mulai);
        const e = parseTimeToMinutes(j.jam_selesai);
        return s !== null && e !== null && currentTimeMinutes !== null && currentTimeMinutes >= s && currentTimeMinutes < e;
      })
    : null;

  const nextSession = isToday
    ? filteredPelajaran.find((j) => {
        const s = parseTimeToMinutes(j.jam_mulai);
        return s !== null && currentTimeMinutes !== null && s > currentTimeMinutes;
      })
    : null;

  const firstSession = filteredPelajaran[0];
  const lastSession = filteredPelajaran[filteredPelajaran.length - 1];
  const firstStartMin = firstSession ? parseTimeToMinutes(firstSession.jam_mulai) : null;
  const lastEndMin = lastSession ? parseTimeToMinutes(lastSession.jam_selesai) : null;

  const isBeforeSchool = isToday && firstStartMin !== null && currentTimeMinutes !== null && currentTimeMinutes < firstStartMin;
  const isAfterSchool = isToday && lastEndMin !== null && currentTimeMinutes !== null && currentTimeMinutes >= lastEndMin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda Mingguan</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Jadwal Pelajaran &{' '}
          <span className="text-blue-600">
            Piket Kelas
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500">
          Susunan kegiatan belajar mengajar dan jadwal piket kebersihan kelas XI PPLG 3.
        </p>
      </div>

      {/* Main Tab Switcher (Pelajaran vs Piket) */}
      <div className="flex justify-center mb-8">
        <div className="p-1 sm:p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex gap-1 shadow-inner max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('pelajaran')}
            className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeTab === 'pelajaran'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jadwal Pelajaran</span>
          </button>
          <button
            onClick={() => setActiveTab('piket')}
            className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeTab === 'piket'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <Paintbrush className="w-4 h-4 animate-sweep-broom text-amber-300" />
            <span>Jadwal Piket</span>
          </button>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-10 px-2">
        {DAYS.map((day) => {
          const isCurrentToday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()] === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span>{day}</span>
              {isCurrentToday && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                  selectedDay === day ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  HARI INI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      {activeTab === 'pelajaran' ? (
        /* JADWAL PELAJARAN */
        <div className="max-w-3xl mx-auto space-y-4">
          {/* REAL-TIME LIVE TRACKER HERO BANNER */}
          {isToday ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-blue-500/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Top Row: Live Clock & Current Status Badge */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Clock className="w-6 h-6 animate-pulse text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                        Live Tracker Jadwal Hari Ini
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
                      <span className="font-mono tracking-tight">{currentTimeString || '--:--:-- WIB'}</span>
                      <span className="text-xs font-semibold text-slate-400">({selectedDay})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeSession ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Sedang Berlangsung</span>
                    </span>
                  ) : isBeforeSchool ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <span>Belum Masuk Sekolah</span>
                    </span>
                  ) : isAfterSchool ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                      <span>Sudah Pulang Sekolah</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold">
                      <span>Di Luar Jam Sesi</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: Active Session Details & Countdown Bar */}
              <div className="relative z-10 mt-4 pt-1">
                {activeSession ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-300 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-blue-400 font-semibold">Sesi Aktif:</span>
                        <span className="text-base sm:text-lg font-black text-white">{activeSession.mata_pelajaran}</span>
                        <span className="text-slate-400 font-mono">({activeSession.jam_mulai} - {activeSession.jam_selesai})</span>
                      </div>
                      <span className="font-mono text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40 text-[11px] self-start sm:self-auto">
                        Sisa {Math.max(0, (parseTimeToMinutes(activeSession.jam_selesai) || 0) - (currentTimeMinutes || 0))} Menit Lagi
                      </span>
                    </div>

                    {/* Progress Bar for Current Lesson */}
                    {(() => {
                      const s = parseTimeToMinutes(activeSession.jam_mulai) || 0;
                      const e = parseTimeToMinutes(activeSession.jam_selesai) || 0;
                      const now = currentTimeMinutes || 0;
                      const pct = Math.min(100, Math.max(0, Math.round(((now - s) / (e - s)) * 100)));
                      return (
                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 ease-out rounded-full shadow-xs"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      );
                    })()}

                    {/* Next Session Preview */}
                    {nextSession && (
                      <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                        <span className="text-blue-300 font-semibold">Berikutnya:</span>
                        <strong className="text-slate-200">{nextSession.mata_pelajaran}</strong>
                        <span className="font-mono">({nextSession.jam_mulai} - {nextSession.jam_selesai})</span>
                        {nextSession.guru && nextSession.guru !== '-' && (
                          <span className="text-slate-400">• Pengajar: {nextSession.guru}</span>
                        )}
                      </p>
                    )}
                  </div>
                ) : isBeforeSchool && firstSession ? (
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-white flex items-center gap-2">
                      <span>Kegiatan belajar hari {selectedDay} akan dimulai pukul</span>
                      <span className="text-emerald-400 font-mono text-sm">{firstSession.jam_mulai} WIB</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Sesi pertama: <strong className="text-slate-200">{firstSession.mata_pelajaran}</strong> ({firstSession.guru})
                    </p>
                  </div>
                ) : isAfterSchool ? (
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-white">
                      Seluruh rangkaian mata pelajaran hari {selectedDay} telah selesai dikerjakan.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Siswa sudah pulang sekolah. Sampai jumpa di kegiatan belajar mengajar berikutnya!
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* Day Switch Notice when inspecting another day */
            <div className="mb-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  Sedang melihat jadwal hari <strong>{selectedDay}</strong>. Hari ini adalah <strong>{currentDayToday}</strong> ({currentTimeString || ''}).
                </span>
              </div>
              {DAYS.includes(currentDayToday as any) && (
                <button
                  type="button"
                  onClick={() => setSelectedDay(currentDayToday as DayType)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex-shrink-0 cursor-pointer shadow-xs"
                >
                  Lompat ke Jadwal Hari Ini
                </button>
              )}
            </div>
          )}

          {/* Schedule List Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 mb-4">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Susunan Jadwal Hari {selectedDay}
            </span>
            <span className="font-mono">{filteredPelajaran.length} Sesi Terjadwal</span>
          </div>

          {/* Schedule Items List */}
          {filteredPelajaran.map((item) => {
            const isDhuha = item.mata_pelajaran.toUpperCase().includes('DHUHA');
            const isKokurikuler = item.mata_pelajaran.toUpperCase().includes('KOKURIKULER');
            const isBreak =
              !isDhuha &&
              (item.mata_pelajaran.toUpperCase().includes('ISTIRAHAT') ||
              item.mata_pelajaran.toUpperCase().includes('ISHOMA') ||
              item.mata_pelajaran.toUpperCase().includes('SHOLJUM'));
            const isCeremony = item.mata_pelajaran.toUpperCase().includes('UPACARA');
            const isPulang = item.mata_pelajaran.toUpperCase().includes('PULANG');

            const category = getSubjectCategory(item.mata_pelajaran);
            const startMin = parseTimeToMinutes(item.jam_mulai);
            const endMin = parseTimeToMinutes(item.jam_selesai);

            const isOngoing =
              isToday &&
              currentTimeMinutes !== null &&
              startMin !== null &&
              endMin !== null &&
              currentTimeMinutes >= startMin &&
              currentTimeMinutes < endMin;

            const isCompleted =
              isToday &&
              currentTimeMinutes !== null &&
              endMin !== null &&
              currentTimeMinutes >= endMin;

            const isNext =
              isToday &&
              !isOngoing &&
              !isCompleted &&
              nextSession?.id === item.id;

            const remainingMin = (endMin && currentTimeMinutes) ? Math.max(0, endMin - currentTimeMinutes) : 0;
            const itemProgress = (startMin && endMin && currentTimeMinutes && isOngoing)
              ? Math.min(100, Math.max(0, Math.round(((currentTimeMinutes - startMin) / (endMin - startMin)) * 100)))
              : 0;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 relative overflow-hidden group ${
                  isOngoing
                    ? 'ring-2 ring-blue-500 border-blue-400 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/40 shadow-lg shadow-blue-500/15'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200 text-slate-500 opacity-80'
                    : isNext
                    ? 'bg-white border-blue-300 ring-1 ring-blue-200 shadow-sm'
                    : isCeremony
                    ? 'bg-rose-50/60 border-rose-200 text-rose-950 shadow-xs'
                    : isPulang
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 shadow-xs'
                    : isDhuha
                    ? 'bg-teal-50/60 border-teal-200 text-teal-950 shadow-xs'
                    : isKokurikuler
                    ? 'bg-purple-50/60 border-purple-200 text-purple-950 shadow-xs'
                    : isBreak
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md shadow-xs'
                }`}
              >
                {/* Left side: Urutan & Subject Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 sm:mt-0 ${
                      isOngoing
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : isCompleted
                        ? 'bg-slate-200 text-slate-500'
                        : isCeremony
                        ? 'bg-rose-600 text-white'
                        : isPulang
                        ? 'bg-emerald-600 text-white'
                        : isDhuha
                        ? 'bg-teal-600 text-white shadow-sm'
                        : isKokurikuler
                        ? 'bg-purple-600 text-white shadow-sm'
                        : isBreak
                        ? 'bg-amber-200/80 text-amber-900'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    #{item.urutan}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-base sm:text-lg font-black tracking-tight leading-tight ${isCompleted ? 'text-slate-600' : 'text-slate-900'}`}>
                        {item.mata_pelajaran}
                      </h3>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${category.color}`}
                      >
                        {category.label}
                      </span>

                      {/* Real-time Status Badges */}
                      {isOngoing && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white flex items-center gap-1.5 animate-live-pulse shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          SEDANG BERLANGSUNG • SISA {remainingMin} MNT
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          SELESAI
                        </span>
                      )}

                      {isNext && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          BERIKUTNYA
                        </span>
                      )}
                    </div>

                    {isDhuha ? (
                      <p className="text-xs text-teal-700 flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>Pembiasaan Ibadah Pagi: Sholat Dhuha Berjamaah & Doa Bersama</span>
                      </p>
                    ) : isKokurikuler ? (
                      <div className="space-y-1.5">
                        <p className="text-xs text-purple-700 flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          <span>Kegiatan Bergilir Setiap 3 Minggu Sekali:</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-purple-200 text-[11px] font-semibold text-purple-800 shadow-2xs">
                            <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[9px] flex items-center justify-center font-bold">1</span>
                            🏃 Olahraga
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-purple-200 text-[11px] font-semibold text-purple-800 shadow-2xs">
                            <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[9px] flex items-center justify-center font-bold">2</span>
                            🥗 Sarapan Sehat
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/90 border border-purple-200 text-[11px] font-semibold text-purple-800 shadow-2xs">
                            <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[9px] flex items-center justify-center font-bold">3</span>
                            🧹 Bersih-Bersih
                          </span>
                        </div>
                      </div>
                    ) : !isBreak && item.guru && item.guru !== '-' ? (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        Pengajar: <strong className="text-slate-800 font-semibold">{item.guru}</strong>
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                        <Coffee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>Sesi Istirahat & Relaksasi</span>
                      </p>
                    )}

                    {/* Real-time micro progress bar inside active card */}
                    {isOngoing && (
                      <div className="w-full max-w-md h-1.5 bg-blue-100 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${itemProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Time Pill */}
                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                  <span
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 ${
                      isOngoing
                        ? 'bg-blue-100/90 border border-blue-300 text-blue-800 shadow-2xs'
                        : isCompleted
                        ? 'bg-slate-100 border border-slate-200 text-slate-500'
                        : isBreak
                        ? 'bg-amber-100 border border-amber-200 text-amber-800'
                        : 'bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.jam_mulai} - {item.jam_selesai}</span>
                  </span>

                  {isBreak && (
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-200/70 border border-amber-300 text-amber-900">
                      Istirahat
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* JADWAL PIKET */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* PJ Banner with Progress and Animations */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Paintbrush className="w-7 h-7 animate-sweep-broom text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Penanggung Jawab Hari {selectedDay}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-[10px] animate-pulse">
                        HARI INI
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span>{pj}</span>
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isAdmin ? (
                  <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Akses Admin Aktif</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white/10 text-blue-200 border border-white/15 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-300" />
                    <span>Mode Lihat (Khusus Admin Centang)</span>
                  </span>
                )}
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white/10 backdrop-blur-md text-blue-200 border border-white/15 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
                  <span>Siklus Minggu ke-{getWeekNumber()}</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
                  {filteredPiket.length} Petugas Kebersihan
                </span>
              </div>
            </div>

            {/* Daily Cleaning Progress Bar */}
            <div className="mt-6 pt-5 border-t border-white/15">
              <div className="flex justify-between items-center text-xs font-bold text-white/90 mb-2">
                <span>Progress Kebersihan Hari {selectedDay}:</span>
                <span className="font-mono bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
                  {completedCount}/{filteredPiket.length} Selesai ({percentComplete}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-emerald-400 transition-all duration-700 ease-out rounded-full shadow-sm"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>

              <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-white/70">
                <span className="flex items-center gap-1.5">
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Mode Admin: Anda dapat mencentang tugas piket yang telah selesai dikerjakan.</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-blue-300" />
                      <span>Hanya Admin yang berhak mencentang tugas piket. Pengunjung/siswa berstatus View-Only.</span>
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <RotateCcw className="w-3 h-3" />
                  <span>Auto-reset setiap hari Senin</span>
                </span>
              </div>
            </div>
          </div>

          {/* List of piket students with real avatars & interactive checkmark */}
          {/* Mobile: 2-col grid with vertical portrait cards. Desktop: 3-col horizontal cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {filteredPiket.map((piket) => {
              const isDone = !!piketCompleted[piket.id];
              const photoUrl = getStudentPhotoByName(piket.nama_siswa);

              return (
                <div
                  key={piket.id}
                  onClick={() => togglePiket(piket.id)}
                  className={`rounded-2xl border transition-all duration-200 shadow-xs select-none overflow-hidden ${
                    isAdmin
                      ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
                      : 'cursor-pointer hover:border-slate-300'
                  } ${
                    isDone
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  title={
                    isAdmin
                      ? `Klik untuk ${isDone ? 'batalkan' : 'centang'} tugas piket`
                      : 'Hanya Admin yang dapat mencentang tugas piket'
                  }
                >
                  {/* Portrait Photo - full width, 4:5 aspect ratio */}
                  <div className="relative w-full aspect-[4/5] bg-slate-100">
                    <Image
                      src={photoUrl}
                      alt={piket.nama_siswa}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top"
                    />
                    {/* Overlay gradient + done badge */}
                    {isDone && (
                      <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                          <Check className="w-7 h-7 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-2.5 flex items-center justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-bold truncate leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {piket.nama_siswa}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        #{piket.urutan}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={`Status piket ${piket.nama_siswa}`}
                      className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isAdmin
                          ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          : 'bg-slate-100/80 text-slate-300'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Dialog: Notice when non-admin tries to check */}
      {showAdminNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 text-center relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowAdminNotice(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
              Akses Khusus Admin
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              Hanya akun <strong className="text-slate-800 font-bold">Admin Kelas</strong> yang memiliki hak akses untuk menandai atau mencentang tugas piket kebersihan. Pengunjung dan siswa berstatus <em>View-Only</em> (hanya melihat).
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/admin/login"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Login Sebagai Admin
              </Link>
              <button
                type="button"
                onClick={() => setShowAdminNotice(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
