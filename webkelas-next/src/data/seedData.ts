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
  ContactInfo,
  GuestbookMessage
} from '@/types/database';

export const initialContact: ContactInfo = {
  id: 1,
  instagram: '@xpplg.3rd',
  whatsapp: '6281294862060',
  email: 'classxpplg3@gmail.com',
  logo: '/assets/uploads/logo/logo_windows_xp.jpg'
};

export const initialStructure: StructureMember[] = [
  {
    id: 1,
    role: 'Wali Kelas',
    name: 'Mutia Oktavia S,Pd',
    photo: '/assets/uploads/structure/struct_1_1787281004.jpeg',
    expertise: 'Bahasa Indonesia & Pembina Karakter',
    description: 'Bu Mutia Oktavia adalah guru Bahasa Indonesia yang berdedikasi tinggi membimbing siswa XI PPLG 3. Senantiasa menuntun para siswa menjadi pribadi yang beretika, kreatif, dan unggul di bidang teknologi.',
    message: 'Teruslah belajar, tetap semangat, jaga solidaritas, dan jangan pernah menyerah menggapai cita-cita!',
    year: '2026 - 2027',
    subject: 'Bahasa Indonesia',
    motto: 'Silih Asah, Silih Asih, Silih Asuh',
    order_num: 1
  },
  {
    id: 2,
    role: 'Ketua Kelas',
    name: 'Revand Aqilla Al Hafiz',
    photo: '/assets/uploads/structure/struct_2_1787281208.jpeg',
    expertise: 'Leadership & Management',
    description: 'Ketua kelas yang bertanggung jawab memimpin dan mengkoordinasikan seluruh kegiatan kelas. Memiliki jiwa kepemimpinan yang kuat dan selalu siap membantu teman-teman.',
    message: 'Mari kita bersama-sama membangun kelas yang solid dan kompak. Setiap masalah pasti ada solusinya jika kita bekerja sama dengan baik.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Together We Achieve More',
    order_num: 2
  },
  {
    id: 3,
    role: 'Wakil Ketua',
    name: 'Niko Keandre Adinata',
    photo: '/assets/uploads/structure/struct_3_1787281713.jpg',
    expertise: 'Organization & Coordination',
    description: 'Wakil ketua kelas yang siap mendukung ketua dalam menjalankan tugas dan tanggung jawab. Aktif dalam mengkoordinasikan kegiatan kelas.',
    message: 'Kita adalah tim yang hebat. Mari saling mendukung dan membantu satu sama lain untuk mencapai tujuan bersama.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Unity in Diversity',
    order_num: 3
  },
  {
    id: 4,
    role: 'Sekretaris 1',
    name: 'Khaira Putri Madani',
    photo: '/assets/uploads/structure/struct_4_1787281474.jpg',
    expertise: 'Documentation & Administration',
    description: 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.',
    message: 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Detail Matters',
    order_num: 4
  },
  {
    id: 5,
    role: 'Sekretaris 2',
    name: 'Asyifa',
    photo: '/assets/uploads/structure/struct_5_1787281787.jpg',
    expertise: 'Documentation & Administration',
    description: 'Sekretaris pendamping yang membantu pengelolaan absensi, notulensi rapat kelas, dan surat-menyurat.',
    message: 'Ketelitian dan komitmen membawa keteraturan bagi seluruh anggota kelas.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Precision & Excellence',
    order_num: 5
  },
  {
    id: 6,
    role: 'Bendahara 1',
    name: 'Lulu Maulida',
    photo: '/assets/uploads/structure/struct_6_1787281138.jpeg',
    expertise: 'Financial Management',
    description: 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.',
    message: 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Trust Through Transparency',
    order_num: 6
  },
  {
    id: 7,
    role: 'Bendahara 2',
    name: 'Habib Ramadhan',
    photo: '/assets/uploads/structure/struct_7_1787281857.jpeg',
    expertise: 'Financial Management',
    description: 'Mendukung pembukuan kas kelas dan memastikan iuran serta alokasi anggaran kegiatan berjalan tertib.',
    message: 'Uang kas kelas adalah amanah bersama untuk kemajuan kelas kita.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Accountability First',
    order_num: 7
  },
  {
    id: 8,
    role: 'PDD (Publikasi & Dokumentasi)',
    name: 'Rajib Zahir',
    photo: '/assets/uploads/structure/struct_8_1787301394.jpeg',
    expertise: 'Media & Web Development',
    description: 'Bertanggung jawab atas publikasi, konten digital, dan dokumentasi seluruh momen berharga kelas XI PPLG 3.',
    message: 'Setiap momen adalah cerita. Mari kita abadikan perjalanan kita bersama dengan dokumentasi yang kreatif dan bermakna.',
    year: '2026 - 2027',
    subject: 'PPLG (Software Engineering)',
    motto: 'Capture The Moment, Code The Future',
    order_num: 8
  }
];

export const initialStudents: Student[] = [
  { id: '001', name: 'Abyan Alfarizi', photo: '/assets/uploads/students/student_001_1778723200.png', kelas: 'XI PPLG 3' },
  { id: '002', name: 'Aisyah Chyntia Devantara', photo: '/assets/uploads/students/student_002_1778723298.png', kelas: 'XI PPLG 3' },
  { id: '003', name: 'Alivia Cahaya Lukmana', photo: '/assets/uploads/students/student_003_1778723345.png', kelas: 'XI PPLG 3' },
  { id: '004', name: 'Andini Novriani', photo: '/assets/uploads/students/student_004_1778723416.png', kelas: 'XI PPLG 3' },
  { id: '005', name: 'Asyifa Nurmaulidya', photo: '/assets/uploads/students/student_005_1778723423.png', kelas: 'XI PPLG 3' },
  { id: '006', name: 'Bagus Pambudi Priyambodo', photo: '/assets/uploads/students/student_006_1778722684.jpeg', kelas: 'XI PPLG 3' },
  { id: '007', name: 'Bramantyo Arsya Wijaya', photo: '/assets/uploads/students/student_007_1778723484.png', kelas: 'XI PPLG 3' },
  { id: '008', name: 'Crisna Juliana', photo: '/assets/uploads/students/student_008_1778723491.png', kelas: 'XI PPLG 3' },
  { id: '009', name: 'Davin Alfarrel Nasrullah', photo: '/assets/uploads/students/student_009_1778723551.png', kelas: 'XI PPLG 3' },
  { id: '010', name: 'Dema Arya Ramadhan', photo: '/assets/uploads/students/student_010_1778723559.png', kelas: 'XI PPLG 3' },
  { id: '011', name: 'Faneza Putri', photo: '/assets/uploads/students/student_012_1778722700.jpeg', kelas: 'XI PPLG 3' },
  { id: '012', name: 'Faris Ahmad Ghaisan', photo: '/assets/uploads/students/student_013_1778723735.png', kelas: 'XI PPLG 3' },
  { id: '013', name: 'Habib Ramadhan', photo: '/assets/uploads/students/student_014_1778723793.png', kelas: 'XI PPLG 3' },
  { id: '014', name: 'Ilham Muhamad Fahri', photo: '/assets/uploads/students/student_015_1778723801.png', kelas: 'XI PPLG 3' },
  { id: '015', name: 'Intan Nuraeni', photo: '/assets/uploads/students/student_016_1778723850.png', kelas: 'XI PPLG 3' },
  { id: '016', name: 'Khaira Putri Madani', photo: '/assets/uploads/students/student_017_1778723931.png', kelas: 'XI PPLG 3' },
  { id: '017', name: 'Lulu Maulida', photo: '/assets/uploads/students/student_018_1778723939.png', kelas: 'XI PPLG 3' },
  { id: '018', name: 'Maisie Anzala Maramis', photo: '/assets/uploads/students/student_019_1778724013.png', kelas: 'XI PPLG 3' },
  { id: '019', name: 'Muhamad Aditya Saputra', photo: '/assets/uploads/students/student_020_1778722877.jpeg', kelas: 'XI PPLG 3' },
  { id: '020', name: 'Muhamad Anzas Adzahri', photo: '/assets/uploads/students/student_021_1778724003.png', kelas: 'XI PPLG 3' },
  { id: '021', name: 'Muhammad Alif Fatir Sya\'bani', photo: '/assets/uploads/students/student_022_1778724221.png', kelas: 'XI PPLG 3' },
  { id: '022', name: 'Muhammad Candra Kusuma', photo: '/assets/uploads/students/student_023_1778724280.png', kelas: 'XI PPLG 3' },
  { id: '023', name: 'Muhammad Hafiyz Nurhidayah', photo: '/assets/uploads/students/student_024_1778724326.png', kelas: 'XI PPLG 3' },
  { id: '024', name: 'Muhammad Noval Adil Adha', photo: '/assets/uploads/students/student_025_1778724316.png', kelas: 'XI PPLG 3' },
  { id: '025', name: 'Muhammad Rajib Zahir', photo: '/assets/uploads/students/student_026_1778724212.png', nisn: '2345678', kelas: 'XI PPLG 3', email: 'rajibjugi02@gmail.com', github_link: 'https://github.com/rajibjugi02-ctrl/SMK-PENERBANGAN-BOGOR' },
  { id: '026', name: 'Muhammad Refan Abiena Wafa', photo: '/assets/uploads/students/student_027_1778724399.png', kelas: 'XI PPLG 3' },
  { id: '027', name: 'Mutia Khamelia', photo: '/assets/uploads/students/student_028_1778725011.png', kelas: 'XI PPLG 3' },
  { id: '028', name: 'Nadine Shahmina', photo: '/assets/uploads/students/student_029_1778722718.jpeg', nisn: '0109463616', kelas: 'XI PPLG 3', email: 'nadineeshahminaa@gmail.com' },
  { id: '029', name: 'Nazhril Rizky Alfiansyah', photo: '/assets/uploads/students/student_030_1778725003.png', kelas: 'XI PPLG 3' },
  { id: '030', name: 'Niko Keandre Adinata', photo: '/assets/uploads/students/student_031_1778724994.png', kelas: 'XI PPLG 3' },
  { id: '031', name: 'Nur Syifa Fauziah', photo: '/assets/uploads/students/student_032_1778724971.png', kelas: 'XI PPLG 3' },
  { id: '032', name: 'Oktavia Indriani', photo: '/assets/uploads/students/student_033_1778724961.jpg', kelas: 'XI PPLG 3' },
  { id: '033', name: 'Rafi Udin', photo: '/assets/uploads/students/student_034_1778725126.png', kelas: 'XI PPLG 3' },
  { id: '034', name: 'Rafli', photo: '/assets/uploads/students/student_035_1778812776.jpeg', kelas: 'XI PPLG 3' },
  { id: '035', name: 'Ranty Dwi Oktavia', photo: '/assets/uploads/students/student_036_1778725224.png', kelas: 'XI PPLG 3' },
  { id: '036', name: 'Reisya Auliaul Jannah', photo: '/assets/uploads/students/student_037_1778725213.png', kelas: 'XI PPLG 3' },
  { id: '037', name: 'Restu Alfarizhi', photo: '/assets/uploads/students/student_038_1778725204.png', kelas: 'XI PPLG 3' },
  { id: '038', name: 'Revand Aqila Al Hafiz', photo: '/assets/uploads/students/student_039_1778725285.png', kelas: 'XI PPLG 3' },
  { id: '039', name: 'Rizky Maulana', photo: '/assets/uploads/students/student_040_1778725293.png', kelas: 'XI PPLG 3' },
  { id: '040', name: 'Salsabila Azzahra', photo: '/assets/uploads/students/student_041_1778722842.jpeg', kelas: 'XI PPLG 3' },
  { id: '041', name: 'Siti Ainun', photo: '/assets/uploads/students/student_042_1778725434.png', kelas: 'XI PPLG 3' },
  { id: '042', name: 'Siti Salwa Aulia', photo: '/assets/uploads/students/student_043_1778725375.png', kelas: 'XI PPLG 3' },
  { id: '043', name: 'Sulthan Azzam Rizqullah', photo: '/assets/uploads/students/student_044_1778725527.png', kelas: 'XI PPLG 3' },
  { id: '044', name: 'Taruna Jayalaksana Suwarman', photo: '/assets/uploads/students/student_045_1778725535.png', kelas: 'XI PPLG 3' },
  { id: '045', name: 'Nurul Nabilla Arti', photo: '/assets/uploads/students/student_045_nurul.png', kelas: 'XI PPLG 3' }
];

export const initialJadwalPelajaran: JadwalPelajaran[] = [
  // Senin
  { id: 101, hari: 'Senin', jam_mulai: '06.30', jam_selesai: '07.30', mata_pelajaran: 'UPACARA BENDERA', guru: 'Seluruh Siswa & Dewan Guru', urutan: 1 },
  { id: 1, hari: 'Senin', jam_mulai: '07.30', jam_selesai: '08.50', mata_pelajaran: 'SEJARAH', guru: 'BU RINA', urutan: 2 },
  { id: 2, hari: 'Senin', jam_mulai: '08.50', jam_selesai: '09.30', mata_pelajaran: 'PPKN', guru: 'PA MAMAN', urutan: 3 },
  { id: 3, hari: 'Senin', jam_mulai: '09.30', jam_selesai: '10.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 4 },
  { id: 4, hari: 'Senin', jam_mulai: '10.00', jam_selesai: '10.40', mata_pelajaran: 'PPKN', guru: 'PA MAMAN', urutan: 5 },
  { id: 5, hari: 'Senin', jam_mulai: '10.40', jam_selesai: '12.00', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'BU DIAH', urutan: 6 },
  { id: 6, hari: 'Senin', jam_mulai: '12.00', jam_selesai: '13.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 7 },
  { id: 7, hari: 'Senin', jam_mulai: '13.00', jam_selesai: '15.00', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'BU DELIKA', urutan: 8 },
  { id: 102, hari: 'Senin', jam_mulai: '15.00', jam_selesai: '15.15', mata_pelajaran: 'DOA & PULANG SEKOLAH', guru: 'Wali Kelas & Siswa', urutan: 9 },
  // Selasa
  { id: 103, hari: 'Selasa', jam_mulai: '06.30', jam_selesai: '07.30', mata_pelajaran: 'SHOLAT DHUHA BERSAMA', guru: 'Guru Pembimbing & Seluruh Siswa', urutan: 1 },
  { id: 8, hari: 'Selasa', jam_mulai: '07.30', jam_selesai: '08.50', mata_pelajaran: 'BISNIS DIGITAL', guru: 'PA DIDIN', urutan: 2 },
  { id: 9, hari: 'Selasa', jam_mulai: '08.50', jam_selesai: '09.30', mata_pelajaran: 'BAHASA INGGRIS', guru: 'MIS. SUCI', urutan: 3 },
  { id: 10, hari: 'Selasa', jam_mulai: '09.30', jam_selesai: '10.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 4 },
  { id: 11, hari: 'Selasa', jam_mulai: '10.00', jam_selesai: '10.40', mata_pelajaran: 'BAHASA INGGRIS', guru: 'MIS. SUCI', urutan: 5 },
  { id: 12, hari: 'Selasa', jam_mulai: '10.40', jam_selesai: '12.00', mata_pelajaran: 'MATEMATIKA', guru: 'BU DESI', urutan: 6 },
  { id: 13, hari: 'Selasa', jam_mulai: '12.00', jam_selesai: '13.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 7 },
  { id: 14, hari: 'Selasa', jam_mulai: '13.00', jam_selesai: '13.40', mata_pelajaran: 'MATEMATIKA', guru: 'BU DESI', urutan: 8 },
  { id: 15, hari: 'Selasa', jam_mulai: '13.40', jam_selesai: '15.00', mata_pelajaran: 'BAHASA INGGRIS', guru: 'MIS. SUCI', urutan: 9 },
  { id: 104, hari: 'Selasa', jam_mulai: '15.00', jam_selesai: '15.15', mata_pelajaran: 'DOA & PULANG SEKOLAH', guru: 'Wali Kelas & Siswa', urutan: 10 },
  // Rabu
  { id: 105, hari: 'Rabu', jam_mulai: '06.30', jam_selesai: '07.30', mata_pelajaran: 'SHOLAT DHUHA BERSAMA', guru: 'Guru Pembimbing & Seluruh Siswa', urutan: 1 },
  { id: 16, hari: 'Rabu', jam_mulai: '07.30', jam_selesai: '09.30', mata_pelajaran: 'PAI', guru: 'PA RAHMAT', urutan: 2 },
  { id: 17, hari: 'Rabu', jam_mulai: '09.30', jam_selesai: '10.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 3 },
  { id: 18, hari: 'Rabu', jam_mulai: '10.00', jam_selesai: '12.00', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'BU DIAH', urutan: 4 },
  { id: 19, hari: 'Rabu', jam_mulai: '12.00', jam_selesai: '13.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 5 },
  { id: 20, hari: 'Rabu', jam_mulai: '13.00', jam_selesai: '15.00', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'PA DIDIN', urutan: 6 },
  { id: 106, hari: 'Rabu', jam_mulai: '15.00', jam_selesai: '15.15', mata_pelajaran: 'DOA & PULANG SEKOLAH', guru: 'Wali Kelas & Siswa', urutan: 7 },
  // Kamis
  { id: 107, hari: 'Kamis', jam_mulai: '06.30', jam_selesai: '07.30', mata_pelajaran: 'SHOLAT DHUHA BERSAMA', guru: 'Guru Pembimbing & Seluruh Siswa', urutan: 1 },
  { id: 21, hari: 'Kamis', jam_mulai: '07.30', jam_selesai: '09.30', mata_pelajaran: 'BAHASA INDONESIA', guru: 'BU MITA', urutan: 2 },
  { id: 22, hari: 'Kamis', jam_mulai: '09.30', jam_selesai: '10.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 3 },
  { id: 23, hari: 'Kamis', jam_mulai: '10.00', jam_selesai: '11.00', mata_pelajaran: 'PJOK', guru: 'PA YUDHI', urutan: 4 },
  { id: 24, hari: 'Kamis', jam_mulai: '11.20', jam_selesai: '12.00', mata_pelajaran: 'KIK', guru: 'PA WANDA', urutan: 5 },
  { id: 25, hari: 'Kamis', jam_mulai: '12.00', jam_selesai: '13.00', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 6 },
  { id: 26, hari: 'Kamis', jam_mulai: '13.00', jam_selesai: '15.00', mata_pelajaran: 'KIK', guru: 'PA WANDA', urutan: 7 },
  { id: 108, hari: 'Kamis', jam_mulai: '15.00', jam_selesai: '15.15', mata_pelajaran: 'DOA & PULANG SEKOLAH', guru: 'Wali Kelas & Siswa', urutan: 8 },
  // Jumat
  { id: 109, hari: 'Jumat', jam_mulai: '06.30', jam_selesai: '07.30', mata_pelajaran: 'KOKURIKULER (JUMAT SEHAT & BERSIH)', guru: 'Bergilir per 3 Minggu: Olahraga, Sarapan Sehat, Bersih-Bersih', urutan: 1 },
  { id: 27, hari: 'Jumat', jam_mulai: '07.30', jam_selesai: '08.10', mata_pelajaran: 'KIK', guru: 'PA WANDA', urutan: 2 },
  { id: 28, hari: 'Jumat', jam_mulai: '08.10', jam_selesai: '09.30', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'BU DELIKA', urutan: 3 },
  { id: 29, hari: 'Jumat', jam_mulai: '09.30', jam_selesai: '09.45', mata_pelajaran: 'ISTIRAHAT', guru: '-', urutan: 4 },
  { id: 30, hari: 'Jumat', jam_mulai: '09.45', jam_selesai: '11.45', mata_pelajaran: 'PPLG/PRODUKTIF', guru: 'PA DIDIN', urutan: 5 },
  { id: 31, hari: 'Jumat', jam_mulai: '12.00', jam_selesai: '13.00', mata_pelajaran: 'ISHOMA / SHOLAT JUMAT', guru: '-', urutan: 6 },
  { id: 110, hari: 'Jumat', jam_mulai: '13.00', jam_selesai: '13.15', mata_pelajaran: 'DOA & PULANG SEKOLAH', guru: 'Wali Kelas & Siswa', urutan: 7 }
];

export const initialJadwalPiket: JadwalPiket[] = [
  // Senin
  { id: 1, hari: 'Senin', nama_siswa: 'Aisyah', urutan: 1, pj: 'Alivia & Ainun' },
  { id: 2, hari: 'Senin', nama_siswa: 'Intan', urutan: 2, pj: 'Alivia & Ainun' },
  { id: 3, hari: 'Senin', nama_siswa: 'Nadine', urutan: 3, pj: 'Alivia & Ainun' },
  { id: 4, hari: 'Senin', nama_siswa: 'Salsa', urutan: 4, pj: 'Alivia & Ainun' },
  { id: 5, hari: 'Senin', nama_siswa: 'Abyan', urutan: 5, pj: 'Alivia & Ainun' },
  { id: 6, hari: 'Senin', nama_siswa: 'Dema', urutan: 6, pj: 'Alivia & Ainun' },
  { id: 7, hari: 'Senin', nama_siswa: 'Anzas', urutan: 7, pj: 'Alivia & Ainun' },
  { id: 8, hari: 'Senin', nama_siswa: 'Rajib', urutan: 8, pj: 'Alivia & Ainun' },
  { id: 9, hari: 'Senin', nama_siswa: 'Restu', urutan: 9, pj: 'Alivia & Ainun' },
  // Selasa
  { id: 10, hari: 'Selasa', nama_siswa: 'Alivia', urutan: 1, pj: 'Lulu & Oktavia' },
  { id: 11, hari: 'Selasa', nama_siswa: 'Khaira', urutan: 2, pj: 'Lulu & Oktavia' },
  { id: 12, hari: 'Selasa', nama_siswa: 'Nursyifa', urutan: 3, pj: 'Lulu & Oktavia' },
  { id: 13, hari: 'Selasa', nama_siswa: 'Ainun', urutan: 4, pj: 'Lulu & Oktavia' },
  { id: 14, hari: 'Selasa', nama_siswa: 'Bagus', urutan: 5, pj: 'Lulu & Oktavia' },
  { id: 15, hari: 'Selasa', nama_siswa: 'Faris', urutan: 6, pj: 'Lulu & Oktavia' },
  { id: 16, hari: 'Selasa', nama_siswa: 'Alif', urutan: 7, pj: 'Lulu & Oktavia' },
  { id: 17, hari: 'Selasa', nama_siswa: 'Refan', urutan: 8, pj: 'Lulu & Oktavia' },
  { id: 18, hari: 'Selasa', nama_siswa: 'Revand', urutan: 9, pj: 'Lulu & Oktavia' },
  // Rabu
  { id: 19, hari: 'Rabu', nama_siswa: 'Andini', urutan: 1, pj: 'Asyifa & Ranty' },
  { id: 20, hari: 'Rabu', nama_siswa: 'Lulu', urutan: 2, pj: 'Asyifa & Ranty' },
  { id: 21, hari: 'Rabu', nama_siswa: 'Oktavia', urutan: 3, pj: 'Asyifa & Ranty' },
  { id: 22, hari: 'Rabu', nama_siswa: 'Salwa', urutan: 4, pj: 'Asyifa & Ranty' },
  { id: 23, hari: 'Rabu', nama_siswa: 'Bramantyo', urutan: 5, pj: 'Asyifa & Ranty' },
  { id: 24, hari: 'Rabu', nama_siswa: 'Habib', urutan: 6, pj: 'Asyifa & Ranty' },
  { id: 25, hari: 'Rabu', nama_siswa: 'Candra', urutan: 7, pj: 'Asyifa & Ranty' },
  { id: 26, hari: 'Rabu', nama_siswa: 'Raffi Udin', urutan: 8, pj: 'Asyifa & Ranty' },
  { id: 27, hari: 'Rabu', nama_siswa: 'Rizky', urutan: 9, pj: 'Asyifa & Ranty' },
  // Kamis
  { id: 28, hari: 'Kamis', nama_siswa: 'Asyifa', urutan: 1, pj: 'Fanezza & Reisya' },
  { id: 29, hari: 'Kamis', nama_siswa: 'Maisi', urutan: 2, pj: 'Fanezza & Reisya' },
  { id: 30, hari: 'Kamis', nama_siswa: 'Ranty', urutan: 3, pj: 'Fanezza & Reisya' },
  { id: 31, hari: 'Kamis', nama_siswa: 'Nurul', urutan: 4, pj: 'Fanezza & Reisya' },
  { id: 32, hari: 'Kamis', nama_siswa: 'Crisna', urutan: 5, pj: 'Fanezza & Reisya' },
  { id: 33, hari: 'Kamis', nama_siswa: 'Ilham', urutan: 6, pj: 'Fanezza & Reisya' },
  { id: 34, hari: 'Kamis', nama_siswa: 'Hafiyz', urutan: 7, pj: 'Fanezza & Reisya' },
  { id: 35, hari: 'Kamis', nama_siswa: 'Nazhril', urutan: 8, pj: 'Fanezza & Reisya' },
  { id: 36, hari: 'Kamis', nama_siswa: 'Azzam', urutan: 9, pj: 'Fanezza & Reisya' },
  // Jumat
  { id: 37, hari: 'Jumat', nama_siswa: 'Faneza', urutan: 1, pj: 'Intan & Nadine' },
  { id: 38, hari: 'Jumat', nama_siswa: 'Mutia', urutan: 2, pj: 'Intan & Nadine' },
  { id: 39, hari: 'Jumat', nama_siswa: 'Reisya', urutan: 3, pj: 'Intan & Nadine' },
  { id: 40, hari: 'Jumat', nama_siswa: 'M. Aditya', urutan: 4, pj: 'Intan & Nadine' },
  { id: 41, hari: 'Jumat', nama_siswa: 'Davin', urutan: 5, pj: 'Intan & Nadine' },
  { id: 42, hari: 'Jumat', nama_siswa: 'Noval', urutan: 6, pj: 'Intan & Nadine' },
  { id: 43, hari: 'Jumat', nama_siswa: 'Rafli', urutan: 7, pj: 'Intan & Nadine' },
  { id: 44, hari: 'Jumat', nama_siswa: 'Taruna', urutan: 8, pj: 'Intan & Nadine' },
  { id: 45, hari: 'Jumat', nama_siswa: 'Niko', urutan: 9, pj: 'Intan & Nadine' }
];

export const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Radar Organisasi Dan Aspirasi',
    description: 'Website ini sebuah website roa atau radar organisasi dan aspirasi dari SMK Negeri 1 Ciomas',
    image: '/assets/uploads/projects/project_1778720947.png',
    link: 'https://roangkasa.infinityfree.me/index.php',
    makers: 'Don Matteu Abie Wewengkang , Muhammad Rajib Zahir , Nadine Shahmina',
    tech_stack: ['PHP', 'MySQL', 'Bootstrap 5', 'REST API'],
    featured: true
  },
  {
    id: 2,
    title: 'Perpustakaan PGRI 3',
    description: 'Sebuah webiste perpustakaan pgri 3 yg di buat oleh kelompok davin x pplg 3, website ini bisa digunak...',
    image: '/assets/uploads/projects/project_1778721629.png',
    link: 'https://perpuspgri3.online/',
    makers: 'Dema Arya Ramadhan , Davin Alfarel Nasrullah',
    tech_stack: ['PHP', 'MySQL', 'Tailwind CSS', 'AdminLTE'],
    featured: true
  },
  {
    id: 3,
    title: 'Tadika Anak It Al Muhajirin',
    description: 'Website kami di gunakan sebagai sarana informasi dan komunikasi antara orang tua murid dan pihak sek...',
    image: '/assets/uploads/projects/project_1778724529.png',
    link: 'https://tadikakanakitalmuhajirin.my.id/',
    makers: 'Kelompok IT PPLG 3',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    featured: true
  }
];

export const initialComments: ProjectComment[] = [
  { id: 1, project_id: 2, user_name: 'Rajib', comment: 'Wih keren banget websitenya!', is_visible: true, created_at: '2026-05-14T16:02:06Z' },
  { id: 2, project_id: 3, user_name: 'Anzas', comment: 'Keren nih desainnya, rekomendasikan tambah integrasi kalender acara ya!', is_visible: true, created_at: '2026-05-14T17:03:28Z' },
  { id: 3, project_id: 3, user_name: 'Davin', comment: 'Siap terimakasih sarannya kawan!', parent_id: 2, is_visible: true, created_at: '2026-05-14T17:04:13Z' },
  { id: 4, project_id: 2, user_name: 'Admin PPLG 3', comment: 'Bangga punya siswa yang mampu berkreasi dengan project nyata seperti ini!', is_visible: true, created_at: '2026-05-15T10:05:35Z' },
  { id: 5, project_id: 2, user_name: 'Muhammad Rajib Zahir', comment: 'Terima kasih banyak supportnya!', parent_id: 4, is_visible: true, created_at: '2026-05-15T10:19:21Z' }
];

export const initialGallery: GalleryItem[] = [
  { id: 1, image: '/assets/uploads/gallery/gallery_1778720190_0.jpeg', caption: 'Petugas Upacara Bendera 2026', category: 'Upacara' },
  { id: 2, image: '/assets/uploads/gallery/gallery_1778720397_0.jpeg', caption: 'Peringatan Maulid Nabi Muhammad SAW 2025', category: 'Acara' },
  { id: 3, image: '/assets/uploads/gallery/gallery_1778720615_0.jpeg', caption: 'Hari Guru Nasional 2025 bersama Wali Kelas', category: 'Peringatan' },
  { id: 4, image: '/assets/uploads/gallery/gallery_1778843741_0.jpeg', caption: 'Momen Hangat Bersama Sebelum Bulan Ramadhan', category: 'Kebersamaan' },
  { id: 5, image: '/assets/uploads/gallery/gallery_1778843912_0.jpeg', caption: 'Juara 1 Fashion Show Peringatan Hari Kartini 2026', category: 'Prestasi' },
  { id: 6, image: '/assets/uploads/gallery/gallery_1787384210_0.jpeg', caption: 'Upacara Kemerdekaan Republik Indonesia 17 Agustus', category: 'Upacara' },
  { id: 7, image: '/assets/uploads/gallery/gallery_1787384334_0.jpeg', caption: 'Takziah & Doa Bersama untuk Keluarga Siswa', category: 'Sosial' }
];

export const initialVideos: VideoKelas[] = [
  {
    id: 1,
    judul: 'Lomba Dekorasi Kelas PPLG 3',
    deskripsi: 'Keseruan dan kerja keras seluruh anggota kelas mendekorasi ruangan kelas.',
    url_video: '/assets/uploads/videos/video_1787385653_938.mp4',
    thumbnail: '/assets/uploads/thumbnails/thumb_1787385653_720.jpeg',
    tanggal: '2026-08-15'
  },
  {
    id: 2,
    judul: 'Doa Bersama & Kebersamaan',
    deskripsi: 'Momen empati dan doa bersama untuk almarhum ayahanda sahabat kami.',
    url_video: '/assets/uploads/videos/video_1787385509_323.mp4',
    thumbnail: '/assets/uploads/thumbnails/thumb_1787385536_389.jpeg',
    tanggal: '2026-07-24'
  }
];

export const initialPlaylist: Song[] = [
  { id: 1, judul: "Somebody's Pleasure", artis: 'Aziz Hendra', file_name: '/assets/audio/somebodys_pleasure.mp3', cover: '/assets/uploads/thumbnails/thumb_1787385653_720.jpeg', urutan: 1, aktif: true },
  { id: 2, judul: 'Malu-Malu', artis: 'V1RST', file_name: '/assets/audio/malu_malu.mp3', cover: '/assets/uploads/gallery/gallery_1778720190_0.jpeg', urutan: 2, aktif: true },
  { id: 3, judul: 'Bersenjagurau', artis: 'Raim Laode', file_name: '/assets/audio/bersenjagurau.mp3', cover: '/assets/uploads/gallery/gallery_1778720397_0.jpeg', urutan: 3, aktif: true },
  { id: 4, judul: 'dna', artis: 'LANY', file_name: '/assets/audio/lany.mp3', cover: '/assets/uploads/gallery/gallery_1778843741_0.jpeg', urutan: 4, aktif: true }
];

export const initialGuestbook: GuestbookMessage[] = [
  { id: 1, name: 'Siti Maisaroh', kelas: 'X PPLG 4', message: 'Semoga XI PPLG 3 makin solid dan coding-nya makin jago!', created_at: '2026-05-15T09:20:18Z' },
  { id: 2, name: 'Zhirrbam', 'kelas': 'X TO 2', message: 'Web kelasnya keren banget bro, sukses terus!', created_at: '2026-05-15T23:39:21Z' },
  { id: 3, name: 'Rafli', kelas: 'X PPLG 3', message: 'Keren nih tampilan Next.js nya, mantap!', created_at: '2026-05-15T10:17:50Z' }
];
