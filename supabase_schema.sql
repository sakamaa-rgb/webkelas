-- ==============================================================================
-- SUPABASE DATABASE SCHEMA & SEED DATA UNTUK WEB KELAS XI PPLG 3
-- SMK Penerbangan Bogor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: structure (Struktur Organisasi Kelas)
DROP TABLE IF EXISTS project_comments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS jadwal_piket CASCADE;
DROP TABLE IF EXISTS jadwal_pelajaran CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS video_kelas CASCADE;
DROP TABLE IF EXISTS music_playlist CASCADE;
DROP TABLE IF EXISTS posters CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS guestbook CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS structure CASCADE;

CREATE TABLE structure (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  photo VARCHAR(255) DEFAULT '',
  expertise VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  message TEXT DEFAULT NULL,
  year VARCHAR(50) DEFAULT '2026 - 2027',
  subject VARCHAR(255) DEFAULT 'PPLG (Software Engineering)',
  motto VARCHAR(255) DEFAULT 'Code Your Dreams',
  order_num INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: students (Daftar Siswa)
CREATE TABLE students (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  photo VARCHAR(255) DEFAULT '',
  nisn VARCHAR(20) DEFAULT NULL,
  kelas VARCHAR(50) DEFAULT 'XI PPLG 3',
  email VARCHAR(100) DEFAULT NULL,
  portfolio_link VARCHAR(255) DEFAULT NULL,
  github_link VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: jadwal_pelajaran
CREATE TABLE jadwal_pelajaran (
  id SERIAL PRIMARY KEY,
  hari VARCHAR(20) NOT NULL,
  jam_mulai VARCHAR(10) NOT NULL,
  jam_selesai VARCHAR(10) NOT NULL,
  mata_pelajaran VARCHAR(100) NOT NULL,
  guru VARCHAR(100) DEFAULT '',
  urutan INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: jadwal_piket
CREATE TABLE jadwal_piket (
  id SERIAL PRIMARY KEY,
  hari VARCHAR(20) NOT NULL,
  nama_siswa VARCHAR(100) NOT NULL,
  urutan INT DEFAULT 1,
  pj VARCHAR(100) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE: projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  image VARCHAR(255) DEFAULT '',
  link VARCHAR(255) DEFAULT '',
  makers TEXT DEFAULT NULL,
  tech_stack TEXT[] DEFAULT ARRAY['Web', 'HTML/CSS/JS'],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE: project_comments
CREATE TABLE project_comments (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  parent_id INT DEFAULT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE: gallery
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  caption VARCHAR(255) DEFAULT '',
  category VARCHAR(50) DEFAULT 'Kegiatan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE: video_kelas
CREATE TABLE video_kelas (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT DEFAULT NULL,
  url_video VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255) DEFAULT '',
  tanggal DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLE: music_playlist
CREATE TABLE music_playlist (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  artis VARCHAR(255) DEFAULT '',
  file_name VARCHAR(255) NOT NULL,
  urutan INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABLE: posters
CREATE TABLE posters (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) DEFAULT '',
  deskripsi TEXT DEFAULT NULL,
  gambar VARCHAR(255) NOT NULL,
  tanggal_mulai DATE DEFAULT CURRENT_DATE,
  tanggal_selesai DATE DEFAULT CURRENT_DATE,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABLE: visitors & guestbook
CREATE TABLE visitors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  last_login TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guestbook (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABLE: contact
CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  instagram VARCHAR(255) DEFAULT '@xpplg.3rd',
  whatsapp VARCHAR(255) DEFAULT '6281294862060',
  email VARCHAR(255) DEFAULT 'classxpplg3@gmail.com',
  logo VARCHAR(255) DEFAULT ''
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_pelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_playlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Read policies for public (Anyone can view class info)
CREATE POLICY "Allow public read structure" ON structure FOR SELECT USING (true);
CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read jadwal_pelajaran" ON jadwal_pelajaran FOR SELECT USING (true);
CREATE POLICY "Allow public read jadwal_piket" ON jadwal_piket FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON project_comments FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public insert comments" ON project_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read video_kelas" ON video_kelas FOR SELECT USING (true);
CREATE POLICY "Allow public read music_playlist" ON music_playlist FOR SELECT USING (aktif = true);
CREATE POLICY "Allow public read posters" ON posters FOR SELECT USING (aktif = true);
CREATE POLICY "Allow public read guestbook" ON guestbook FOR SELECT USING (true);
CREATE POLICY "Allow public insert guestbook" ON guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contact" ON contact FOR SELECT USING (true);

-- Authenticated Admin Policies (Full access for authenticated admin users)
CREATE POLICY "Allow auth all structure" ON structure FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all students" ON students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all jadwal_pelajaran" ON jadwal_pelajaran FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all jadwal_piket" ON jadwal_piket FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all project_comments" ON project_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all video_kelas" ON video_kelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all music_playlist" ON music_playlist FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all posters" ON posters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all guestbook" ON guestbook FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth all contact" ON contact FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- SEED DATA (MIGRASI DATA DARI DATABASE ASLI)
-- ==============================================================================

-- 1. STRUCTURE
INSERT INTO structure (id, role, name, photo, expertise, description, message, year, subject, motto, order_num) VALUES
(1, 'Wali Kelas', 'Mutia Oktavia S,Pd', 'struct_1_1787281004.jpeg', 'Bahasa Indonesia', 'Bu Mutia Oktavia Adalah seorang guru bahasa indonesia di kelas 11 sekaligus walikelas xi pplg 3 juga.', 'Teruslah belajar, semangat dan pantang menyerah!!', '2026 - 2027', 'Bahasa Indonesia', 'Teks prosedur', 1),
(2, 'Ketua Kelas', 'Revand Aqilla Al Hafiz', 'struct_2_1787281208.jpeg', 'Leadership & Management', 'Ketua kelas yang bertanggung jawab memimpin dan mengkoordinasikan seluruh kegiatan kelas. Memiliki jiwa kepemimpinan yang kuat dan selalu siap membantu teman-teman.', 'Mari kita bersama-sama membangun kelas yang solid dan kompak. Setiap masalah pasti ada solusinya jika kita bekerja sama dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Together We Achieve More', 2),
(3, 'Wakil Ketua', 'Niko Keandre Adinata', 'struct_3_1787281713.jpg', 'Organization & Coordination', 'Wakil ketua kelas yang siap mendukung ketua dalam menjalankan tugas dan tanggung jawab. Aktif dalam mengkoordinasikan kegiatan kelas.', 'Kita adalah tim yang hebat. Mari saling mendukung dan membantu satu sama lain untuk mencapai tujuan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Unity in Diversity', 3),
(4, 'Sekretaris 1', 'Khaira Putri Madani', 'struct_4_1787281474.jpg', 'Documentation & Administration', 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.', 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Detail Matters', 4),
(5, 'Sekretaris 2', 'Asyifa', 'struct_5_1787281787.jpg', 'Documentation & Administration', 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.', 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Detail Matters', 5),
(6, 'Bendahara 1', 'Lulu Maulida', 'struct_6_1787281138.jpeg', 'Financial Management', 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.', 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Trust Through Transparency', 6),
(7, 'Bendahara 2', 'Habib Ramadhan', 'struct_7_1787281857.jpeg', 'Financial Management', 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.', 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Trust Through Transparency', 7),
(8, 'PDD', 'Rajib Zahir', 'struct_8_1787301394.jpeg', 'Media & Documentation', 'Bertanggung jawab atas publikasi, dekorasi, dan dokumentasi seluruh kegiatan kelas. Memastikan setiap momen berharga terabadikan dengan baik.', 'Setiap momen adalah cerita. Mari kita abadikan perjalanan kita bersama dengan dokumentasi yang kreatif dan bermakna.', '2026 - 2027', 'PPLG (Software Engineering)', 'Capture The Moment', 8)
ON CONFLICT (id) DO NOTHING;

-- 2. CONTACT
INSERT INTO contact (id, instagram, whatsapp, email, logo) VALUES
(1, '@xpplg.3rd', '6281294862060', 'classxpplg3@gmail.com', 'logo_1787282041.jpeg')
ON CONFLICT (id) DO NOTHING;

-- 3. STUDENTS (45 Siswa)
INSERT INTO students (id, name, photo, nisn, kelas, email, portfolio_link, github_link) VALUES
('001', 'Abyan Alfarizi', 'student_001_1778723200.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('002', 'Aisyah Chyntia Devantara', 'student_002_1778723298.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('003', 'Alivia Cahaya Lukmana', 'student_003_1778723345.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('004', 'Andini Novriani', 'student_004_1778723416.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('005', 'Asyifa Nurmaulidya', 'student_005_1778723423.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('006', 'Bagus Pambudi Priyambodo', 'student_006_1778722684.jpeg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('007', 'Bramantyo Arsya Wijaya', 'student_007_1778723484.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('008', 'Crisna Juliana', 'student_008_1778723491.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('009', 'Davin Alfarrel Nasrullah', 'student_009_1778723551.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('010', 'Dema Arya Ramadhan', 'student_010_1778723559.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('011', 'Faneza Putri', 'student_012_1778722700.jpeg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('012', 'Faris Ahmad Ghaisan', 'student_013_1778723735.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('013', 'Habib Ramadhan', 'student_014_1778723793.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('014', 'Ilham Muhamad Fahri', 'student_015_1778723801.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('015', 'Intan Nuraeni', 'student_016_1778723850.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('016', 'Khaira Putri Madani', 'student_017_1778723931.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('017', 'Lulu Maulida', 'student_018_1778723939.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('018', 'Maisie Anzala Maramis', 'student_019_1778724013.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('019', 'Muhamad Aditya Saputra', 'student_020_1778722877.jpeg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('020', 'Muhamad Anzas Adzahri', 'student_021_1778724003.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('021', 'Muhammad Alif Fatir Sya''bani', 'student_022_1778724221.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('022', 'Muhammad Candra Kusuma', 'student_023_1778724280.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('023', 'Muhammad Hafiyz Nurhidayah', 'student_024_1778724326.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('024', 'Muhammad Noval Adil Adha', 'student_025_1778724316.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('025', 'Muhammad Rajib Zahir', 'student_026_1778724212.png', '2345678', 'XI PPLG 3', 'rajibjugi02@gmail.com', '', 'https://github.com/rajibjugi02-ctrl/SMK-PENERBANGAN-BOGOR'),
('026', 'Muhammad Refan Abiena Wafa', 'student_027_1778724399.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('027', 'Mutia Khamelia', 'student_028_1778725011.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('028', 'Nadine Shahmina', 'student_029_1778722718.jpeg', '0109463616', 'XI PPLG 3', 'nadineeshahminaa@gmail.com', NULL, NULL),
('029', 'Nazhril Rizky Alfiansyah', 'student_030_1778725003.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('030', 'Niko Keandre Adinata', 'student_031_1778724994.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('031', 'Nur Syifa Fauziah', 'student_032_1778724971.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('032', 'Oktavia Indriani', 'student_033_1778724961.jpg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('033', 'Rafi Udin', 'student_034_1778725126.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('034', 'Rafli', 'student_035_1778812776.jpeg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('035', 'Ranty Dwi Oktavia', 'student_036_1778725224.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('036', 'Reisya Auliaul Jannah', 'student_037_1778725213.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('037', 'Restu Alfarizhi', 'student_038_1778725204.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('038', 'Revand Aqila Al Hafiz', 'student_039_1778725285.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('039', 'Rizky Maulana', 'student_040_1778725293.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('040', 'Salsabila Azzahra', 'student_041_1778722842.jpeg', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('041', 'Siti Ainun', 'student_042_1778725434.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('042', 'Siti Salwa Aulia', 'student_043_1778725375.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('043', 'Sulthan Azzam Rizqullah', 'student_044_1778725527.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('044', 'Taruna Jayalaksana Suwarman', 'student_045_1778725535.png', NULL, 'XI PPLG 3', NULL, NULL, NULL),
('045', 'Nurul Nabilla Arti', 'student_045_nurul.png', NULL, 'XI PPLG 3', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. JADWAL PELAJARAN
INSERT INTO jadwal_pelajaran (id, hari, jam_mulai, jam_selesai, mata_pelajaran, guru, urutan) VALUES
(101, 'Senin', '07.00', '07.30', 'UPACARA BENDERA', 'Seluruh Siswa & Dewan Guru', 1),
(1, 'Senin', '07.30', '08.50', 'SEJARAH', 'BU RINA', 2),
(2, 'Senin', '08.50', '09.30', 'PPKN', 'PA MAMAN', 3),
(3, 'Senin', '09.30', '10.00', 'ISTIRAHAT', '-', 4),
(4, 'Senin', '10.00', '10.40', 'PPKN', 'PA MAMAN', 5),
(5, 'Senin', '10.40', '12.00', 'PPLG/PRODUKTIF', 'BU DIAH', 6),
(6, 'Senin', '12.00', '13.00', 'ISTIRAHAT', '-', 7),
(7, 'Senin', '13.00', '15.00', 'PPLG/PRODUKTIF', 'BU DELIKA', 8),
(102, 'Senin', '15.00', '15.15', 'DOA & PULANG SEKOLAH', 'Wali Kelas & Siswa', 9),
(103, 'Selasa', '07.00', '07.30', 'SHOLAT DHUHA BERSAMA', 'Guru Pembimbing & Seluruh Siswa', 1),
(8, 'Selasa', '07.30', '08.50', 'BISNIS DIGITAL', 'PA DIDIN', 2),
(9, 'Selasa', '08.50', '09.30', 'BAHASA INGGRIS', 'MIS. SUCI', 3),
(10, 'Selasa', '09.30', '10.00', 'ISTIRAHAT', '-', 4),
(11, 'Selasa', '10.00', '10.40', 'BAHASA INGGRIS', 'MIS. SUCI', 5),
(12, 'Selasa', '10.40', '12.00', 'MATEMATIKA', 'BU DESI', 6),
(13, 'Selasa', '12.00', '13.00', 'ISTIRAHAT', '-', 7),
(14, 'Selasa', '13.00', '13.40', 'MATEMATIKA', 'BU DESI', 8),
(15, 'Selasa', '13.40', '15.00', 'BAHASA INGGRIS', 'MIS. SUCI', 9),
(104, 'Selasa', '15.00', '15.15', 'DOA & PULANG SEKOLAH', 'Wali Kelas & Siswa', 10),
(105, 'Rabu', '07.00', '07.30', 'SHOLAT DHUHA BERSAMA', 'Guru Pembimbing & Seluruh Siswa', 1),
(16, 'Rabu', '07.30', '09.30', 'PAI', 'PA RAHMAT', 2),
(17, 'Rabu', '09.30', '10.00', 'ISTIRAHAT', '-', 3),
(18, 'Rabu', '10.00', '12.00', 'PPLG/PRODUKTIF', 'BU DIAH', 4),
(19, 'Rabu', '12.00', '13.00', 'ISTIRAHAT', '-', 5),
(20, 'Rabu', '13.00', '15.00', 'PPLG/PRODUKTIF', 'PA DIDIN', 6),
(106, 'Rabu', '15.00', '15.15', 'DOA & PULANG SEKOLAH', 'Wali Kelas & Siswa', 7),
(107, 'Kamis', '07.00', '07.30', 'SHOLAT DHUHA BERSAMA', 'Guru Pembimbing & Seluruh Siswa', 1),
(21, 'Kamis', '07.30', '09.30', 'BAHASA INDONESIA', 'BU MITA', 2),
(22, 'Kamis', '09.30', '10.00', 'ISTIRAHAT', '-', 3),
(23, 'Kamis', '10.00', '11.00', 'PJOK', 'PA YUDHI', 4),
(24, 'Kamis', '11.20', '12.00', 'KIK', 'PA WANDA', 5),
(25, 'Kamis', '12.00', '13.00', 'ISTIRAHAT', '-', 6),
(26, 'Kamis', '13.00', '15.00', 'KIK', 'PA WANDA', 7),
(108, 'Kamis', '15.00', '15.15', 'DOA & PULANG SEKOLAH', 'Wali Kelas & Siswa', 8),
(109, 'Jumat', '07.00', '07.30', 'KOKURIKULER (JUMAT SEHAT & BERSIH)', 'Bergilir per 3 Minggu: Olahraga, Sarapan Sehat, Bersih-Bersih', 1),
(27, 'Jumat', '07.30', '08.10', 'KIK', 'PA WANDA', 2),
(28, 'Jumat', '08.10', '09.30', 'PPLG/PRODUKTIF', 'BU DELIKA', 3),
(29, 'Jumat', '09.30', '09.45', 'ISTIRAHAT', '-', 4),
(30, 'Jumat', '09.45', '11.45', 'PPLG/PRODUKTIF', 'PA DIDIN', 5),
(31, 'Jumat', '12.00', '13.00', 'ISHOMA/SHOLJUM', '-', 6),
(110, 'Jumat', '13.00', '13.15', 'DOA & PULANG SEKOLAH', 'Wali Kelas & Siswa', 7)
ON CONFLICT (id) DO NOTHING;

-- 5. JADWAL PIKET
INSERT INTO jadwal_piket (id, hari, nama_siswa, urutan, pj) VALUES
(1, 'Senin', 'Aisyah', 1, 'Alivia & Ainun'),
(2, 'Senin', 'Intan', 2, 'Alivia & Ainun'),
(3, 'Senin', 'Nadine', 3, 'Alivia & Ainun'),
(4, 'Senin', 'Salsa', 4, 'Alivia & Ainun'),
(5, 'Senin', 'Abyan', 5, 'Alivia & Ainun'),
(6, 'Senin', 'Dema', 6, 'Alivia & Ainun'),
(7, 'Senin', 'Anzas', 7, 'Alivia & Ainun'),
(8, 'Senin', 'Rajib', 8, 'Alivia & Ainun'),
(9, 'Senin', 'Restu', 9, 'Alivia & Ainun'),
(10, 'Selasa', 'Alivia', 1, 'Lulu & Oktavia'),
(11, 'Selasa', 'Khaira', 2, 'Lulu & Oktavia'),
(12, 'Selasa', 'Nursyifa', 3, 'Lulu & Oktavia'),
(13, 'Selasa', 'Ainun', 4, 'Lulu & Oktavia'),
(14, 'Selasa', 'Bagus', 5, 'Lulu & Oktavia'),
(15, 'Selasa', 'Faris', 6, 'Lulu & Oktavia'),
(16, 'Selasa', 'Alif', 7, 'Lulu & Oktavia'),
(17, 'Selasa', 'Refan', 8, 'Lulu & Oktavia'),
(18, 'Selasa', 'Revand', 9, 'Lulu & Oktavia'),
(19, 'Rabu', 'Andini', 1, 'Asyifa & Ranty'),
(20, 'Rabu', 'Lulu', 2, 'Asyifa & Ranty'),
(21, 'Rabu', 'Oktavia', 3, 'Asyifa & Ranty'),
(22, 'Rabu', 'Salwa', 4, 'Asyifa & Ranty'),
(23, 'Rabu', 'Bramantyo', 5, 'Asyifa & Ranty'),
(24, 'Rabu', 'Habib', 6, 'Asyifa & Ranty'),
(25, 'Rabu', 'Candra', 7, 'Asyifa & Ranty'),
(26, 'Rabu', 'Raffi Udin', 8, 'Asyifa & Ranty'),
(27, 'Rabu', 'Rizky', 9, 'Asyifa & Ranty'),
(28, 'Kamis', 'Asyifa', 1, 'Fanezza & Reisya'),
(29, 'Kamis', 'Maisi', 2, 'Fanezza & Reisya'),
(30, 'Kamis', 'Ranty', 3, 'Fanezza & Reisya'),
(31, 'Kamis', 'Nurul', 4, 'Fanezza & Reisya'),
(32, 'Kamis', 'Crisna', 5, 'Fanezza & Reisya'),
(33, 'Kamis', 'Ilham', 6, 'Fanezza & Reisya'),
(34, 'Kamis', 'Hafiyz', 7, 'Fanezza & Reisya'),
(35, 'Kamis', 'Nazhril', 8, 'Fanezza & Reisya'),
(36, 'Kamis', 'Azzam', 9, 'Fanezza & Reisya'),
(37, 'Jumat', 'Faneza', 1, 'Intan & Nadine'),
(38, 'Jumat', 'Mutia', 2, 'Intan & Nadine'),
(39, 'Jumat', 'Reisya', 3, 'Intan & Nadine'),
(40, 'Jumat', 'M. Aditya', 4, 'Intan & Nadine'),
(41, 'Jumat', 'Davin', 5, 'Intan & Nadine'),
(42, 'Jumat', 'Noval', 6, 'Intan & Nadine'),
(43, 'Jumat', 'Rafli', 7, 'Intan & Nadine'),
(44, 'Jumat', 'Taruna', 8, 'Intan & Nadine'),
(45, 'Jumat', 'Niko', 9, 'Intan & Nadine')
ON CONFLICT (id) DO NOTHING;

-- 6. PROJECTS
INSERT INTO projects (id, title, description, image, link, makers, tech_stack, featured) VALUES
(1, 'Radar Organisasi Dan Aspirasi', 'Website ini sebuah website roa atau radar organisasi dan aspirasi dari SMK PENERBANGAN BOGOR', 'project_1778720947.png', 'https://roangkasa.infinityfree.me/index.php', 'Don Matteu Abie Wewengkang, Muhammad Rajib Zahir, Nadine Shahmina', ARRAY['PHP', 'MySQL', 'Bootstrap'], true),
(2, 'Perpustakaan PGRI 3', 'Sebuah website perpustakaan pgri 3 yg di buat oleh kelompok davin x pplg 3, website ini bisa digunakan untuk peminjaman buku secara daring.', 'project_1778721629.png', 'https://perpuspgri3.online/', 'Dema Arya Ramadhan, Davin Alfarel Nasrullah', ARRAY['PHP', 'MySQL', 'CSS3'], true),
(3, 'Tadika Anak It Al Muhajirin', 'Website kami di gunakan sebagai sarana informasi dan komunikasi antara orang tua murid dan pihak sekolah mengenai pertumbuhan anak dan lain lain.', 'project_1778724529.png', 'https://tadikakanakitalmuhajirin.my.id/', 'Kelompok IT PPLG 3', ARRAY['Next.js', 'Tailwind CSS'], true)
ON CONFLICT (id) DO NOTHING;

-- 7. PROJECT COMMENTS
INSERT INTO project_comments (id, project_id, user_name, comment, parent_id, is_visible) VALUES
(1, 2, 'rajib', 'wih keren websitenya', NULL, true),
(2, 3, 'anjas', 'mungkin di website ini saya kasih rekomendasi tambahan fitur absensi', NULL, true),
(3, 3, 'davin', 'iya terimakasih sarannya', 2, true),
(4, 2, 'Admin PPLG 3', 'Bangga punya kelas yg bisa membuat project sebagus ini', NULL, true),
(5, 2, 'Muhammad Rajib Zahir', 'iyakan min gila keren bangett', 4, true),
(6, 3, 'Admin PPLG 3', 'semangat lagi buat menampilkan website yg keren!!', NULL, true),
(7, 3, 'Muhammad Rajib Zahir', 'WOHOOOO!! Terus berkarya!', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 8. GALLERY
INSERT INTO gallery (id, image, caption, category) VALUES
(1, 'gallery_1778720190_0.jpeg', 'Petugas Upacara 2026', 'Upacara'),
(2, 'gallery_1778720397_0.jpeg', 'Maulid Nabi 2025', 'Acara'),
(3, 'gallery_1778720615_0.jpeg', 'Hari Guru 2025', 'Peringatan'),
(4, 'gallery_1778843741_0.jpeg', 'Foto Bersama Sebelum Puasa 2026', 'Kebersamaan'),
(5, 'gallery_1778843912_0.jpeg', 'X PPLG 3 Meraih Juara 1 Fashion Show Di Hari Kartini 2026', 'Prestasi'),
(6, 'gallery_1787384210_0.jpeg', 'Upacara 17 Agustus 2026', 'Upacara'),
(7, 'gallery_1787384334_0.jpeg', 'Takziah Ayah Intan', 'Sosial')
ON CONFLICT (id) DO NOTHING;

-- 9. VIDEO KELAS
INSERT INTO video_kelas (id, judul, deskripsi, url_video, thumbnail, tanggal) VALUES
(1, 'Takziah Ayah Intan', 'Doa bersama untuk ayah intan...', 'video_1787385509_323.mp4', 'thumb_1787385536_389.jpeg', '2026-07-24'),
(2, 'Lomba Dekor Kelas', 'Mendekor kelas bersama tapi makan dulu hahaha', 'video_1787385653_938.mp4', 'thumb_1787385653_720.jpeg', '2026-08-15')
ON CONFLICT (id) DO NOTHING;

-- 10. MUSIC PLAYLIST
INSERT INTO music_playlist (id, judul, artis, file_name, urutan, aktif) VALUES
(1, 'Somebody''s Pleasure', 'Aziz Hendra', 'somebodys_pleasure.mp3', 1, true),
(2, 'Malu-Malu', 'V1RST', 'malu_malu.mp3', 2, true),
(3, 'Bersenjagurau', 'Raim Laode', 'bersenjagurau.mp3', 3, true),
(4, 'LANY', 'LANY', 'lany.mp3', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Selesai!
