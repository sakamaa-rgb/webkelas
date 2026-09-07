'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { 
  Compass, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Award, 
  Code2, 
  Laptop, 
  Check, 
  Maximize2,
  Trophy,
  Flag,
  Star,
  Eye,
  SlidersHorizontal,
  RefreshCw,
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
  getAvailableEkskulCategories,
  defaultEkskulCategories
} from '@/data/aktivitasData';
import { initialStudents } from '@/data/seedData';
import { compressImage } from '@/lib/imageCompressor';
import { uploadFileToStorage } from '@/lib/supabase/dataService';

// Modal Dialog Universal untuk Window (Desktop) & Mobile via Portal Body
function AktivitasModal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-xl'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 w-full ${maxWidth} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            {icon && <div className="shrink-0">{icon}</div>}
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form / Content (Has its own scrollable body & sticky footer) */}
        {children}
      </div>
    </div>,
    document.body
  );
}

interface KelolaAktivitasTabProps {
  onAddLog?: (
    action: string,
    category: 'auth' | 'content' | 'student' | 'schedule' | 'project' | 'profile',
    target: string,
    actorRole?: 'admin' | 'student' | 'guest' | 'system',
    status?: 'success' | 'info' | 'warning'
  ) => void;
}

export default function KelolaAktivitasTab({ onAddLog }: KelolaAktivitasTabProps) {
  const [subTab, setSubTab] = useState<'ekskul' | 'organisasi' | 'dicoding' | 'setting'>('ekskul');

  // Datasets state (synced with localStorage)
  const [ekskulList, setEkskulList] = useState<EkstrakurikulerItem[]>(initialEkskul);
  const [orgList, setOrgList] = useState<OrganisasiMember[]>(initialOrg);
  const [journeyList, setJourneyList] = useState<JourneyMilestone[]>(initialJourney);
  const [photoConfig, setPhotoConfig] = useState<AktivitasPhotoConfig>(defaultPhotoConfig);
  const [previewOrientation, setPreviewOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Filter per-kegiatan ekskul & organisasi (mirrors /jadwal UX)
  const [selectedEkskulFilter, setSelectedEkskulFilter] = useState<string>('Semua');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<'Semua' | 'MPK' | 'OSIS'>('Semua');

  const availableEkskulCategories = React.useMemo(() => {
    return getAvailableEkskulCategories(ekskulList);
  }, [ekskulList]);

  const filteredEkskul = React.useMemo(() => {
    return ekskulList.filter((item) => matchesEkskulCategory(item, selectedEkskulFilter));
  }, [ekskulList, selectedEkskulFilter]);

  const filteredOrg = React.useMemo(() => {
    if (selectedOrgFilter === 'Semua') return orgList;
    return orgList.filter((item) => item.organisasi === selectedOrgFilter);
  }, [orgList, selectedOrgFilter]);

  // Status feedback
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  const [compressInfo, setCompressInfo] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Modals state
  const [editingEkskul, setEditingEkskul] = useState<EkstrakurikulerItem | null>(null);
  const [isAddingEkskul, setIsAddingEkskul] = useState(false);
  const [formEkskul, setFormEkskul] = useState<Partial<EkstrakurikulerItem>>({});

  const [editingOrg, setEditingOrg] = useState<OrganisasiMember | null>(null);
  const [formOrg, setFormOrg] = useState<Partial<OrganisasiMember>>({});

  const [editingJourney, setEditingJourney] = useState<JourneyMilestone | null>(null);
  const [isAddingJourney, setIsAddingJourney] = useState(false);
  const [formJourney, setFormJourney] = useState<Partial<JourneyMilestone>>({});

  // Delete animation state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    id: string;
    nama: string;
    type: 'ekskul' | 'org' | 'journey';
  } | null>(null);

  // Students list for dropdown selection
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
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
          if (sanitized.length > 0) {
            setEkskulList(sanitized);
          } else {
            setEkskulList(initialEkskul);
            localStorage.setItem('class_aktivitas_ekskul', JSON.stringify(initialEkskul));
          }
        } catch {
          setEkskulList(initialEkskul);
        }
      } else {
        setEkskulList(initialEkskul);
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
            localStorage.setItem('class_aktivitas_journey', JSON.stringify(initialJourney));
          }
        } catch {
          setJourneyList(initialJourney);
        }
      } else {
        setJourneyList(initialJourney);
      }

      const savedStudents = localStorage.getItem('class_students_list') || localStorage.getItem('class_web_students');
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        setStudents(initialStudents);
      }
    } catch (e) {
      console.warn('Fallback reading aktivitas data:', e);
      setStudents(initialStudents);
    }
  }, []);

  const showAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  // Save photo size settings
  const handleSavePhotoConfig = (newConfig: AktivitasPhotoConfig) => {
    setPhotoConfig(newConfig);
    try {
      localStorage.setItem('class_aktivitas_photo_config', JSON.stringify(newConfig));
      window.dispatchEvent(new CustomEvent('class_aktivitas_config_updated', { detail: newConfig }));
      showAlert('Pengaturan ukuran foto aktivitas berhasil disimpan!');
      if (onAddLog) {
        onAddLog(
          `Mengubah pengaturan ukuran foto aktivitas ke rasio ${newConfig.aspectRatio}`,
          'content',
          'Setting Ukuran Foto Aktivitas'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload Handler with Automatic Client-Side Compression
  const handlePhotoUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    if (!file) return;
    setIsCompressing(true);
    setCompressInfo('Mengompres foto agar website tidak lag...');

    try {
      // 1. Kompres foto otomatis
      const { file: compressedFile, dataUrl, sizeReductionPercent } = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.82
      });

      setCompressInfo(`Foto berhasil dikompres ${sizeReductionPercent}% lebih ringan!`);
      // Preview lokal instan
      onSuccess(dataUrl);

      // 2. Upload ke Supabase Storage di background jika terhubung
      const uploadedUrl = await uploadFileToStorage(compressedFile, 'aktivitas');
      if (uploadedUrl) {
        onSuccess(uploadedUrl);
      }
    } catch (error) {
      console.error('Error compressing image:', error);
      const fallbackUrl = URL.createObjectURL(file);
      onSuccess(fallbackUrl);
    } finally {
      setIsCompressing(false);
      setTimeout(() => setCompressInfo(null), 3000);
    }
  };

  // Save Ekstrakurikuler
  const handleSaveEkskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEkskul.nama?.trim()) return;

    let updated: EkstrakurikulerItem[];
    if (editingEkskul) {
      updated = ekskulList.map((item) =>
        item.id === editingEkskul.id ? ({ ...item, ...formEkskul } as EkstrakurikulerItem) : item
      );
      showAlert(`Ekstrakurikuler "${formEkskul.nama}" berhasil diperbarui!`);
    } else {
      const newItem: EkstrakurikulerItem = {
        id: `ekskul-${Date.now()}`,
        nama: formEkskul.nama || 'Ekstrakurikuler Baru',
        siswa: formEkskul.siswa || '',
        kategori: formEkskul.kategori || 'Olahraga',
        badgeColor: formEkskul.badgeColor || 'blue',
        deskripsi: formEkskul.deskripsi || '',
        foto: formEkskul.foto || '/assets/uploads/aktivitas/ekskul_basket.jpg',
        orientation: formEkskul.orientation || 'landscape',
        tagline: formEkskul.tagline || ''
      };
      updated = [newItem, ...ekskulList];
      showAlert(`Ekstrakurikuler baru berhasil ditambahkan!`);
    }

    setEkskulList(updated);
    localStorage.setItem('class_aktivitas_ekskul', JSON.stringify(updated));
    window.dispatchEvent(new Event('class_aktivitas_updated'));
    setEditingEkskul(null);
    setIsAddingEkskul(false);
  };

  // Prompt delete functions
  const promptDeleteEkskul = (id: string, nama: string) => {
    setDeleteConfirmTarget({ id, nama, type: 'ekskul' });
  };

  const promptDeleteOrg = (id: string, nama: string) => {
    setDeleteConfirmTarget({ id, nama, type: 'org' });
  };

  const promptDeleteJourney = (id: string, nama: string) => {
    setDeleteConfirmTarget({ id, nama, type: 'journey' });
  };

  // Unified delete execution with exit animation
  const executeDelete = () => {
    if (!deleteConfirmTarget) return;
    const { id: targetId, nama: targetName, type } = deleteConfirmTarget;
    setDeleteConfirmTarget(null);

    // Aktifkan animasi keluar halus (animate-delete-exit)
    setDeletingId(targetId);

    setTimeout(() => {
      if (type === 'ekskul') {
        const updated = ekskulList.filter((item) => item.id !== targetId);
        setEkskulList(updated);
        localStorage.setItem('class_aktivitas_ekskul', JSON.stringify(updated));
        showAlert(`Ekstrakurikuler "${targetName}" berhasil dihapus!`);
      } else if (type === 'org') {
        const updated = orgList.filter((item) => item.id !== targetId);
        setOrgList(updated);
        localStorage.setItem('class_aktivitas_org', JSON.stringify(updated));
        showAlert(`Anggota Organisasi "${targetName}" berhasil dihapus!`);
      } else if (type === 'journey') {
        const updated = journeyList.filter((item) => item.step !== targetId);
        setJourneyList(updated);
        localStorage.setItem('class_aktivitas_journey', JSON.stringify(updated));
        showAlert(`Milestone "${targetName}" berhasil dihapus!`);
      }

      window.dispatchEvent(new Event('class_aktivitas_updated'));
      setDeletingId(null);
    }, 380);
  };

  // Save Organisasi Member
  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    const updated = orgList.map((m) =>
      m.id === editingOrg.id ? ({ ...m, ...formOrg } as OrganisasiMember) : m
    );
    setOrgList(updated);
    localStorage.setItem('class_aktivitas_org', JSON.stringify(updated));
    window.dispatchEvent(new Event('class_aktivitas_updated'));
    showAlert(`Data ${formOrg.nama || editingOrg.nama} berhasil disimpan!`);
    setEditingOrg(null);
  };

  // Save Dicoding Journey Milestone
  const handleSaveJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJourney.title?.trim()) {
      showAlert('Judul milestone wajib diisi!', 'info');
      return;
    }

    const highlightsArr = Array.isArray(formJourney.highlights)
      ? formJourney.highlights.map((s: string) => s.trim()).filter(Boolean)
      : typeof formJourney.highlights === 'string'
      ? (formJourney.highlights as string).split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    if (isAddingJourney) {
      let stepVal = formJourney.step?.trim();
      if (!stepVal) {
        const nextNum = journeyList.length + 1;
        stepVal = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
      }

      const newMilestone: JourneyMilestone = {
        step: stepVal,
        stageName: formJourney.stageName?.trim() || `Tahap ${stepVal}`,
        title: formJourney.title.trim(),
        tanggal: formJourney.tanggal?.trim() || '2026',
        badge: (formJourney.badge?.trim() || 'DICODING').toUpperCase(),
        badgeType: formJourney.badgeType || 'purple',
        iconType: formJourney.iconType || 'code',
        deskripsi: formJourney.deskripsi?.trim() || '',
        foto: formJourney.foto || '/assets/uploads/aktivitas/journey_dicoding.jpg',
        orientation: formJourney.orientation || 'landscape',
        highlights: highlightsArr.length > 0 ? highlightsArr : ['Dicoding Academy', 'Siswa XI PPLG 3']
      };

      const updated = [...journeyList, newMilestone];
      setJourneyList(updated);
      localStorage.setItem('class_aktivitas_journey', JSON.stringify(updated));
      window.dispatchEvent(new Event('class_aktivitas_updated'));
      showAlert(`Milestone Tahap ${stepVal} "${newMilestone.title}" berhasil ditambahkan!`);
      setIsAddingJourney(false);
      setEditingJourney(null);
      setFormJourney({});
      if (onAddLog) {
        onAddLog(`Menambahkan Milestone Dicoding Tahap ${stepVal}: ${newMilestone.title}`, 'content', 'Dicoding Journey');
      }
    } else if (editingJourney) {
      const updated = journeyList.map((m) => {
        if (m.step === editingJourney.step) {
          return {
            ...m,
            ...formJourney,
            highlights: highlightsArr.length > 0 ? highlightsArr : m.highlights
          } as JourneyMilestone;
        }
        return m;
      });
      setJourneyList(updated);
      localStorage.setItem('class_aktivitas_journey', JSON.stringify(updated));
      window.dispatchEvent(new Event('class_aktivitas_updated'));
      showAlert(`Milestone Tahap ${editingJourney.step} berhasil diperbarui!`);
      setEditingJourney(null);
      setIsAddingJourney(false);
      setFormJourney({});
      if (onAddLog) {
        onAddLog(`Memperbarui Milestone Dicoding Tahap ${editingJourney.step}: ${formJourney.title || editingJourney.title}`, 'content', 'Dicoding Journey');
      }
    }
  };

  // Reset to default data
  const handleResetToDefault = () => {
    if (!confirm('Kembalikan seluruh data aktivitas ke data bawaan awal?')) return;
    localStorage.removeItem('class_aktivitas_ekskul');
    localStorage.removeItem('class_aktivitas_org');
    localStorage.removeItem('class_aktivitas_journey');
    localStorage.removeItem('class_aktivitas_photo_config');
    setEkskulList(initialEkskul);
    setOrgList(initialOrg);
    setJourneyList(initialJourney);
    setPhotoConfig(defaultPhotoConfig);
    window.dispatchEvent(new Event('class_aktivitas_updated'));
    window.dispatchEvent(new CustomEvent('class_aktivitas_config_updated', { detail: defaultPhotoConfig }));
    showAlert('Data aktivitas berhasil direset ke bawaan awal!');
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Modul Manajemen Aktivitas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kelola Halaman Aktivitas & Dicoding Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data Ekstrakurikuler, Perwakilan Organisasi (MPK/OSIS), Dicoding Journey, dan kustomisasi ukuran foto aktivitas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            title="Reset ke data bawaan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          onClick={() => setSubTab('ekskul')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            subTab === 'ekskul'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏫</span>
          <span>Ekstrakurikuler ({ekskulList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('organisasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            subTab === 'organisasi'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>👥</span>
          <span>Organisasi Siswa (MPK & OSIS)</span>
        </button>

        <button
          onClick={() => setSubTab('dicoding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            subTab === 'dicoding'
              ? 'bg-white text-purple-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>💻</span>
          <span>Dicoding Journey ({journeyList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('setting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            subTab === 'setting'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Setting Ukuran Foto</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: EKSTRAKURIKULER
          ========================================================================= */}
      {subTab === 'ekskul' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Daftar Ekstrakurikuler XI PPLG 3
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola foto kegiatan per ekstrakurikuler secara terpisah dan terorganisir.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingEkskul(null);
                setFormEkskul({
                  nama: selectedEkskulFilter !== 'Semua' ? selectedEkskulFilter : '',
                  kategori: selectedEkskulFilter !== 'Semua' ? selectedEkskulFilter : 'Olahraga',
                  badgeColor: 'blue',
                  orientation: 'landscape'
                });
                setIsAddingEkskul(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekskul</span>
            </button>
          </div>

          {/* Category Filter Pills (Mirrors /jadwal UX) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            {availableEkskulCategories.map((cat) => {
              const count = cat === 'Semua' 
                ? ekskulList.length 
                : ekskulList.filter((item) => matchesEkskulCategory(item, cat)).length;
              const isSelected = selectedEkskulFilter === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedEkskulFilter(cat)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredEkskul.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-3">
                🏫
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-800 mb-1">
                Belum ada data untuk kegiatan &quot;{selectedEkskulFilter}&quot;
              </p>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Tambahkan foto dan nama siswa/i untuk ekstrakurikuler ini agar tampil di website.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEkskul(null);
                    setFormEkskul({
                      nama: selectedEkskulFilter !== 'Semua' ? selectedEkskulFilter : '',
                      kategori: selectedEkskulFilter !== 'Semua' ? selectedEkskulFilter : 'Olahraga',
                      badgeColor: 'blue',
                      orientation: 'landscape'
                    });
                    setIsAddingEkskul(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Tambah Ekskul {selectedEkskulFilter}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEkskulFilter('Semua')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Tampilkan Semua
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEkskul.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                    deletingId === item.id ? 'animate-delete-exit ring-2 ring-rose-500/50' : ''
                  }`}
                >
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.foto}
                      alt={item.nama}
                      fill
                      className={item.orientation === 'portrait' ? 'object-contain' : 'object-cover'}
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-bold backdrop-blur-xs">
                      {item.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-blue-600 uppercase">
                          {item.kategori}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900">{item.nama}</h4>
                      {item.siswa && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{item.siswa}</span>
                        </div>
                      )}
                      {item.deskripsi && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2">{item.deskripsi}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEkskul(item);
                          setFormEkskul({ ...item });
                          setIsAddingEkskul(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold text-xs transition-colors cursor-pointer"
                        title="Edit Ekskul"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => promptDeleteEkskul(item.id, item.nama)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                        title="Hapus Ekskul"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: ORGANISASI SISWA (SPOTLIGHT MPK & OSIS)
          ========================================================================= */}
      {subTab === 'organisasi' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs sm:text-sm text-amber-800 flex items-start gap-3">
            <span className="text-lg">ℹ️</span>
            <div>
              <strong className="block font-bold mb-0.5">Ketentuan Organisasi Siswa:</strong>
              Bagian ini menampilkan 3 perwakilan siswa XI PPLG 3 yang aktif di MPK (Sekretaris MPK) dan OSIS (Bendahara OSIS & Ketua Seksi Bidang 6 / KSIT OSIS).
            </div>
          </div>

          {/* Organisasi Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
            {(['Semua', 'MPK', 'OSIS'] as const).map((org) => {
              const count = org === 'Semua' ? orgList.length : orgList.filter((m) => m.organisasi === org).length;
              const isSelected = selectedOrgFilter === org;
              return (
                <button
                  key={org}
                  type="button"
                  onClick={() => setSelectedOrgFilter(org)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <span>{org === 'Semua' ? 'Semua Organisasi' : org}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOrg.map((member) => (
              <div
                key={member.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                  member.organisasi === 'MPK' ? 'border-emerald-200' : 'border-blue-200'
                } ${
                  deletingId === member.id ? 'animate-delete-exit ring-2 ring-rose-500/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                      member.organisasi === 'MPK' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      ● {member.organisasi}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {member.highlightTag}
                    </span>
                  </div>

                  <div 
                    className={`relative w-full rounded-2xl overflow-hidden mb-4 border border-slate-200 shadow-inner bg-slate-100 ${
                      member.orientation === 'landscape' ? 'aspect-[16/10]' : member.orientation === 'square' ? 'aspect-[1/1]' : 'aspect-[3/4]'
                    }`}
                  >
                    {member.fitMode === 'contain' ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                        <Image
                          src={member.foto}
                          alt=""
                          fill
                          className="object-cover blur-md opacity-40 scale-125"
                        />
                        <Image
                          src={member.foto}
                          alt={member.nama}
                          fill
                          className="object-contain z-10 p-1"
                        />
                      </div>
                    ) : (
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
                        }`}
                      />
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-bold backdrop-blur-xs">
                      {member.fitMode === 'contain' ? 'Contain' : 'Cover'}
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-slate-900">{member.nama}</h4>
                  <p className={`text-xs font-extrabold mt-0.5 ${member.organisasi === 'MPK' ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {member.jabatan}
                  </p>
                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                    {member.roleDescription}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingOrg(member);
                      setFormOrg({ ...member });
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </button>
                  <button
                    onClick={() => promptDeleteOrg(member.id, member.nama)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                    title="Hapus Anggota Organisasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: DICODING JOURNEY (MENGGANTIKAN PPLG)
          ========================================================================= */}
      {subTab === 'dicoding' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Milestone Dicoding Journey ({journeyList.length} Tahap)
              </h3>
              <p className="text-xs text-slate-500">
                Perjalanan coding, challenge, dan sertifikasi Dicoding siswa XI PPLG 3.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan milestone Dicoding ke data bawaan awal (Tahap 01 - 05)?')) {
                    setJourneyList(initialJourney);
                    localStorage.setItem('class_aktivitas_journey', JSON.stringify(initialJourney));
                    window.dispatchEvent(new Event('class_aktivitas_updated'));
                    showAlert('Milestone bawaan berhasil dimuat ulang!');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                title="Muat ulang 5 tahap bawaan awal"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Tahap Bawaan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingJourney(null);
                  const nextNum = journeyList.length + 1;
                  const nextStep = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
                  setFormJourney({
                    step: nextStep,
                    stageName: '',
                    title: '',
                    tanggal: '',
                    badge: 'CHALLENGE',
                    badgeType: 'purple',
                    iconType: 'code',
                    orientation: 'landscape',
                    deskripsi: '',
                    highlights: []
                  });
                  setIsAddingJourney(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Milestone</span>
              </button>
            </div>
          </div>

          {journeyList.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-3">
                💻
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-800 mb-1">
                Belum Ada Milestone Dicoding Journey
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                Tambahkan milestone perjalanan Dicoding siswa XI PPLG 3 atau muat ulang tahap bawaan (01 - 05).
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setJourneyList(initialJourney);
                    localStorage.setItem('class_aktivitas_journey', JSON.stringify(initialJourney));
                    window.dispatchEvent(new Event('class_aktivitas_updated'));
                    showAlert('Milestone bawaan (01 - 05) berhasil dimuat!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Muat Tahap Bawaan (01-05)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingJourney(null);
                    setFormJourney({
                      step: '01',
                      stageName: 'Persiapan',
                      title: '',
                      tanggal: '',
                      badge: 'PERSIAPAN',
                      badgeType: 'blue',
                      iconType: 'flag',
                      orientation: 'landscape',
                      deskripsi: '',
                      highlights: []
                    });
                    setIsAddingJourney(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Milestone Pertama</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {journeyList.map((milestone) => (
                <div
                  key={milestone.step}
                  className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    deletingId === milestone.step ? 'animate-delete-exit ring-2 ring-rose-500/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black text-base shrink-0">
                      {milestone.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-black uppercase border border-purple-200">
                          {milestone.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{milestone.tanggal}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{milestone.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl mt-1">
                        {milestone.deskripsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        setIsAddingJourney(false);
                        setEditingJourney(milestone);
                        setFormJourney({ ...milestone });
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Tahap</span>
                    </button>
                    <button
                      onClick={() => promptDeleteJourney(milestone.step, `${milestone.step} - ${milestone.title}`)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                      title="Hapus Milestone Tahap"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: PENGATURAN UKURAN FOTO AKTIVITAS (REQUEST USER)
          ========================================================================= */}
      {subTab === 'setting' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <span>Pengaturan Ukuran & Format Foto Aktivitas</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Atur rasio aspek card, tinggi container, dan mode fit foto khusus untuk halaman Aktivitas XI PPLG 3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Control Panel */}
            <div className="space-y-6">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  1. Rasio Aspek Frame Foto Card
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {[
                    { key: 'auto', label: 'Auto (Sesuai Foto)', desc: '9:16 untuk portrait, 16:9 untuk landscape' },
                    { key: '9/16', label: '9:16 (Story / Reel)', desc: 'Format Vertikal Pas' },
                    { key: '16/10', label: '16:10 (Standar)', desc: 'Rasio Seimbang' },
                    { key: '16/9', label: '16:9 (Landscape Lebar)', desc: 'Sinematik Modern' },
                    { key: '4/3', label: '4:3 (Klasik)', desc: 'Format Kamera' },
                    { key: '1/1', label: '1:1 (Kotak Presisi)', desc: 'Instagram Grid' },
                    { key: '3/2', label: '3:2 (DSLR)', desc: 'Fotografi Pro' },
                  ].map((ratio) => (
                    <button
                      key={ratio.key}
                      type="button"
                      onClick={() => handleSavePhotoConfig({ ...photoConfig, aspectRatio: ratio.key as any })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        photoConfig.aspectRatio === ratio.key
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900 font-black'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-black">{ratio.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ratio.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Height Setting */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  2. Ketinggian Container Card
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { key: 'compact', label: 'Compact', desc: 'Hemat Ruang Layar' },
                    { key: 'normal', label: 'Normal', desc: 'Standar Responsif' },
                    { key: 'spacious', label: 'Spacious', desc: 'Besar & Tajam' },
                  ].map((height) => (
                    <button
                      key={height.key}
                      type="button"
                      onClick={() => handleSavePhotoConfig({ ...photoConfig, cardHeight: height.key as any })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        photoConfig.cardHeight === height.key
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900 font-black'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-black">{height.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{height.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adaptive Image Behavior */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  3. Perilaku Foto Portrait & Full Cover
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => handleSavePhotoConfig({ ...photoConfig, objectFit: 'contain' })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      photoConfig.objectFit === 'contain'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900 font-black'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">Adaptive Contain</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Latar blur + wajah & tubuh subjek terlihat utuh tanpa crop.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSavePhotoConfig({ 
                      ...photoConfig, 
                      objectFit: 'cover',
                      fullCoverMode: 'auto-ratio'
                    })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      photoConfig.objectFit === 'cover'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900 font-black'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">Full Cover</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Mengisi frame foto penuh (dapat otomatis nyesuain 9:16 pas).
                    </div>
                  </button>
                </div>

                {/* Sub-Setting Khusus Full Cover (Request User: nyesuain langsung sm foto misal 9:16) */}
                {photoConfig.objectFit === 'cover' && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5 animate-in fade-in duration-200">
                    <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ukuran Full Cover Menyesuaikan Foto:</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Di mode Full Cover, frame foto dapat langsung menyesuaikan proporsi foto aslinya (misal foto 9:16 pas segimana ukuran aslinya):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSavePhotoConfig({ ...photoConfig, fullCoverMode: 'auto-ratio', aspectRatio: 'auto' })}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          photoConfig.fullCoverMode === 'auto-ratio'
                            ? 'bg-white border-blue-600 text-blue-900 font-black shadow-xs ring-2 ring-blue-500/30'
                            : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-blue-950">Auto Nyesuain Foto (9:16 Pas)</span>
                          {photoConfig.fullCoverMode === 'auto-ratio' && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                          Jika foto berorientasi portrait, frame otomatis berukuran 9:16 pas tanpa terpotong! Foto landscape tetap 16:10.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSavePhotoConfig({ ...photoConfig, fullCoverMode: 'fixed-ratio' })}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          photoConfig.fullCoverMode === 'fixed-ratio'
                            ? 'bg-white border-blue-600 text-blue-900 font-black shadow-xs ring-2 ring-blue-500/30'
                            : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">Rasio Seragam Tetap</span>
                          {photoConfig.fullCoverMode === 'fixed-ratio' && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                          Semua foto dipaksa mengikuti 1 rasio tetap yang dipilih pada Menu 1 di atas.
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Show Portrait Badge Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">Tampilkan Badge "Portrait View"</div>
                  <div className="text-[11px] text-slate-500">
                    Label kecil di sudut atas pada foto dengan orientasi vertikal.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={photoConfig.showPortraitBadge}
                  onChange={(e) => handleSavePhotoConfig({ ...photoConfig, showPortraitBadge: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Live Preview Setting
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold self-start sm:self-auto">
                  {photoConfig.aspectRatio === 'auto' || (photoConfig.objectFit === 'cover' && photoConfig.fullCoverMode === 'auto-ratio')
                    ? `Auto Adaptif (${previewOrientation === 'portrait' ? '9:16 Pas' : '16:10'})`
                    : photoConfig.aspectRatio} • {photoConfig.objectFit}
                </span>
              </div>

              {/* Switcher Preview Portrait vs Landscape */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setPreviewOrientation('portrait')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewOrientation === 'portrait'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📱 Tes Foto Portrait (9:16)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOrientation('landscape')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewOrientation === 'landscape'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🖥️ Tes Foto Landscape (16:10)
                </button>
              </div>

              {/* Preview Card */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div 
                  className="relative w-full overflow-hidden bg-black flex items-center justify-center transition-all duration-300"
                  style={{
                    aspectRatio: (() => {
                      const isAuto = photoConfig.aspectRatio === 'auto' || 
                        (photoConfig.objectFit === 'cover' && photoConfig.fullCoverMode === 'auto-ratio');
                      if (isAuto) {
                        return previewOrientation === 'portrait' ? '9 / 16' : '16 / 10';
                      }
                      const parts = photoConfig.aspectRatio.split('/');
                      if (parts.length === 2) {
                        return `${parts[0]} / ${parts[1]}`;
                      }
                      return '16 / 10';
                    })()
                  }}
                >
                  {/* Backdrop if contain */}
                  {photoConfig.objectFit === 'contain' && (
                    <Image
                      src={
                        previewOrientation === 'portrait'
                          ? '/assets/uploads/aktivitas/ekskul_pramuka.jpg'
                          : '/assets/uploads/aktivitas/ekskul_basket.jpg'
                      }
                      alt="Preview"
                      fill
                      className="object-cover blur-xl opacity-35 scale-125"
                    />
                  )}
                  {/* Foreground Image */}
                  <Image
                    src={
                      previewOrientation === 'portrait'
                        ? '/assets/uploads/aktivitas/ekskul_pramuka.jpg'
                        : '/assets/uploads/aktivitas/ekskul_basket.jpg'
                    }
                    alt="Preview"
                    fill
                    className={
                      photoConfig.objectFit === 'contain'
                        ? 'object-contain'
                        : `object-cover ${previewOrientation === 'portrait' ? 'object-top' : 'object-center'}`
                    }
                  />
                  {photoConfig.showPortraitBadge && previewOrientation === 'portrait' && (
                    <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-sm">
                      9:16 Pas
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-900/90 text-white">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase">
                    {previewOrientation === 'portrait' ? 'Foto Vertikal (Portrait)' : 'Foto Horizontal (Landscape)'}
                  </div>
                  <div className="text-base font-black">
                    {previewOrientation === 'portrait' ? 'Gerakan Pramuka (9:16)' : 'Basketball Club (16:10)'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {previewOrientation === 'portrait'
                      ? 'Ukuran frame otomatis menyesuaikan menjadi 9:16 pas tanpa terpotong.'
                      : 'Ukuran frame beradaptasi dalam format landscape proporsional.'}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                * Pengaturan Full Cover ini langsung diterapkan secara otomatis di halaman Aktivitas tanpa perlu restart server.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EDIT / TAMBAH EKSTRAKURIKULER (UNIVERSAL PORTAL)
          ========================================================================= */}
      <AktivitasModal
        isOpen={isAddingEkskul}
        onClose={() => setIsAddingEkskul(false)}
        title={editingEkskul ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
        icon={<Compass className="w-5 h-5 text-blue-600" />}
      >
        <form onSubmit={handleSaveEkskul} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Ekstrakurikuler <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="ekskul-options-list"
                value={formEkskul.nama || ''}
                onChange={(e) => setFormEkskul({ ...formEkskul, nama: e.target.value })}
                placeholder="Pilih atau ketik nama eskul (Rohis, Pramuka, Paskibra, Futsal, Voli, Basket)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
                required
              />
              <datalist id="ekskul-options-list">
                <option value="Rohis (Kerohanian Islam)" />
                <option value="Gerakan Pramuka" />
                <option value="Paskibra" />
                <option value="Futsal Club" />
                <option value="Bola Voli" />
                <option value="Basketball Club" />
              </datalist>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Siswa / i
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="student-names-list"
                    value={formEkskul.siswa || ''}
                    onChange={(e) => setFormEkskul({ ...formEkskul, siswa: e.target.value })}
                    placeholder="Pilih atau ketik nama siswa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
                  />
                  <datalist id="student-names-list">
                    {students.map((s) => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  list="ekskul-kategori-list"
                  value={formEkskul.kategori || ''}
                  onChange={(e) => setFormEkskul({ ...formEkskul, kategori: e.target.value })}
                  placeholder="Contoh: Olahraga / Keagamaan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
                />
                <datalist id="ekskul-kategori-list">
                  <option value="Olahraga" />
                  <option value="Keagamaan" />
                  <option value="Organisasi & Kepemimpinan" />
                  <option value="Kedisiplinan & Baris-Berbaris" />
                </datalist>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ukuran / Orientasi Foto</label>
              <select
                value={formEkskul.orientation || 'landscape'}
                onChange={(e) => setFormEkskul({ ...formEkskul, orientation: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800 bg-white"
              >
                <option value="landscape">Landscape (Horizontal 16:10 / 16:9)</option>
                <option value="portrait">Portrait (Vertikal 9:16 / Pas Badan)</option>
                <option value="square">Persegi / Square (1:1)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Upload File Foto <span className="text-rose-500">*</span>
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold text-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4 shrink-0" />
                <span>{isCompressing ? 'Mengompres Foto...' : 'Pilih File Foto (Otomatis Kompres)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file, (url) => setFormEkskul({ ...formEkskul, foto: url }));
                  }}
                />
              </label>
              {compressInfo && (
                <p className="mt-1.5 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{compressInfo}</span>
                </p>
              )}
              {formEkskul.foto && (
                <div className="mt-2.5 relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                  <Image src={formEkskul.foto} alt="Preview" fill className="object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat (Opsional)</label>
              <textarea
                rows={2}
                value={formEkskul.deskripsi || ''}
                onChange={(e) => setFormEkskul({ ...formEkskul, deskripsi: e.target.value })}
                placeholder="Jelaskan deskripsi atau peran siswa di ekstrakurikuler ini..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 sm:gap-3 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => setIsAddingEkskul(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {editingEkskul ? 'Simpan Perubahan' : 'Simpan Ekskul'}
            </button>
          </div>
        </form>
      </AktivitasModal>

      {/* =========================================================================
          MODAL 2: EDIT ORGANISASI MEMBER (UNIVERSAL PORTAL)
          ========================================================================= */}
      <AktivitasModal
        isOpen={!!editingOrg}
        onClose={() => setEditingOrg(null)}
        title="Edit Perwakilan Organisasi Siswa"
        icon={<Award className="w-5 h-5 text-indigo-600" />}
      >
        <form onSubmit={handleSaveOrg} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formOrg.nama || ''}
                onChange={(e) => setFormOrg({ ...formOrg, nama: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Organisasi</label>
                <input
                  type="text"
                  disabled
                  value={formOrg.organisasi || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jabatan Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formOrg.jabatan || ''}
                  onChange={(e) => setFormOrg({ ...formOrg, jabatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ganti Foto Siswa</label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-bold text-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4 shrink-0" />
                <span>{isCompressing ? 'Mengompres...' : 'Pilih Foto Baru (Otomatis Kompres)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file, (url) => setFormOrg({ ...formOrg, foto: url }));
                  }}
                />
              </label>
              {compressInfo && (
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">{compressInfo}</p>
              )}
            </div>

            {/* Photo Sizing & Fit Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mode Tampilan Foto</label>
                <select
                  value={formOrg.fitMode || 'cover'}
                  onChange={(e) => setFormOrg({ ...formOrg, fitMode: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden font-medium text-slate-800 bg-white text-xs sm:text-sm"
                >
                  <option value="cover">Cover Penuh (Pas & Rapi)</option>
                  <option value="contain">Utuh / Contain (Latar Blur)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Orientasi Frame</label>
                <select
                  value={formOrg.orientation || 'portrait'}
                  onChange={(e) => setFormOrg({ ...formOrg, orientation: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden font-medium text-slate-800 bg-white text-xs sm:text-sm"
                >
                  <option value="portrait">Portrait (3:4 Pas Profil)</option>
                  <option value="landscape">Landscape (16:10 Melebar)</option>
                  <option value="square">Persegi / Square (1:1)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fokus Posisi Wajah</label>
                <select
                  value={formOrg.objectPosition || 'top'}
                  onChange={(e) => setFormOrg({ ...formOrg, objectPosition: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden font-medium text-slate-800 bg-white text-xs sm:text-sm"
                >
                  <option value="top">Atas / Wajah (Rekomendasi)</option>
                  <option value="center">Tengah (Center)</option>
                  <option value="bottom">Bawah</option>
                </select>
              </div>
            </div>

            {formOrg.foto && (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 mb-2">Preview Tampilan Foto:</span>
                <div 
                  className={`relative rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-sm ${
                    formOrg.orientation === 'landscape' ? 'h-32 w-52' : formOrg.orientation === 'square' ? 'h-32 w-32' : 'h-40 w-30'
                  }`}
                >
                  <Image 
                    src={formOrg.foto} 
                    alt="Preview" 
                    fill 
                    className={
                      formOrg.fitMode === 'contain' 
                        ? 'object-contain' 
                        : `object-cover ${formOrg.objectPosition === 'center' ? 'object-center' : formOrg.objectPosition === 'bottom' ? 'object-bottom' : 'object-top'}`
                    } 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deskripsi Peran & Kontribusi</label>
              <textarea
                rows={3}
                value={formOrg.roleDescription || ''}
                onChange={(e) => setFormOrg({ ...formOrg, roleDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 sm:gap-3 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => setEditingOrg(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </AktivitasModal>

      {/* =========================================================================
          MODAL 3: TAMBAH & EDIT DICODING JOURNEY MILESTONE (UNIVERSAL PORTAL)
          ========================================================================= */}
      <AktivitasModal
        isOpen={isAddingJourney || !!editingJourney}
        onClose={() => {
          setEditingJourney(null);
          setIsAddingJourney(false);
          setFormJourney({});
        }}
        title={
          isAddingJourney
            ? 'Tambah Milestone Dicoding Baru'
            : editingJourney
            ? `Edit Tahap ${editingJourney.step}: ${editingJourney.stageName || ''}`
            : 'Milestone Dicoding'
        }
        icon={<Code2 className="w-5 h-5 text-purple-600" />}
      >
        <form onSubmit={handleSaveJourney} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* 1. Nomor & 3. Tahun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 01, 02, 06..."
                  value={formJourney.step || ''}
                  onChange={(e) => setFormJourney({ ...formJourney, step: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-hidden font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tahun
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 2026 / 2025 - 2026"
                  value={formJourney.tanggal || ''}
                  onChange={(e) => setFormJourney({ ...formJourney, tanggal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-hidden font-medium text-slate-800"
                />
              </div>
            </div>

            {/* 2. Judul */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Judul <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Dicoding Hackathon & Dev Challenge"
                value={formJourney.title || ''}
                onChange={(e) => setFormJourney({ ...formJourney, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-hidden font-medium text-slate-800"
                required
              />
            </div>

            {/* 4. Ukuran Foto */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ukuran Foto</label>
              <select
                value={formJourney.orientation || 'landscape'}
                onChange={(e) => setFormJourney({ ...formJourney, orientation: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-hidden font-medium text-slate-800 bg-white"
              >
                <option value="landscape">Landscape (Horizontal 16:10 / 16:9)</option>
                <option value="portrait">Portrait (Vertikal 3:4 / 9:16)</option>
              </select>
            </div>

            {/* 5. Upload Foto */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Upload Foto</label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-bold text-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4 shrink-0" />
                <span>{isCompressing ? 'Mengompres...' : 'Pilih File Foto (Otomatis Kompres)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file, (url) => setFormJourney({ ...formJourney, foto: url }));
                  }}
                />
              </label>
              {compressInfo && (
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">{compressInfo}</p>
              )}
              {formJourney.foto && (
                <div className="mt-2.5 relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                  <Image src={formJourney.foto} alt="Preview" fill className="object-contain" />
                </div>
              )}
            </div>

            {/* 6. Deskripsi */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deskripsi</label>
              <textarea
                rows={3}
                placeholder="Tulis deskripsi kegiatan/milestone..."
                value={formJourney.deskripsi || ''}
                onChange={(e) => setFormJourney({ ...formJourney, deskripsi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 sm:gap-3 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => {
                setEditingJourney(null);
                setIsAddingJourney(false);
                setFormJourney({});
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {isAddingJourney ? 'Tambah Milestone' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </AktivitasModal>

      {/* =========================================================================
          MODAL 4: KONFIRMASI HAPUS DENGAN PORTAL Z-[9999]
          ========================================================================= */}
      {deleteConfirmTarget && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce duration-1000">
              <Trash2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              {deleteConfirmTarget.type === 'ekskul' && 'Hapus Ekstrakurikuler?'}
              {deleteConfirmTarget.type === 'org' && 'Hapus Anggota Organisasi?'}
              {deleteConfirmTarget.type === 'journey' && 'Hapus Tahap Dicoding?'}
            </h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-800 font-bold">"{deleteConfirmTarget.nama}"</strong>? Tindakan ini akan menghapus data foto dan informasi terkait dari website.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 cursor-pointer transition-all active:scale-95"
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
