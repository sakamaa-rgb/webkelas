'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Music, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Radio,
  FileAudio,
  Save
} from 'lucide-react';
import { Song } from '@/types/database';
import { initialPlaylist } from '@/data/seedData';
import { 
  getAllSongs, 
  upsertSong, 
  deleteSong, 
  uploadFileToStorage 
} from '@/lib/supabase/dataService';

interface KelolaMusicTabProps {
  onAddLog?: (
    action: string,
    category: 'auth' | 'content' | 'student' | 'schedule' | 'project' | 'profile',
    target: string,
    actorRole?: 'admin' | 'student' | 'guest' | 'system',
    status?: 'success' | 'info' | 'warning'
  ) => void;
}

export default function KelolaMusicTab({ onAddLog }: KelolaMusicTabProps) {
  const [mounted, setMounted] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  // Form State
  const [editingSongId, setEditingSongId] = useState<number | null>(null);
  const [formJudul, setFormJudul] = useState('');
  const [formArtis, setFormArtis] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formUrutan, setFormUrutan] = useState(1);
  const [formAktif, setFormAktif] = useState(true);
  const [formAudioMeta, setFormAudioMeta] = useState<{ name: string; size: string } | null>(null);

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio Tester state in admin
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load songs from Supabase & localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('class_music_playlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlaylist(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setPlaylist(initialPlaylist);
    }

    // Sync with Supabase cloud database
    getAllSongs().then((remote) => {
      if (remote && remote.length > 0) {
        setPlaylist(remote);
        try {
          localStorage.setItem('class_music_playlist', JSON.stringify(remote));
        } catch {}
      }
    });
  }, []);

  // Save playlist helper
  const savePlaylist = (updated: Song[]) => {
    setPlaylist(updated);
    try {
      localStorage.setItem('class_music_playlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('class_playlist_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Preview play tester
  const togglePlayPreview = (song: Song) => {
    if (playingSongId === song.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPlayingSongId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(song.file_name);
      previewAudioRef.current = audio;
      audio
        .play()
        .then(() => setPlayingSongId(song.id))
        .catch((err) => {
          console.warn('Playback error:', err);
          setErrorMsg(`Tidak dapat memutar lagu: ${song.judul}`);
          setTimeout(() => setErrorMsg(null), 3000);
          setPlayingSongId(null);
        });

      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => setPlayingSongId(null);
    }
  };

  // Handle MP3 Upload
  const handleMp3FileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      setErrorMsg('Harap pilih file audio berekstensi MP3.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setFormAudioMeta({ name: file.name, size: fileSizeMb });

    // Auto fill title if empty
    if (!formJudul) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormJudul(cleanName);
    }

    // Convert to Data URL / Object URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormFileName(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage if available
    const url = await uploadFileToStorage(file, 'music/audio');
    if (url) {
      setFormFileName(url);
    }
  };

  // Handle Cover Image Upload
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      setErrorMsg('Harap pilih file gambar untuk cover album (JPG, PNG, WEBP).');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    // 1. Tampilkan preview lokal instan
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormCover(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload file cover ke Supabase Storage agar tersimpan permanen di cloud
    const url = await uploadFileToStorage(file, 'music/covers');
    if (url) {
      setFormCover(url);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormJudul('');
    setFormArtis('');
    setFormFileName('');
    setFormCover('');
    setFormAudioMeta(null);
    setFormUrutan(playlist.length + 1);
    setFormAktif(true);
    setModalAddOpen(true);
  };

  // Save Add
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formArtis.trim()) {
      setErrorMsg('Judul lagu dan Nama artis harus diisi.');
      return;
    }
    if (!formFileName.trim()) {
      setErrorMsg('File audio MP3 harus diunggah terlebih dahulu.');
      return;
    }

    const newSong: Song = {
      id: Date.now(),
      judul: formJudul.trim(),
      artis: formArtis.trim(),
      file_name: formFileName.trim(),
      cover: formCover.trim() || '/assets/uploads/thumbnails/thumb_1787385653_720.jpeg',
      urutan: Number(formUrutan) || playlist.length + 1,
      aktif: formAktif
    };

    const saved = (await upsertSong(newSong)) || newSong;
    const updated = [...playlist, saved].sort((a, b) => a.urutan - b.urutan);
    savePlaylist(updated);
    setModalAddOpen(false);
    setSuccessMsg(`Lagu "${saved.judul}" berhasil ditambahkan ke playlist!`);
    setTimeout(() => setSuccessMsg(null), 3500);

    if (onAddLog) {
      onAddLog(`Menambahkan lagu baru "${saved.judul}" ke pemutar musik`, 'content', 'Kelola Musik');
    }
  };

  // Open Edit Modal
  const openEditModal = (song: Song) => {
    setEditingSongId(song.id);
    setFormJudul(song.judul);
    setFormArtis(song.artis);
    setFormFileName(song.file_name);
    setFormCover(song.cover || '');
    setFormAudioMeta({ name: song.judul + '.mp3', size: 'Audio Siap' });
    setFormUrutan(song.urutan);
    setFormAktif(song.aktif);
    setModalEditOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSongId) return;

    const targetSong = playlist.find(s => s.id === editingSongId);
    const updatedSong: Song = {
      id: editingSongId,
      judul: formJudul.trim(),
      artis: formArtis.trim(),
      file_name: formFileName.trim(),
      cover: formCover.trim() || targetSong?.cover || null,
      urutan: Number(formUrutan),
      aktif: formAktif
    };

    const saved = (await upsertSong(updatedSong)) || updatedSong;

    const updated = playlist.map((s) => (s.id === editingSongId ? saved : s)).sort((a, b) => a.urutan - b.urutan);

    savePlaylist(updated);
    setModalEditOpen(false);
    setSuccessMsg(`Lagu "${formJudul}" berhasil diperbarui!`);
    setTimeout(() => setSuccessMsg(null), 3500);

    if (onAddLog) {
      onAddLog(`Memperbarui data lagu "${formJudul}"`, 'content', 'Kelola Musik');
    }
  };

  // Toggle Active Status directly
  const toggleSongStatus = (id: number) => {
    const updated = playlist.map((s) => (s.id === id ? { ...s, aktif: !s.aktif } : s));
    savePlaylist(updated);
    const target = updated.find(s => s.id === id);
    if (target) {
      upsertSong(target);
    }
  };

  // Delete
  const executeDelete = () => {
    if (!songToDelete) return;
    const targetTitle = songToDelete.judul;

    if (playingSongId === songToDelete.id && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPlayingSongId(null);
    }

    const updated = playlist.filter((s) => s.id !== songToDelete.id);
    savePlaylist(updated);
    deleteSong(songToDelete.id);
    setSongToDelete(null);
    setSuccessMsg(`Lagu "${targetTitle}" berhasil dihapus dari playlist.`);
    setTimeout(() => setSuccessMsg(null), 3500);

    if (onAddLog) {
      onAddLog(`Menghapus lagu "${targetTitle}" dari playlist`, 'content', 'Kelola Musik');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Kelola Playlist Musik</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {playlist.length} Lagu
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Unggah file MP3 dan cover album agar lagu berputar di pemutar musik seluruh halaman website.
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lagu Baru</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Songs List Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlist.map((song) => {
            const isPreviewing = playingSongId === song.id;
            return (
              <div
                key={song.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                  isPreviewing
                    ? 'bg-blue-50/80 border-blue-300 shadow-md ring-1 ring-blue-300'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Left: Cover Art & Song Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-900 flex-shrink-0 group shadow-2xs">
                    {song.cover ? (
                      <img
                        src={song.cover}
                        alt={song.judul}
                        className={`w-full h-full object-cover ${isPreviewing ? 'animate-vinyl-spin' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                        <Music className="w-6 h-6" />
                      </div>
                    )}
                    {/* Hover Play Button on thumbnail */}
                    <button
                      type="button"
                      onClick={() => togglePlayPreview(song)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      title={isPreviewing ? 'Hentikan Preview' : 'Putar Preview Lagu'}
                    >
                      {isPreviewing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                    </button>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                        #{song.urutan}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {song.judul}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {song.artis}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => toggleSongStatus(song.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                          song.aktif
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-200/70 text-slate-500 border-slate-300 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status aktif"
                      >
                        {song.aktif ? '● Aktif di Web' : '○ Nonaktif'}
                      </button>
                      {isPreviewing && (
                        <span className="text-[10px] font-bold text-blue-600 animate-pulse flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          Memutar Audio...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePlayPreview(song)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isPreviewing
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    title={isPreviewing ? 'Hentikan Preview' : 'Tes Suara'}
                  >
                    {isPreviewing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(song)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Lagu"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSongToDelete(song)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Lagu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MODAL: TAMBAH LAGU BARU (PORTAL & COMPACT 2-COLUMN NO-SCROLL)
          ======================================================== */}
      {mounted && modalAddOpen && createPortal(
        <div className="fixed inset-y-0 right-0 left-0 lg:left-64 z-40 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Tambah Lagu Baru ke Playlist
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Unggah file audio MP3 dan cover album pemutar musik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAddOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Compact 2-Column (Fits completely on screen, no scroll needed!) */}
            <form id="add-song-form" onSubmit={handleSaveAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom Kiri: Metadata */}
                <div className="space-y-3.5">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Judul Lagu</span>
                      <span className="text-rose-500 font-extrabold text-[10px]">Wajib</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formJudul}
                      onChange={(e) => setFormJudul(e.target.value)}
                      placeholder="cth: Asmalibrasi / Sialan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Nama Penyanyi / Artis</span>
                      <span className="text-rose-500 font-extrabold text-[10px]">Wajib</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formArtis}
                      onChange={(e) => setFormArtis(e.target.value)}
                      placeholder="cth: Soegi Bornean / Mahalini"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Urutan Playlist
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formUrutan}
                        onChange={(e) => setFormUrutan(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-bold text-center focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status Lagu
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormAktif(!formAktif)}
                        className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formAktif
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${formAktif ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{formAktif ? 'Aktif di Web' : 'Nonaktif'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Media Audio & Cover */}
                <div className="space-y-3.5">
                  {/* Audio MP3 */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <FileAudio className="w-3.5 h-3.5 text-blue-600" />
                        <span>File Audio MP3</span>
                      </span>
                      <span className="text-rose-500 font-extrabold text-[10px]">Wajib</span>
                    </label>

                    {formFileName ? (
                      <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800 truncate">
                              {formAudioMeta?.name || 'File Audio Terpilih'}
                            </span>
                          </div>
                          <div>
                            <input
                              type="file"
                              id="mp3-file-input-change"
                              accept="audio/*,.mp3"
                              onChange={handleMp3FileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="mp3-file-input-change"
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-bold text-slate-700 cursor-pointer inline-block"
                            >
                              Ganti
                            </label>
                          </div>
                        </div>
                        <audio controls className="w-full h-7 rounded" src={formFileName} />
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="mp3-file-input"
                          accept="audio/*,.mp3"
                          onChange={handleMp3FileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="mp3-file-input"
                          className="p-3.5 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/70 hover:border-blue-400 transition-all flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-blue-700 block">
                              Pilih File MP3 / Audio
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Mendukung file .mp3, .wav
                            </span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Foto Cover */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Cover Album</span>
                      </span>
                      <span className="text-slate-400 text-[10px]">Opsional</span>
                    </label>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        {formCover ? (
                          <img src={formCover} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Music className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="file"
                            id="cover-file-input"
                            accept="image/*"
                            onChange={handleCoverFileUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="cover-file-input"
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs inline-block"
                          >
                            {formCover ? 'Ganti Cover' : 'Upload Foto'}
                          </label>
                          {formCover && (
                            <button
                              type="button"
                              onClick={() => setFormCover('')}
                              className="px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-bold cursor-pointer hover:bg-rose-100"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>Preset:</span>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/thumbnails/thumb_1787385653_720.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #1
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/gallery/gallery_1778720190_0.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #2
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/gallery/gallery_1778720397_0.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #3
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalAddOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="add-song-form"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Lagu</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================
          MODAL: EDIT DATA LAGU (PORTAL & COMPACT 2-COLUMN NO-SCROLL)
          ======================================================== */}
      {mounted && modalEditOpen && createPortal(
        <div className="fixed inset-y-0 right-0 left-0 lg:left-64 z-40 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Edit Data Lagu Playlist
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Perbarui judul, artis, audio, urutan, atau status
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalEditOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Compact 2-Column */}
            <form id="edit-song-form" onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom Kiri: Metadata */}
                <div className="space-y-3.5">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Judul Lagu</span>
                      <span className="text-rose-500 font-extrabold text-[10px]">Wajib</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formJudul}
                      onChange={(e) => setFormJudul(e.target.value)}
                      placeholder="cth: Asmalibrasi"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Nama Penyanyi / Artis</span>
                      <span className="text-rose-500 font-extrabold text-[10px]">Wajib</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formArtis}
                      onChange={(e) => setFormArtis(e.target.value)}
                      placeholder="cth: Soegi Bornean"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Urutan Playlist
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formUrutan}
                        onChange={(e) => setFormUrutan(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-bold text-center focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status Lagu
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormAktif(!formAktif)}
                        className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formAktif
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${formAktif ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{formAktif ? 'Aktif di Web' : 'Nonaktif'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Media Audio & Cover */}
                <div className="space-y-3.5">
                  {/* Audio MP3 */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <FileAudio className="w-3.5 h-3.5 text-blue-600" />
                        <span>File Audio MP3</span>
                      </span>
                      <span className="text-slate-400 text-[10px]">Tersimpan</span>
                    </label>

                    <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 truncate">
                            {formJudul || 'File Audio'}
                          </span>
                        </div>
                        <div>
                          <input
                            type="file"
                            id="mp3-file-input-edit"
                            accept="audio/*,.mp3"
                            onChange={handleMp3FileUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="mp3-file-input-edit"
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-bold text-slate-700 cursor-pointer inline-block"
                          >
                            Ganti
                          </label>
                        </div>
                      </div>
                      {formFileName && (
                        <audio controls className="w-full h-7 rounded" src={formFileName} />
                      )}
                    </div>
                  </div>

                  {/* Foto Cover */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Cover Album</span>
                      </span>
                      <span className="text-slate-400 text-[10px]">Thumbnail</span>
                    </label>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        {formCover ? (
                          <img src={formCover} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Music className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="file"
                            id="cover-file-input-edit"
                            accept="image/*"
                            onChange={handleCoverFileUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="cover-file-input-edit"
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs inline-block"
                          >
                            Ganti Cover
                          </label>
                          {formCover && (
                            <button
                              type="button"
                              onClick={() => setFormCover('')}
                              className="px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-bold cursor-pointer hover:bg-rose-100"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>Preset:</span>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/thumbnails/thumb_1787385653_720.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #1
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/gallery/gallery_1778720190_0.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #2
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormCover('/assets/uploads/gallery/gallery_1778720397_0.jpeg')}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            #3
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalEditOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="edit-song-form"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS (PORTAL)
          ======================================================== */}
      {mounted && songToDelete && createPortal(
        <div className="fixed inset-y-0 right-0 left-0 lg:left-64 z-40 bg-slate-900/50 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-200 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Hapus Lagu dari Playlist?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lagu <strong className="text-slate-800">&quot;{songToDelete.judul}&quot;</strong> ({songToDelete.artis}) akan dihapus dari pemutar musik website.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSongToDelete(null)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all active:scale-95 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
