'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Globe, 
  LogOut, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  Menu, 
  X, 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Camera, 
  IdCard,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { initialStudents, initialJadwalPiket, initialJadwalPelajaran } from '@/data/seedData';
import { Student, JadwalPiket, JadwalPelajaran } from '@/types/database';
import { useClassProfile } from '@/context/ClassProfileContext';

export default function SiswaDashboardPage() {
  const router = useRouter();
  const { profile } = useClassProfile();

  // Active Tab: 'dashboard' | 'biodata' | 'pengaturan'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'biodata' | 'pengaturan'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);

  // Biodata Form State
  const [bio, setBio] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [expertise, setExpertise] = useState('Frontend & Web Engineering');
  const [studentPhoto, setStudentPhoto] = useState('');
  const [savingBiodata, setSavingBiodata] = useState(false);
  const [biodataSaved, setBiodataSaved] = useState(false);

  // Settings: Email Form State
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  // Settings: Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);

  // Real-time time display
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDayName, setCurrentDayName] = useState('Senin');

  useEffect(() => {
    // Determine current day & time
    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    setCurrentDayName(daysIndo[now.getDay()] === 'Minggu' || daysIndo[now.getDay()] === 'Sabtu' ? 'Senin' : daysIndo[now.getDay()]);

    const updateTimer = () => {
      const d = new Date();
      setCurrentTimeStr(
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      );
    };
    updateTimer();
    const interval = setInterval(updateTimer, 10000);

    // Check student session
    const storedUser = localStorage.getItem('class_web_user');

    // Find student in studentsList from localStorage or fallback
    let allStudents: Student[] = initialStudents;
    const savedStudents = localStorage.getItem('class_students_list');
    if (savedStudents) {
      try {
        allStudents = JSON.parse(savedStudents);
      } catch (e) {
        console.error(e);
      }
    }

    // Default to Nadine if storedUser matches or fallback
    let currentStudent = allStudents.find(
      (s) => storedUser && (s.name.toLowerCase() === storedUser.toLowerCase() || storedUser.toLowerCase().includes(s.name.toLowerCase()))
    );

    if (!currentStudent) {
      // Find Nadine Shahmina or student 28
      currentStudent = allStudents.find((s) => s.name.toLowerCase().includes('nadine')) || allStudents[27] || allStudents[0];
    }

    setStudent(currentStudent);
    setBio(currentStudent.bio || 'Semangat belajar teknologi dan software engineering di XI PPLG 3!');
    setPortfolioLink(currentStudent.portfolio_link || '');
    setGithubLink(currentStudent.github_link || '');
    setInstagramLink(currentStudent.instagram_link || '@' + currentStudent.name.toLowerCase().replace(/\s+/g, ''));
    setStudentPhoto(currentStudent.photo);

    // Load registered accounts to find email & password
    const registered = JSON.parse(localStorage.getItem('class_registered_students') || '[]');
    const matchedAccount = registered.find(
      (acc: any) =>
        acc.id === currentStudent?.id ||
        (currentStudent?.nisn && acc.nisn === currentStudent.nisn) ||
        acc.name.toLowerCase() === currentStudent?.name.toLowerCase()
    );

    if (matchedAccount && matchedAccount.email) {
      setCurrentEmail(matchedAccount.email);
    } else if (currentStudent.email) {
      setCurrentEmail(currentStudent.email);
    } else {
      setCurrentEmail(`${currentStudent.name.toLowerCase().replace(/\s+/g, '')}@smkn1ciomas.sch.id`);
    }

    return () => clearInterval(interval);
  }, []);

  // Handle Biodata Save
  const handleSaveBiodata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setSavingBiodata(true);
    setTimeout(() => {
      // Update student object in state
      const updatedStudent: Student = {
        ...student,
        photo: studentPhoto,
        bio: bio.trim(),
        portfolio_link: portfolioLink.trim(),
        github_link: githubLink.trim(),
        instagram_link: instagramLink.trim()
      };
      setStudent(updatedStudent);

      // Persist in class_students_list & class_web_students
      try {
        const savedList = localStorage.getItem('class_students_list');
        const list: Student[] = savedList ? JSON.parse(savedList) : initialStudents;
        const index = list.findIndex((s) => s.id === student.id || s.name === student.name);
        if (index !== -1) {
          list[index] = updatedStudent;
        } else {
          list.push(updatedStudent);
        }
        localStorage.setItem('class_students_list', JSON.stringify(list));
        localStorage.setItem('class_web_students', JSON.stringify(list));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('class_students_updated'));
        }
      } catch (err) {
        console.error(err);
      }

      setSavingBiodata(false);
      setBiodataSaved(true);
      setTimeout(() => setBiodataSaved(false), 3000);
    }, 400);
  };

  // Handle Email Update
  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErrorMsg(null);
    setEmailSuccessMsg(null);

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setEmailErrorMsg('Harap masukkan format alamat email yang valid.');
      return;
    }

    setSavingEmail(true);
    setTimeout(() => {
      setCurrentEmail(newEmail.trim());

      // Update registered accounts in localStorage
      try {
        const registered = JSON.parse(localStorage.getItem('class_registered_students') || '[]');
        const idx = registered.findIndex(
          (acc: any) =>
            acc.id === student?.id ||
            (student?.nisn && acc.nisn === student.nisn) ||
            acc.name.toLowerCase() === student?.name.toLowerCase()
        );

        if (idx !== -1) {
          registered[idx].email = newEmail.trim();
        } else if (student) {
          registered.push({
            id: student.id,
            name: student.name,
            nisn: student.nisn || student.id,
            email: newEmail.trim(),
            password: 'password123',
            kelas: student.kelas || 'XI PPLG 3'
          });
        }
        localStorage.setItem('class_registered_students', JSON.stringify(registered));
      } catch (err) {
        console.error(err);
      }

      setSavingEmail(false);
      setEmailSuccessMsg('Alamat email akun siswa berhasil diperbarui!');
      setNewEmail('');
      setTimeout(() => setEmailSuccessMsg(null), 3500);
    }, 400);
  };

  // Handle Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    setPassSuccessMsg(null);

    if (!newPassword.trim()) {
      setPassErrorMsg('Kata sandi baru tidak boleh kosong.');
      return;
    }
    if (newPassword.length < 6) {
      setPassErrorMsg('Kata sandi minimal 6 karakter demi keamanan akun Anda.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setSavingPass(true);
    setTimeout(() => {
      // Update password in class_registered_students
      try {
        const registered = JSON.parse(localStorage.getItem('class_registered_students') || '[]');
        const idx = registered.findIndex(
          (acc: any) =>
            acc.id === student?.id ||
            (student?.nisn && acc.nisn === student.nisn) ||
            acc.name.toLowerCase() === student?.name.toLowerCase()
        );

        if (idx !== -1) {
          registered[idx].password = newPassword.trim();
        } else if (student) {
          registered.push({
            id: student.id,
            name: student.name,
            nisn: student.nisn || student.id,
            email: currentEmail || `${student.name.toLowerCase()}@smkn1ciomas.sch.id`,
            password: newPassword.trim(),
            kelas: student.kelas || 'XI PPLG 3'
          });
        }
        localStorage.setItem('class_registered_students', JSON.stringify(registered));
      } catch (err) {
        console.error(err);
      }

      setSavingPass(false);
      setPassSuccessMsg('Kata sandi akun siswa berhasil diubah dengan sukses!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccessMsg(null), 3500);
    }, 400);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('class_web_user');
    localStorage.removeItem('class_user_role');
    localStorage.removeItem('class_student_id');
    router.push('/');
  };

  // Photo change handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setStudentPhoto(previewUrl);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <p className="text-xs text-slate-400 font-medium">Memuat portal siswa...</p>
      </div>
    );
  }

  // Find student piket
  const piketEntry = initialJadwalPiket.find((p) =>
    student.name.toLowerCase().includes(p.nama_siswa.toLowerCase()) ||
    p.nama_siswa.toLowerCase().includes(student.name.split(' ')[0].toLowerCase())
  );

  // Today's lessons
  const todayClasses: JadwalPelajaran[] = initialJadwalPelajaran.filter(
    (j) => j.hari.toLowerCase() === currentDayName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans antialiased">
      {/* 1. SIDEBAR (Dark Slate Theme matching Admin Panel) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b132b] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 flex-shrink-0 bg-[#080d1f]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-purple-500/40 flex-shrink-0 bg-purple-600 shadow-sm">
              <Image
                src={profile.logo || '/assets/uploads/logo/logo_1787282041.jpeg'}
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-wide block leading-tight">
                Portal Siswa
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {profile.className || 'XI PPLG 3'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mini Student Profile Card in Sidebar */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 shadow-inner">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-purple-400/60 flex-shrink-0 bg-purple-950">
            <Image
              src={studentPhoto || student.photo}
              alt={student.name}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate leading-tight">
              {student.name}
            </h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              NISN: {student.nisn || student.id}
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Siswa Aktif
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>

          {/* 1. Dashboard */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* 2. Biodata Profile */}
          <button
            onClick={() => {
              setActiveTab('biodata');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'biodata'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Biodata Profile</span>
          </button>

          {/* 3. Pengaturan */}
          <button
            onClick={() => {
              setActiveTab('pengaturan');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pengaturan'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Akun</span>
          </button>

          <div className="pt-4 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Akses & Sesi
          </div>

          {/* 4. Lihat Website */}
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all group"
          >
            <Globe className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Lihat Website</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
          </Link>

          {/* 5. Logout */}
          <button
            onClick={() => setModalLogoutOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080d1f] text-center text-[10px] text-slate-400">
          <p className="font-semibold text-slate-400">Portal Siswa v2.0</p>
          <p>{profile.schoolName || 'SMK Negeri 1 Ciomas'}</p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Navbar for Student Dashboard (No Public Links) */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 hidden sm:inline">
                  Portal Siswa
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
                <h1 className="text-sm sm:text-base font-black text-slate-900 capitalize">
                  {activeTab === 'dashboard' && 'Dashboard Siswa'}
                  {activeTab === 'biodata' && 'Biodata & Profil Portofolio'}
                  {activeTab === 'pengaturan' && 'Pengaturan Email & Password'}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-600">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>{currentTimeStr || '14:20 WIB'}</span>
            </div>

            {/* Quick Action: Lihat Website */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 text-xs font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ke Website</span>
            </Link>

            {/* Quick Action: Logout */}
            <button
              onClick={() => setModalLogoutOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1"
              title="Keluar dari akun siswa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Welcome Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 sm:p-8 shadow-xl shadow-purple-600/15">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Akun Siswa Terverifikasi</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                      Selamat Datang, {student.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-purple-100 font-normal leading-relaxed">
                      Kelola profil portofolio Anda, pantau jadwal pelajaran harian, serta perbarui informasi akun Anda di portal resmi ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
                    <button
                      onClick={() => setActiveTab('biodata')}
                      className="px-5 py-2.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Edit Biodata</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pengaturan')}
                      className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs backdrop-blur-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Pengaturan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Stat 1: Status Siswa */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status Akun
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    Siswa Aktif
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {student.kelas || 'XI PPLG 3'}
                  </p>
                </div>

                {/* Stat 2: Jadwal Piket */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Jadwal Piket
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {piketEntry ? `Hari ${piketEntry.hari}` : 'Belum Ditugaskan'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {piketEntry ? `PJ: ${piketEntry.pj}` : 'Konfirmasi ke pengurus'}
                  </p>
                </div>

                {/* Stat 3: NISN */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      NISN / No. Induk
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IdCard className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {student.nisn || student.id}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Terdata Resmi Sekolah
                  </p>
                </div>

                {/* Stat 4: Portofolio Status */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Portofolio Web
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {student.portfolio_link || portfolioLink ? 'Terpasang' : 'Belum Diisi'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {student.github_link || githubLink ? 'GitHub Terhubung' : 'Siap ditambahkan'}
                  </p>
                </div>
              </div>

              {/* Two Column Grid: Today's Schedule & Quick Student Bio Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left (2 cols): Today's Schedule Timeline */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Jadwal Pelajaran Hari Ini ({currentDayName})
                        </h3>
                        <p className="text-xs text-slate-500">
                          {todayClasses.length} sesi terdaftar di sistem kelas
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/jadwal"
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
                    >
                      Lihat Semua
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {todayClasses.map((item) => {
                      const isDhuha = item.mata_pelajaran.toUpperCase().includes('DHUHA');
                      const isBreak =
                        !isDhuha &&
                        (item.mata_pelajaran.toUpperCase().includes('ISTIRAHAT') ||
                        item.mata_pelajaran.toUpperCase().includes('ISHOMA'));
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                            isDhuha
                              ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                              : isBreak
                              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                              : 'bg-slate-50/60 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/80 text-xs font-mono font-bold shadow-2xs flex-shrink-0">
                              {item.jam_mulai} - {item.jam_selesai}
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {item.mata_pelajaran}
                              </h4>
                              {item.guru && item.guru !== '-' && (
                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <UserCheck className="w-3 h-3 text-purple-600" />
                                  <span>{item.guru}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          {isDhuha && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-200/80 text-teal-800">
                              Ibadah Pagi
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right (1 col): Quick Profile Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center justify-between">
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-4 border-purple-100 shadow-md mb-4 bg-purple-50">
                      <Image
                        src={studentPhoto || student.photo}
                        alt={student.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                    <p className="text-xs font-semibold text-purple-600 mt-0.5">
                      NISN: {student.nisn || student.id} • {student.kelas || 'XI PPLG 3'}
                    </p>

                    <p className="mt-3 text-xs text-slate-500 italic line-clamp-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-full text-center">
                      &quot;{bio || 'Semangat belajar teknologi dan software engineering di XI PPLG 3!'}&quot;
                    </p>
                  </div>

                  <div className="w-full pt-4 space-y-2">
                    <button
                      onClick={() => setActiveTab('biodata')}
                      className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Ubah Profil & Karya</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pengaturan')}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Ganti Password & Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIODATA PROFILE */}
          {activeTab === 'biodata' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Biodata & Profil Portofolio
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Lengkapi informasi profil diri, tautan portofolio proyek, dan akun media sosial Anda.
                      </p>
                    </div>
                  </div>

                  {biodataSaved && (
                    <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Biodata berhasil diperbarui!</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveBiodata} className="mt-8 space-y-6">
                  {/* Photo & Basic Info Row */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="relative group">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-purple-50">
                        <Image
                          src={studentPhoto || student.photo}
                          alt={student.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <label className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                        <Camera className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Ganti Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                        {student.kelas || 'XI PPLG 3'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{student.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        NISN: <strong className="text-slate-700">{student.nisn || student.id}</strong> • Terdaftar sebagai Siswa PPLG
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Klik pada foto untuk mengunggah foto profil baru dari perangkat Anda.
                      </p>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Nama Lengkap Siswa:
                      </label>
                      <input
                        type="text"
                        value={student.name}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        *Nama resmi terdaftar di database kelas.
                      </span>
                    </div>

                    {/* Bidang Keahlian */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Minat / Keahlian Utama:
                      </label>
                      <input
                        type="text"
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        placeholder="Contoh: Web Developer, UI/UX Designer, Game Dev..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Bio / Kutipan Diri */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Bio / Kutipan Diri:
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tuliskan kata motivasi, bio, atau ketertarikan Anda dalam rekayasa perangkat lunak..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 leading-relaxed"
                    />
                  </div>

                  {/* Online Presence & Links */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Portofolio Website */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Link Portofolio / Website:
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={portfolioLink}
                          onChange={(e) => setPortfolioLink(e.target.value)}
                          placeholder="https://portofolio-anda.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Link Profil GitHub:
                      </label>
                      <input
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs text-slate-800"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Username Instagram:
                      </label>
                      <input
                        type="text"
                        value={instagramLink}
                        onChange={(e) => setInstagramLink(e.target.value)}
                        placeholder="@username"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-none text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={savingBiodata}
                      className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingBiodata ? 'Menyimpan...' : 'Simpan Perubahan Biodata'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: PENGATURAN (GANTI EMAIL & PASSWORD) */}
          {activeTab === 'pengaturan' && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Header Title */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Pengaturan Akun & Keamanan
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Perbarui alamat email dan kata sandi akun login siswa Anda.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  {/* CARD A: GANTI EMAIL */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200/70">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Perbarui Alamat Email
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Digunakan untuk login dan komunikasi portal
                          </p>
                        </div>
                      </div>

                      {emailSuccessMsg && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{emailSuccessMsg}</span>
                        </div>
                      )}

                      {emailErrorMsg && (
                        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>{emailErrorMsg}</span>
                        </div>
                      )}

                      <form onSubmit={handleUpdateEmail} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">
                            Email Saat Ini:
                          </label>
                          <input
                            type="email"
                            value={currentEmail}
                            disabled
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-200/70 border border-slate-200 text-xs font-semibold text-slate-600 cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Alamat Email Baru:
                          </label>
                          <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="nama.anda@email.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 focus:outline-none text-xs text-slate-800"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={savingEmail}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{savingEmail ? 'Memperbarui...' : 'Simpan Email Baru'}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/70 text-[11px] text-slate-400">
                      💡 Pastikan email aktif untuk kemudahan reset akses bila lupa kata sandi.
                    </div>
                  </div>

                  {/* CARD B: GANTI PASSWORD */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200/70">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Ganti Kata Sandi (Password)
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Amankan akun siswa dengan password yang kuat
                          </p>
                        </div>
                      </div>

                      {passSuccessMsg && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{passSuccessMsg}</span>
                        </div>
                      )}

                      {passErrorMsg && (
                        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>{passErrorMsg}</span>
                        </div>
                      )}

                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        {/* Password Baru */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Kata Sandi Baru:
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPass ? 'text' : 'password'}
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimal 6 karakter"
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 focus:outline-none text-xs text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Konfirmasi Password Baru */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Ulangi Kata Sandi Baru:
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPass ? 'text' : 'password'}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Ketik ulang kata sandi baru"
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 focus:outline-none text-xs text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={savingPass}
                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{savingPass ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/70 text-[11px] text-slate-400">
                      🔒 Password baru langsung aktif untuk login berikutnya dengan Email atau NISN Anda.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL KONFIRMASI LOGOUT */}
      {modalLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                Keluar dari Portal Siswa?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sesi login siswa Anda akan diakhiri. Anda dapat login kembali sewaktu-waktu menggunakan NISN atau email Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalLogoutOpen(false)}
                className="py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
