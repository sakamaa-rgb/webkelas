'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Wifi, ShieldCheck, Activity } from 'lucide-react';

export default function AdminLiveClock() {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* Live Pulsing Beacon */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold tracking-wider">LIVE SYSTEM</span>
      </div>

      {/* Latency Indicator */}
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
        <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
        <span className="text-[11px] font-semibold">14ms Latency</span>
      </div>

      {/* Digital Real-Time Clock */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white font-mono shadow-xs border border-slate-800">
        <Clock className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-bold tracking-wider">{time || '--:--:--'} WIB</span>
        {dateStr && (
          <span className="hidden md:inline text-slate-400 text-[11px] font-sans border-l border-slate-700 pl-2 ml-1 font-medium">
            {dateStr}
          </span>
        )}
      </div>
    </div>
  );
}
