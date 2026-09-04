'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Video, 
  Play, 
  X, 
  Calendar, 
  Film, 
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { initialVideos } from '@/data/seedData';
import { VideoKelas } from '@/types/database';
import { useClassProfile } from '@/context/ClassProfileContext';
import { getVideos } from '@/lib/supabase/dataService';

export default function VideoPage() {
  const { profile } = useClassProfile();
  const [videosList, setVideosList] = useState<VideoKelas[]>(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState<VideoKelas | null>(null);

  useEffect(() => {
    const loadVideos = () => {
      const savedVideos = localStorage.getItem('class_videos_list');
      if (savedVideos) {
        try {
          const parsed = JSON.parse(savedVideos);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideosList(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setVideosList(initialVideos);
    };

    loadVideos();

    // Live sync from Supabase cloud database
    getVideos().then((data) => {
      if (data && data.length > 0) {
        setVideosList(data);
        try { localStorage.setItem('class_videos_list', JSON.stringify(data)); } catch (e) {}
      }
    });

    window.addEventListener('storage', loadVideos);
    window.addEventListener('class_videos_updated', loadVideos);
    return () => {
      window.removeEventListener('storage', loadVideos);
      window.removeEventListener('class_videos_updated', loadVideos);
    };
  }, []);


  const featuredVideo = videosList[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* 1. Cinema Theatre Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0d30] via-[#0d1226] to-[#120a22] text-white p-6 sm:p-10 shadow-2xl border border-purple-900/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-cinema-beam" />
        <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold backdrop-blur-xs">
              <Film className="w-3.5 h-3.5 text-purple-400 animate-film-reel" />
              <span>Cinema & Dokumentasi Resmi {profile.className || 'XI PPLG 3'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Galeri Video <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Dokumentasi</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Rekaman sinematik berbagai kegiatan, lomba dekorasi kelas, aksi kebersamaan, dan dinamika pembelajaran siswa {profile.className || 'XI PPLG 3'} {profile.schoolName || 'SMK'}.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Video className="w-3.5 h-3.5 text-purple-300" />
                <span>{videosList.length} Video Arsip</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-amber-300 font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>High Definition 1080p</span>
              </span>
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 border border-purple-400/30 flex-shrink-0 self-start md:self-center">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 animate-film-reel" />
          </div>
        </div>
      </div>

      {/* 2. Featured Video Spotlight (if available) */}
      {featuredVideo && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Sorotan Video Terbaru</span>
          </div>

          <div 
            onClick={() => setSelectedVideo(featuredVideo)}
            className="cursor-pointer group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl hover:border-purple-500/50 transition-all duration-500"
          >
            <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden">
              <Image
                src={featuredVideo.thumbnail || '/assets/uploads/logo/logo_1787282041.jpeg'}
                alt={featuredVideo.judul}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
              />

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Play button center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/60 group-hover:scale-110 transition-transform animate-play-pulse">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featuredVideo.tanggal || 'Arsip Resmi'}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                  {featuredVideo.judul}
                </h2>
                {featuredVideo.deskripsi && (
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl leading-relaxed">
                    {featuredVideo.deskripsi}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. All Videos Collection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-600" />
            <span>Semua Rekaman Dokumentasi ({videosList.length})</span>
          </h2>

          <Link
            href="/galeri"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>Lihat Galeri Foto</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosList.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer group rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-950 bg-slate-950 mb-3.5">
                  <Image
                    src={video.thumbnail || '/assets/uploads/logo/logo_1787282041.jpeg'}
                    alt={video.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Top badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-purple-300 border border-purple-400/30 flex items-center gap-1">
                      <Film className="w-2.5 h-2.5 text-purple-400" />
                      <span>Dokumentasi</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-black/60 backdrop-blur-md text-white/90 border border-white/20">
                      MP4 HD
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-center justify-center group-hover:from-black/60 transition-colors">
                    <div className="w-13 h-13 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform animate-play-pulse">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-purple-600 font-bold mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{video.tanggal || 'Arsip Kelas'}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {video.judul}
                </h3>

                {video.deskripsi && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {video.deskripsi}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-current" /> Putar Video
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Klik untuk menonton</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Cinema Lightbox Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full rounded-3xl bg-slate-900 border border-purple-500/30 p-4 sm:p-6 shadow-2xl overflow-hidden text-white">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Film className="w-4 h-4 animate-film-reel" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                    {selectedVideo.judul}
                  </h3>
                  {selectedVideo.tanggal && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{selectedVideo.tanggal}</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800 mb-4">
              <video
                src={selectedVideo.url_video}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {selectedVideo.deskripsi && (
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
                {selectedVideo.deskripsi}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
