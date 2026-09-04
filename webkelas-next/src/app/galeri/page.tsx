'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  X, 
  Calendar, 
  Maximize2,
  Film,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Columns3,
  SlidersHorizontal,
  Expand
} from 'lucide-react';
import { initialGallery, initialVideos } from '@/data/seedData';
import { GalleryItem, VideoKelas } from '@/types/database';

export default function GaleriPage() {
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoKelas | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [videosList, setVideosList] = useState<VideoKelas[]>(initialVideos);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(initialGallery);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');

  React.useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  React.useEffect(() => {
    const loadMediaData = () => {
      const savedVideos = localStorage.getItem('class_videos_list');
      if (savedVideos) {
        try {
          const parsed = JSON.parse(savedVideos);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideosList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const savedGallery = localStorage.getItem('class_gallery_list');
      if (savedGallery) {
        try {
          const parsed = JSON.parse(savedGallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadMediaData();
    window.addEventListener('storage', loadMediaData);
    window.addEventListener('class_gallery_updated', loadMediaData);
    window.addEventListener('class_videos_updated', loadMediaData);
    return () => {
      window.removeEventListener('storage', loadMediaData);
      window.removeEventListener('class_gallery_updated', loadMediaData);
      window.removeEventListener('class_videos_updated', loadMediaData);
    };
  }, []);

  const categories = ['Semua', 'Upacara', 'Acara', 'Peringatan', 'Kebersamaan', 'Prestasi', 'Sosial'];

  const filteredPhotos = galleryList.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-3">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Dokumentasi Visual</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Galeri Foto &{' '}
          <span className="text-blue-600">
            Video Kegiatan
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500">
          Abadikan setiap tawa, kerja keras, dan prestasi bersama keluarga besar XI PPLG 3.
        </p>
      </div>

      {/* Tab Switcher: Foto vs Video */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('foto')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'foto'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Galeri Foto ({initialGallery.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <Video className="w-4 h-4" />
            Video Dokumentasi ({videosList.length})
          </button>
        </div>
      </div>

      {/* PHOTO SECTION */}
      {activeTab === 'foto' ? (
        <div>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls Bar: Counter & Layout View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:px-4">
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{filteredPhotos.length}</span> dokumentasi foto
              {selectedCategory !== 'Semua' && (
                <span className="ml-1 text-blue-600 font-semibold">({selectedCategory})</span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Fit Option (only in Grid mode) */}
              {viewMode === 'grid' && (
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setImageFit('cover')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      imageFit === 'cover'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                    title="Penuh - Foto memenuhi kotak tanpa bar hitam"
                  >
                    Penuh (Cover)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageFit('contain')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      imageFit === 'contain'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                    title="Utuh - Seluruh foto tampil tanpa crop"
                  >
                    Utuh (Fit)
                  </button>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  title="Grid Seragam (4:3)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid Rapi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('masonry')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'masonry'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  title="Masonry - Ukuran asli tanpa terpotong"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sesuai Asli</span>
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Display */}
          {viewMode === 'masonry' ? (
            /* Masonry Mode: Natural Aspect Ratio without any cropping */
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="break-inside-avoid group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col mb-6"
                >
                  <div className="relative w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 block"
                      loading="lazy"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 z-20 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-2.5 rounded-full bg-white/95 text-blue-600 shadow-lg backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 inline-block mb-1.5">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.caption}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid Mode: 4:3 Proportionate Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Photo Frame 4:3 */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {imageFit === 'contain' ? (
                      <>
                        {/* Soft Ambient Backdrop */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover blur-xl scale-125 opacity-60"
                            aria-hidden="true"
                          />
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                        </div>
                        <div className="relative z-10 w-full h-full p-2 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.caption}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain drop-shadow-sm group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 z-20 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-2.5 rounded-full bg-white/95 text-blue-600 shadow-lg backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 inline-block mb-1.5">
                        {item.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.caption}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIDEO SECTION */
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Cinema Banner Mini */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 shadow-xl border border-purple-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Film className="w-6 h-6 animate-film-reel" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Bioskop & Rekaman Kelas XI PPLG 3
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Tonton kilas balik momen berharga dan kegiatan siswa dalam format video sinematik.
                </p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-purple-200 border border-white/15 flex items-center gap-1.5 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{videosList.length} Video Arsip</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videosList.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="cursor-pointer group rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 mb-3.5">
                    <Image
                      src={video.thumbnail || '/assets/uploads/logo/logo_1787282041.jpeg'}
                      alt={video.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Top Pill Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-purple-300 border border-purple-400/30 flex items-center gap-1">
                        <Film className="w-2.5 h-2.5 text-purple-400" />
                        <span>Dokumentasi</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-black/60 backdrop-blur-md text-white/90 border border-white/20">
                        MP4 HD
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-center justify-center group-hover:from-black/60 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform animate-play-pulse">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-purple-600 font-bold mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{video.tanggal || 'Arsip Kelas'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
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
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (() => {
        const photoIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
        const handlePrev = () => {
          const nextIndex = photoIndex > 0 ? photoIndex - 1 : filteredPhotos.length - 1;
          setSelectedPhoto(filteredPhotos[nextIndex]);
        };
        const handleNext = () => {
          const nextIndex = photoIndex < filteredPhotos.length - 1 ? photoIndex + 1 : 0;
          setSelectedPhoto(filteredPhotos[nextIndex]);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative max-w-4xl w-full rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden text-white flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600/90 text-white border border-blue-400/30">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Foto {photoIndex + 1} dari {filteredPhotos.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image with Prev/Next Floating Buttons */}
              <div className="relative h-[60vh] sm:h-[72vh] max-h-[720px] w-full rounded-2xl overflow-hidden bg-slate-950/90 mb-4 flex items-center justify-center">
                {/* Ambient blurred backdrop */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src={selectedPhoto.image}
                    alt=""
                    fill
                    className="object-cover blur-3xl scale-125 opacity-35 brightness-75"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
                </div>

                <Image
                  src={selectedPhoto.image}
                  alt={selectedPhoto.caption}
                  fill
                  className="object-contain relative z-10 drop-shadow-2xl"
                  priority
                />

                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-black/60 hover:bg-blue-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
                      title="Foto Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-black/60 hover:bg-blue-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
                      title="Foto Berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Caption Bar */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <h3 className="font-bold text-slate-200">
                  {selectedPhoto.caption}
                </h3>
                <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
                  Gunakan tombol panah untuk navigasi
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Video Player Cinema Lightbox Modal */}
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
