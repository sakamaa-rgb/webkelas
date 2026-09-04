'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2, 
  VolumeX, 
  Music2, 
  Sliders, 
  X, 
  Check, 
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { useMusic } from '@/context/MusicContext';

export default function MusicPlayer() {
  const {
    songs,
    currentIndex,
    currentSong,
    isPlaying,
    volume,
    isMuted,
    isMinimized,
    showControls,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrevious,
    selectSong,
    setVolume,
    toggleMute,
    toggleMinimize,
    setShowControls,
    seek
  } = useMusic();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* 1. MINIMIZED STATE: Floating Circular Music Disc */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => toggleMinimize(false)}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl shadow-blue-500/25 border border-slate-100 p-1 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none animate-in zoom-in-75 duration-200"
          title={isPlaying ? `Sedang Memutar: ${currentSong?.judul} (Klik untuk perbesar)` : 'Buka Pemutar Musik'}
          aria-label="Buka Pemutar Musik"
        >
          {/* Subtle pulse ring when music is actively playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-blue-500/25 animate-ping pointer-events-none opacity-60" />
          )}

          {/* Inner Disc / Cover Art */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 transition-transform group-hover:scale-105 overflow-hidden relative">
            {currentSong?.cover ? (
              <>
                <img
                  src={currentSong.cover}
                  alt={currentSong.judul}
                  className={`w-full h-full object-cover rounded-full ${
                    isPlaying ? 'animate-vinyl-spin' : ''
                  }`}
                />
                {/* Vinyl Center Hole */}
                <div className="absolute inset-0 m-auto w-3 h-3 bg-slate-900 rounded-full border-2 border-white/80 pointer-events-none" />
              </>
            ) : (
              <Music2
                className={`w-5 h-5 sm:w-6 sm:h-6 text-white ${
                  isPlaying ? 'animate-vinyl-spin' : ''
                }`}
              />
            )}
          </div>

          {/* Mini animated soundwave badge when playing */}
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 bg-blue-700 text-white rounded-full px-1.5 py-1 border-2 border-white shadow-xs z-10">
              <span className="w-0.5 bg-white rounded-full animate-soundwave-1" style={{ height: '6px' }} />
              <span className="w-0.5 bg-white rounded-full animate-soundwave-2" style={{ height: '10px' }} />
              <span className="w-0.5 bg-white rounded-full animate-soundwave-3" style={{ height: '7px' }} />
            </div>
          )}
        </button>
      ) : (
        /* 2. EXPANDED STATE: Full Pill Player */
        <div className="relative animate-pill-entrance">
          {/* Optional Expanded Drawer for Volume & Playlist */}
          {showControls && (
            <div className="absolute bottom-16 right-0 mb-2 w-72 sm:w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-4 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pengaturan Musik & Playlist</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowControls(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Control Slider */}
              <div className="flex items-center gap-2.5 px-2 py-2 mb-3 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] font-mono text-slate-500 w-8 text-right font-medium">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* Progress Seek Bar */}
              {duration > 0 && (
                <div className="px-2 py-1 mb-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.5"
                    value={currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {/* Playlist Tracks List */}
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Daftar Lagu ({songs.length})
                </div>
                {songs.map((song, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => selectSong(idx)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-2xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-600 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/80">
                          {song.cover ? (
                            <img
                              src={song.cover}
                              alt={song.judul}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                              <Music2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="truncate min-w-0 flex-1">
                          <div className="truncate text-xs">{song.judul}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {song.artis}
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Main Pill Component */}
          <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-900/10 text-slate-800 transition-all hover:shadow-2xl">
            {/* 1. Mini Vinyl / Disc Icon with Album Cover */}
            <div 
              onClick={togglePlay}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 flex-shrink-0 cursor-pointer overflow-hidden group border border-white/40"
              title={isPlaying ? 'Jeda Lagu' : 'Putar Lagu'}
            >
              {currentSong?.cover ? (
                <>
                  <img
                    src={currentSong.cover}
                    alt={currentSong.judul}
                    className={`w-full h-full object-cover rounded-full ${
                      isPlaying ? 'animate-vinyl-spin' : 'group-hover:scale-110'
                    }`}
                  />
                  <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-slate-900 rounded-full border border-white/90 pointer-events-none" />
                </>
              ) : (
                <Music2
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                    isPlaying ? 'animate-vinyl-spin' : 'group-hover:scale-110'
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-black/10 rounded-full pointer-events-none" />
            </div>

            {/* 2. Song Info Marquee (Truncated on mobile for clean fit) */}
            <div 
              onClick={() => setShowControls((prev) => !prev)}
              className="w-28 sm:w-36 overflow-hidden cursor-pointer px-1 text-left"
              title="Klik untuk buka playlist"
            >
              <div
                className={`text-xs font-bold text-slate-900 leading-tight ${
                  isPlaying ? 'animate-music-marquee' : 'truncate'
                }`}
              >
                <span>{currentSong?.judul}</span>
                {isPlaying && (
                  <span className="mx-2 text-slate-300">•</span>
                )}
                {isPlaying && (
                  <span>{currentSong?.judul}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate font-medium">
                {currentSong?.artis}
              </p>
            </div>

            {/* 3. Play / Pause Action Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-blue-600" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-blue-600 ml-0.5" />
              )}
            </button>

            {/* 4. Next Track Button */}
            <button
              type="button"
              onClick={playNext}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              title="Lagu Berikutnya"
              aria-label="Lagu Berikutnya"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* 5. Controls Popover Toggle Button */}
            <button
              type="button"
              onClick={() => setShowControls((prev) => !prev)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                showControls
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
              title="Pengaturan Volume & Playlist"
              aria-label="Pengaturan Volume & Playlist"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* 6. Minimize Button */}
            <button
              type="button"
              onClick={() => toggleMinimize(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Perkecil ke tombol melayang"
              aria-label="Perkecil ke tombol melayang"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
