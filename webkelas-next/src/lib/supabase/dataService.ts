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

export function normalizeAssetUrl(
  url: string | null | undefined,
  folder: 'gallery' | 'students' | 'structure' | 'videos' | 'thumbnails' | 'projects' | 'logo' | 'audio'
): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  return `/assets/uploads/${folder}/${trimmed}`;
}

export async function getStructure(): Promise<StructureMember[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('structure')
        .select('*')
        .order('order_num', { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as StructureMember[]).map((m) => ({
          ...m,
          photo: normalizeAssetUrl(m.photo, 'structure')
        }));
      }
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
      if (!error && data && data.length > 0) {
        return (data as Student[]).map((s) => ({
          ...s,
          photo: normalizeAssetUrl(s.photo, 'students')
        }));
      }
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
      if (!error && data && data.length > 0) {
        let list = data as JadwalPelajaran[];
        
        // Ensure morning routine exists for each weekday
        const routines = initialJadwalPelajaran.filter((item) => item.id >= 100 && item.urutan === 1);
        for (const routine of routines) {
          const hasDayRoutine = list.some(
            (d) =>
              d.hari === routine.hari &&
              (d.mata_pelajaran.toUpperCase().includes('UPACARA') ||
                d.mata_pelajaran.toUpperCase().includes('DHUHA') ||
                d.mata_pelajaran.toUpperCase().includes('KOKURIKULER'))
          );
          if (!hasDayRoutine) {
            list.push(routine);
          }
        }

        // Also ensure Pulang routine exists for each weekday
        const pulangRoutines = initialJadwalPelajaran.filter((item) => item.mata_pelajaran.toUpperCase().includes('PULANG'));
        for (const pRoutine of pulangRoutines) {
          const hasPulang = list.some(
            (d) => d.hari === pRoutine.hari && d.mata_pelajaran.toUpperCase().includes('PULANG')
          );
          if (!hasPulang) {
            list.push(pRoutine);
          }
        }

        // Normalize morning routines to 06.30 - 07.30
        list = list.map((item) => {
          const m = item.mata_pelajaran.toUpperCase();
          if (m.includes('UPACARA') || m.includes('DHUHA') || m.includes('KOKURIKULER')) {
            return {
              ...item,
              jam_mulai: '06.30',
              jam_selesai: '07.30',
              urutan: 1
            };
          }
          return item;
        });

        return list;
      }
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
      if (!error && data && data.length > 0) {
        return (data as Project[]).map((p) => ({
          ...p,
          image: normalizeAssetUrl(p.image, 'projects')
        }));
      }
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
      if (!error && data && data.length > 0) {
        return (data as GalleryItem[]).map((g) => ({
          ...g,
          image: normalizeAssetUrl(g.image, 'gallery')
        }));
      }
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
      if (!error && data && data.length > 0) {
        return (data as VideoKelas[]).map((v) => ({
          ...v,
          url_video: normalizeAssetUrl(v.url_video, 'videos'),
          thumbnail: normalizeAssetUrl(v.thumbnail, 'thumbnails')
        }));
      }
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('contact').select('*').limit(1).single();
      if (!error && data) {
        return {
          ...data,
          logo: normalizeAssetUrl(data.logo, 'logo')
        } as ContactInfo;
      }
    } catch {
      // Fallback
    }
  }
  return initialContact;
}


// ==============================================================================
// CROSS-DEVICE MUTATION HELPERS (SYNC DIREKT KE SUPABASE)
// ==============================================================================

export async function upsertStudent(student: Partial<Student> & { id: string }) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('students').upsert([student]).select();
      if (!error && data) return data[0] as Student;
    } catch (e) {
      console.error('Error upserting student to Supabase:', e);
    }
  }
  return null;
}

export async function deleteStudentFromDb(id: string) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting student from Supabase:', e);
    }
  }
}

export async function upsertStructureMember(member: Partial<StructureMember> & { id: number }) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('structure').upsert([member]).select();
      if (!error && data) return data[0] as StructureMember;
    } catch (e) {
      console.error('Error upserting structure to Supabase:', e);
    }
  }
  return null;
}

export async function upsertJadwalPiket(piket: Partial<JadwalPiket>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('jadwal_piket').upsert([piket]).select();
      if (!error && data) return data[0] as JadwalPiket;
    } catch (e) {
      console.error('Error upserting piket to Supabase:', e);
    }
  }
  return null;
}

export async function deleteJadwalPiket(id: number) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('jadwal_piket').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting piket from Supabase:', e);
    }
  }
}

export async function upsertJadwalPelajaran(jadwal: Partial<JadwalPelajaran>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('jadwal_pelajaran').upsert([jadwal]).select();
      if (!error && data) return data[0] as JadwalPelajaran;
    } catch (e) {
      console.error('Error upserting jadwal to Supabase:', e);
    }
  }
  return null;
}

export async function deleteJadwalPelajaran(id: number) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('jadwal_pelajaran').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting jadwal from Supabase:', e);
    }
  }
}

export async function upsertVideo(video: Partial<VideoKelas>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('video_kelas').upsert([video]).select();
      if (!error && data) return data[0] as VideoKelas;
    } catch (e) {
      console.error('Error upserting video to Supabase:', e);
    }
  }
  return null;
}

export async function deleteVideo(id: number) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('video_kelas').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting video from Supabase:', e);
    }
  }
}

export async function upsertGalleryItem(item: Partial<GalleryItem>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('gallery').upsert([item]).select();
      if (!error && data) return data[0] as GalleryItem;
    } catch (e) {
      console.error('Error upserting gallery to Supabase:', e);
    }
  }
  return null;
}

export async function deleteGalleryItem(id: number) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting gallery from Supabase:', e);
    }
  }
}

export async function upsertProject(project: Partial<Project>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('projects').upsert([project]).select();
      if (!error && data) return data[0] as Project;
    } catch (e) {
      console.error('Error upserting project to Supabase:', e);
    }
  }
  return null;
}

export async function deleteProject(id: number) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting project from Supabase:', e);
    }
  }
}

export async function upsertContact(contact: Partial<ContactInfo> & { id?: number }) {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = { id: 1, ...contact };
      const { data, error } = await supabase.from('contact').upsert([payload]).select();
      if (!error && data) return data[0];
    } catch (e) {
      console.error('Error upserting contact to Supabase:', e);
    }
  }
  return null;
}
// ==============================================================================
// STORAGE HELPERS (SUPABASE STORAGE)
// ==============================================================================

export async function uploadFileToStorage(file: File, folder: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const ext = file.name.split('.').pop();
    const fileName = `_.`;
    const filePath = `/`;

    const { error } = await supabase.storage.from('webkelas_media').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return null;
    }

    const { data } = supabase.storage.from('webkelas_media').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Unexpected error uploading file:', err);
    return null;
  }
}
