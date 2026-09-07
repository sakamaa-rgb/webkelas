import savedDefaults from './aktivitasDefaultData.json';

export interface EkstrakurikulerItem {
  id: string;
  nama: string;           // Nama Eskul
  siswa?: string;          // Nama Siswa / i
  kategori: string;       // Kategori
  orientation: 'landscape' | 'portrait' | 'square'; // Ukuran / Orientasi Foto
  foto: string;           // Upload file foto
  badgeColor?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'indigo';
  deskripsi?: string;
  tagline?: string;
  jadwal?: string;
  lokasi?: string;
}

export interface OrganisasiMember {
  id: string;
  nama: string;
  organisasi: 'MPK' | 'OSIS';
  jabatan: string;
  foto: string;
  orientation?: 'portrait' | 'landscape' | 'square';
  fitMode?: 'cover' | 'contain';
  objectPosition?: 'top' | 'center' | 'bottom';
  badgeLabel: string;
  roleDescription: string;
  highlightTag: string;
  accentColor: string;
}

export interface JourneyMilestone {
  step: string;
  stageName: string;
  title: string;
  tanggal: string;
  badge: 'PERSIAPAN' | 'PEMBELAJARAN' | 'CHALLENGE' | 'UJI LEVEL' | 'ACHIEVEMENT' | string;
  badgeType: 'blue' | 'purple' | 'amber' | 'rose' | 'emerald';
  iconType: 'flag' | 'code' | 'laptop' | 'star' | 'trophy';
  deskripsi: string;
  foto: string;
  orientation: 'landscape' | 'portrait';
  highlights: string[];
}

export interface AktivitasPhotoConfig {
  aspectRatio: 'auto' | '16/10' | '16/9' | '9/16' | '4/3' | '1/1' | '3/2';
  cardHeight: 'compact' | 'normal' | 'spacious';
  objectFit: 'contain' | 'cover';
  fullCoverMode: 'auto-ratio' | 'fixed-ratio';
  showPortraitBadge: boolean;
}

export const defaultPhotoConfig: AktivitasPhotoConfig = {
  aspectRatio: 'auto',
  cardHeight: 'normal',
  objectFit: 'cover',
  fullCoverMode: 'auto-ratio',
  showPortraitBadge: true
};

export const defaultEkskulCategories = [
  'Semua',
  'Rohis',
  'Pramuka',
  'Paskibra',
  'Futsal',
  'Voli',
  'Basket',
  'Silat'
];

export const officialEkskulNames = [
  'Rohis',
  'Pramuka',
  'Paskibra',
  'Futsal',
  'Voli',
  'Basket',
  'Silat'
];

export const matchesEkskulCategory = (item: EkstrakurikulerItem, category: string): boolean => {
  if (!category || category === 'Semua') return true;
  const target = category.toLowerCase().trim();
  const name = (item.nama || '').toLowerCase();
  const cat = (item.kategori || '').toLowerCase();

  if (target === 'rohis') return name.includes('rohis') || name.includes('kerohanian') || cat.includes('rohis') || cat.includes('islam') || cat.includes('keagamaan');
  if (target === 'pramuka') return name.includes('pramuka') || cat.includes('pramuka');
  if (target === 'paskibra') return name.includes('paskibra') || cat.includes('paskibra');
  if (target === 'futsal') return name.includes('futsal') || cat.includes('futsal');
  if (target === 'voli') return name.includes('voli') || name.includes('volley') || cat.includes('voli');
  if (target === 'basket') return name.includes('basket') || cat.includes('basket');
  if (target === 'silat') return name.includes('silat') || cat.includes('silat') || name.includes('pencak');

  return name.includes(target) || cat.includes(target);
};

export const getAvailableEkskulCategories = (list: EkstrakurikulerItem[]): string[] => {
  const base = ['Semua', 'Rohis', 'Pramuka', 'Paskibra', 'Futsal', 'Voli', 'Basket', 'Silat'];
  const customSet = new Set<string>();
  list.forEach((item) => {
    const matchesBase = base.slice(1).some((b) => matchesEkskulCategory(item, b));
    if (!matchesBase) {
      if (item.kategori && item.kategori !== 'Olahraga' && item.kategori !== 'Umum') {
        customSet.add(item.kategori);
      } else if (item.nama) {
        customSet.add(item.nama);
      }
    }
  });
  return [...base, ...Array.from(customSet)];
};


const defaultEkskulList: EkstrakurikulerItem[] = [
  {
    id: 'ekskul-futsal',
    nama: 'Futsal Club',
    siswa: 'Muhammad Alif Fatir Sya\'bani',
    kategori: 'Olahraga',
    badgeColor: 'blue',
    deskripsi: 'Membangun kebugaran fisik, kecepatan teknik mengolah bola, soliditas, dan taktik permainan futsal yang kompetitif.',
    foto: '/assets/uploads/aktivitas/ekskul_futsal.jpg',
    orientation: 'landscape',
    tagline: 'Speed, Precision, Solidarity'
  },
  {
    id: 'ekskul-basket',
    nama: 'Basketball Club',
    siswa: 'Abyan Alfarizi',
    kategori: 'Olahraga',
    badgeColor: 'amber',
    deskripsi: 'Mengembangkan ketangkasan fisik, sportivitas, dan strategi kerjasama tim bola basket dalam berbagai turnamen antarsekolah.',
    foto: '/assets/uploads/aktivitas/ekskul_basket.jpg',
    orientation: 'landscape',
    tagline: 'Teamwork & Agility'
  },
  {
    id: 'ekskul-voli',
    nama: 'Bola Voli',
    siswa: 'Muhammad Refan Abiena Wafa',
    kategori: 'Olahraga',
    badgeColor: 'indigo',
    deskripsi: 'Mengasah teknik passing, smash, block, serta kerjasama dan ketahanan fisik dalam tim olahraga bola voli.',
    foto: '/assets/uploads/aktivitas/ekskul_basket.jpg',
    orientation: 'landscape',
    tagline: 'Power, Teamwork & Spirit'
  },
  {
    id: 'ekskul-pramuka',
    nama: 'Gerakan Pramuka',
    siswa: 'Bramantyo Zaki Arkananta',
    kategori: 'Organisasi & Kepemimpinan',
    badgeColor: 'amber',
    deskripsi: 'Wadah pembentukan karakter unggul, kedisiplinan, kemandirian, dan kepemimpinan berjiwa patriotik bagi generasi muda.',
    foto: '/assets/uploads/aktivitas/ekskul_pramuka.jpg',
    orientation: 'portrait',
    tagline: 'Satyaku Kudarmakan, Darmaku Kubaktikan'
  },
  {
    id: 'ekskul-paskibra',
    nama: 'Paskibra',
    siswa: 'Dema Raditya Albar',
    kategori: 'Kedisiplinan & Baris-Berbaris',
    badgeColor: 'rose',
    deskripsi: 'Melatih kedisiplinan tingkat tinggi, ketahanan fisik, kekompakan baris-berbaris, dan rasa cinta tanah air.',
    foto: '/assets/uploads/aktivitas/ekskul_pramuka.jpg',
    orientation: 'portrait',
    tagline: 'Disiplin, Tegap, Berprestasi'
  },
  {
    id: 'ekskul-rohis',
    nama: 'Rohis (Kerohanian Islam)',
    siswa: 'Muhammad Rajib Zahir',
    kategori: 'Keagamaan',
    badgeColor: 'emerald',
    deskripsi: 'Wadah pembinaan spiritual, kajian keislaman, tadarus Al-Qur\'an, dan penanaman akhlak mulia di lingkungan sekolah.',
    foto: '/assets/uploads/aktivitas/ekskul_pramuka.jpg',
    orientation: 'portrait',
    tagline: 'Iman, Ilmu, & Akhlak Mulia'
  }
];

const defaultOrgList: OrganisasiMember[] = [
  {
    id: 'org-mpk-khaira',
    nama: 'Khaira Putri Madani',
    organisasi: 'MPK',
    jabatan: 'Sekretaris MPK',
    foto: '/assets/uploads/structure/struct_4_1787281474.jpg',
    orientation: 'portrait',
    fitMode: 'cover',
    objectPosition: 'top',
    badgeLabel: 'Majelis Perwakilan Kelas',
    roleDescription: 'Bertanggung jawab penuh atas pengelolaan administrasi, dokumentasi persidangan, notulensi rapat pleno, serta penyaluran aspirasi siswa secara terstruktur kepada pihak sekolah.',
    highlightTag: 'Administrasi & Aspirasi',
    accentColor: 'emerald'
  },
  {
    id: 'org-osis-lulu',
    nama: 'Lulu Maulida',
    organisasi: 'OSIS',
    jabatan: 'Bendahara OSIS',
    foto: '/assets/uploads/structure/struct_6_1787281138.jpeg',
    orientation: 'portrait',
    fitMode: 'cover',
    objectPosition: 'top',
    badgeLabel: 'Organisasi Siswa Intra Sekolah',
    roleDescription: 'Mengelola keuangan dan perbendaharaan operasional OSIS sekolah, menyusun anggaran program kerja secara akuntabel, transparan, dan terpercaya.',
    highlightTag: 'Manajemen Keuangan',
    accentColor: 'blue'
  },
  {
    id: 'org-osis-rajib',
    nama: 'Muhammad Rajib Zahir',
    organisasi: 'OSIS',
    jabatan: 'Ketua Seksi Bidang 6 / KSIT OSIS',
    foto: '/assets/uploads/structure/struct_8_1787301394.jpeg',
    orientation: 'portrait',
    fitMode: 'cover',
    objectPosition: 'top',
    badgeLabel: 'Organisasi Siswa Intra Sekolah',
    roleDescription: 'Memimpin Seksi Bidang 6 (Kelompok Siswa IT) dalam digitalisasi kegiatan sekolah, pengelolaan media publikasi, dan implementasi inovasi berbasis teknologi software.',
    highlightTag: 'Teknologi & Inovasi',
    accentColor: 'indigo'
  }
];

const defaultJourneyList: JourneyMilestone[] = [
  {
    step: '01',
    stageName: 'Persiapan',
    title: 'Orientasi & Fondasi Teknologi PPLG',
    tanggal: 'Agustus 2025',
    badge: 'PERSIAPAN',
    badgeType: 'blue',
    iconType: 'flag',
    deskripsi: 'Pembekalan awal mengenai standar industri rekayasa perangkat lunak, adopsi Version Control System (Git & GitHub), konfigurasi environment pengembangan, serta pemahaman kurikulum kompetensi PPLG modern.',
    foto: '/assets/uploads/aktivitas/journey_persiapan.jpg',
    orientation: 'landscape',
    highlights: ['Setup Git & VS Code Environment', 'Roadmap Software Engineering', 'Pengenalan Ekosistem Web Modern']
  },
  {
    step: '02',
    stageName: 'Pembelajaran',
    title: 'Coding Intensive & Mentorship Lab',
    tanggal: 'Oktober - Desember 2025',
    badge: 'PEMBELAJARAN',
    badgeType: 'purple',
    iconType: 'code',
    deskripsi: 'Sesi mendalam penguasaan logika pemrograman, arsitektur frontend responsif, integrasi database relasional, serta mentoring kode secara intensif bersama instruktur kejuruan.',
    foto: '/assets/uploads/aktivitas/journey_pembelajaran.jpg',
    orientation: 'portrait',
    highlights: ['Frontend & UI/UX State-of-the-Art', 'RESTful API & Database Integration', 'Code Review & Clean Code Standard']
  },
  {
    step: '03',
    stageName: 'Event / Challenge',
    title: 'Dicoding Hackathon & Dev Challenge',
    tanggal: 'Februari 2026',
    badge: 'CHALLENGE',
    badgeType: 'amber',
    iconType: 'laptop',
    deskripsi: 'Tantangan kolaboratif maraton coding dalam kurun waktu terbatas untuk menyelesaikan masalah nyata, menguji ketangguhan logika dan kemampuan kerja tim siswa XI PPLG 3.',
    foto: '/assets/uploads/aktivitas/journey_challenge.jpg',
    orientation: 'landscape',
    highlights: ['Team Coding Marathon', 'Pembuatan Solusi Nyata', 'Validasi Modul Dicoding Indonesia']
  },
  {
    step: '04',
    stageName: 'Uji Level PPLG',
    title: 'Uji Level Kompetensi Keahlian PPLG',
    tanggal: 'April 2026',
    badge: 'UJI LEVEL',
    badgeType: 'rose',
    iconType: 'star',
    deskripsi: 'Tahapan penting pengujian kompetensi teknis melalui demonstrasi langsung sistem aplikasi web yang telah dibangun, diuji, dan dipertanggungjawabkan di hadapan tim penguji industri.',
    foto: '/assets/uploads/aktivitas/journey_ujilevel.jpg',
    orientation: 'landscape',
    highlights: ['Live Demo Aplikasi Berfungsi Penuh', 'Tanya Jawab Arsitektur Sistem', 'Evaluasi Kesiapan Kerja Industri']
  },
  {
    step: '05',
    stageName: 'Dicoding Achievement',
    title: 'Kelulusan Sertifikasi & Penghargaan Dicoding',
    tanggal: 'Mei 2026',
    badge: 'ACHIEVEMENT',
    badgeType: 'emerald',
    iconType: 'trophy',
    deskripsi: 'Puncak pencapaian siswa XI PPLG 3 meraih sertifikasi kompetensi industri resmi dari Dicoding Academy, menjadi bukti otentik dedikasi, kerja keras, dan keahlian rekayasa perangkat lunak bertaraf global.',
    foto: '/assets/uploads/aktivitas/journey_dicoding.jpg',
    orientation: 'landscape',
    highlights: ['Sertifikat Terverifikasi Industri', 'Portofolio Terakreditasi', 'Kesiapan Level Up Profesional']
  }
];

export const ekstrakurikulerList: EkstrakurikulerItem[] =
  (savedDefaults.ekstrakurikulerList && (savedDefaults.ekstrakurikulerList as any[]).length > 0)
    ? (savedDefaults.ekstrakurikulerList as EkstrakurikulerItem[])
    : defaultEkskulList;

export const organisasiMembers: OrganisasiMember[] =
  (savedDefaults.organisasiMembers && (savedDefaults.organisasiMembers as any[]).length > 0)
    ? (savedDefaults.organisasiMembers as OrganisasiMember[])
    : defaultOrgList;

export const journeyMilestones: JourneyMilestone[] =
  (savedDefaults.journeyMilestones && (savedDefaults.journeyMilestones as any[]).length > 0)
    ? (savedDefaults.journeyMilestones as JourneyMilestone[])
    : defaultJourneyList;

