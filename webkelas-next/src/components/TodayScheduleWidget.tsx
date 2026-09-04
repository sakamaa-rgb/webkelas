'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Sparkles, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';
import { initialJadwalPelajaran, initialJadwalPiket } from '@/data/seedData';
import { JadwalPelajaran, JadwalPiket } from '@/types/database';

export default function TodayScheduleWidget() {
  const [dayName, setDayName] = useState<string>('Senin');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    setDayName(currentDay === 'Sabtu' || currentDay === 'Minggu' ? 'Senin' : currentDay);
    
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(initialJadwalPelajaran);
  const [piketList, setPiketList] = useState<JadwalPiket[]>(initialJadwalPiket);

  useEffect(() => {
    const loadScheduleData = () => {
      const savedJadwal = localStorage.getItem('class_jadwal_pelajaran');
      if (savedJadwal) {
        try {
          const parsed = JSON.parse(savedJadwal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJadwalList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const savedPiket = localStorage.getItem('class_piket_list');
      if (savedPiket) {
        try {
          const parsed = JSON.parse(savedPiket);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPiketList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadScheduleData();
    window.addEventListener('storage', loadScheduleData);
    window.addEventListener('class_jadwal_updated', loadScheduleData);
    window.addEventListener('class_piket_updated', loadScheduleData);
    return () => {
      window.removeEventListener('storage', loadScheduleData);
      window.removeEventListener('class_jadwal_updated', loadScheduleData);
      window.removeEventListener('class_piket_updated', loadScheduleData);
    };
  }, []);

  const todayClasses: JadwalPelajaran[] = jadwalList.filter(
    (j) => j.hari.toLowerCase() === dayName.toLowerCase()
  );

  const todayPiket: JadwalPiket[] = piketList.filter(
    (p) => p.hari.toLowerCase() === dayName.toLowerCase()
  );

  const pj = todayPiket[0]?.pj || '-';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Jadwal Pelajaran Hari Ini */}
      <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Jadwal Pelajaran Hari Ini
                </h3>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {dayName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pukul <strong className="text-blue-600">{currentTime || '--:--'}</strong> WIB
              </p>
            </div>
          </div>

          <Link
            href="/jadwal"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Lihat Semua Hari
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Classes Timeline */}
        <div className="space-y-3">
          {todayClasses.slice(0, 5).map((pelajaran) => {
            const isBreak = pelajaran.mata_pelajaran.toUpperCase().includes('ISTIRAHAT') || pelajaran.mata_pelajaran.toUpperCase().includes('ISHOMA');
            return (
              <div
                key={pelajaran.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isBreak
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-slate-50/60 border-slate-200/80 hover:border-blue-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    {pelajaran.jam_mulai} - {pelajaran.jam_selesai}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {pelajaran.mata_pelajaran}
                    </h4>
                    {!isBreak && pelajaran.guru && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        Pengajar: {pelajaran.guru}
                      </p>
                    )}
                  </div>
                </div>
                {isBreak && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    Istirahat
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Piket Hari Ini */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Piket Kelas Hari Ini
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                PJ: <strong className="text-indigo-600">{pj}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Petugas Bertugas:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {todayPiket.map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {p.nama_siswa}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/jadwal"
          className="mt-6 w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          Lihat Detail Jadwal Piket Lengkap
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
