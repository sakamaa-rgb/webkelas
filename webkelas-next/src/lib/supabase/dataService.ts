import { supabase, isSupabaseConfigured } from './client';
import {
  initialStructure,
  initialStudents,
  initialJadwalPelajaran,
  initialJadwalPiket,
  initialProjects,
  initialComments,
  initialGallery,
  initialVideos,
  initialPlaylist,
  initialGuestbook,
  initialContact
} from '@/data/seedData';
import {
  StructureMember,
  Student,
  JadwalPelajaran,
  JadwalPiket,
  Project,
  ProjectComment,
  GalleryItem,
  VideoKelas,
  Song,
  GuestbookMessage,
  ContactInfo
} from '@/types/database';

export async function getStructure(): Promise<StructureMember[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('structure')
        .select('*')
        .order('order_num', { ascending: true });
      if (!error && data && data.length > 0) return data as StructureMember[];
    } catch {
      // Fallback
    }
  }
  return initialStructure;
}

export async function getStructureMemberById(id: number): Promise<StructureMember | null> {
  const members = await getStructure();
  return members.find(m => m.id === id) || null;
}

export async function getStudents(): Promise<Student[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) return data as Student[];
    } catch {
      // Fallback
    }
  }
  return initialStudents;
}

export async function getJadwalPelajaran(): Promise<JadwalPelajaran[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jadwal_pelajaran')
        .select('*')
        .order('urutan', { ascending: true });
      if (!error && data && data.length > 0) return data as JadwalPelajaran[];
    } catch {
      // Fallback
    }
  }
  return initialJadwalPelajaran;
}

export async function getJadwalPiket(): Promise<JadwalPiket[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('jadwal_piket')
        .select('*')
        .order('urutan', { ascending: true });
      if (!error && data && data.length > 0) return data as JadwalPiket[];
    } catch {
      // Fallback
    }
  }
  return initialJadwalPiket;
}

export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) return data as Project[];
    } catch {
      // Fallback
    }
  }
  return initialProjects;
}

export async function getProjectComments(projectId: number): Promise<ProjectComment[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('project_comments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      if (!error && data) return data as ProjectComment[];
    } catch {
      // Fallback
    }
  }
  return initialComments.filter(c => c.project_id === projectId);
}

export async function addProjectComment(projectId: number, userName: string, comment: string, parentId?: number) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('project_comments')
      .insert([
        {
          project_id: projectId,
          user_name: userName,
          comment: comment,
          parent_id: parentId || null,
          is_visible: true
        }
      ])
      .select();
    if (!error && data) return data[0];
  }
  
  // Local fallback simulation
  const newComment: ProjectComment = {
    id: Date.now(),
    project_id: projectId,
    user_name: userName,
    comment: comment,
    parent_id: parentId,
    is_visible: true,
    created_at: new Date().toISOString()
  };
  return newComment;
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data && data.length > 0) return data as GalleryItem[];
    } catch {
      // Fallback
    }
  }
  return initialGallery;
}

export async function getVideos(): Promise<VideoKelas[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('video_kelas')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data && data.length > 0) return data as VideoKelas[];
    } catch {
      // Fallback
    }
  }
  return initialVideos;
}

export async function getPlaylist(): Promise<Song[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('music_playlist')
        .select('*')
        .eq('aktif', true)
        .order('urutan', { ascending: true });
      if (!error && data && data.length > 0) return data as Song[];
    } catch {
      // Fallback
    }
  }
  return initialPlaylist;
}

export async function getGuestbook(): Promise<GuestbookMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as GuestbookMessage[];
    } catch {
      // Fallback
    }
  }
  return initialGuestbook;
}

export async function addGuestbookMessage(name: string, kelas: string, message: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('guestbook')
      .insert([{ name, kelas, message }])
      .select();
    if (!error && data) return data[0];
  }
  
  return {
    id: Date.now(),
    name,
    kelas,
    message,
    created_at: new Date().toISOString()
  };
}

export async function getContactInfo(): Promise<ContactInfo> {
  return initialContact;
}
