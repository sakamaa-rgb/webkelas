'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Paintbrush, 
  Monitor, 
  Film, 
  Code, 
  Image as ImageIcon, 
  MessageSquare, 
  Contact as ContactIcon, 
  Clock, 
  ExternalLink, 
  LogOut, 
  Zap,
  FolderTree,
  Eye,
  Menu,
  X,
  User,
  CheckCircle2,
  Trash2,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Calendar,
  BookOpen,
  Lightbulb,
  AlignLeft,
  Quote,
  Crown,
  GraduationCap,
  PenTool,
  Wallet,
  Shield,
  UserPlus,
  MoreVertical,
  Edit,
  CreditCard,
  Hash,
  Mail,
  Globe,
  Briefcase,
  FileText,
  AlertTriangle,
  Sparkles,
  Check,
  Plus,
  Coffee,
  UserCheck,
  RotateCcw,
  Play,
  Video,
  Camera,
  Maximize2,
  Layers,
  EyeOff,
  Terminal,
  Phone,
  MapPin,
  Activity,
  ShieldAlert,
  History,
  Copy,
  Download,
  RefreshCw,
  MessageCircle,
  Music2
} from 'lucide-react';
import KelolaMusicTab from '@/components/admin/KelolaMusicTab';
import AdminModalPortal from '@/components/admin/AdminModalPortal';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { 
  initialStudents, 
  initialStructure, 
  initialProjects, 
  initialJadwalPelajaran, 
  initialJadwalPiket, 
  initialGallery, 
  initialVideos, 
  initialContact, 
  initialComments 
} from '@/data/seedData';
import { StructureMember, Student, JadwalPiket, JadwalPelajaran, VideoKelas, GalleryItem, Project, ProjectComment } from '@/types/database';

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

export interface ActivityLogItem {
  id: string;
  actor: string;
  actorRole: 'admin' | 'student' | 'guest' | 'system';
  action: string;
  category: 'auth' | 'content' | 'student' | 'schedule' | 'project' | 'profile';
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'info' | 'warning';
}

export const initialActivityLogs: ActivityLogItem[] = [
  {
    id: 'log-1',
    actor: 'Admin XI PPLG 3',
    actorRole: 'admin',
    action: 'Otentikasi berhasil via login dashboard',
    category: 'auth',
    target: 'Sesi Dashboard Admin',
    timestamp: 'Baru saja',
    ip: '192.168.1.10 - Chrome / Windows',
    status: 'success'
  },
  {
    id: 'log-2',
    actor: 'Sistem Sinkronisasi',
    actorRole: 'system',
    action: 'Pemeriksaan status pergantian pekan piket otomatis',
    category: 'schedule',
    target: 'Jadwal Piket Minggu Ini',
    timestamp: '15 menit lalu',
    ip: '127.0.0.1 - Cron Background',
    status: 'info'
  },
  {
    id: 'log-3',
    actor: 'Muhammad Rajib Zahir',
    actorRole: 'student',
    action: 'Memperbarui link portofolio GitHub dan biodata',
    category: 'student',
    target: 'Profil Siswa (NISN: 0072819201)',
    timestamp: '42 menit lalu',
    ip: '114.122.45.89 - Safari / iOS',
    status: 'success'
  },
  {
    id: 'log-4',
    actor: 'Admin XI PPLG 3',
    actorRole: 'admin',
    action: 'Menambahkan dokumentasi foto baru ke galeri',
    category: 'content',
    target: 'Galeri Kategori: Kebersamaan',
    timestamp: '2 jam lalu',
    ip: '192.168.1.10 - Chrome / Windows',
    status: 'success'
  },
  {
    id: 'log-5',
    actor: 'Pengunjung (Siti Maisaroh)',
    actorRole: 'guest',
    action: 'Mengirimkan pesan apresiasi buku tamu',
    category: 'content',
    target: 'Buku Tamu Publik',
    timestamp: '3 jam lalu',
    ip: '180.245.33.12 - Android WebKit',
    status: 'info'
  },
  {
    id: 'log-6',
    actor: 'Admin XI PPLG 3',
    actorRole: 'admin',
    action: 'Mengubah status visibilitas komentar proyek',
    category: 'project',
    target: 'Proyek: E-Commerce Herbal',
    timestamp: '5 jam lalu',
    ip: '192.168.1.10 - Chrome / Windows',
    status: 'success'
  },
  {
    id: 'log-7',
    actor: 'Revand Aqilla Al Hafiz',
    actorRole: 'student',
    action: 'Menandai tugas piket harian telah diselesaikan',
    category: 'schedule',
    target: 'Checklist Piket: Senin',
    timestamp: 'Kemarin, 14:20 WIB',
    ip: '118.98.112.5 - Chrome / Android',
    status: 'success'
  },
  {
    id: 'log-8',
    actor: 'Sistem Keamanan',
    actorRole: 'system',
    action: 'Pencegahan percobaan unauthorized request',
    category: 'auth',
    target: '/api/admin/eval',
    timestamp: 'Kemarin, 09:15 WIB',
    ip: '36.72.190.21 - Blocked Access',
    status: 'warning'
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Structure State
  const [structureList, setStructureList] = useState<StructureMember[]>(initialStructure);
  const [expandedMembers, setExpandedMembers] = useState<Record<number, boolean>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Students Management State (Matching webkelas.wuaze.com/admin/students.php)
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [searchStudent, setSearchStudent] = useState('');
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Student Modals
  const [modalBiodataStudent, setModalBiodataStudent] = useState<Student | null>(null);
  const [modalEditStudent, setModalEditStudent] = useState<Student | null>(null);
  const [modalAddOpen, setModalAddOpen] = useState(false);

  // Student Delete Animation & Modal
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Student Add Form
  const [addId, setAddId] = useState('');
  const [addNisn, setAddNisn] = useState('');
  const [addName, setAddName] = useState('');
  const [addClass, setAddClass] = useState('X PPLG 3');
  const [addPhoto, setAddPhoto] = useState('/assets/uploads/students/student_001_1778723200.png');

  // Student Edit Form
  const [editId, setEditId] = useState('');
  const [editNisn, setEditNisn] = useState('');
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('X PPLG 3');
  const [editPhoto, setEditPhoto] = useState('');

  // Piket Management State
  const [piketList, setPiketList] = useState<JadwalPiket[]>(initialJadwalPiket);
  const [selectedPiketDay, setSelectedPiketDay] = useState<string>('Semua');
  const [piketCompleted, setPiketCompleted] = useState<Record<number, boolean>>({});
  const [modalPiketOpen, setModalPiketOpen] = useState(false);
  const [editingPiket, setEditingPiket] = useState<JadwalPiket | null>(null);
  const [piketFormDay, setPiketFormDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [piketFormName, setPiketFormName] = useState('');
  const [piketFormPj, setPiketFormPj] = useState('');

  // Jadwal Pelajaran State
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(initialJadwalPelajaran);
  const [selectedJadwalDay, setSelectedJadwalDay] = useState<string>('Semua');
  const [modalJadwalOpen, setModalJadwalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalPelajaran | null>(null);
  const [jadwalToDelete, setJadwalToDelete] = useState<JadwalPelajaran | null>(null);
  const [deletingJadwalId, setDeletingJadwalId] = useState<number | null>(null);

  // Jadwal Form
  const [jadwalFormDay, setJadwalFormDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');
  const [jadwalFormMataPelajaran, setJadwalFormMataPelajaran] = useState('');
  const [jadwalFormGuru, setJadwalFormGuru] = useState('');
  const [jadwalFormJamMulai, setJadwalFormJamMulai] = useState('07.30');
  const [jadwalFormJamSelesai, setJadwalFormJamSelesai] = useState('08.50');
  const [jadwalFormUrutan, setJadwalFormUrutan] = useState<number>(1);
  const [jadwalIsBreak, setJadwalIsBreak] = useState(false);

  // Video Management State
  const [videosList, setVideosList] = useState<VideoKelas[]>(initialVideos);
  const [selectedPlayVideo, setSelectedPlayVideo] = useState<VideoKelas | null>(null);
  const [modalVideoOpen, setModalVideoOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoKelas | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<VideoKelas | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);

  // Video Form
  const [videoFormJudul, setVideoFormJudul] = useState('');
  const [videoFormDeskripsi, setVideoFormDeskripsi] = useState('');
  const [videoFormUrl, setVideoFormUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoFormThumbnail, setVideoFormThumbnail] = useState('');
  const [videoFormTanggal, setVideoFormTanggal] = useState('');

  // Gallery Management State
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(initialGallery);
  const [searchGallery, setSearchGallery] = useState('');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('Semua');
  const [modalGalleryOpen, setModalGalleryOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<GalleryItem | null>(null);
  const [deletingGalleryId, setDeletingGalleryId] = useState<number | null>(null);
  const [selectedPreviewGallery, setSelectedPreviewGallery] = useState<GalleryItem | null>(null);

  // Gallery Form
  const [galleryFormCaption, setGalleryFormCaption] = useState('');
  const [galleryFormCategory, setGalleryFormCategory] = useState('Kebersamaan');
  const [galleryFormImage, setGalleryFormImage] = useState('');
  const [galleryFileName, setGalleryFileName] = useState('');

  // Projects Management State
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [searchProject, setSearchProject] = useState('');
  const [modalProjectOpen, setModalProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);

  // Project Form
  const [projectFormTitle, setProjectFormTitle] = useState('');
  const [projectFormDescription, setProjectFormDescription] = useState('');
  const [projectFormImage, setProjectFormImage] = useState('');
  const [projectFileName, setProjectFileName] = useState('');
  const [projectFormLink, setProjectFormLink] = useState('');
  const [projectFormMakers, setProjectFormMakers] = useState('');
  const [projectFormTechStack, setProjectFormTechStack] = useState('');
  const [projectFormFeatured, setProjectFormFeatured] = useState(false);

  // Comments Moderation State
  const [commentsList, setCommentsList] = useState<ProjectComment[]>(initialComments);
  const [searchComment, setSearchComment] = useState('');
  const [commentFilterStatus, setCommentFilterStatus] = useState<'all' | 'visible' | 'hidden'>('all');
  const [commentToDelete, setCommentToDelete] = useState<ProjectComment | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  // Contact & Profile State (Kiri: Contact, Kanan: Profile)
  const [contactInstagram, setContactInstagram] = useState(initialContact.instagram || '@xpplg.3rd');
  const [contactWhatsapp, setContactWhatsapp] = useState(initialContact.whatsapp || '6281294862060');
  const [contactEmail, setContactEmail] = useState(initialContact.email || 'classxpplg3@gmail.com');
  const [contactTiktok, setContactTiktok] = useState('@xipplg3.official');
  const [contactAddress, setContactAddress] = useState('SMK Penerbangan Bogor, Jl. Raya Sukabumi No. 12, Kota Bogor');
  const [savingContact, setSavingContact] = useState(false);
  const [contactSaveSuccess, setContactSaveSuccess] = useState(false);

  // Profile Website State (Kanan)
  const [profileClassName, setProfileClassName] = useState('XI PPLG 3');
  const [profileSchoolName, setProfileSchoolName] = useState('SMK Penerbangan Bogor');
  const [profileTagline, setProfileTagline] = useState('Unggul dalam Teknologi, Kreatif dalam Inovasi & Bersatu');
  const [profileYear, setProfileYear] = useState('2026 / 2027');
  const [profileDescription, setProfileDescription] = useState('Portal web resmi kelas XI PPLG 3 SMK Penerbangan Bogor sebagai wadah karya, portofolio digital, dan dokumentasi kebersamaan siswa.');
  const [profileLogo, setProfileLogo] = useState(initialContact.logo || '/assets/uploads/logo/logo_1787282041.jpeg');
  const [profileLogoFileName, setProfileLogoFileName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Activity Log State
  const [activityLogsList, setActivityLogsList] = useState<ActivityLogItem[]>(initialActivityLogs);
  const [searchLog, setSearchLog] = useState('');
  const [selectedLogCategory, setSelectedLogCategory] = useState<string>('Semua');
  const [modalClearLogsOpen, setModalClearLogsOpen] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('class_web_admin');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
    } else {
      setCheckingAuth(false);
    }

    // Persisted students list from localStorage
    const saved = localStorage.getItem('class_students_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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

    // Persisted structure list from localStorage
    const savedStructure = localStorage.getItem('class_web_structure');
    if (savedStructure) {
      try {
        const parsed = JSON.parse(savedStructure);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStructureList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Persisted piket list & weekly auto-reset status
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
      const savedPiket = localStorage.getItem('class_piket_completed');
      if (savedPiket) {
        try {
          setPiketCompleted(JSON.parse(savedPiket));
        } catch (e) {
          console.error(e);
        }
      }
    }
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

    // Persisted jadwal pelajaran list
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

    // Persisted videos list
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

    // Persisted gallery list
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

    // Persisted projects list
    const savedProjects = localStorage.getItem('class_projects_list');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjectsList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Persisted comments list
    const savedComments = localStorage.getItem('class_comments_list');
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCommentsList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Persisted contact info
    const savedContact = localStorage.getItem('class_web_contact');
    if (savedContact) {
      try {
        const parsed = JSON.parse(savedContact);
        if (parsed.instagram) setContactInstagram(parsed.instagram);
        if (parsed.whatsapp) setContactWhatsapp(parsed.whatsapp);
        if (parsed.email) setContactEmail(parsed.email);
        if (parsed.tiktok) setContactTiktok(parsed.tiktok);
        if (parsed.address) setContactAddress(parsed.address);
      } catch (e) {
        console.error(e);
      }
    }

    // Persisted profile info
    const savedProfile = localStorage.getItem('class_web_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.className) setProfileClassName(parsed.className);
        if (parsed.schoolName) setProfileSchoolName(parsed.schoolName);
        if (parsed.tagline) setProfileTagline(parsed.tagline);
        if (parsed.year) setProfileYear(parsed.year);
        if (parsed.description) setProfileDescription(parsed.description);
        if (parsed.logo) setProfileLogo(parsed.logo);
      } catch (e) {
        console.error(e);
      }
    }

    // Persisted activity logs
    const savedLogs = localStorage.getItem('class_activity_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActivityLogsList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Read tab parameter from URL
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('class_web_admin');
    localStorage.removeItem('class_web_user');
    localStorage.removeItem('class_user_role');
    router.push('/admin/login');
  };

  const toggleExpandMember = (id: number) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMemberChange = (id: number, field: keyof StructureMember, value: string) => {
    setStructureList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handlePhotoChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setStructureList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, photo: previewUrl } : m))
      );
    }
  };

  const handleSaveMember = (id: number) => {
    setSavingId(id);
    try {
      localStorage.setItem('class_web_structure', JSON.stringify(structureList));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_structure_updated'));
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setSavingId(null);
      const member = structureList.find((m) => m.id === id);
      setSaveSuccessMsg(`Data ${member?.role || 'struktur'} berhasil disimpan!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 400);
  };

  // Student CRUD Operations
  const openEditModal = (student: Student) => {
    setModalEditStudent(student);
    setEditId(student.id);
    setEditNisn(student.nisn || '');
    setEditName(student.name);
    setEditClass(student.kelas || 'X PPLG 3');
    setEditPhoto(student.photo);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditStudent) return;
    setStudentsList((prev) => {
      const updated = prev.map((s) =>
        s.id === modalEditStudent.id
          ? {
              ...s,
              id: editId.trim() || s.id,
              name: editName.trim() || s.name,
              nisn: editNisn.trim() || null,
              kelas: editClass.trim() || 'X PPLG 3',
              photo: editPhoto || s.photo
            }
          : s
      );
      try {
        localStorage.setItem('class_students_list', JSON.stringify(updated));
        localStorage.setItem('class_web_students', JSON.stringify(updated));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_students_updated'));
        }
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    setModalEditStudent(null);
    setSaveSuccessMsg(`Data siswa ${editName} berhasil diperbarui!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    const assignedId = addId.trim() || String(studentsList.length + 1).padStart(3, '0');
    const newStudent: Student = {
      id: assignedId,
      name: addName.trim(),
      nisn: addNisn.trim() || null,
      kelas: addClass.trim() || 'X PPLG 3',
      photo: addPhoto || '/assets/uploads/students/student_001_1778723200.png'
    };
    setStudentsList((prev) => {
      const updated = [newStudent, ...prev];
      try {
        localStorage.setItem('class_students_list', JSON.stringify(updated));
        localStorage.setItem('class_web_students', JSON.stringify(updated));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_students_updated'));
        }
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    setModalAddOpen(false);
    setAddId('');
    setAddNisn('');
    setAddName('');
    setAddClass('X PPLG 3');
    setSaveSuccessMsg(`Siswa baru ${newStudent.name} berhasil ditambahkan!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setActiveActionMenuId(null);
  };

  const executeDeleteStudent = () => {
    if (!studentToDelete) return;
    const targetId = studentToDelete.id;
    const targetName = studentToDelete.name;

    // 1. Close modal
    setStudentToDelete(null);

    // 2. Trigger exit animation on card
    setDeletingId(targetId);

    // 3. After animation completes (400ms), remove from state & persist
    setTimeout(() => {
      setStudentsList((prev) => {
        const updated = prev.filter((s) => s.id !== targetId);
        try {
          localStorage.setItem('class_students_list', JSON.stringify(updated));
          localStorage.setItem('class_web_students', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_students_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingId(null);
      setSaveSuccessMsg(`Data siswa ${targetName} berhasil dihapus!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 400);
  };

  const handleAddPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAddPhoto(previewUrl);
    }
  };

  const handleEditPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditPhoto(previewUrl);
    }
  };

  // Piket Handlers
  const togglePiketStatus = (id: number) => {
    const currentWeek = getWeekKey();
    setPiketCompleted((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('class_piket_completed', JSON.stringify(updated));
        localStorage.setItem('class_piket_week', currentWeek);
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleResetPiketWeek = () => {
    if (confirm('Reset seluruh checklist piket untuk minggu ini kembali ke awal (0% selesai)?')) {
      setPiketCompleted({});
      try {
        localStorage.setItem('class_piket_completed', JSON.stringify({}));
        localStorage.setItem('class_piket_week', getWeekKey());
      } catch (e) {
        console.error(e);
      }
      setSaveSuccessMsg('Status checklist piket minggu ini berhasil di-reset!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const getStudentPhotoByName = (name: string) => {
    const student = studentsList.find((s) =>
      s.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
    );
    return student?.photo || '/assets/uploads/students/student_001_1778723200.png';
  };

  const openAddPiketModal = (day?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => {
    setEditingPiket(null);
    setPiketFormDay(day || 'Senin');
    setPiketFormName('');
    const existingPj = piketList.find((p) => p.hari === (day || 'Senin'))?.pj || '';
    setPiketFormPj(existingPj);
    setModalPiketOpen(true);
  };

  const openEditPiketModal = (piket: JadwalPiket) => {
    setEditingPiket(piket);
    setPiketFormDay(piket.hari as any);
    setPiketFormName(piket.nama_siswa);
    setPiketFormPj(piket.pj);
    setModalPiketOpen(true);
  };

  const handleSavePiket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!piketFormName.trim()) return;

    if (editingPiket) {
      setPiketList((prev) => {
        const updated = prev.map((p) =>
          p.id === editingPiket.id
            ? { ...p, hari: piketFormDay, nama_siswa: piketFormName.trim(), pj: piketFormPj.trim() || p.pj }
            : p
        );
        try { 
          localStorage.setItem('class_piket_list', JSON.stringify(updated)); 
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_piket_updated'));
          }
        } catch(err){}
        return updated;
      });
      setSaveSuccessMsg(`Tugas piket ${piketFormName} berhasil diperbarui!`);
    } else {
      const newPiket: JadwalPiket = {
        id: Date.now(),
        hari: piketFormDay,
        nama_siswa: piketFormName.trim(),
        urutan: piketList.filter((p) => p.hari === piketFormDay).length + 1,
        pj: piketFormPj.trim() || 'PJ Kebersihan'
      };
      setPiketList((prev) => {
        const updated = [...prev, newPiket];
        try { 
          localStorage.setItem('class_piket_list', JSON.stringify(updated)); 
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_piket_updated'));
          }
        } catch(err){}
        return updated;
      });
      setSaveSuccessMsg(`Petugas piket ${newPiket.nama_siswa} berhasil ditambahkan!`);
    }
    setModalPiketOpen(false);
    setEditingPiket(null);
    setPiketFormName('');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeletePiket = (id: number) => {
    const piketItem = piketList.find((p) => p.id === id);
    if (confirm(`Hapus ${piketItem?.nama_siswa || 'siswa'} dari jadwal piket hari ${piketItem?.hari}?`)) {
      setPiketList((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        try { 
          localStorage.setItem('class_piket_list', JSON.stringify(updated)); 
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_piket_updated'));
          }
        } catch(err){}
        return updated;
      });
      setSaveSuccessMsg(`Petugas piket berhasil dihapus.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Jadwal Pelajaran Handlers
  const openAddJadwalModal = (day?: string) => {
    setEditingJadwal(null);
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const targetDay = (day && validDays.includes(day))
      ? (day as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')
      : 'Senin';
    setJadwalFormDay(targetDay);
    setJadwalFormMataPelajaran('');
    setJadwalFormGuru('');
    setJadwalFormJamMulai('07.30');
    setJadwalFormJamSelesai('08.50');
    setJadwalIsBreak(false);
    const currentDayItems = jadwalList.filter((j) => j.hari === targetDay);
    setJadwalFormUrutan(currentDayItems.length + 1);
    setModalJadwalOpen(true);
  };

  const openEditJadwalModal = (jadwal: JadwalPelajaran) => {
    setEditingJadwal(jadwal);
    setJadwalFormDay(jadwal.hari as any);
    setJadwalFormMataPelajaran(jadwal.mata_pelajaran);
    setJadwalFormGuru(jadwal.guru);
    setJadwalFormJamMulai(jadwal.jam_mulai);
    setJadwalFormJamSelesai(jadwal.jam_selesai);
    setJadwalFormUrutan(jadwal.urutan);
    const isBreak =
      jadwal.mata_pelajaran.toUpperCase().includes('ISTIRAHAT') ||
      jadwal.mata_pelajaran.toUpperCase().includes('ISHOMA') ||
      jadwal.mata_pelajaran.toUpperCase().includes('SHOLJUM');
    setJadwalIsBreak(isBreak);
    setModalJadwalOpen(true);
  };

  const handleSaveJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMapel = jadwalIsBreak ? 'ISTIRAHAT' : jadwalFormMataPelajaran.trim();
    if (!finalMapel) return;

    const finalGuru = jadwalIsBreak ? '-' : (jadwalFormGuru.trim() || '-');

    if (editingJadwal) {
      setJadwalList((prev) => {
        const updated = prev.map((item) =>
          item.id === editingJadwal.id
            ? {
                ...item,
                hari: jadwalFormDay,
                mata_pelajaran: finalMapel,
                guru: finalGuru,
                jam_mulai: jadwalFormJamMulai.trim() || '07.30',
                jam_selesai: jadwalFormJamSelesai.trim() || '08.50',
                urutan: Number(jadwalFormUrutan) || 1
              }
            : item
        );
        try {
          localStorage.setItem('class_jadwal_pelajaran', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_jadwal_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Sesi ${finalMapel} (${jadwalFormDay}) berhasil disimpan!`);
    } else {
      const newJadwal: JadwalPelajaran = {
        id: Date.now(),
        hari: jadwalFormDay,
        mata_pelajaran: finalMapel,
        guru: finalGuru,
        jam_mulai: jadwalFormJamMulai.trim() || '07.30',
        jam_selesai: jadwalFormJamSelesai.trim() || '08.50',
        urutan: Number(jadwalFormUrutan) || (jadwalList.filter((j) => j.hari === jadwalFormDay).length + 1)
      };
      setJadwalList((prev) => {
        const updated = [...prev, newJadwal];
        try {
          localStorage.setItem('class_jadwal_pelajaran', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_jadwal_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Sesi ${finalMapel} (${jadwalFormDay}) berhasil ditambahkan!`);
    }

    setModalJadwalOpen(false);
    setEditingJadwal(null);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const confirmDeleteJadwal = (item: JadwalPelajaran) => {
    setJadwalToDelete(item);
  };

  const executeDeleteJadwal = () => {
    if (!jadwalToDelete) return;
    const targetId = jadwalToDelete.id;
    const targetName = jadwalToDelete.mata_pelajaran;
    const targetDay = jadwalToDelete.hari;

    setJadwalToDelete(null);
    setDeletingJadwalId(targetId);

    setTimeout(() => {
      setJadwalList((prev) => {
        const updated = prev.filter((j) => j.id !== targetId);
        try {
          localStorage.setItem('class_jadwal_pelajaran', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_jadwal_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingJadwalId(null);
      setSaveSuccessMsg(`Sesi ${targetName} (${targetDay}) berhasil dihapus!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 350);
  };

  const getSubjectCategory = (mapel: string) => {
    const m = mapel.toUpperCase();
    if (m.includes('ISTIRAHAT') || m.includes('ISHOMA') || m.includes('SHOLJUM')) {
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

  // Video Handlers
  const openAddVideoModal = () => {
    setEditingVideo(null);
    setVideoFormJudul('');
    setVideoFormDeskripsi('');
    setVideoFormUrl('');
    setVideoFileName('');
    setVideoFormThumbnail('');
    setVideoFormTanggal(new Date().toISOString().split('T')[0]);
    setModalVideoOpen(true);
  };

  const openEditVideoModal = (v: VideoKelas) => {
    setEditingVideo(v);
    setVideoFormJudul(v.judul);
    setVideoFormDeskripsi(v.deskripsi || '');
    setVideoFormUrl(v.url_video);
    setVideoFileName(v.url_video.split('/').pop() || 'Video File');
    setVideoFormThumbnail(v.thumbnail);
    setVideoFormTanggal(v.tanggal || '');
    setModalVideoOpen(true);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoFormUrl(videoUrl);
      setVideoFileName(file.name);
    }
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFormJudul.trim()) return;
    if (!videoFormUrl) {
      alert('Silakan upload file video terlebih dahulu!');
      return;
    }

    const defaultThumbnail = '/assets/uploads/thumbnails/thumb_1787385653_720.jpeg';

    if (editingVideo) {
      setVideosList((prev) => {
        const updated = prev.map((item) =>
          item.id === editingVideo.id
            ? {
                ...item,
                judul: videoFormJudul.trim(),
                deskripsi: videoFormDeskripsi.trim() || null,
                url_video: videoFormUrl.trim(),
                thumbnail: videoFormThumbnail.trim() || defaultThumbnail,
                tanggal: videoFormTanggal || new Date().toISOString().split('T')[0]
              }
            : item
        );
        try {
          localStorage.setItem('class_videos_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_videos_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Video "${videoFormJudul}" berhasil diperbarui!`);
    } else {
      const newVideo: VideoKelas = {
        id: Date.now(),
        judul: videoFormJudul.trim(),
        deskripsi: videoFormDeskripsi.trim() || null,
        url_video: videoFormUrl.trim(),
        thumbnail: videoFormThumbnail.trim() || defaultThumbnail,
        tanggal: videoFormTanggal || new Date().toISOString().split('T')[0]
      };
      setVideosList((prev) => {
        const updated = [newVideo, ...prev];
        try {
          localStorage.setItem('class_videos_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_videos_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Video "${newVideo.judul}" berhasil ditambahkan!`);
    }

    setModalVideoOpen(false);
    setEditingVideo(null);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const confirmDeleteVideo = (v: VideoKelas) => {
    setVideoToDelete(v);
  };

  const executeDeleteVideo = () => {
    if (!videoToDelete) return;
    const targetId = videoToDelete.id;
    const targetJudul = videoToDelete.judul;

    setVideoToDelete(null);
    setDeletingVideoId(targetId);

    setTimeout(() => {
      setVideosList((prev) => {
        const updated = prev.filter((v) => v.id !== targetId);
        try {
          localStorage.setItem('class_videos_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_videos_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingVideoId(null);
      setSaveSuccessMsg(`Video "${targetJudul}" berhasil dihapus!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 350);
  };

  const handleVideoThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoFormThumbnail(previewUrl);
    }
  };

  // Gallery Handlers
  const openAddGalleryModal = () => {
    setEditingGallery(null);
    setGalleryFormCaption('');
    setGalleryFormCategory('Kebersamaan');
    setGalleryFormImage('');
    setGalleryFileName('');
    setModalGalleryOpen(true);
  };

  const openEditGalleryModal = (g: GalleryItem) => {
    setEditingGallery(g);
    setGalleryFormCaption(g.caption);
    setGalleryFormCategory(g.category);
    setGalleryFormImage(g.image);
    setGalleryFileName(g.image.split('/').pop() || 'Foto');
    setModalGalleryOpen(true);
  };

  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setGalleryFormImage(previewUrl);
      setGalleryFileName(file.name);
    }
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormCaption.trim()) return;
    if (!galleryFormImage) {
      alert('Silakan pilih file foto terlebih dahulu!');
      return;
    }

    if (editingGallery) {
      setGalleryList((prev) => {
        const updated = prev.map((item) =>
          item.id === editingGallery.id
            ? {
                ...item,
                caption: galleryFormCaption.trim(),
                category: galleryFormCategory,
                image: galleryFormImage
              }
            : item
        );
        try {
          localStorage.setItem('class_gallery_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_gallery_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Foto "${galleryFormCaption}" berhasil diperbarui!`);
    } else {
      const newGallery: GalleryItem = {
        id: Date.now(),
        caption: galleryFormCaption.trim(),
        category: galleryFormCategory,
        image: galleryFormImage
      };
      setGalleryList((prev) => {
        const updated = [newGallery, ...prev];
        try {
          localStorage.setItem('class_gallery_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_gallery_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Foto baru berhasil ditambahkan ke Galeri!`);
    }

    setModalGalleryOpen(false);
    setEditingGallery(null);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const confirmDeleteGallery = (g: GalleryItem) => {
    setGalleryToDelete(g);
  };

  const executeDeleteGallery = () => {
    if (!galleryToDelete) return;
    const targetId = galleryToDelete.id;
    const targetCaption = galleryToDelete.caption;

    setGalleryToDelete(null);
    setDeletingGalleryId(targetId);

    setTimeout(() => {
      setGalleryList((prev) => {
        const updated = prev.filter((g) => g.id !== targetId);
        try {
          localStorage.setItem('class_gallery_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_gallery_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingGalleryId(null);
      setSaveSuccessMsg(`Foto "${targetCaption}" berhasil dihapus dari galeri!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 350);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Upacara':
        return 'bg-blue-600/90 text-white border-blue-400/40';
      case 'Acara':
        return 'bg-purple-600/90 text-white border-purple-400/40';
      case 'Peringatan':
        return 'bg-amber-600/90 text-white border-amber-400/40';
      case 'Kebersamaan':
        return 'bg-emerald-600/90 text-white border-emerald-400/40';
      case 'Prestasi':
        return 'bg-rose-600/90 text-white border-rose-400/40';
      case 'Sosial':
        return 'bg-sky-600/90 text-white border-sky-400/40';
      default:
        return 'bg-slate-800/90 text-white border-slate-600/40';
    }
  };

  // Project Handlers
  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectFormTitle('');
    setProjectFormDescription('');
    setProjectFormImage('');
    setProjectFileName('');
    setProjectFormLink('');
    setProjectFormMakers('');
    setProjectFormTechStack('Next.js, TypeScript, Tailwind CSS');
    setProjectFormFeatured(false);
    setModalProjectOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProject(p);
    setProjectFormTitle(p.title);
    setProjectFormDescription(p.description);
    setProjectFormImage(p.image);
    setProjectFileName(p.image.split('/').pop() || 'Screenshot Proyek');
    setProjectFormLink(p.link);
    setProjectFormMakers(p.makers || '');
    setProjectFormTechStack(Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '');
    setProjectFormFeatured(!!p.featured);
    setModalProjectOpen(true);
  };

  const handleProjectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProjectFormImage(previewUrl);
      setProjectFileName(file.name);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormTitle.trim()) return;
    if (!projectFormImage) {
      alert('Silakan pilih gambar screenshot proyek terlebih dahulu!');
      return;
    }

    const parsedTechStack = projectFormTechStack
      ? projectFormTechStack.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Web App'];

    if (editingProject) {
      setProjectsList((prev) => {
        const updated = prev.map((item) =>
          item.id === editingProject.id
            ? {
                ...item,
                title: projectFormTitle.trim(),
                description: projectFormDescription.trim(),
                image: projectFormImage,
                link: projectFormLink.trim() || '#',
                makers: projectFormMakers.trim() || null,
                tech_stack: parsedTechStack,
                featured: projectFormFeatured
              }
            : item
        );
        try {
          localStorage.setItem('class_projects_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_projects_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Proyek "${projectFormTitle}" berhasil diperbarui!`);
    } else {
      const newProject: Project = {
        id: Date.now(),
        title: projectFormTitle.trim(),
        description: projectFormDescription.trim(),
        image: projectFormImage,
        link: projectFormLink.trim() || '#',
        makers: projectFormMakers.trim() || null,
        tech_stack: parsedTechStack,
        featured: projectFormFeatured
      };
      setProjectsList((prev) => {
        const updated = [newProject, ...prev];
        try {
          localStorage.setItem('class_projects_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_projects_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setSaveSuccessMsg(`Proyek baru "${newProject.title}" berhasil ditambahkan!`);
    }

    setModalProjectOpen(false);
    setEditingProject(null);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const toggleFeaturedProject = (id: number) => {
    setProjectsList((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      );
      try {
        localStorage.setItem('class_projects_list', JSON.stringify(updated));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_projects_updated'));
        }
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const confirmDeleteProject = (p: Project) => {
    setProjectToDelete(p);
  };

  const executeDeleteProject = () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete.id;
    const targetTitle = projectToDelete.title;

    setProjectToDelete(null);
    setDeletingProjectId(targetId);

    setTimeout(() => {
      setProjectsList((prev) => {
        const updated = prev.filter((p) => p.id !== targetId);
        try {
          localStorage.setItem('class_projects_list', JSON.stringify(updated));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('class_projects_updated'));
          }
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingProjectId(null);
      setSaveSuccessMsg(`Proyek "${targetTitle}" berhasil dihapus!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 350);
  };

  // Comment Moderation Handlers
  const toggleCommentVisibility = (id: number) => {
    setCommentsList((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, is_visible: !c.is_visible } : c
      );
      try {
        localStorage.setItem('class_comments_list', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const confirmDeleteComment = (c: ProjectComment) => {
    setCommentToDelete(c);
  };

  const executeDeleteComment = () => {
    if (!commentToDelete) return;
    const targetId = commentToDelete.id;

    setCommentToDelete(null);
    setDeletingCommentId(targetId);

    setTimeout(() => {
      setCommentsList((prev) => {
        const updated = prev.filter((c) => c.id !== targetId);
        try {
          localStorage.setItem('class_comments_list', JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingCommentId(null);
      setSaveSuccessMsg(`Komentar berhasil dihapus!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 350);
  };

  // Activity Log & Profile Handlers
  const addActivityLog = (
    action: string,
    category: 'auth' | 'content' | 'student' | 'schedule' | 'project' | 'profile',
    target: string,
    actorRole: 'admin' | 'student' | 'guest' | 'system' = 'admin',
    status: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const newLog: ActivityLogItem = {
      id: 'log-' + Date.now(),
      actor: actorRole === 'admin' ? 'Admin XI PPLG 3' : actorRole === 'student' ? 'Siswa' : 'Sistem Sinkronisasi',
      actorRole,
      action,
      category,
      target,
      timestamp: 'Baru saja',
      ip: '192.168.1.10 - Chrome / Windows',
      status
    };

    setActivityLogsList((prev) => {
      const updated = [newLog, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('class_activity_logs', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    const contactData = {
      instagram: contactInstagram.trim(),
      whatsapp: contactWhatsapp.trim(),
      email: contactEmail.trim(),
      tiktok: contactTiktok.trim(),
      address: contactAddress.trim()
    };
    try {
      localStorage.setItem('class_web_contact', JSON.stringify(contactData));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_profile_updated'));
      }
    } catch (err) {
      console.error(err);
    }
    addActivityLog('Memperbarui informasi kontak & media sosial', 'profile', 'Kontak Kelas');
    setTimeout(() => {
      setSavingContact(false);
      setContactSaveSuccess(true);
      setSaveSuccessMsg('Informasi kontak berhasil disimpan!');
      setTimeout(() => {
        setContactSaveSuccess(false);
        setSaveSuccessMsg(null);
      }, 3000);
    }, 400);
  };

  const handleResetContact = () => {
    if (confirm('Kembalikan informasi kontak ke pengaturan standar bawaan?')) {
      setContactInstagram(initialContact.instagram || '@xpplg.3rd');
      setContactWhatsapp(initialContact.whatsapp || '6281294862060');
      setContactEmail(initialContact.email || 'classxpplg3@gmail.com');
      setContactTiktok('@xipplg3.official');
      setContactAddress('SMK Penerbangan Bogor, Jl. Raya Sukabumi No. 12, Kota Bogor');
      const resetData = {
        instagram: initialContact.instagram,
        whatsapp: initialContact.whatsapp,
        email: initialContact.email,
        tiktok: '@xipplg3.official',
        address: 'SMK Penerbangan Bogor, Jl. Raya Sukabumi No. 12, Kota Bogor'
      };
      try {
        localStorage.setItem('class_web_contact', JSON.stringify(resetData));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_profile_updated'));
        }
      } catch (err) {}
      addActivityLog('Mereset kontak kelas ke konfigurasi default', 'profile', 'Kontak Kelas', 'admin', 'info');
      setSaveSuccessMsg('Kontak berhasil di-reset ke standar!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar yang valid (.png, .jpg, .jpeg, .webp, .svg)');
        return;
      }
      setProfileLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProfileLogo(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const profileData = {
      className: profileClassName.trim(),
      schoolName: profileSchoolName.trim(),
      tagline: profileTagline.trim(),
      year: profileYear.trim(),
      description: profileDescription.trim(),
      logo: profileLogo
    };
    try {
      localStorage.setItem('class_web_profile', JSON.stringify(profileData));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_profile_updated'));
      }
    } catch (err) {
      console.error(err);
    }
    addActivityLog(`Memperbarui profil & branding identitas website (${profileClassName})`, 'profile', 'Profil Website');
    setTimeout(() => {
      setSavingProfile(false);
      setProfileSaveSuccess(true);
      setSaveSuccessMsg('Profil website kelas berhasil diperbarui!');
      setTimeout(() => {
        setProfileSaveSuccess(false);
        setSaveSuccessMsg(null);
      }, 3000);
    }, 400);
  };

  const handleResetProfile = () => {
    if (confirm('Kembalikan data profil dan logo website ke pengaturan standar bawaan?')) {
      setProfileClassName('XI PPLG 3');
      setProfileSchoolName('SMK Penerbangan Bogor');
      setProfileTagline('Unggul dalam Teknologi, Kreatif dalam Inovasi & Bersatu');
      setProfileYear('2026 / 2027');
      setProfileDescription('Portal web resmi kelas XI PPLG 3 SMK Penerbangan Bogor sebagai wadah karya, portofolio digital, dan dokumentasi kebersamaan siswa.');
      setProfileLogo(initialContact.logo || '/assets/uploads/logo/logo_1787282041.jpeg');
      setProfileLogoFileName('');
      const defaultProfile = {
        className: 'XI PPLG 3',
        schoolName: 'SMK Penerbangan Bogor',
        tagline: 'Unggul dalam Teknologi, Kreatif dalam Inovasi & Bersatu',
        year: '2026 / 2027',
        description: 'Portal web resmi kelas XI PPLG 3 SMK Penerbangan Bogor sebagai wadah karya, portofolio digital, dan dokumentasi kebersamaan siswa.',
        logo: initialContact.logo || '/assets/uploads/logo/logo_1787282041.jpeg'
      };
      try {
        localStorage.setItem('class_web_profile', JSON.stringify(defaultProfile));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_profile_updated'));
        }
      } catch (err) {}
      addActivityLog('Mereset profil dan logo website ke default bawaan', 'profile', 'Profil Website', 'admin', 'info');
      setSaveSuccessMsg('Profil website berhasil di-reset ke standar!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSaveAllContactAndProfile = () => {
    setSavingContact(true);
    setSavingProfile(true);
    const contactData = {
      instagram: contactInstagram.trim(),
      whatsapp: contactWhatsapp.trim(),
      email: contactEmail.trim(),
      tiktok: contactTiktok.trim(),
      address: contactAddress.trim()
    };
    const profileData = {
      className: profileClassName.trim(),
      schoolName: profileSchoolName.trim(),
      tagline: profileTagline.trim(),
      year: profileYear.trim(),
      description: profileDescription.trim(),
      logo: profileLogo
    };
    try {
      localStorage.setItem('class_web_contact', JSON.stringify(contactData));
      localStorage.setItem('class_web_profile', JSON.stringify(profileData));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('class_profile_updated'));
      }
    } catch (err) {
      console.error(err);
    }
    addActivityLog('Memperbarui seluruh kontak dan profil website sekaligus', 'profile', 'Kontak & Profil Terpadu');
    setTimeout(() => {
      setSavingContact(false);
      setSavingProfile(false);
      setContactSaveSuccess(true);
      setProfileSaveSuccess(true);
      setSaveSuccessMsg('Semua data kontak dan profil website berhasil disimpan!');
      setTimeout(() => {
        setContactSaveSuccess(false);
        setProfileSaveSuccess(false);
        setSaveSuccessMsg(null);
      }, 3000);
    }, 400);
  };

  const handleClearLogs = () => {
    setActivityLogsList([]);
    try {
      localStorage.setItem('class_activity_logs', JSON.stringify([]));
    } catch (err) {
      console.error(err);
    }
    setModalClearLogsOpen(false);
    setSaveSuccessMsg('Seluruh riwayat log aktivitas telah dibersihkan.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleResetLogsToDefault = () => {
    setActivityLogsList(initialActivityLogs);
    try {
      localStorage.setItem('class_activity_logs', JSON.stringify(initialActivityLogs));
    } catch (err) {
      console.error(err);
    }
    setModalClearLogsOpen(false);
    setSaveSuccessMsg('Riwayat log berhasil dikembalikan ke standar awal.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-activity-logs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addActivityLog('Mengekspor file JSON audit trail sistem', 'auth', 'Ekspor Log Audit', 'admin', 'info');
  };

  const logCategories = [
    { id: 'Semua', label: 'Semua Aktivitas' },
    { id: 'auth', label: 'Otentikasi & Akses' },
    { id: 'profile', label: 'Profil & Kontak' },
    { id: 'student', label: 'Data Siswa' },
    { id: 'schedule', label: 'Jadwal & Piket' },
    { id: 'content', label: 'Galeri & Media' },
    { id: 'project', label: 'Proyek & Komentar' }
  ];

  const filteredLogs = activityLogsList.filter((log) => {
    const matchCategory = selectedLogCategory === 'Semua' || log.category === selectedLogCategory;
    const matchSearch =
      !searchLog ||
      log.actor.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.target.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchLog.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getRoleIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('wali')) return <GraduationCap className="w-3.5 h-3.5" />;
    if (r.includes('ketua')) return <Crown className="w-3.5 h-3.5" />;
    if (r.includes('sekretaris')) return <PenTool className="w-3.5 h-3.5" />;
    if (r.includes('bendahara')) return <Wallet className="w-3.5 h-3.5" />;
    return <Shield className="w-3.5 h-3.5" />;
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Memeriksa otentikasi admin...
      </div>
    );
  }

  // Counts for Stats Cards
  const totalStudents = studentsList.length; // Dynamic
  const totalPiket = piketList.length; // Dynamic
  const totalJadwal = jadwalList.length; // Dynamic
  const totalVideos = videosList.length; // Dynamic
  const totalProjects = projectsList.length; // Dynamic
  const totalGallery = galleryList.length; // Dynamic

  const filteredStudents = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (s.nisn && s.nisn.includes(searchStudent)) ||
      s.id.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans antialiased">
      {/* 1. Dark Navy Sidebar (Matching Screenshot) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b132b] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-slate-800/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-blue-500/40 flex-shrink-0 bg-blue-600">
              <Image
                src="/assets/uploads/logo/logo_1787282041.jpeg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-white text-sm tracking-wide">
              Admin Panel
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items (Scrollbar completely hidden) */}
        <div className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3 px-3 space-y-3.5">
          {/* MAIN */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              MAIN
            </div>
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* CONTENT */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              CONTENT
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => { setActiveTab('struktur'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'struktur'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FolderTree className="w-4 h-4 flex-shrink-0" />
                <span>Struktur</span>
              </button>

              <button
                onClick={() => { setActiveTab('siswa'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'siswa'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Siswa</span>
              </button>

              <button
                onClick={() => { setActiveTab('piket'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'piket'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Paintbrush className="w-4 h-4 flex-shrink-0" />
                <span>Jadwal Piket</span>
              </button>

              <button
                onClick={() => { setActiveTab('jadwal'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'jadwal'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Monitor className="w-4 h-4 flex-shrink-0" />
                <span>Jadwal Pelajaran</span>
              </button>

              <button
                onClick={() => { setActiveTab('video'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'video'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Film className="w-4 h-4 flex-shrink-0" />
                <span>Video Kelas</span>
              </button>

              <button
                onClick={() => { setActiveTab('gallery'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                <span>Gallery</span>
              </button>

              <button
                onClick={() => { setActiveTab('project'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'project'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Code className="w-4 h-4 flex-shrink-0" />
                <span>Project</span>
              </button>

              <button
                onClick={() => { setActiveTab('komentar'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'komentar'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span>Komentar</span>
              </button>

              <button
                onClick={() => { setActiveTab('music'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'music'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Music2 className="w-4 h-4 flex-shrink-0" />
                <span>Kelola Musik</span>
              </button>
            </div>
          </div>

          {/* SETTINGS */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              SETTINGS
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => { setActiveTab('contact'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ContactIcon className="w-4 h-4 flex-shrink-0" />
                <span>Contact</span>
              </button>

              <button
                onClick={() => { setActiveTab('activity_log'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'activity_log'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Activity Log</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-slate-800/80 space-y-0.5 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar (Matching Screenshot) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'struktur'
                ? 'Kelola Struktur'
                : activeTab === 'dashboard'
                ? 'Dashboard'
                : activeTab === 'music'
                ? 'Kelola Musik'
                : `Kelola ${activeTab.replace('_', ' ')}`}
            </h1>
          </div>

          {/* Admin User Profile Pill (Matching Screenshot) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-slate-800 text-xs font-bold">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>adminPPLG3</span>
            </div>
          </div>
        </header>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Dashboard Body Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <div key={activeTab} className="animate-admin-tab space-y-8">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <>
                {/* 3. Stats Grid (Matching Screenshot: Siswa, Piket, Jadwal, Video, Project, Gallery) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
                  {/* 1. Total Siswa */}
                  <div
                    onClick={() => setActiveTab('siswa')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-blue-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalStudents}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Total Siswa
                      </div>
                    </div>
                  </div>

                  {/* 2. Data Piket */}
                  <div
                    onClick={() => setActiveTab('piket')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-emerald-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalPiket}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Data Piket
                      </div>
                    </div>
                  </div>

                  {/* 3. Jadwal Mapel */}
                  <div
                    onClick={() => setActiveTab('jadwal')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-amber-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalJadwal}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Jadwal Mapel
                      </div>
                    </div>
                  </div>

                  {/* 4. Video Kelas */}
                  <div
                    onClick={() => setActiveTab('video')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-purple-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Film className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalVideos}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Video Kelas
                      </div>
                    </div>
                  </div>

                  {/* 5. Total Project */}
                  <div
                    onClick={() => setActiveTab('project')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-orange-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalProjects}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Total Project
                      </div>
                    </div>
                  </div>

                  {/* 6. Foto Gallery */}
                  <div
                    onClick={() => setActiveTab('gallery')}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all duration-300 md:hover:-translate-y-1.5 md:hover:shadow-lg md:hover:border-emerald-300 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {totalGallery}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        Foto Gallery
                      </div>
                    </div>
                  </div>
                </div>

              {/* 4. Akses Cepat Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                {/* Header */}
                <div className="flex items-center gap-2 text-base font-black text-slate-900 mb-6">
                  <Zap className="w-5 h-5 text-slate-800 fill-slate-800" />
                  <h2>Akses Cepat</h2>
                </div>

                {/* 9 Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  <button
                    onClick={() => setActiveTab('piket')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Paintbrush className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Piket</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('jadwal')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Monitor className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Jadwal</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Film className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Video</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('struktur')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <FolderTree className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Struktur</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('siswa')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Siswa</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Gallery</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('project')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Code className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Project</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <ContactIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Kelola Contact</span>
                  </button>

                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-all text-left shadow-xs hover:-translate-y-0.5"
                  >
                    <Eye className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Lihat Website</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* TAB: KELOLA STRUKTUR (Matching Screenshot 1 & 2) */}
          {activeTab === 'struktur' && (
            <div className="space-y-6">
              {/* Section Header (Matching Screenshot 1) */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <FolderTree className="w-6 h-6 text-blue-600" />
                  <span>Edit Anggota Struktur Organisasi</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Sesuaikan data nama dan foto pengurus kelas dengan tampilan yang lebih fresh.
                </p>
              </div>

              {/* Structure Cards Grid (Matching Screenshot 1 & 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
                {structureList.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200/90 flex flex-col"
                  >
                    {/* Top Blue Cover Header with Diagonal Cut */}
                    <div className="relative h-20 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
                      <div className="absolute -bottom-4 -left-4 -right-4 h-8 bg-white -rotate-3" />
                    </div>

                    {/* Centered Circular Avatar */}
                    <div className="-mt-11 text-center relative z-10 px-4">
                      <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-slate-100">
                        <Image
                          src={m.photo}
                          alt={m.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Role Pill Badge (Matching Screenshot) */}
                      <div className="mt-3 mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-extrabold text-[11px] uppercase tracking-wider border border-blue-100">
                        {getRoleIcon(m.role)}
                        <span>{m.role}</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveMember(m.id);
                      }}
                      className="px-5 pb-5 space-y-3 flex-1 flex flex-col"
                    >
                      {/* 1. Name Input */}
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleMemberChange(m.id, 'name', e.target.value)}
                          placeholder="Nama Lengkap"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      {/* 2. Expertise / Mata Pelajaran Input */}
                      <div className="relative">
                        <Star className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={m.expertise || ''}
                          onChange={(e) => handleMemberChange(m.id, 'expertise', e.target.value)}
                          placeholder="Keahlian / Mata Pelajaran"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      {/* 3. Ubah Foto Button */}
                      <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer transition-colors">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <span>Ubah Foto...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoChange(m.id, e)}
                        />
                      </label>

                      {/* 4. Detail Profil Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleExpandMember(m.id)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {expandedMembers[m.id] ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Sembunyikan Detail</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Detail Profil</span>
                          </>
                        )}
                      </button>

                      {/* 5. Expanded Profile Details (Matching Screenshot 2) */}
                      {expandedMembers[m.id] && (
                        <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Deskripsi */}
                          <div className="relative">
                            <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                            <textarea
                              rows={3}
                              value={m.description || ''}
                              onChange={(e) => handleMemberChange(m.id, 'description', e.target.value)}
                              placeholder="Deskripsi tentang guru/siswa..."
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                            />
                          </div>

                          {/* Pesan untuk Siswa */}
                          <div className="relative">
                            <Quote className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                            <textarea
                              rows={2}
                              value={m.message || ''}
                              onChange={(e) => handleMemberChange(m.id, 'message', e.target.value)}
                              placeholder="Pesan untuk siswa..."
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                            />
                          </div>

                          {/* Tahun Ajaran */}
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={m.year || ''}
                              onChange={(e) => handleMemberChange(m.id, 'year', e.target.value)}
                              placeholder="Tahun Ajaran (contoh: 2026 - 2027)"
                              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
                            />
                          </div>

                          {/* Mata Pelajaran */}
                          <div className="relative">
                            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={m.subject || ''}
                              onChange={(e) => handleMemberChange(m.id, 'subject', e.target.value)}
                              placeholder="Mata Pelajaran"
                              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
                            />
                          </div>

                          {/* Motto / Fokus */}
                          <div className="relative">
                            <Lightbulb className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={m.motto || ''}
                              onChange={(e) => handleMemberChange(m.id, 'motto', e.target.value)}
                              placeholder="Motto / Fokus"
                              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* 6. Simpan Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          type="submit"
                          disabled={savingId === m.id}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>{savingId === m.id ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Kelola Siswa (Matching Screenshots 1, 2, 3, 4, 5) */}
          {activeTab === 'siswa' && (
            <div className="space-y-6">
              {/* Header Section (Matching Screenshot 1) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Manajemen Data Siswa
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Kelola biodata seluruh siswa kelas X PPLG 3. Total: <strong className="text-slate-800 font-bold">{studentsList.length}</strong> siswa.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari nama / ID..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs transition-all"
                    />
                  </div>

                  {/* Tambah Siswa Button */}
                  <button
                    onClick={() => {
                      setAddId(String(studentsList.length + 1).padStart(3, '0'));
                      setAddName('');
                      setAddNisn('');
                      setAddClass('X PPLG 3');
                      setAddPhoto('/assets/uploads/students/student_001_1778723200.png');
                      setModalAddOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm shadow-blue-500/25 transition-all flex-shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Tambah Siswa</span>
                  </button>
                </div>
              </div>

              {/* Student Cards Grid (Matching Screenshot 1 & 5) */}
              {filteredStudents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-600">Tidak ada data siswa yang cocok dengan pencarian.</p>
                  <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci nama atau nomor ID lainnya.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 p-4 relative flex flex-col items-center text-center group ${
                        deletingId === s.id
                          ? 'scale-75 opacity-0 -translate-y-4 filter blur-xs pointer-events-none duration-400'
                          : 'scale-100 opacity-100 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Top Row: Pill Badge on Left, 3 Dots on Right */}
                      <div className="w-full flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-extrabold text-xs border border-blue-100/80">
                          {s.id}
                        </span>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenuId(activeActionMenuId === s.id ? null : s.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Aksi Siswa"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeActionMenuId === s.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveActionMenuId(null)}
                              />
                              <div className="absolute right-0 top-7 z-20 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  onClick={() => {
                                    setModalBiodataStudent(s);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Lihat Biodata</span>
                                </button>
                                <button
                                  onClick={() => {
                                    openEditModal(s);
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Edit Data</span>
                                </button>
                                <button
                                  onClick={() => {
                                    confirmDeleteStudent(s);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Hapus Siswa</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Student Photo with Red Circular Backdrop (Matching Screenshot 1 & 5) */}
                      <div
                        onClick={() => setModalBiodataStudent(s)}
                        className="mt-2.5 cursor-pointer group-hover:scale-105 transition-transform"
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-red-600 border-2 border-white shadow-xs mx-auto flex items-center justify-center">
                          <Image
                            src={s.photo}
                            alt={s.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* Student Name */}
                      <h4
                        onClick={() => setModalBiodataStudent(s)}
                        className="font-bold text-slate-900 text-sm mt-3 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                        title={s.name}
                      >
                        {s.name}
                      </h4>

                      {/* Class */}
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {s.kelas || 'X PPLG 3'}
                      </p>

                      {/* NISN (if any) */}
                      {s.nisn && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          NISN: {s.nisn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL: Konfirmasi Hapus Siswa dengan Animasi */}
              <AdminModalPortal isOpen={!!studentToDelete} onClose={() => setStudentToDelete(null)}>
                {studentToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center my-auto">
                    {/* Animated Trash Icon with bouncing pulse */}
                    <div className="relative w-16 h-16 rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      Hapus Data Siswa?
                    </h3>

                    <div className="my-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-left">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-red-600 border border-white shadow-xs flex-shrink-0">
                        <Image
                          src={studentToDelete.photo}
                          alt={studentToDelete.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-black text-slate-900 truncate block">
                          {studentToDelete.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono font-bold">
                          NISN: {studentToDelete.nisn || '-'} • {studentToDelete.kelas || 'X PPLG 3'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                      Apakah kamu yakin ingin menghapus data siswa ini? Aksi ini akan mencatat aktivitas ke Activity Log.
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setStudentToDelete(null)}
                        className="py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={executeDeleteStudent}
                        className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Ya, Hapus</span>
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>

              {/* MODAL 1: Tambah Siswa Baru (Matching Screenshot 2) */}
              <AdminModalPortal isOpen={modalAddOpen} onClose={() => setModalAddOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[calc(100vh-2rem)] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                      <UserPlus className="w-5 h-5 text-slate-800" />
                      <span>Tambah Siswa Baru</span>
                    </div>
                    <button
                      onClick={() => setModalAddOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAddStudent}>
                    <div className="p-6 space-y-4 text-xs sm:text-sm">
                      {/* Row 1: No. Absen / ID & NISN */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            No. Absen / ID <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addId}
                            onChange={(e) => setAddId(e.target.value)}
                            placeholder="e.g. 046"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            NISN <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                          </label>
                          <input
                            type="text"
                            value={addNisn}
                            onChange={(e) => setAddNisn(e.target.value)}
                            placeholder="10 digit NISN"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* Row 2: Nama Lengkap */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addName}
                          onChange={(e) => setAddName(e.target.value)}
                          placeholder="Nama lengkap siswa"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                        />
                      </div>

                      {/* Row 3: Kelas */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Kelas <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={addClass}
                          onChange={(e) => setAddClass(e.target.value)}
                          placeholder="X PPLG 3"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                        />
                      </div>

                      {/* Row 4: Foto */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Foto <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                        </label>
                        <label className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer transition-colors">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                          <span>{addPhoto && addPhoto.startsWith('blob:') ? 'Foto Terpilih (Ganti)' : 'Pilih foto...'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAddPhotoUpload}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setModalAddOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-blue-500/25 transition-all"
                      >
                        <span>+ Tambah</span>
                      </button>
                    </div>
                  </form>
                </div>
              </AdminModalPortal>

              {/* MODAL 2: Edit Data Siswa (Matching Screenshot 3) */}
              <AdminModalPortal isOpen={!!modalEditStudent} onClose={() => setModalEditStudent(null)}>
                {modalEditStudent && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[calc(100vh-2rem)] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                        <Edit className="w-5 h-5 text-slate-800" />
                        <span>Edit Data Siswa</span>
                      </div>
                      <button
                        onClick={() => setModalEditStudent(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preview Avatar */}
                    <div className="pt-5 pb-2 text-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-red-600 border-2 border-white shadow-md mx-auto flex items-center justify-center">
                        <Image
                          src={editPhoto || modalEditStudent.photo}
                          alt="Preview"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 mt-1.5 block">
                        Preview
                      </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSaveEditStudent}>
                      <div className="px-6 py-3 space-y-3.5 text-xs sm:text-sm">
                        {/* Row 1: ID & NISN */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              No. Absen / ID
                            </label>
                            <input
                              type="text"
                              value={editId}
                              onChange={(e) => setEditId(e.target.value)}
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              NISN <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={editNisn}
                              onChange={(e) => setEditNisn(e.target.value)}
                              placeholder="10 digit NISN"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                            />
                          </div>
                        </div>

                        {/* Row 2: Nama Lengkap */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                          />
                        </div>

                        {/* Row 3: Kelas */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kelas <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                          </label>
                          <input
                            type="text"
                            value={editClass}
                            onChange={(e) => setEditClass(e.target.value)}
                            placeholder="X PPLG 3"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-medium"
                          />
                        </div>

                        {/* Row 4: Ganti Foto */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Ganti Foto <span className="text-slate-400 text-[11px] font-normal">(opsional)</span>
                          </label>
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer transition-colors">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                            <span>{editPhoto ? 'Foto Baru Dipilih (Ganti)' : 'Pilih file foto baru...'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleEditPhotoUpload}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setModalEditStudent(null)}
                          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Simpan</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </AdminModalPortal>

              {/* MODAL 3: Biodata Siswa (Matching Screenshot 4) */}
              <AdminModalPortal isOpen={!!modalBiodataStudent} onClose={() => setModalBiodataStudent(null)}>
                {modalBiodataStudent && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[calc(100vh-2rem)] flex flex-col">
                    {/* Modal Top Bar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                        <FileText className="w-4 h-4 text-slate-700" />
                        <span>Biodata Siswa</span>
                      </div>
                      <button
                        onClick={() => setModalBiodataStudent(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Royal Blue Hero Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 px-4 text-center text-white">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-red-600 border-2 border-white shadow-md mx-auto mb-2.5 flex items-center justify-center">
                        <Image
                          src={modalBiodataStudent.photo}
                          alt={modalBiodataStudent.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <h3 className="font-bold text-base text-white">
                        {modalBiodataStudent.name}
                      </h3>
                      <div className="mt-1.5 inline-block">
                        <span className="px-3 py-0.5 rounded-full bg-blue-500/40 border border-blue-400/40 text-white font-bold text-[11px]">
                          {modalBiodataStudent.kelas || 'X PPLG 3'}
                        </span>
                      </div>
                    </div>

                    {/* Details List */}
                    <div className="p-5 space-y-3 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <Hash className="w-3.5 h-3.5 text-blue-600" />
                          ID / Absen
                        </span>
                        <span className="font-mono font-bold text-slate-800">
                          {modalBiodataStudent.id}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          NISN
                        </span>
                        <span className="font-mono text-slate-700 font-semibold">
                          {modalBiodataStudent.nisn || '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                          Kelas
                        </span>
                        <span className="text-slate-700 font-semibold">
                          {modalBiodataStudent.kelas || '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          Email
                        </span>
                        <span className="text-slate-500 font-medium">
                          {modalBiodataStudent.email || '(Privat)'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          GitHub
                        </span>
                        {modalBiodataStudent.github_link ? (
                          <a
                            href={modalBiodataStudent.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-mono"
                          >
                            {modalBiodataStudent.github_link.replace('https://github.com/', '@')}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-semibold">-</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 text-slate-500 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          Portfolio
                        </span>
                        {modalBiodataStudent.portfolio_link ? (
                          <a
                            href={modalBiodataStudent.portfolio_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Kunjungi
                          </a>
                        ) : (
                          <span className="text-slate-400 font-semibold">-</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Kelola Piket (Special UI/UX & Animations) */}
          {activeTab === 'piket' && (
            <div className="space-y-6">
              {/* Cleanliness Hero Header with Sweeping Broom Animation */}
              <div className="bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-3 backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                      <span>Sistem Manajemen Kebersihan Kelas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Paintbrush className="w-6 h-6 animate-sweep-broom" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          Jadwal Piket Kebersihan
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                          XI PPLG 3 • SMK Penerbangan Bogor • Pantau & tandai tugas kebersihan harian
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Day Info */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Hari Ini
                      </span>
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]}
                      </span>
                    </div>

                    <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-xs flex flex-col justify-center">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Siklus Piket
                      </span>
                      <span className="font-bold text-blue-300 flex items-center gap-1 mt-0.5">
                        <RotateCcw className="w-3 h-3 text-blue-400" />
                        Minggu ke-{getWeekNumber()} (Auto Reset Senin)
                      </span>
                    </div>

                    <button
                      onClick={handleResetPiketWeek}
                      className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-rose-600/30 border border-white/15 hover:border-rose-500/50 text-slate-200 hover:text-rose-200 font-bold text-xs transition-all flex-shrink-0 cursor-pointer"
                      title="Reset semua status checklist piket minggu ini kembali ke 0%"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Siklus</span>
                    </button>

                    <button
                      onClick={() => openAddPiketModal()}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex-shrink-0 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Tambah Petugas</span>
                    </button>
                  </div>
                </div>

                {/* Day Filter Pills (Scrollable on Mobile, Wrapped on Window/Desktop) */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
                    <span className="text-xs font-bold text-slate-400 mr-1 flex-shrink-0">Tampilkan:</span>
                    {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => {
                      const isTodayDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()] === day;
                      const isSelected = selectedPiketDay === day;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedPiketDay(day)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50'
                              : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white border border-white/5'
                          }`}
                        >
                          <span>{day === 'Semua' ? 'Semua Hari (Kanban)' : day}</span>
                          {isTodayDay && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                              Hari Ini
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedPiketDay === 'Semua' && (
                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>💡 Geser horizontal untuk melihat seluruh hari</span>
                    </div>
                  )}
                </div>
              </div>

              {/* VIEW 1: SINGLE DAY FOCUS MODE (Spacious Multi-column responsive layout) */}
              {selectedPiketDay !== 'Semua' ? (
                <div className="max-w-5xl mx-auto w-full pb-8">
                  {(() => {
                    const hari = selectedPiketDay;
                    const items = piketList.filter((p) => p.hari === hari);
                    const pj = items[0]?.pj || 'Belum Ditentukan';
                    const isToday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()] === hari;
                    const completedCount = items.filter((item) => piketCompleted[item.id]).length;
                    const percentComplete = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

                    const themeColor =
                      hari === 'Senin'
                        ? { bg: 'from-emerald-500 to-teal-700', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-500' }
                        : hari === 'Selasa'
                        ? { bg: 'from-blue-600 to-cyan-700', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' }
                        : hari === 'Rabu'
                        ? { bg: 'from-violet-600 to-purple-700', text: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200', ring: 'ring-violet-500' }
                        : hari === 'Kamis'
                        ? { bg: 'from-amber-500 to-orange-600', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500' }
                        : { bg: 'from-rose-500 to-pink-700', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200', ring: 'ring-rose-500' };

                    return (
                      <div className={`bg-white rounded-3xl border ${themeColor.border} shadow-lg overflow-hidden flex flex-col`}>
                        {/* Day Card Header Banner */}
                        <div className={`bg-gradient-to-r ${themeColor.bg} p-6 sm:p-7 text-white relative overflow-hidden`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-2xl sm:text-3xl font-black tracking-wide">
                                  Piket Hari {hari}
                                </h3>
                                {isToday && (
                                  <span className="px-3 py-1 rounded-full bg-white text-slate-900 font-black text-xs shadow-md animate-pulse">
                                    ⭐ HARI INI
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm text-white/95 font-semibold">
                                <Crown className="w-4 h-4 text-amber-300 fill-amber-300 flex-shrink-0" />
                                <span>Penanggung Jawab (PJ): <strong className="text-white underline decoration-amber-300 underline-offset-4">{pj}</strong></span>
                              </div>
                            </div>

                            <button
                              onClick={() => openAddPiketModal(hari as any)}
                              className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>+ Tambah Petugas {hari}</span>
                            </button>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-5 max-w-xl">
                            <div className="flex justify-between text-xs text-white/90 font-bold mb-1.5">
                              <span>Progress Kebersihan: {completedCount} dari {items.length} Siswa Selesai</span>
                              <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md">{percentComplete}%</span>
                            </div>
                            <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5">
                              <div
                                className="h-full bg-white transition-all duration-500 ease-out rounded-full shadow-sm"
                                style={{ width: `${percentComplete}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* List of Duty Students: Responsive 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
                        <div className="p-5 sm:p-6">
                          {items.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 text-sm">
                              Belum ada petugas piket untuk hari {hari}.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                              {items.map((item, idx) => {
                                const isDone = !!piketCompleted[item.id];
                                const photoUrl = getStudentPhotoByName(item.nama_siswa);

                                return (
                                  <div
                                    key={item.id}
                                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                                      isDone
                                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      {/* Student Photo Avatar */}
                                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-red-600 border-2 border-white shadow-sm flex-shrink-0">
                                        <Image
                                          src={photoUrl}
                                          alt={item.nama_siswa}
                                          fill
                                          className="object-cover object-top"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div
                                          className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}
                                          title={item.nama_siswa}
                                        >
                                          {item.nama_siswa}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                                            #{idx + 1}
                                          </span>
                                          <span>{isDone ? 'Sudah Selesai' : 'Belum Piket'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        onClick={() => togglePiketStatus(item.id)}
                                        className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 ${
                                          isDone
                                            ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                                            : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                                        }`}
                                        title={isDone ? 'Batalkan Status Selesai' : 'Tandai Sudah Piket'}
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        <span>{isDone ? 'Selesai' : 'Piket'}</span>
                                      </button>

                                      <button
                                        onClick={() => openEditPiketModal(item)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                        title="Edit Petugas"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>

                                      <button
                                        onClick={() => handleDeletePiket(item.id)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title="Hapus dari Piket"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* VIEW 2: SEMUA HARI (Spacious Horizontal Kanban Carousel - never squished!) */
                <div className="w-full pb-8 overflow-hidden">
                  <div className="flex gap-5 overflow-x-auto pb-6 pt-1 px-1 no-scrollbar snap-x items-start">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari) => {
                      const items = piketList.filter((p) => p.hari === hari);
                      const pj = items[0]?.pj || 'Belum Ditentukan';
                      const isToday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()] === hari;
                      const completedCount = items.filter((item) => piketCompleted[item.id]).length;
                      const percentComplete = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

                      // Color variants
                      const themeColor =
                        hari === 'Senin'
                          ? { bg: 'from-emerald-500 to-teal-700', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-500' }
                          : hari === 'Selasa'
                          ? { bg: 'from-blue-600 to-cyan-700', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' }
                          : hari === 'Rabu'
                          ? { bg: 'from-violet-600 to-purple-700', text: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200', ring: 'ring-violet-500' }
                          : hari === 'Kamis'
                          ? { bg: 'from-amber-500 to-orange-600', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500' }
                          : { bg: 'from-rose-500 to-pink-700', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200', ring: 'ring-rose-500' };

                      return (
                        <div
                          key={hari}
                          className={`w-[320px] sm:w-[350px] flex-shrink-0 snap-start bg-white rounded-3xl border ${themeColor.border} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative ${
                            isToday ? `ring-2 ${themeColor.ring} shadow-lg shadow-blue-500/10` : ''
                          }`}
                        >
                          {/* Day Card Header */}
                          <div className={`bg-gradient-to-r ${themeColor.bg} p-4 sm:p-5 text-white relative overflow-hidden`}>
                            <div className="flex items-center justify-between">
                              <span className="text-lg sm:text-xl font-black tracking-wide flex items-center gap-1.5">
                                {hari}
                              </span>
                              {isToday && (
                                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 font-extrabold text-[10px] shadow-sm animate-pulse">
                                  ⭐ HARI INI
                                </span>
                              )}
                            </div>

                            {/* Penanggung Jawab (PJ) Pill */}
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-white/90 font-semibold">
                              <Crown className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                              <span className="truncate">PJ: {pj}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3.5">
                              <div className="flex justify-between text-[11px] text-white/85 font-bold mb-1">
                                <span>Kebersihan: {completedCount}/{items.length} Selesai</span>
                                <span className="font-mono">{percentComplete}%</span>
                              </div>
                              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                                  style={{ width: `${percentComplete}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* List of Duty Students with Spacious Content */}
                          <div className="p-3 sm:p-4 space-y-2 flex-1 max-h-[580px] overflow-y-auto no-scrollbar">
                            {items.length === 0 ? (
                              <div className="py-8 text-center text-slate-400 text-xs">
                                Belum ada petugas piket untuk hari ini.
                              </div>
                            ) : (
                              items.map((item, idx) => {
                                const isDone = !!piketCompleted[item.id];
                                const photoUrl = getStudentPhotoByName(item.nama_siswa);

                                return (
                                  <div
                                    key={item.id}
                                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 group ${
                                      isDone
                                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-2xs'
                                        : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-blue-300 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      {/* Order / Photo Avatar */}
                                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-red-600 border border-white shadow-2xs flex-shrink-0">
                                        <Image
                                          src={photoUrl}
                                          alt={item.nama_siswa}
                                          fill
                                          className="object-cover object-top"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div
                                          className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}
                                          title={item.nama_siswa}
                                        >
                                          {item.nama_siswa}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium">
                                          Tugas #{idx + 1}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions: Interactive Checkbox & Edit/Delete */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => togglePiketStatus(item.id)}
                                        className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer active:scale-95 ${
                                          isDone
                                            ? 'bg-emerald-600 text-white animate-check-pop shadow-xs shadow-emerald-600/30'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300'
                                        }`}
                                        title={isDone ? 'Batalkan Status Selesai' : 'Tandai Sudah Piket'}
                                      >
                                        <Check className="w-3 h-3 stroke-[3]" />
                                        <span className="hidden sm:inline">{isDone ? 'Selesai' : 'Piket'}</span>
                                      </button>

                                      <button
                                        onClick={() => openEditPiketModal(item)}
                                        className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                        title="Edit Petugas"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => handleDeletePiket(item.id)}
                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title="Hapus dari Piket"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Card Footer: Add button */}
                          <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
                            <button
                              onClick={() => openAddPiketModal(hari as any)}
                              className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-dashed border-slate-200 hover:border-blue-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>+ Petugas {hari}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODAL: Tambah / Edit Petugas Piket */}
              <AdminModalPortal isOpen={modalPiketOpen} onClose={() => setModalPiketOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[calc(100vh-2rem)] flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                      <Paintbrush className="w-5 h-5 text-emerald-600 animate-sweep-broom" />
                      <span>{editingPiket ? 'Edit Petugas Piket' : 'Tambah Petugas Piket'}</span>
                    </div>
                    <button
                      onClick={() => setModalPiketOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePiket} className="p-6 space-y-4 text-xs sm:text-sm">
                    {/* Hari */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Hari Tugas <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={piketFormDay}
                        onChange={(e) => setPiketFormDay(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                      >
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((d) => (
                          <option key={d} value={d}>
                            Hari {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nama Siswa (Dropdown dari daftar siswa kelas) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nama Siswa <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          list="students-datalist"
                          value={piketFormName}
                          onChange={(e) => setPiketFormName(e.target.value)}
                          placeholder="Ketik atau pilih nama siswa..."
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                        />
                        <datalist id="students-datalist">
                          {studentsList.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.id} - {s.name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* Penanggung Jawab (PJ) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Penanggung Jawab (PJ) Hari Ini
                      </label>
                      <input
                        type="text"
                        value={piketFormPj}
                        onChange={(e) => setPiketFormPj(e.target.value)}
                        placeholder="Contoh: Alivia & Ainun"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setModalPiketOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Simpan Petugas</span>
                      </button>
                    </div>
                  </form>
                </div>
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Kelola Jadwal Pelajaran */}
          {activeTab === 'jadwal' && (
            <div className="space-y-6">
              {/* 1. Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute left-1/2 -top-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Agenda Pembelajaran XI PPLG 3</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                      Kelola Jadwal Pelajaran
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Atur susunan mata pelajaran, jam kegiatan belajar mengajar, sesi istirahat, serta guru pengampu untuk setiap hari sekolah secara terstruktur.
                    </p>

                    {/* Quick Stats Pill Strip */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold flex items-center gap-1.5 backdrop-blur-xs">
                        <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                        <span>Total <strong>{jadwalList.length}</strong> Sesi Terjadwal</span>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold flex items-center gap-1.5 backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          <strong>
                            {
                              new Set(
                                jadwalList
                                  .map((j) => j.mata_pelajaran)
                                  .filter((m) => !m.toUpperCase().includes('ISTIRAHAT') && !m.toUpperCase().includes('ISHOMA'))
                              ).size
                            }
                          </strong> Mapel Aktif
                        </span>
                      </div>

                      {(() => {
                        const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                        const todayName = daysIndo[new Date().getDay()];
                        const todaySessions = jadwalList.filter((j) => j.hari === todayName).length;
                        return (
                          <div className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-200 font-bold flex items-center gap-1.5 backdrop-blur-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                            <span>Hari Ini: {todayName} ({todaySessions} Sesi)</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right side: Animated Icon + Add Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-book-flip">
                      <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <button
                      onClick={() => openAddJadwalModal(selectedJadwalDay === 'Semua' ? 'Senin' : selectedJadwalDay)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Tambah Jam Pelajaran</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Responsive Day Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari) => {
                  const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                  const isCurrentToday = daysIndo[new Date().getDay()] === hari;
                  const count = hari === 'Semua' 
                    ? jadwalList.length 
                    : jadwalList.filter((j) => j.hari === hari).length;

                  return (
                    <button
                      key={hari}
                      onClick={() => setSelectedJadwalDay(hari)}
                      className={`relative px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                        selectedJadwalDay === hari
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-600/20'
                          : 'bg-white text-slate-600 border border-slate-200/90 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <span>{hari === 'Semua' ? 'Semua Hari' : hari}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          selectedJadwalDay === hari
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                      {isCurrentToday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" title="Hari Ini" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3. Schedule Grid Columns (Mobile 1 col, Tablet 2 cols, Laptop 3 cols, 2XL 5 cols) */}
              <div
                className={
                  selectedJadwalDay === 'Semua'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 items-start'
                    : 'max-w-3xl mx-auto space-y-4'
                }
              >
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
                  .filter((h) => selectedJadwalDay === 'Semua' || selectedJadwalDay === h)
                  .map((hari) => {
                    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const isToday = daysIndo[new Date().getDay()] === hari;
                    const dayItems = jadwalList
                      .filter((j) => j.hari === hari)
                      .sort((a, b) => a.urutan - b.urutan);

                    // Day gradient banner mappings
                    const dayGradients: Record<string, string> = {
                      Senin: 'from-indigo-600 to-blue-700',
                      Selasa: 'from-violet-600 to-purple-700',
                      Rabu: 'from-sky-600 to-cyan-700',
                      Kamis: 'from-emerald-600 to-teal-700',
                      Jumat: 'from-amber-600 to-orange-700',
                    };

                    const gradient = dayGradients[hari] || 'from-blue-600 to-indigo-700';

                    return (
                      <div
                        key={hari}
                        className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                          isToday ? 'ring-2 ring-blue-500/40 shadow-blue-100' : ''
                        }`}
                      >
                        {/* Day Card Header */}
                        <div className={`p-4 bg-gradient-to-r ${gradient} text-white flex items-center justify-between`}>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                                  {hari}
                                </h3>
                                {isToday && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white text-blue-700 shadow-xs uppercase tracking-wider">
                                    Hari Ini
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-white/80 font-medium">
                                {dayItems.length} Sesi Terjadwal
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => openAddJadwalModal(hari)}
                            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                            title={`Tambah Jam Pelajaran ${hari}`}
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* List of Lessons / Sessions */}
                        <div className="p-3.5 sm:p-4 space-y-2.5 flex-1 bg-slate-50/40">
                          {dayItems.length === 0 ? (
                            <div className="text-center py-8 px-4 text-slate-400">
                              <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                              <p className="text-xs font-semibold">Belum ada jadwal untuk hari {hari}</p>
                              <button
                                onClick={() => openAddJadwalModal(hari)}
                                className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Tambah Sesi
                              </button>
                            </div>
                          ) : (
                            dayItems.map((item) => {
                              const isBreak =
                                item.mata_pelajaran.toUpperCase().includes('ISTIRAHAT') ||
                                item.mata_pelajaran.toUpperCase().includes('ISHOMA') ||
                                item.mata_pelajaran.toUpperCase().includes('SHOLJUM');

                              const category = getSubjectCategory(item.mata_pelajaran);
                              const isDeleting = deletingJadwalId === item.id;

                              return (
                                <div
                                  key={item.id}
                                  className={`rounded-2xl transition-all duration-300 relative group border ${
                                    isDeleting
                                      ? 'opacity-0 scale-90 blur-xs'
                                      : isBreak
                                      ? 'bg-amber-50/90 border-amber-200/90 text-amber-950 p-3 shadow-xs'
                                      : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md p-3 text-slate-800'
                                  }`}
                                >
                                  {/* Header Row: Urutan badge, Category pill, Action buttons */}
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`w-5 h-5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center ${
                                          isBreak
                                            ? 'bg-amber-200/80 text-amber-900'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                      >
                                        #{item.urutan}
                                      </span>

                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${category.color}`}
                                      >
                                        {category.label}
                                      </span>
                                    </div>

                                    {/* Action Buttons (Edit & Delete) */}
                                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => openEditJadwalModal(item)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit Sesi"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => confirmDeleteJadwal(item)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                        title="Hapus Sesi"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Subject Title */}
                                  <div className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 leading-snug">
                                    {item.mata_pelajaran}
                                  </div>

                                  {/* Teacher & Time Info */}
                                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                                    {!isBreak && item.guru && item.guru !== '-' ? (
                                      <div className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[150px]">
                                        <UserCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                        <span className="truncate">{item.guru}</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-amber-700 font-medium">
                                        <Coffee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                        <span>Istirahat</span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-1 text-slate-500 font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span>{item.jam_mulai} - {item.jam_selesai}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Card Footer: Add session button */}
                        <div className="p-3 bg-white border-t border-slate-100 text-center">
                          <button
                            onClick={() => openAddJadwalModal(hari)}
                            className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-dashed border-slate-200 hover:border-blue-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>+ Sesi {hari}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* MODAL 1: Tambah / Edit Jadwal Pelajaran */}
              <AdminModalPortal isOpen={modalJadwalOpen} onClose={() => setModalJadwalOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[calc(100vh-2rem)] flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base leading-tight">
                          {editingJadwal ? 'Edit Jadwal Pelajaran' : 'Tambah Jam Pelajaran'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {editingJadwal ? 'Perbarui rincian sesi kegiatan belajar' : 'Tambahkan jam pelajaran baru ke susunan kelas'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalJadwalOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                    {/* Modal Form */}
                    <form onSubmit={handleSaveJadwal} className="p-6 space-y-4 text-xs sm:text-sm">
                      {/* Hari & Urutan */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Hari <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={jadwalFormDay}
                            onChange={(e) => setJadwalFormDay(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                          >
                            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((d) => (
                              <option key={d} value={d}>
                                Hari {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Urutan Jam Ke- <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="15"
                            value={jadwalFormUrutan}
                            onChange={(e) => setJadwalFormUrutan(Number(e.target.value))}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-bold"
                          />
                        </div>
                      </div>

                      {/* Quick Toggle: Istirahat */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-slate-700">Tandai Sebagai Jam Istirahat / Ishoma</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={jadwalIsBreak}
                          onChange={(e) => {
                            setJadwalIsBreak(e.target.checked);
                            if (e.target.checked) {
                              setJadwalFormMataPelajaran('ISTIRAHAT');
                              setJadwalFormGuru('-');
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      {/* Mata Pelajaran */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Mata Pelajaran <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            list="mapel-datalist"
                            value={jadwalFormMataPelajaran}
                            onChange={(e) => setJadwalFormMataPelajaran(e.target.value)}
                            placeholder="Contoh: PPLG/PRODUKTIF atau MATEMATIKA"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium uppercase"
                          />
                          <datalist id="mapel-datalist">
                            <option value="PPLG/PRODUKTIF" />
                            <option value="MATEMATIKA" />
                            <option value="BAHASA INGGRIS" />
                            <option value="BAHASA INDONESIA" />
                            <option value="PAI" />
                            <option value="SEJARAH" />
                            <option value="PPKN" />
                            <option value="PJOK" />
                            <option value="KIK" />
                            <option value="BISNIS DIGITAL" />
                            <option value="ISTIRAHAT" />
                            <option value="ISHOMA / SHOLJUM" />
                          </datalist>
                        </div>
                      </div>

                      {/* Guru Pengajar */}
                      {!jadwalIsBreak && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Guru Pengampu / Pengajar
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              list="guru-datalist"
                              value={jadwalFormGuru}
                              onChange={(e) => setJadwalFormGuru(e.target.value)}
                              placeholder="Contoh: BU DIAH, PA DIDIN, MIS. SUCI"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-medium uppercase"
                            />
                            <datalist id="guru-datalist">
                              <option value="BU DIAH" />
                              <option value="BU DELIKA" />
                              <option value="PA DIDIN" />
                              <option value="BU DESI" />
                              <option value="MIS. SUCI" />
                              <option value="PA RAHMAT" />
                              <option value="BU MITA" />
                              <option value="PA YUDHI" />
                              <option value="PA WANDA" />
                              <option value="BU RINA" />
                              <option value="PA MAMAN" />
                            </datalist>
                          </div>
                        </div>
                      )}

                      {/* Jam Mulai & Jam Selesai */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Jam Mulai <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={jadwalFormJamMulai}
                            onChange={(e) => setJadwalFormJamMulai(e.target.value)}
                            placeholder="07.30"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Jam Selesai <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={jadwalFormJamSelesai}
                            onChange={(e) => setJadwalFormJamSelesai(e.target.value)}
                            placeholder="08.50"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-bold"
                          />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setModalJadwalOpen(false)}
                          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Simpan Jadwal</span>
                        </button>
                      </div>
                    </form>
                  </div>
              </AdminModalPortal>

              {/* MODAL 2: Animated Delete Confirmation Modal */}
              <AdminModalPortal isOpen={!!jadwalToDelete} onClose={() => setJadwalToDelete(null)}>
                {jadwalToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Hapus Sesi Pelajaran?
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Sesi <strong>{jadwalToDelete.mata_pelajaran}</strong> hari <strong>{jadwalToDelete.hari}</strong> ({jadwalToDelete.jam_mulai} - {jadwalToDelete.jam_selesai}) akan dihapus dari jadwal kelas.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setJadwalToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={executeDeleteJadwal}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Kelola Video Dokumentasi Kelas (Cinema Studio UI/UX & Special Animations) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              {/* 1. Cinema Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b0d2e] via-[#0f142a] to-[#120824] text-white p-6 sm:p-8 shadow-2xl border border-purple-900/40">
                <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none animate-cinema-beam" />
                <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-xs">
                      <Film className="w-3.5 h-3.5 text-purple-400" />
                      <span>Cinema & Dokumentasi XI PPLG 3</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                      <span>Studio Video Kelas</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Kelola dan putar arsip dokumentasi video kenangan kelas, perlombaan dekorasi, momen sosial, dan aktivitas seru siswa secara sinematik.
                    </p>

                    {/* Quick Stats Pill Strip */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold flex items-center gap-1.5 backdrop-blur-xs">
                        <Video className="w-3.5 h-3.5 text-purple-300" />
                        <span>Total <strong>{videosList.length}</strong> Video Dokumentasi</span>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold flex items-center gap-1.5 backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Kualitas Sinematik HD</span>
                      </div>

                      {videosList.length > 0 && (
                        <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 font-bold flex items-center gap-1.5 backdrop-blur-xs">
                          <Calendar className="w-3.5 h-3.5 text-purple-300" />
                          <span>Rilis Terkini: {videosList[0].tanggal || 'Terbaru'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Animated Film Reel + Add Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 border border-purple-400/30">
                      <Film className="w-8 h-8 sm:w-10 sm:h-10 animate-film-reel" />
                    </div>

                    <button
                      onClick={openAddVideoModal}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Tambah Video Baru</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Cinema Video Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {videosList.map((video) => {
                  const isDeleting = deletingVideoId === video.id;

                  return (
                    <div
                      key={video.id}
                      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group ${
                        isDeleting ? 'opacity-0 scale-90 blur-xs' : ''
                      }`}
                    >
                      {/* Video Thumbnail with Hover Scrim & Animated Play Button */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedPlayVideo(video)}>
                        <Image
                          src={video.thumbnail || '/assets/uploads/logo/logo_1787282041.jpeg'}
                          alt={video.judul}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />

                        {/* Top badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase bg-black/60 backdrop-blur-md text-purple-300 border border-purple-400/30 flex items-center gap-1 shadow-sm">
                            <Film className="w-3 h-3 text-purple-400" />
                            <span>Dokumentasi</span>
                          </span>

                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white/90 border border-white/20 shadow-sm">
                            MP4 HD
                          </span>
                        </div>

                        {/* Center Animated Glowing Play Button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 flex items-center justify-center group-hover:from-black/70 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform animate-play-pulse">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>

                        {/* Bottom Overlay Date */}
                        {video.tanggal && (
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-[11px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span>{video.tanggal}</span>
                          </div>
                        )}
                      </div>

                      {/* Video Info Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3
                            onClick={() => setSelectedPlayVideo(video)}
                            className="font-black text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-purple-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {video.judul}
                          </h3>

                          {video.deskripsi && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {video.deskripsi}
                            </p>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedPlayVideo(video)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Putar Video</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditVideoModal(video)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Video"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => confirmDeleteVideo(video)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MODAL 1: Cinema Lightbox Video Player */}
              <AdminModalPortal isOpen={!!selectedPlayVideo} onClose={() => setSelectedPlayVideo(null)} backdropClass="bg-black/90 backdrop-blur-md">
                {selectedPlayVideo && (
                  <div className="relative max-w-4xl w-full rounded-2xl sm:rounded-3xl bg-slate-900 border border-purple-500/30 p-4 sm:p-6 shadow-2xl overflow-hidden text-white my-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                          <Film className="w-4 h-4 animate-film-reel" />
                        </span>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                            {selectedPlayVideo.judul}
                          </h3>
                          {selectedPlayVideo.tanggal && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-purple-400" />
                              <span>{selectedPlayVideo.tanggal}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPlayVideo(null)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Tutup Player"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Video Player */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
                      <video
                        src={selectedPlayVideo.url_video}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Description below */}
                    {selectedPlayVideo.deskripsi && (
                      <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
                      {selectedPlayVideo.deskripsi}
                      </div>
                    )}
                  </div>
                )}
              </AdminModalPortal>

              {/* MODAL 2: Tambah / Edit Video Dokumentasi */}
              <AdminModalPortal isOpen={modalVideoOpen} onClose={() => setModalVideoOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-purple-100 text-purple-600 flex-shrink-0">
                          <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                            {editingVideo ? 'Edit Video Dokumentasi' : 'Upload Video Dokumentasi'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {editingVideo ? 'Perbarui informasi dan arsip video kelas' : 'Tambahkan rekaman momen sinematik kelas'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalVideoOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSaveVideo} className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        {/* Row 1: Judul Video */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Judul Video <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={videoFormJudul}
                            onChange={(e) => setVideoFormJudul(e.target.value)}
                            placeholder="cth: Makrab Kelas 2024"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium text-slate-800"
                          />
                        </div>

                        {/* Row 2: File Video */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            File Video <span className="text-red-500">*</span>
                          </label>
                          <div className="border border-dashed border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 transition-colors rounded-2xl p-3">
                            <input
                              type="file"
                              id="video-upload-file-input"
                              accept="video/*"
                              onChange={handleVideoFileUpload}
                              className="hidden"
                            />
                            <label htmlFor="video-upload-file-input" className="cursor-pointer block">
                              {videoFormUrl ? (
                                <div className="flex items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-purple-200 shadow-xs">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                      <Video className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">
                                        {videoFileName || 'File Video Terpilih'}
                                      </p>
                                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                        <Check className="w-3 h-3" /> File video siap diupload
                                      </p>
                                    </div>
                                  </div>
                                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200 transition-colors flex-shrink-0">
                                    Ganti File
                                  </span>
                                </div>
                              ) : (
                                <div className="py-2 text-center space-y-1.5 group">
                                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-purple-700">
                                      Pilih File Video dari Komputer / HP
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      Format MP4, WebM, MKV, atau MOV
                                    </p>
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Row 3: Upload Foto Thumbnail */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Upload Foto Thumbnail
                          </label>
                          <div className="border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 flex items-center gap-3">
                            {videoFormThumbnail ? (
                              <div className="relative w-20 h-13 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex-shrink-0 shadow-2xs">
                                <Image
                                  src={videoFormThumbnail}
                                  alt="Thumbnail preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-13 rounded-xl border border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-[9px] font-semibold">No Image</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0 space-y-1">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-all cursor-pointer shadow-2xs">
                                <UploadCloud className="w-3 h-3" />
                                <span>{videoFormThumbnail ? 'Ganti Foto' : 'Pilih Foto'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleVideoThumbUpload}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-[10px] text-slate-400">
                                JPG, PNG, atau WEBP (Rasio 16:9 disarankan)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Deskripsi */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Deskripsi Video
                          </label>
                          <textarea
                            rows={2}
                            value={videoFormDeskripsi}
                            onChange={(e) => setVideoFormDeskripsi(e.target.value)}
                            placeholder="Ceritakan momen seru di balik video ini..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600 leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Fixed Footer */}
                      <div className="flex-shrink-0 flex items-center justify-end gap-2 px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70">
                        <button
                          type="button"
                          onClick={() => setModalVideoOpen(false)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Simpan Video</span>
                        </button>
                      </div>
                    </form>
                  </div>
              </AdminModalPortal>

              {/* MODAL 3: Animated Delete Confirmation Modal */}
              <AdminModalPortal isOpen={!!videoToDelete} onClose={() => setVideoToDelete(null)}>
                {videoToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 sm:p-6 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Hapus Video Dokumentasi?
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Video <strong>"{videoToDelete.judul}"</strong> akan dihapus permanen dari arsip kelas.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setVideoToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={executeDeleteVideo}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Kelola Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Studio Header Banner */}
              <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 sm:p-7 text-white shadow-xl border border-indigo-900/40 overflow-hidden">
                {/* Decorative Ambient Beam */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-cinema-beam" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/30 flex-shrink-0">
                      <div className="w-full h-full bg-slate-900/80 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-blue-400">
                        <Camera className="w-7 h-7 animate-camera-shutter" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-extrabold border border-blue-400/30 mb-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Studio Visual & Kenangan</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Galeri Foto XI PPLG 3
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                        Kelola arsip dokumentasi kegiatan, momen kebersamaan, upacara, dan prestasi kelas dalam satu studio interaktif.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-center">
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">TOTAL FOTO</span>
                        <span className="text-base font-black text-white">{galleryList.length}</span>
                      </div>
                      <div className="w-px h-7 bg-white/10" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">KATEGORI</span>
                        <span className="text-base font-black text-blue-400">
                          {new Set(galleryList.map((g) => g.category)).size}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openAddGalleryModal}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Upload Foto Baru</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchGallery}
                      onChange={(e) => setSearchGallery(e.target.value)}
                      placeholder="Cari foto berdasarkan caption atau kategori kegiatan..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                    />
                    {searchGallery && (
                      <button
                        type="button"
                        onClick={() => setSearchGallery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-500 flex-shrink-0">
                    Menampilkan <span className="text-blue-600 font-black">{galleryList.filter((g) => {
                      const matchSearch = g.caption.toLowerCase().includes(searchGallery.toLowerCase()) || g.category.toLowerCase().includes(searchGallery.toLowerCase());
                      const matchCat = selectedGalleryCategory === 'Semua' || g.category === selectedGalleryCategory;
                      return matchSearch && matchCat;
                    }).length}</span> dari {galleryList.length} foto
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                  {['Semua', 'Upacara', 'Acara', 'Peringatan', 'Kebersamaan', 'Prestasi', 'Sosial'].map((cat) => {
                    const count = cat === 'Semua'
                      ? galleryList.length
                      : galleryList.filter((g) => g.category === cat).length;
                    const isActive = selectedGalleryCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedGalleryCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:border-blue-200'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photos Grid */}
              {(() => {
                const displayedPhotos = galleryList.filter((g) => {
                  const matchSearch = g.caption.toLowerCase().includes(searchGallery.toLowerCase()) || g.category.toLowerCase().includes(searchGallery.toLowerCase());
                  const matchCat = selectedGalleryCategory === 'Semua' || g.category === selectedGalleryCategory;
                  return matchSearch && matchCat;
                });

                if (displayedPhotos.length === 0) {
                  return (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">Tidak ada foto ditemukan</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Coba sesuaikan kata kunci pencarian atau pilih kategori lain untuk melihat koleksi foto.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setSearchGallery(''); setSelectedGalleryCategory('Semua'); }}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-colors"
                      >
                        Reset Filter
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {displayedPhotos.map((g) => {
                      const isDeleting = deletingGalleryId === g.id;
                      return (
                        <div
                          key={g.id}
                          className={`group relative rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                            isDeleting ? 'opacity-0 scale-90 -translate-y-3 transition-all duration-300' : ''
                          }`}
                        >
                          {/* Image Container */}
                          <div
                            onClick={() => setSelectedPreviewGallery(g)}
                            className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden cursor-pointer"
                          >
                            <Image
                              src={g.image}
                              alt={g.caption}
                              fill
                              className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            />

                            {/* Shimmer Light Sweep on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                            {/* Category Tag */}
                            <div className="absolute top-3 left-3 z-10 pointer-events-none">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs border ${getCategoryBadgeStyle(g.category)}`}>
                                {g.category}
                              </span>
                            </div>

                            {/* Full Preview Icon on Hover */}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="p-2.5 rounded-xl bg-white/90 text-blue-600 shadow-xl backdrop-blur-md flex items-center gap-1.5 font-bold text-xs group-hover:scale-105 transition-transform">
                                <Maximize2 className="w-4 h-4" />
                                <span>Preview</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Content & Action Buttons */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-3">
                              {g.caption}
                            </h4>

                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setSelectedPreviewGallery(g)}
                                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Penuh</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditGalleryModal(g)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                  title="Edit Keterangan Foto"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => confirmDeleteGallery(g)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Hapus Foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* MODAL 1: Upload / Edit Foto Galeri */}
              <AdminModalPortal isOpen={modalGalleryOpen} onClose={() => setModalGalleryOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                            {editingGallery ? 'Edit Foto Galeri' : 'Upload Foto Galeri Baru'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {editingGallery ? 'Perbarui informasi dan kategori foto' : 'Tambahkan potret kegiatan baru ke galeri'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalGalleryOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Scrollable Form Body */}
                    <form onSubmit={handleSaveGallery} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-4 space-y-3.5 flex-1 text-xs sm:text-sm">
                        {/* Upload Foto Input (File Upload Only) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            File Foto <span className="text-rose-500">*</span>
                          </label>
                          <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 rounded-2xl p-3 transition-all">
                            <input
                              type="file"
                              id="gallery-file-input"
                              accept="image/*"
                              onChange={handleGalleryPhotoUpload}
                              className="hidden"
                            />
                            <label htmlFor="gallery-file-input" className="cursor-pointer block">
                              {galleryFormImage ? (
                                <div className="space-y-2">
                                  <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                                    <Image
                                      src={galleryFormImage}
                                      alt="Preview Foto"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between gap-2 px-1">
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">
                                        {galleryFileName || 'Foto Terpilih'}
                                      </p>
                                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Foto siap diunggah
                                      </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition-colors flex-shrink-0">
                                      Ganti Foto
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-4 text-center space-y-1.5 group">
                                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-blue-700">
                                      Pilih Foto dari Komputer / HP
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      Format JPG, PNG, atau WEBP (Maksimal 5MB)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Judul / Caption */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Keterangan / Judul Foto <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={galleryFormCaption}
                            onChange={(e) => setGalleryFormCaption(e.target.value)}
                            placeholder="Contoh: Petugas Upacara Bendera HUT RI 2026"
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-bold"
                          />
                        </div>

                        {/* Kategori */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Kategori Kegiatan <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={galleryFormCategory}
                            onChange={(e) => setGalleryFormCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-semibold"
                          >
                            <option value="Kebersamaan">Kebersamaan</option>
                            <option value="Upacara">Upacara</option>
                            <option value="Acara">Acara</option>
                            <option value="Peringatan">Peringatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Sosial">Sosial</option>
                          </select>
                        </div>
                      </div>

                      {/* Fixed Footer */}
                      <div className="flex-shrink-0 flex items-center justify-end gap-2 px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70">
                        <button
                          type="button"
                          onClick={() => setModalGalleryOpen(false)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Simpan Foto</span>
                        </button>
                      </div>
                    </form>
                  </div>
              </AdminModalPortal>

              {/* MODAL 2: Lightbox Cinema Preview Modal */}
              <AdminModalPortal isOpen={!!selectedPreviewGallery} onClose={() => setSelectedPreviewGallery(null)} backdropClass="bg-black/90 backdrop-blur-md">
                {selectedPreviewGallery && (
                  <div className="relative max-w-4xl w-full rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col text-white my-auto">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/70">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-xs border ${getCategoryBadgeStyle(selectedPreviewGallery.category)}`}>
                          {selectedPreviewGallery.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-lg">
                          {selectedPreviewGallery.caption}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewGallery(null)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-black flex items-center justify-center">
                      <Image
                        src={selectedPreviewGallery.image}
                        alt={selectedPreviewGallery.caption}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </AdminModalPortal>

              {/* MODAL 3: Delete Confirmation Modal */}
              <AdminModalPortal isOpen={!!galleryToDelete} onClose={() => setGalleryToDelete(null)}>
                {galleryToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 sm:p-6 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Hapus Foto dari Galeri?
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Foto <strong>"{galleryToDelete.caption}"</strong> akan dihapus permanen dari arsip galeri kelas.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setGalleryToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={executeDeleteGallery}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Kelola Project */}
          {activeTab === 'project' && (
            <div className="space-y-6">
              {/* Studio Header Banner */}
              <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-5 sm:p-7 text-white shadow-xl border border-cyan-900/40 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-terminal-glow" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex-shrink-0">
                      <div className="w-full h-full bg-slate-900/80 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-cyan-400">
                        <Terminal className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-extrabold border border-cyan-400/30 mb-1.5">
                        <Code className="w-3 h-3 text-cyan-300" />
                        <span>Developer Innovation Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Showcase Project XI PPLG 3
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                        Kelola portofolio aplikasi, website, dan inovasi software engineering karya siswa kelas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-center">
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">TOTAL PROYEK</span>
                        <span className="text-base font-black text-white">{projectsList.length}</span>
                      </div>
                      <div className="w-px h-7 bg-white/10" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">FEATURED</span>
                        <span className="text-base font-black text-cyan-400">
                          {projectsList.filter((p) => p.featured).length}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openAddProjectModal}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Tambah Proyek Baru</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    placeholder="Cari proyek berdasarkan judul, nama pembuat, atau tech stack..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 font-medium"
                  />
                  {searchProject && (
                    <button
                      type="button"
                      onClick={() => setSearchProject('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-500 flex-shrink-0">
                  Menampilkan <span className="text-cyan-600 font-black">{projectsList.filter((p) => {
                    const q = searchProject.toLowerCase();
                    const stack = Array.isArray(p.tech_stack) ? p.tech_stack.join(' ').toLowerCase() : '';
                    return p.title.toLowerCase().includes(q) || (p.makers && p.makers.toLowerCase().includes(q)) || stack.includes(q);
                  }).length}</span> dari {projectsList.length} proyek
                </div>
              </div>

              {/* Projects Grid */}
              {(() => {
                const displayedProjects = projectsList.filter((p) => {
                  const q = searchProject.toLowerCase();
                  const stack = Array.isArray(p.tech_stack) ? p.tech_stack.join(' ').toLowerCase() : '';
                  return p.title.toLowerCase().includes(q) || (p.makers && p.makers.toLowerCase().includes(q)) || stack.includes(q);
                });

                if (displayedProjects.length === 0) {
                  return (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-3">
                        <Code className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">Tidak ada proyek ditemukan</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Coba kata kunci pencarian lain atau tambahkan proyek karya siswa baru.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProjects.map((p) => {
                      const isDeleting = deletingProjectId === p.id;
                      return (
                        <div
                          key={p.id}
                          className={`group rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                            isDeleting ? 'opacity-0 scale-90 -translate-y-3 transition-all duration-300' : ''
                          }`}
                        >
                          <div>
                            {/* Project Screenshot Banner */}
                            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                              <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                              />

                              {/* Shimmer Light Sweep */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                              {/* Featured Badge */}
                              {p.featured && (
                                <div className="absolute top-3 left-3 z-10">
                                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md shadow-amber-500/30 flex items-center gap-1 border border-amber-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>Featured</span>
                                  </span>
                                </div>
                              )}

                              {/* Quick Action Overlay */}
                              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => toggleFeaturedProject(p.id)}
                                  className={`p-2 rounded-xl backdrop-blur-md shadow-md transition-all ${
                                    p.featured
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-black/60 text-white hover:bg-amber-500'
                                  }`}
                                  title={p.featured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                                >
                                  <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditProjectModal(p)}
                                  className="p-2 rounded-xl bg-black/60 hover:bg-cyan-600 text-white backdrop-blur-md shadow-md transition-all"
                                  title="Edit Proyek"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => confirmDeleteProject(p)}
                                  className="p-2 rounded-xl bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md shadow-md transition-all"
                                  title="Hapus Proyek"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Project Info */}
                            <div className="p-4 sm:p-5">
                              <h4 className="text-base font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1.5 line-clamp-1">
                                {p.title}
                              </h4>

                              {p.makers && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                                  <User className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                                  <span className="truncate font-semibold">{p.makers}</span>
                                </div>
                              )}

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                                {p.description}
                              </p>

                              {/* Tech Stack Chips */}
                              {Array.isArray(p.tech_stack) && p.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {p.tech_stack.map((tech, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/80"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="p-4 pt-0">
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
                            >
                              <span>Buka Live Demo</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* MODAL: Tambah / Edit Proyek */}
              <AdminModalPortal isOpen={modalProjectOpen} onClose={() => setModalProjectOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-150">
                    <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-100 text-cyan-600 flex-shrink-0">
                          <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                            {editingProject ? 'Edit Portofolio Proyek' : 'Tambah Proyek Baru'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {editingProject ? 'Perbarui informasi aplikasi karya siswa' : 'Tambahkan karya inovasi siswa kelas ke showcase'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalProjectOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-4 space-y-3.5 flex-1 text-xs sm:text-sm">
                        {/* File Upload Screenshot (Direct File Picker) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Screenshot / Thumbnail Proyek <span className="text-rose-500">*</span>
                          </label>
                          <div className="border-2 border-dashed border-cyan-200 hover:border-cyan-400 bg-cyan-50/20 hover:bg-cyan-50/40 rounded-2xl p-3 transition-all">
                            <input
                              type="file"
                              id="project-screenshot-upload"
                              accept="image/*"
                              onChange={handleProjectPhotoUpload}
                              className="hidden"
                            />
                            <label htmlFor="project-screenshot-upload" className="cursor-pointer block">
                              {projectFormImage ? (
                                <div className="space-y-2">
                                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                                    <Image
                                      src={projectFormImage}
                                      alt="Screenshot preview"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between gap-2 px-1">
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">
                                        {projectFileName || 'File Gambar Terpilih'}
                                      </p>
                                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Screenshot siap digunakan
                                      </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-[11px] font-bold border border-cyan-200 transition-colors flex-shrink-0">
                                      Ganti Gambar
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-4 text-center space-y-1.5 group">
                                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-cyan-700">
                                      Pilih Gambar Screenshot dari Perangkat
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      Format JPG, PNG, atau WEBP (Rasio 16:9 disarankan)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Judul & Pembuat */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Judul Proyek <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={projectFormTitle}
                              onChange={(e) => setProjectFormTitle(e.target.value)}
                              placeholder="Contoh: Perpustakaan Digital"
                              required
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Pembuat / Developer Siswa
                            </label>
                            <input
                              type="text"
                              value={projectFormMakers}
                              onChange={(e) => setProjectFormMakers(e.target.value)}
                              placeholder="Contoh: Davin, Dema, Rajib"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-medium"
                            />
                          </div>
                        </div>

                        {/* Link & Tech Stack */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Link Live Demo / Website
                            </label>
                            <input
                              type="text"
                              value={projectFormLink}
                              onChange={(e) => setProjectFormLink(e.target.value)}
                              placeholder="https://perpuspgri3.online"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Tech Stack (Pisahkan Koma)
                            </label>
                            <input
                              type="text"
                              value={projectFormTechStack}
                              onChange={(e) => setProjectFormTechStack(e.target.value)}
                              placeholder="Next.js, Tailwind, MySQL"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Deskripsi Singkat Proyek
                          </label>
                          <textarea
                            rows={3}
                            value={projectFormDescription}
                            onChange={(e) => setProjectFormDescription(e.target.value)}
                            placeholder="Jelaskan tujuan aplikasi, fitur unggulan, dan masalah yang diselesaikan..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 leading-relaxed"
                          />
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                          <input
                            type="checkbox"
                            id="featured-toggle"
                            checked={projectFormFeatured}
                            onChange={(e) => setProjectFormFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                          />
                          <label htmlFor="featured-toggle" className="text-xs font-bold text-amber-900 cursor-pointer">
                            Tampilkan sebagai Proyek Unggulan (Featured Showcase ⭐)
                          </label>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex-shrink-0 flex items-center justify-end gap-2 px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70">
                        <button
                          type="button"
                          onClick={() => setModalProjectOpen(false)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Simpan Proyek</span>
                        </button>
                      </div>
                    </form>
                  </div>
              </AdminModalPortal>

              {/* MODAL: Hapus Proyek */}
              <AdminModalPortal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)}>
                {projectToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 sm:p-6 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Hapus Proyek Showcase?
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Proyek <strong>"{projectToDelete.title}"</strong> akan dihapus permanen dari portofolio kelas.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={executeDeleteProject}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Komentar */}
          {activeTab === 'komentar' && (
            <div className="space-y-6">
              {/* Community Moderation Header Banner */}
              <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-5 sm:p-7 text-white shadow-xl border border-purple-900/40 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-play-pulse" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/30 flex-shrink-0">
                      <div className="w-full h-full bg-slate-900/80 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-purple-400">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-extrabold border border-purple-400/30 mb-1.5">
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        <span>Community Feedback Hub</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Moderasi Komentar & Diskusi Proyek
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                        Pantau interaksi pengunjung, tampilkan apresiasi publik, atau sembunyikan komentar yang tidak pantas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs self-start sm:self-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">TOTAL ULASAN</span>
                      <span className="text-base font-black text-white">{commentsList.length}</span>
                    </div>
                    <div className="w-px h-7 bg-white/10" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">AKTIF PUBLIK</span>
                      <span className="text-base font-black text-emerald-400">
                        {commentsList.filter((c) => c.is_visible).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchComment}
                      onChange={(e) => setSearchComment(e.target.value)}
                      placeholder="Cari komentar berdasarkan nama pengirim atau isi ulasan..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-medium"
                    />
                    {searchComment && (
                      <button
                        type="button"
                        onClick={() => setSearchComment('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    {(['all', 'visible', 'hidden'] as const).map((status) => {
                      const label = status === 'all' ? 'Semua' : status === 'visible' ? 'Tampil Publik' : 'Disembunyikan';
                      const count = status === 'all'
                        ? commentsList.length
                        : status === 'visible'
                        ? commentsList.filter((c) => c.is_visible).length
                        : commentsList.filter((c) => !c.is_visible).length;
                      const isActive = commentFilterStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setCommentFilterStatus(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                          }`}
                        >
                          <span>{label}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {(() => {
                const filtered = commentsList.filter((c) => {
                  const q = searchComment.toLowerCase();
                  const matchSearch = c.user_name.toLowerCase().includes(q) || c.comment.toLowerCase().includes(q);
                  const matchStatus =
                    commentFilterStatus === 'all' ||
                    (commentFilterStatus === 'visible' && c.is_visible) ||
                    (commentFilterStatus === 'hidden' && !c.is_visible);
                  return matchSearch && matchStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">Tidak ada komentar yang cocok</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Coba sesuaikan kata kunci pencarian atau ubah filter status komentar di atas.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3.5">
                    {filtered.map((c) => {
                      const isDeleting = deletingCommentId === c.id;
                      const relatedProject = projectsList.find((p) => p.id === c.project_id);
                      return (
                        <div
                          key={c.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            c.is_visible
                              ? 'border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md'
                              : 'border-amber-200 bg-amber-50/20'
                          } ${isDeleting ? 'opacity-0 scale-95 -translate-y-2 transition-all duration-300' : ''}`}
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Avatar Initials */}
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm shadow-purple-500/25">
                              {c.user_name.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                  {c.user_name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  c.is_visible
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {c.is_visible ? '● Aktif di Web' : '● Disembunyikan'}
                                </span>
                                {relatedProject && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[200px]">
                                    Proyek: {relatedProject.title}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                "{c.comment}"
                              </p>

                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  }) : 'Baru saja'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Moderation Controls */}
                          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <button
                              type="button"
                              onClick={() => toggleCommentVisibility(c.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                c.is_visible
                                  ? 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                              }`}
                              title={c.is_visible ? 'Sembunyikan dari web' : 'Tampilkan kembali di web'}
                            >
                              {c.is_visible ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Sembunyikan</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Tampilkan</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => confirmDeleteComment(c)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                              title="Hapus Komentar Permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* MODAL: Hapus Komentar */}
              <AdminModalPortal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)}>
                {commentToDelete && (
                  <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 sm:p-6 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Hapus Komentar?
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Komentar dari <strong>"{commentToDelete.user_name}"</strong> akan dihapus permanen.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCommentToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={executeDeleteComment}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                )}
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: Contact & Profile (Kiri: Contact, Kanan: Ganti Profile) */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3 tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                      <span>STUDIO PENGATURAN KELAS & WEB</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Kontak & Profil Website
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                      Kelola saluran komunikasi publik di sisi kiri, dan ubah logo, nama kelas, serta profil website di sisi kanan dengan pratinjau langsung secara real-time.
                    </p>
                  </div>

                  {/* Quick All-in-One Save Button */}
                  <button
                    type="button"
                    onClick={handleSaveAllContactAndProfile}
                    disabled={savingContact || savingProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {savingContact || savingProfile ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Menyimpan Semua...</span>
                      </>
                    ) : contactSaveSuccess && profileSaveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Semua Tersimpan!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simpan Kontak & Profil Sekaligus</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2-Column Responsive Layout: Left = Contact, Right = Profile */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: Informasi Kontak (lg:col-span-6) */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          Informasi Kontak & Sosmed
                        </h3>
                        <p className="text-xs text-slate-500">
                          Saluran komunikasi terbuka untuk pengunjung & wali murid
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetContact}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Reset ke nilai default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSaveContact} className="space-y-4">
                    {/* Instagram */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                          Instagram Resmi Kelas
                        </span>
                        {contactInstagram && (
                          <a
                            href={`https://instagram.com/${contactInstagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-pink-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Buka Profil</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={contactInstagram}
                          onChange={(e) => setContactInstagram(e.target.value)}
                          placeholder="@xpplg.3rd"
                          className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(contactInstagram);
                            setSaveSuccessMsg('Username Instagram disalin!');
                            setTimeout(() => setSaveSuccessMsg(null), 2000);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-600 p-1"
                          title="Salin username"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          Nomor WhatsApp Admin / Kelas
                        </span>
                        {contactWhatsapp && (
                          <a
                            href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Uji Chat WA</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={contactWhatsapp}
                          onChange={(e) => setContactWhatsapp(e.target.value)}
                          placeholder="6281294862060"
                          className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(contactWhatsapp);
                            setSaveSuccessMsg('Nomor WhatsApp disalin!');
                            setTimeout(() => setSaveSuccessMsg(null), 2000);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 p-1"
                          title="Salin nomor"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Gunakan kode negara tanpa tanda plus atau spasi (contoh: 6281294862060).
                      </span>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-500" />
                          Alamat Email Resmi Kelas
                        </span>
                        {contactEmail && (
                          <a
                            href={`mailto:${contactEmail}`}
                            className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Kirim Email</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="classxpplg3@gmail.com"
                          className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(contactEmail);
                            setSaveSuccessMsg('Alamat email disalin!');
                            setTimeout(() => setSaveSuccessMsg(null), 2000);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-1"
                          title="Salin email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* TikTok / Video Channel */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-purple-500" />
                        TikTok / Saluran Dokumentasi
                      </label>
                      <input
                        type="text"
                        value={contactTiktok}
                        onChange={(e) => setContactTiktok(e.target.value)}
                        placeholder="@xipplg3.official"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>

                    {/* Alamat Sekolah */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        Lokasi & Alamat Sekolah
                      </label>
                      <textarea
                        rows={3}
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        placeholder="SMK Penerbangan Bogor..."
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>

                    {/* Save Contact Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingContact}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        {savingContact ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Menyimpan Kontak...</span>
                          </>
                        ) : contactSaveSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            <span>Kontak Berhasil Disimpan!</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Simpan Perubahan Kontak</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* RIGHT COLUMN: Ganti Profil Website (lg:col-span-6) */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Card Profil Form */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900">
                            Ganti Profil Website
                          </h3>
                          <p className="text-xs text-slate-500">
                            Identitas utama, logo, nama kelas, dan slogan publik
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetProfile}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Reset ke nilai default"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      {/* Logo Website Upload (Direct File, No URL needed) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                          Logo Website Kelas (Upload File Langsung)
                        </label>
                        <div className="p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors flex flex-col sm:flex-row items-center gap-4">
                          {/* Logo Preview Avatar */}
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0 flex items-center justify-center">
                            {profileLogo ? (
                              <Image
                                src={profileLogo}
                                alt="Logo Kelas"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Globe className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          {/* Upload Buttons */}
                          <div className="flex-1 text-center sm:text-left space-y-1.5">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <label
                                htmlFor="logo-file-input"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Pilih Logo Baru</span>
                              </label>
                              <input
                                id="logo-file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                              {profileLogoFileName && (
                                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100/70 px-2 py-1 rounded-lg truncate max-w-[160px]">
                                  {profileLogoFileName}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Mendukung PNG, JPG, WEBP, atau SVG dari galeri perangkat.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Nama Kelas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Nama Kelas
                          </label>
                          <input
                            type="text"
                            value={profileClassName}
                            onChange={(e) => setProfileClassName(e.target.value)}
                            placeholder="XI PPLG 3"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Tahun Ajaran / Angkatan
                          </label>
                          <input
                            type="text"
                            value={profileYear}
                            onChange={(e) => setProfileYear(e.target.value)}
                            placeholder="2026 / 2027"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Nama Sekolah */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Sekolah / Institusi
                        </label>
                        <input
                          type="text"
                          value={profileSchoolName}
                          onChange={(e) => setProfileSchoolName(e.target.value)}
                          placeholder="SMK Penerbangan Bogor"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      {/* Slogan / Tagline */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Slogan / Tagline Website
                        </label>
                        <input
                          type="text"
                          value={profileTagline}
                          onChange={(e) => setProfileTagline(e.target.value)}
                          placeholder="Unggul dalam Teknologi, Kreatif dalam Inovasi"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      {/* Deskripsi Singkat */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Deskripsi Singkat Profil Website
                        </label>
                        <textarea
                          rows={3}
                          value={profileDescription}
                          onChange={(e) => setProfileDescription(e.target.value)}
                          placeholder="Portal web resmi kelas XI PPLG 3..."
                          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      {/* Save Profile Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                          {savingProfile ? (
                            <>
                              <RotateCcw className="w-4 h-4 animate-spin" />
                              <span>Menyimpan Profil...</span>
                            </>
                          ) : profileSaveSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              <span>Profil Berhasil Disimpan!</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Simpan Perubahan Profil</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* LIVE PREVIEW WIDGET (Card Pratinjau Tampilan Header Website) */}
                  <div className="rounded-3xl bg-[#090d16] border border-slate-800 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Preview Header Bar */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-300">
                        <Eye className="w-4 h-4 text-indigo-400" />
                        <span>Pratinjau Langsung (Live Preview)</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar-pulse" />
                        <span>LIVE REAKTIF</span>
                      </div>
                    </div>

                    {/* Simulated Mini Web Header */}
                    <div className="pt-4 flex items-center gap-4">
                      {/* Logo Avatar */}
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-lg flex-shrink-0 bg-blue-600">
                        {profileLogo ? (
                          <Image
                            src={profileLogo}
                            alt="Preview Logo"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Globe className="w-7 h-7 text-white m-auto" />
                        )}
                      </div>

                      {/* Titles */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-white truncate">
                            {profileClassName || 'XI PPLG 3'}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                            {profileYear || '2026 / 2027'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {profileSchoolName || 'SMK Penerbangan Bogor'}
                        </p>
                        <p className="text-[11px] text-indigo-300/90 italic truncate">
                          "{profileTagline || 'Unggul dalam Teknologi, Kreatif dalam Inovasi'}"
                        </p>
                      </div>
                    </div>

                    {/* Simulated Contact Badges */}
                    <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-pink-400 flex items-center gap-1">
                        <InstagramIcon className="w-3 h-3" />
                        <span>{contactInstagram || '@xpplg.3rd'}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{contactWhatsapp || '6281294862060'}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{contactEmail || 'classxpplg3@gmail.com'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Activity Log (Audit Trail Studio) */}
          {activeTab === 'activity_log' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-[#090d16] p-6 sm:p-8 text-white shadow-xl border border-slate-800">
                <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3 tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-radar-pulse" />
                      <span>AUDIT TRAIL & SYSTEM SECURITY MONITOR</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                      <span>Riwayat Aktivitas Sistem</span>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono font-normal">
                        v2.6 Live
                      </span>
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                      Pencatatan menyeluruh setiap perubahan data, otentikasi admin, interaksi siswa, dan aktivitas pengunjung secara real-time.
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleExportLogs}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLogsToDefault}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                      title="Kembalikan log ke entri awal"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-400" />
                      <span>Reset Log</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalClearLogsOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Bersihkan Log</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400">Total Riwayat</div>
                    <div className="text-2xl font-black text-white mt-0.5">{activityLogsList.length}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] font-semibold text-blue-400">Aktivitas Admin</div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      {activityLogsList.filter((l) => l.actorRole === 'admin').length}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] font-semibold text-purple-400">Interaksi Siswa</div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      {activityLogsList.filter((l) => l.actorRole === 'student').length}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] font-semibold text-emerald-400">Keamanan Sistem</div>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>100% Aman</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Category Filter Pills */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari aksi, aktor, target (misal: 'login', 'Rajib', 'piket')..."
                      value={searchLog}
                      onChange={(e) => setSearchLog(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    {searchLog && (
                      <button
                        type="button"
                        onClick={() => setSearchLog('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium px-1 flex items-center gap-1.5">
                    <span>Menampilkan</span>
                    <strong className="text-slate-900 font-bold">{filteredLogs.length}</strong>
                    <span>dari</span>
                    <strong className="text-slate-900 font-bold">{activityLogsList.length}</strong>
                    <span>entri</span>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {logCategories.map((cat) => {
                    const isActive = selectedLogCategory === cat.id;
                    const count =
                      cat.id === 'Semua'
                        ? activityLogsList.length
                        : activityLogsList.filter((l) => l.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedLogCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Stream Feed */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Clock className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800">
                      Tidak ada riwayat aktivitas yang cocok
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Coba sesuaikan kata kunci pencarian atau pilih filter kategori "Semua Aktivitas".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => {
                      const isCopied = copiedLogId === log.id;

                      // Actor badge styling
                      const actorBadgeClass =
                        log.actorRole === 'admin'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : log.actorRole === 'student'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : log.actorRole === 'system'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200';

                      // Category icon
                      const getCategoryIcon = () => {
                        switch (log.category) {
                          case 'auth':
                            return <Shield className="w-4 h-4 text-blue-600" />;
                          case 'profile':
                            return <Globe className="w-4 h-4 text-indigo-600" />;
                          case 'student':
                            return <Users className="w-4 h-4 text-purple-600" />;
                          case 'schedule':
                            return <Calendar className="w-4 h-4 text-emerald-600" />;
                          case 'content':
                            return <ImageIcon className="w-4 h-4 text-rose-600" />;
                          case 'project':
                            return <Code className="w-4 h-4 text-cyan-600" />;
                          default:
                            return <Activity className="w-4 h-4 text-slate-600" />;
                        }
                      };

                      return (
                        <div
                          key={log.id}
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-log-slide"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getCategoryIcon()}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${actorBadgeClass}`}>
                                  {log.actor}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-900">
                                  {log.action}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">
                                  Target: <em>{log.target}</em>
                                </span>
                                <span>•</span>
                                <span className="font-mono text-[11px] text-slate-400">
                                  {log.ip}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Timestamp & Copy Action */}
                          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{log.timestamp}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const logText = `[${log.timestamp}] ${log.actor}: ${log.action} (${log.target}) - ${log.ip}`;
                                navigator.clipboard.writeText(logText);
                                setCopiedLogId(log.id);
                                setTimeout(() => setCopiedLogId(null), 2000);
                              }}
                              className="text-[11px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                              title="Salin baris log ini"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MODAL: Konfirmasi Bersihkan Seluruh Riwayat Log */}
              <AdminModalPortal isOpen={modalClearLogsOpen} onClose={() => setModalClearLogsOpen(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 sm:p-6 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 animate-bounce">
                    <Trash2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Bersihkan Riwayat Log?
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Seluruh entri audit trail sistem saat ini akan dikosongkan. Anda dapat mengembalikan riwayat default kapan saja melalui tombol "Reset Log".
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalClearLogsOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                    >
                      Ya, Bersihkan
                    </button>
                  </div>
                </div>
              </AdminModalPortal>
            </div>
          )}

          {/* TAB: KELOLA MUSIK */}
          {activeTab === 'music' && (
            <KelolaMusicTab onAddLog={addActivityLog} />
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
