'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Users, 
  Rocket, 
  MessageSquare, 
  Lock, 
  Send, 
  User, 
  ArrowRight,
  CornerDownRight,
  X
} from 'lucide-react';
import { initialProjects, initialComments } from '@/data/seedData';
import { Project, ProjectComment } from '@/types/database';
import { getProjectComments, addProjectComment } from '@/lib/supabase/dataService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.id, 10);

  const [project, setProject] = useState<Project | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('class_projects_list');
      if (saved) {
        try {
          const list: Project[] = JSON.parse(saved);
          const found = list.find((p) => p.id === projectId);
          if (found) return found;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialProjects.find((p) => p.id === projectId) || null;
  });

  useEffect(() => {
    const loadProject = () => {
      const saved = localStorage.getItem('class_projects_list');
      if (saved) {
        try {
          const list: Project[] = JSON.parse(saved);
          const found = list.find((p) => p.id === projectId);
          if (found) {
            setProject(found);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      const initial = initialProjects.find((p) => p.id === projectId) || null;
      setProject(initial);
    };

    loadProject();
    window.addEventListener('storage', loadProject);
    window.addEventListener('class_projects_updated', loadProject);
    return () => {
      window.removeEventListener('storage', loadProject);
      window.removeEventListener('class_projects_updated', loadProject);
    };
  }, [projectId]);

  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'visitor' | 'student'>('visitor');
  const [visitorName, setVisitorName] = useState('');
  const [visitorClass, setVisitorClass] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyToName, setReplyToName] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        const fetched = await getProjectComments(projectId);
        if (fetched && fetched.length > 0) {
          setComments(fetched);
          return;
        }
      } catch {
        // Fallback
      }
      setComments(initialComments.filter((c) => c.project_id === projectId));
    }
    loadComments();

    // Check localStorage for logged in user session
    const savedUser = localStorage.getItem('class_web_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, [projectId]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'visitor') {
      if (!visitorName.trim()) return;
      const identifier = visitorClass.trim() 
        ? `${visitorName.trim()} (${visitorClass.trim()})`
        : visitorName.trim();
      setCurrentUser(identifier);
      localStorage.setItem('class_web_user', identifier);
      setShowLoginModal(false);
    } else {
      if (!visitorName.trim()) return;
      const identifier = `${visitorName.trim()} (Siswa PPLG)`;
      setCurrentUser(identifier);
      localStorage.setItem('class_web_user', identifier);
      setShowLoginModal(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const newComment = await addProjectComment(
        projectId, 
        currentUser, 
        commentText.trim(), 
        replyToId || undefined
      );
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      setReplyToId(null);
      setReplyToName(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Proyek Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Proyek dengan ID #{projectId} mungkin telah diperbarui atau belum tersedia.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25">
          <span>Kembali ke Daftar Proyek</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 1. Project Cover Image (Matching Screenshot 2) */}
      <div className="relative w-full aspect-[16/9] max-h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-100 mb-8">
        <img
          src={project.image || '/assets/uploads/projects/default.png'}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Main Project Card (Matching Screenshot 2 & 3) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-12">
        {/* Header Info */}
        <div className="text-center pb-8 mb-8 border-b border-slate-100">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            {project.title}
          </h1>

          {/* Makers Badge Pill */}
          {project.makers && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs sm:text-sm font-semibold transition-transform hover:-translate-y-0.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{project.makers}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-10 text-left">
          {project.description}
        </p>

        {/* Action Card: "Tertarik melihat hasil akhirnya?" (Matching Screenshot 3) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 sm:p-10 max-w-xl mx-auto text-center hover:bg-white transition-colors duration-300">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 transition-transform hover:scale-110">
            <Rocket className="w-9 h-9 -rotate-45" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">
            Tertarik melihat hasil akhirnya?
          </h3>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Kunjungi Website</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <p className="text-sm text-slate-400">Link belum tersedia.</p>
          )}
        </div>
      </div>

      {/* 3. Diskusi & Komentar Section (Matching Screenshot 4) */}
      <div className="space-y-6">
        {/* Section Heading */}
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-slate-900 pb-3 border-b-2 border-slate-200">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2>Diskusi & Komentar</h2>
        </div>

        {/* Empty State matching Screenshot 4 */}
        {comments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          </div>
        ) : (
          /* Render Comments */
          <div className="space-y-4">
            {comments.map((comment) => (
              <div 
                key={comment.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {comment.user_name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(comment.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setReplyToId(comment.id);
                      setReplyToName(comment.user_name);
                      if (!currentUser) setShowLoginModal(true);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    Balas
                  </button>
                </div>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed pl-12">
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Login Prompt Box (Matching Screenshot 4) */}
        {!currentUser ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
              <Lock className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-6">
              Silakan login terlebih dahulu untuk ikut berdiskusi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setLoginType('visitor');
                  setShowLoginModal(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                Login Pengunjung
              </button>
              <button
                onClick={() => {
                  setLoginType('student');
                  setShowLoginModal(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all"
              >
                Login Siswa
              </button>
            </div>
          </div>
        ) : (
          /* Active User Comment Box */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sebagai: <span className="text-blue-600">{currentUser}</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('class_web_user');
                  setCurrentUser(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
              >
                Keluar
              </button>
            </div>

            {replyToId && (
              <div className="mb-3 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center justify-between">
                <span>Membalas komentar <strong className="font-bold">{replyToName || `#${replyToId}`}</strong></span>
                <button 
                  onClick={() => { setReplyToId(null); setReplyToName(null); }} 
                  className="text-blue-500 hover:text-blue-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handlePostComment} className="space-y-4">
              <textarea
                required
                rows={4}
                placeholder="Bagikan pendapat atau saran Anda tentang project ini..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-colors resize-y min-h-[100px]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {loginType === 'student' ? 'Login Siswa PPLG' : 'Login Pengunjung'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {loginType === 'student'
                ? 'Masukkan nama atau NIS Anda untuk berkomentar sebagai siswa kelas.'
                : 'Masukkan nama Anda untuk dapat mengirimkan komentar pada proyek ini.'}
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Anda:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none text-sm text-slate-800"
                />
              </div>

              {loginType === 'visitor' ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kelas / Instansi (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XI PPLG 1 / Tamu Umum"
                    value={visitorClass}
                    onChange={(e) => setVisitorClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none text-sm text-slate-800"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NIS / No Absen:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 026 / No. 26"
                    value={studentNis}
                    onChange={(e) => setStudentNis(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none text-sm text-slate-800"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                >
                  Masuk & Lanjutkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
