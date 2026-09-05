'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { initialPlaylist } from '@/data/seedData';
import { Song } from '@/types/database';
import { getPlaylist } from '@/lib/supabase/dataService';

interface MusicContextType {
  songs: Song[];
  currentIndex: number;
  currentSong: Song;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isMinimized: boolean;
  showControls: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  selectSong: (index: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleMinimize: (value?: boolean) => void;
  setShowControls: (show: boolean | ((prev: boolean) => boolean)) => void;
  seek: (seconds: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with localStorage playlist & Supabase cloud database
  useEffect(() => {
    const loadPlaylist = () => {
      const saved = localStorage.getItem('class_music_playlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSongs(parsed);
          }
        } catch {}
      }
    };
    loadPlaylist();

    // Sync live playlist and covers from Supabase so mobile and all devices stay connected
    getPlaylist().then((remoteSongs) => {
      if (remoteSongs && remoteSongs.length > 0) {
        setSongs(remoteSongs);
        try {
          localStorage.setItem('class_music_playlist', JSON.stringify(remoteSongs));
        } catch {}
      }
    });

    window.addEventListener('class_playlist_updated', loadPlaylist);
    return () => window.removeEventListener('class_playlist_updated', loadPlaylist);
  }, []);

  const currentSong = songs[currentIndex] || songs[0] || initialPlaylist[0];

  // Initialize audio singleton on client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    // Load saved settings
    const savedMin = localStorage.getItem('class_music_minimized');
    if (savedMin === 'true') {
      setIsMinimized(true);
    }

    const savedVol = localStorage.getItem('class_music_volume');
    if (savedVol) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed)) {
        setVolumeState(parsed);
        audio.volume = parsed;
      }
    } else {
      audio.volume = 0.65;
    }

    const savedIndex = localStorage.getItem('class_music_index');
    const activeList = (() => {
      const saved = localStorage.getItem('class_music_playlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
      return initialPlaylist;
    })();

    if (savedIndex) {
      const parsedIdx = parseInt(savedIndex, 10);
      if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < activeList.length) {
        setCurrentIndex(parsedIdx);
        audio.src = activeList[parsedIdx].file_name;
      } else {
        audio.src = activeList[0].file_name;
      }
    } else {
      audio.src = activeList[0]?.file_name || initialPlaylist[0].file_name;
    }

    // Event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto play next song seamlessly
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % initialPlaylist.length;
        try {
          localStorage.setItem('class_music_index', String(nextIdx));
        } catch {}
        audio.src = initialPlaylist[nextIdx].file_name;
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        return nextIdx;
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src || audio.src === window.location.href) {
        audio.src = currentSong.file_name;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error / User interaction needed:', err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextIdx = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIdx);
    try {
      localStorage.setItem('class_music_index', String(nextIdx));
    } catch {}

    audio.src = songs[nextIdx].file_name;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentIndex, songs]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const prevIdx = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIdx);
    try {
      localStorage.setItem('class_music_index', String(prevIdx));
    } catch {}

    audio.src = songs[prevIdx].file_name;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentIndex, songs]);

  const selectSong = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (index >= 0 && index < songs.length) {
      setCurrentIndex(index);
      try {
        localStorage.setItem('class_music_index', String(index));
      } catch {}

      audio.src = songs[index].file_name;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [songs]);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audio) {
      audio.volume = isMuted ? 0 : clamped;
    }
    try {
      localStorage.setItem('class_music_volume', String(clamped));
    } catch {}
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    setIsMuted((prev) => {
      const next = !prev;
      if (audio) {
        audio.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const toggleMinimize = useCallback((value?: boolean) => {
    setIsMinimized((prev) => {
      const nextVal = value !== undefined ? value : !prev;
      try {
        localStorage.setItem('class_music_minimized', String(nextVal));
      } catch {}
      if (nextVal) {
        setShowControls(false);
      }
      return nextVal;
    });
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
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
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
