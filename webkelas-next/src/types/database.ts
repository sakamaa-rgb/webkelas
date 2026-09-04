export interface StructureMember {
  id: number;
  role: string;
  name: string;
  photo: string;
  expertise?: string | null;
  description?: string | null;
  message?: string | null;
  year?: string | null;
  subject?: string | null;
  motto?: string | null;
  order_num: number;
}

export interface Student {
  id: string;
  name: string;
  photo: string;
  nisn?: string | null;
  kelas?: string | null;
  email?: string | null;
  portfolio_link?: string | null;
  github_link?: string | null;
  instagram_link?: string | null;
  expertise?: string | null;
  bio?: string | null;
}

export interface JadwalPelajaran {
  id: number;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | string;
  jam_mulai: string;
  jam_selesai: string;
  mata_pelajaran: string;
  guru: string;
  urutan: number;
}

export interface JadwalPiket {
  id: number;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | string;
  nama_siswa: string;
  urutan: number;
  pj: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  makers?: string | null;
  tech_stack?: string[];
  featured?: boolean;
}

export interface ProjectComment {
  id: number;
  project_id: number;
  user_name: string;
  comment: string;
  parent_id?: number | null;
  is_visible: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  caption: string;
  category: string;
}

export interface VideoKelas {
  id: number;
  judul: string;
  deskripsi?: string | null;
  url_video: string;
  thumbnail: string;
  tanggal?: string | null;
}

export interface Song {
  id: number;
  judul: string;
  artis: string;
  file_name: string;
  cover?: string | null;
  urutan: number;
  aktif: boolean;
}

export interface GuestbookMessage {
  id: number;
  name: string;
  kelas: string;
  message: string;
  created_at: string;
}

export interface ContactInfo {
  id?: number;
  instagram?: string;
  whatsapp?: string;
  email?: string;
  logo?: string;
  tiktok?: string;
  address?: string;
  class_name?: string;
  school_name?: string;
  tagline?: string;
  year?: string;
  description?: string;
}

