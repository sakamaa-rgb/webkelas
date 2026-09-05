'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  Users, 
  Lock, 
  GraduationCap, 
  LogIn, 
  ChevronDown, 
  LogOut,
  UserCheck,
  Gauge,
  LayoutDashboard
} from 'lucide-react';
import { useClassProfile } from '@/context/ClassProfileContext';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Struktur', href: '/struktur' },
  { name: 'Siswa', href: '/siswa' },
  { name: 'Jadwal & Piket', href: '/jadwal' },
  { name: 'Projects', href: '/projects' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { profile } = useClassProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check login status from localStorage
    const savedUser = localStorage.getItem('class_web_user');
    const savedRole = localStorage.getItem('class_user_role');
    const isAdmin = localStorage.getItem('class_web_admin');

    if (isAdmin === 'true') {
      setCurrentUser('Admin PPLG 3');
      setCurrentRole('admin');
    } else if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentRole(savedRole || 'visitor');
    } else {
      setCurrentUser(null);
      setCurrentRole(null);
    }
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('class_web_user');
    localStorage.removeItem('class_user_role');
    localStorage.removeItem('class_web_admin');
    localStorage.removeItem('class_student_id');
    setCurrentUser(null);
    setCurrentRole(null);
    setShowLoginDropdown(false);
    router.push('/');
  };

  // Hide Navbar completely on login, admin, and student dashboard pages
  const isAuthPage =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/siswa/dashboard') ||
    pathname === '/admin/login' ||
    pathname === '/pengunjung/login' ||
    pathname === '/siswa/login' ||
    pathname === '/siswa/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs py-0' 
          : 'bg-white/85 backdrop-blur-md border-b border-slate-200/70 py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-blue-200 shadow-xs flex-shrink-0 bg-blue-600">
              <Image 
                src={profile.logo || "/assets/uploads/logo/logo_windows_xp.jpg"} 
                alt={`${profile.className || 'XI PPLG 3'} Logo`} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="font-extrabold text-blue-600 text-lg sm:text-xl tracking-tight flex items-center gap-1.5">
                {profile.className || 'XI PPLG 3'}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  Tech
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {profile.schoolName || 'SMK Negeri 1 Ciomas'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-bold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Authentication Panel */}
          <div className="hidden lg:flex items-center gap-3 relative" ref={dropdownRef}>
            {!currentUser ? (
              // NOT LOGGED IN: Show Login Dropdown
              <div className="relative">
                <button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20 active:scale-95 hover:-translate-y-0.5 duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showLoginDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showLoginDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/siswa/login"
                      onClick={() => setShowLoginDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-700 hover:text-purple-600 group active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="text-left font-bold text-sm">Siswa</div>
                    </Link>

                    <Link
                      href="/pengunjung/login"
                      onClick={() => setShowLoginDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-700 hover:text-emerald-600 group active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-left font-bold text-sm">Pengunjung</div>
                    </Link>

                    <div className="my-1.5 border-t border-slate-100" />

                    <Link
                      href="/admin/login"
                      onClick={() => setShowLoginDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-700 hover:text-blue-600 group active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-left font-bold text-sm">Admin</div>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // LOGGED IN: Show Panels and Logout
              <div className="flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
                {currentRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                  >
                    <Gauge className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                {currentRole === 'student' && (
                  <Link
                    href="/siswa/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                  >
                    <Gauge className="w-4 h-4" />
                    <span>Siswa Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500 text-rose-500 hover:bg-rose-50 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!currentUser ? (
              <>
                <div className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">
                  Login Portal:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/siswa/login"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold text-center border border-purple-100 transition-all duration-200 active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4 mb-1" />
                    <span>Siswa</span>
                  </Link>
                  <Link
                    href="/pengunjung/login"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold text-center border border-emerald-100 transition-all duration-200 active:scale-95"
                  >
                    <Users className="w-4 h-4 mb-1" />
                    <span>Pengunjung</span>
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold text-center border border-blue-100 transition-all duration-200 active:scale-95"
                  >
                    <Lock className="w-4 h-4 mb-1" />
                    <span>Admin</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">
                  Navigasi Akun:
                </div>
                <div className="flex flex-col gap-2">
                  {currentRole === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm transition-all duration-200 active:scale-95"
                    >
                      <Gauge className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  {currentRole === 'student' && (
                    <Link
                      href="/siswa/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm transition-all duration-200 active:scale-95"
                    >
                      <Gauge className="w-4 h-4" />
                      <span>Siswa Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-rose-500 text-rose-500 bg-white hover:bg-rose-50 font-bold text-sm transition-all duration-200 active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
