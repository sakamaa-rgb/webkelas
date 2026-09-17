'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  FolderTree, 
  Search, 
  User, 
  Crown, 
  GraduationCap, 
  PenTool, 
  Wallet, 
  Camera, 
  Edit, 
  UploadCloud, 
  X, 
  Check, 
  Sparkles, 
  Star, 
  BookOpen, 
  Calendar, 
  Quote, 
  AlignLeft, 
  Lightbulb, 
  Plus, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  GitBranch, 
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { StructureMember, Student } from '@/types/database';
import AdminModalPortal from '@/components/admin/AdminModalPortal';

interface KelolaStrukturTabProps {
  structureList: StructureMember[];
  setStructureList: React.Dispatch<React.SetStateAction<StructureMember[]>>;
  studentsList: Student[];
  upsertStructureMember: (member: Partial<StructureMember> & { id: number }) => Promise<any>;
  uploadFileToStorage: (file: File, folder: string) => Promise<string | null>;
  setSaveSuccessMsg: (msg: string | null) => void;
}

export default function KelolaStrukturTab({
  structureList,
  setStructureList,
  studentsList,
  upsertStructureMember,
  uploadFileToStorage,
  setSaveSuccessMsg
}: KelolaStrukturTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wali' | 'pimpinan' | 'administrasi' | 'seksi'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StructureMember | null>(null);
  const [isNewMember, setIsNewMember] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formExpertise, setFormExpertise] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formYear, setFormYear] = useState('2026 - 2027');
  const [formSubject, setFormSubject] = useState('');
  const [formMotto, setFormMotto] = useState('');
  const [formOrderNum, setFormOrderNum] = useState<number>(1);

  // Quick Student Selector State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Helper: Role Icon
  const getRoleIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('wali')) return <GraduationCap className="w-4 h-4 text-emerald-600" />;
    if (r.includes('ketua') && !r.includes('wakil')) return <Crown className="w-4 h-4 text-amber-500" />;
    if (r.includes('wakil')) return <Star className="w-4 h-4 text-blue-500" />;
    if (r.includes('sekretaris')) return <PenTool className="w-4 h-4 text-purple-500" />;
    if (r.includes('bendahara')) return <Wallet className="w-4 h-4 text-teal-500" />;
    if (r.includes('pdd') || r.includes('foto')) return <Camera className="w-4 h-4 text-pink-500" />;
    return <User className="w-4 h-4 text-slate-500" />;
  };

  // Helper: Category classifier
  const getMemberCategory = (role: string): 'wali' | 'pimpinan' | 'administrasi' | 'seksi' => {
    const r = role.toLowerCase();
    if (r.includes('wali')) return 'wali';
    if (r.includes('ketua')) return 'pimpinan';
    if (r.includes('sekretaris') || r.includes('bendahara')) return 'administrasi';
    return 'seksi';
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return structureList.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.expertise && m.expertise.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedCategory === 'all') return true;
      return getMemberCategory(m.role) === selectedCategory;
    });
  }, [structureList, searchQuery, selectedCategory]);

  // Open Edit Modal
  const handleOpenEdit = (member: StructureMember) => {
    setEditingMember(member);
    setIsNewMember(false);
    setFormName(member.name);
    setFormRole(member.role);
    setFormPhoto(member.photo);
    setFormExpertise(member.expertise || '');
    setFormDescription(member.description || '');
    setFormMessage(member.message || '');
    setFormYear(member.year || '2026 - 2027');
    setFormSubject(member.subject || '');
    setFormMotto(member.motto || '');
    setFormOrderNum(member.order_num || 1);
    setSelectedStudentId('');
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingMember(null);
    setIsNewMember(true);
    setFormName('');
    setFormRole('Seksi Bidang');
    setFormPhoto('/assets/uploads/students/student_001_1778723200.png');
    setFormExpertise('');
    setFormDescription('');
    setFormMessage('');
    setFormYear('2026 - 2027');
    setFormSubject('');
    setFormMotto('');
    setFormOrderNum(structureList.length + 1);
    setSelectedStudentId('');
    setIsModalOpen(true);
  };

  // Handle Quick Student Pick
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (!studentId) return;
    const s = studentsList.find((st) => st.id === studentId);
    if (s) {
      setFormName(s.name);
      if (s.photo) setFormPhoto(s.photo);
      if (s.expertise) setFormExpertise(s.expertise);
      if (s.bio) setFormDescription(s.bio);
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFileToStorage(file, 'members');
      if (url) {
        setFormPhoto(url);
      }
    }
  };

  // Save Member Submit
  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) return;

    setSaving(true);
    const updatedMember: StructureMember = {
      id: isNewMember ? Date.now() : (editingMember?.id || Date.now()),
      name: formName.trim(),
      role: formRole.trim(),
      photo: formPhoto.trim() || '/assets/uploads/students/student_001_1778723200.png',
      expertise: formExpertise.trim() || null,
      description: formDescription.trim() || null,
      message: formMessage.trim() || null,
      year: formYear.trim() || null,
      subject: formSubject.trim() || null,
      motto: formMotto.trim() || null,
      order_num: formOrderNum
    };

    try {
      await upsertStructureMember(updatedMember);

      let newList: StructureMember[];
      if (isNewMember) {
        newList = [...structureList, updatedMember];
      } else {
        newList = structureList.map((m) => (m.id === updatedMember.id ? updatedMember : m));
      }
      setStructureList(newList);
      localStorage.setItem('class_web_structure', JSON.stringify(newList));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_structure_updated'));
      }

      setSaveSuccessMsg(`Data ${updatedMember.role} (${updatedMember.name}) berhasil disimpan!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Member
  const handleDeleteMember = (id: number, name: string) => {
    if (!confirm(`Hapus jabatan/anggota "${name}" dari struktur kelas?`)) return;

    const newList = structureList.filter((m) => m.id !== id);
    setStructureList(newList);
    try {
      localStorage.setItem('class_web_structure', JSON.stringify(newList));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_structure_updated'));
      }
    } catch (err) {
      console.error(err);
    }
    setSaveSuccessMsg(`Anggota struktur "${name}" berhasil dihapus.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Header with Hero Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Pengurus Kelas</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <FolderTree className="w-7 h-7 text-blue-400" />
              <span>Struktur Organisasi Kelas</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Kelola jabatan, data nama, foto, dan visi misi pengurus kelas dengan modal interaktif modern & integrasi data siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* View Mode Switcher */}
            <div className="bg-white/10 p-1 rounded-xl flex items-center border border-white/10 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Bagan Pohon</span>
              </button>
            </div>

            {/* Add Member Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jabatan</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Jabatan', count: structureList.length },
              { id: 'wali', label: 'Wali Kelas', count: structureList.filter((m) => getMemberCategory(m.role) === 'wali').length },
              { id: 'pimpinan', label: 'Pimpinan Kelas', count: structureList.filter((m) => getMemberCategory(m.role) === 'pimpinan').length },
              { id: 'administrasi', label: 'Administrasi', count: structureList.filter((m) => getMemberCategory(m.role) === 'administrasi').length },
              { id: 'seksi', label: 'Divisi Seksi', count: structureList.filter((m) => getMemberCategory(m.role) === 'seksi').length }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau peran..."
              className="w-full pl-9 pr-3.5 py-1.5 sm:py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: GRID KARTU ANGGOTA (Clean, Modern, Interactive) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-16">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              Tidak ada anggota struktur yang cocok dengan pencarian atau filter.
            </div>
          ) : (
            filteredMembers.map((m) => {
              const category = getMemberCategory(m.role);
              const headerGradient =
                category === 'wali'
                  ? 'from-emerald-600 to-teal-700'
                  : category === 'pimpinan'
                  ? 'from-amber-500 to-orange-600'
                  : category === 'administrasi'
                  ? 'from-blue-600 to-indigo-700'
                  : 'from-purple-600 to-pink-700';

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1 relative"
                >
                  {/* Card Header Pattern */}
                  <div className={`relative h-20 bg-gradient-to-r ${headerGradient} overflow-hidden p-3 flex items-start justify-between`}>
                    <span className="px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider">
                      #{m.order_num || 1} • {category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteMember(m.id, m.name)}
                      className="p-1 rounded-lg bg-black/20 text-white/80 hover:text-rose-300 hover:bg-black/40 transition-colors cursor-pointer"
                      title="Hapus Jabatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Centered Avatar */}
                  <div className="-mt-12 text-center relative z-10 px-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg mx-auto bg-slate-100 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Role Pill Badge */}
                    <div className="mt-3 mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs uppercase tracking-wide border border-slate-200">
                      {getRoleIcon(m.role)}
                      <span>{m.role}</span>
                    </div>

                    {/* Member Name */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {m.name}
                    </h3>

                    {/* Subject / Expertise */}
                    {m.expertise ? (
                      <p className="text-xs text-blue-600 font-semibold mt-0.5 flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-blue-600" />
                        <span>{m.expertise}</span>
                      </p>
                    ) : m.subject ? (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {m.subject}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">Pengurus Kelas XI PPLG 3</p>
                    )}
                  </div>

                  {/* Body Info Snippet */}
                  <div className="p-4 pt-3 flex-1 flex flex-col justify-between border-t border-slate-100 mt-3">
                    {m.motto || m.description ? (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 text-center bg-slate-50 p-2 rounded-xl">
                        &ldquo;{m.motto || m.description}&rdquo;
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}

                    {/* Action: Edit Button */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Anggota</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: BAGAN POHON ORGANISASI (Visual Hierarchical Chart) */}
      {viewMode === 'tree' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm overflow-x-auto">
          <div className="min-w-[650px] flex flex-col items-center space-y-8">
            {/* Level 1: Wali Kelas */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
                Level 1: Pembina & Wali Kelas
              </span>
              {structureList.filter((m) => getMemberCategory(m.role) === 'wali').map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleOpenEdit(m)}
                  className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md cursor-pointer hover:scale-102 transition-all"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-emerald-200">
                    <Image src={m.photo} alt={m.name} fill className="object-cover object-top" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-emerald-700 uppercase">{m.role}</div>
                    <div className="text-sm font-black text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.subject || m.expertise || 'Wali Kelas'}</div>
                  </div>
                  <Edit className="w-4 h-4 text-emerald-600 ml-3" />
                </div>
              ))}
              <div className="w-0.5 h-8 bg-slate-300 mt-2" />
            </div>

            {/* Level 2: Ketua & Wakil */}
            <div className="flex flex-col items-center w-full">
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider mb-2">
                Level 2: Pimpinan Kelas
              </span>
              <div className="flex items-center justify-center gap-6">
                {structureList.filter((m) => getMemberCategory(m.role) === 'pimpinan').map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenEdit(m)}
                    className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md cursor-pointer hover:scale-102 transition-all w-60"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-amber-200">
                      <Image src={m.photo} alt={m.name} fill className="object-cover object-top" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold text-amber-700 uppercase">{m.role}</div>
                      <div className="text-sm font-black text-slate-900 truncate">{m.name}</div>
                    </div>
                    <Edit className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="w-0.5 h-8 bg-slate-300 mt-2" />
            </div>

            {/* Level 3: Administrasi (Sekretaris & Bendahara) */}
            <div className="flex flex-col items-center w-full">
              <span className="text-xs font-black uppercase text-blue-700 tracking-wider mb-2">
                Level 3: Administrasi & Keuangan
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {structureList.filter((m) => getMemberCategory(m.role) === 'administrasi').map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenEdit(m)}
                    className="bg-blue-50/80 border-2 border-blue-300 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer hover:scale-102 transition-all w-56"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-blue-200">
                      <Image src={m.photo} alt={m.name} fill className="object-cover object-top" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold text-blue-700 uppercase">{m.role}</div>
                      <div className="text-xs font-black text-slate-900 truncate">{m.name}</div>
                    </div>
                    <Edit className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="w-0.5 h-8 bg-slate-300 mt-2" />
            </div>

            {/* Level 4: Seksi Bidang */}
            <div className="flex flex-col items-center w-full">
              <span className="text-xs font-black uppercase text-purple-700 tracking-wider mb-2">
                Level 4: Divisi & Seksi Bidang
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {structureList.filter((m) => getMemberCategory(m.role) === 'seksi').map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenEdit(m)}
                    className="bg-purple-50/80 border-2 border-purple-300 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer hover:scale-102 transition-all w-56"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-purple-200">
                      <Image src={m.photo} alt={m.name} fill className="object-cover object-top" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold text-purple-700 uppercase">{m.role}</div>
                      <div className="text-xs font-black text-slate-900 truncate">{m.name}</div>
                    </div>
                    <Edit className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: EDIT & TAMBAH ANGGOTA STRUKTUR */}
      <AdminModalPortal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        backdropClass="bg-slate-950/75 backdrop-blur-xs"
      >
        <div 
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {isNewMember ? 'Tambah Anggota Struktur Baru' : `Edit Anggota: ${formRole}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Isi biodata pengurus kelas atau pilih langsung dari data siswa.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitMember} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm no-scrollbar">
                {/* 1. Quick Student Picker Banner */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Pilih Cepat dari Data Siswa Kelas:
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      Auto-Fill 1 Klik
                    </span>
                  </div>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleSelectStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="">-- Pilih Nama Siswa XI PPLG 3 --</option>
                    {studentsList.map((st) => (
                      <option key={st.id} value={st.id}>
                        #{st.id} - {st.name} {st.nisn ? `(NISN: ${st.nisn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Photo and Avatar Preview */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md flex-shrink-0">
                    <Image
                      src={formPhoto || '/assets/uploads/students/student_001_1778723200.png'}
                      alt="Avatar"
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                    <label className="block text-xs font-bold text-slate-700">
                      Foto Profil Anggota
                    </label>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors">
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        <span>Upload Foto Baru...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <input
                        type="text"
                        value={formPhoto}
                        onChange={(e) => setFormPhoto(e.target.value)}
                        placeholder="Atau masukkan URL / path foto..."
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Role & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Jabatan / Peran <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      list="role-suggestions"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="Contoh: Ketua Kelas, Sekretaris 1"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                    <datalist id="role-suggestions">
                      <option value="Wali Kelas" />
                      <option value="Ketua Kelas" />
                      <option value="Wakil Ketua" />
                      <option value="Sekretaris 1" />
                      <option value="Sekretaris 2" />
                      <option value="Bendahara 1" />
                      <option value="Bendahara 2" />
                      <option value="Seksi PDD (Publikasi & Dokumentasi)" />
                      <option value="Seksi Kebersihan" />
                      <option value="Seksi Keamanan" />
                      <option value="Seksi Kerohanian" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Nama lengkap pengurus..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* 4. Expertise & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Keahlian / Fokus Pengurus
                    </label>
                    <input
                      type="text"
                      value={formExpertise}
                      onChange={(e) => setFormExpertise(e.target.value)}
                      placeholder="Contoh: Web Developer & UI/UX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mata Pelajaran (Khusus Guru / Wali)
                    </label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Contoh: Pemrograman Web & PPLG"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* 5. Year & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tahun Ajaran
                    </label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="2026 - 2027"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Urutan Tampil (#)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formOrderNum}
                      onChange={(e) => setFormOrderNum(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* 6. Motto */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Motto / Kalimat Inspiratif
                  </label>
                  <input
                    type="text"
                    value={formMotto}
                    onChange={(e) => setFormMotto(e.target.value)}
                    placeholder="Contoh: Disiplin, Berkarya, dan Berprestasi bersama XI PPLG 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                {/* 7. Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Deskripsi / Biodata Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tuliskan peran atau deskripsi pengurus..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                {/* 8. Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pesan untuk Siswa Kelas
                  </label>
                  <textarea
                    rows={2}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Pesan atau motivasi untuk seluruh anggota kelas..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Anggota Struktur'}</span>
                  </button>
                </div>
              </form>
            </div>
        </AdminModalPortal>
    </div>
  );
}
