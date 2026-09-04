-- Database dump for phpMyAdmin
-- Generated from localhost live database
-- Compatible with localhost and Shared Hosting (InfinityFree, cPanel, etc.)

-- ============================================
-- TABLE: users
-- ============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `password`) VALUES
('1', 'adminPPLG3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ============================================
-- TABLE: structure
-- ============================================
DROP TABLE IF EXISTS `structure`;
CREATE TABLE `structure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT '',
  `expertise` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `year` varchar(50) DEFAULT '2025 - 2026',
  `subject` varchar(255) DEFAULT 'PPLG (Software Engineering)',
  `motto` varchar(255) DEFAULT 'Code Your Dreams',
  `order_num` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `structure` (`id`, `role`, `name`, `photo`, `expertise`, `description`, `message`, `year`, `subject`, `motto`, `order_num`) VALUES
('1', 'Wali Kelas', 'Mutia Oktavia S,Pd', 'struct_1_1787281004.jpeg', 'Bahasa Indonesia', 'Bu Mutia Oktavia Adalah seorang guru bahasa indonesia di kelas 11 sekaligus walikelas xi pplg 3 juga.', 'Teruslah belajar,semangat dan pantang menyerah!!', '2026 - 2027', 'Bahasa Indonesia', 'Teks prosedur', '1'),
('2', 'Ketua Kelas', 'Revand Aqilla Al Hafiz', 'struct_2_1787281208.jpeg', 'Leadership & Management', 'Ketua kelas yang bertanggung jawab memimpin dan mengkoordinasikan seluruh kegiatan kelas. Memiliki jiwa kepemimpinan yang kuat dan selalu siap membantu teman-teman.', 'Mari kita bersama-sama membangun kelas yang solid dan kompak. Setiap masalah pasti ada solusinya jika kita bekerja sama dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Together We Achieve More', '2'),
('3', 'Wakil Ketua', 'Niko Keandre Adinata', 'struct_3_1787281713.jpg', 'Organization & Coordination', 'Wakil ketua kelas yang siap mendukung ketua dalam menjalankan tugas dan tanggung jawab. Aktif dalam mengkoordinasikan kegiatan kelas.', 'Kita adalah tim yang hebat. Mari saling mendukung dan membantu satu sama lain untuk mencapai tujuan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Unity in Diversity', '3'),
('4', 'Sekretaris 1', 'Khaira Putri Madani', 'struct_4_1787281474.jpg', 'Documentation & Administration', 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.', 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Detail Matters', '4'),
('5', 'Sekretaris 2', 'Asyifa', 'struct_5_1787281787.jpg', 'Documentation & Administration', 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.', 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.', '2026 - 2027', 'PPLG (Software Engineering)', 'Detail Matters', '5'),
('6', 'Bendahara 1', 'Lulu Maulida', 'struct_6_1787281138.jpeg', 'Financial Management', 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.', 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Trust Through Transparency', '6'),
('7', 'Bendahara 2', 'Habib Ramadhan', 'struct_7_1787281857.jpeg', 'Financial Management', 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.', 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.', '2026 - 2027', 'PPLG (Software Engineering)', 'Trust Through Transparency', '7'),
('8', 'PDD', 'Rajib Zahir', 'struct_8_1787301394.jpeg', 'Media & Documentation', 'Bertanggung jawab atas publikasi, dekorasi, dan dokumentasi seluruh kegiatan kelas. Memastikan setiap momen berharga terabadikan dengan baik.', 'Setiap momen adalah cerita. Mari kita abadikan perjalanan kita bersama dengan dokumentasi yang kreatif dan bermakna.', '2025 - 2026', 'PPLG (Software Engineering)', 'Capture The Moment', '8');

-- ============================================
-- TABLE: students
-- ============================================
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `kelas` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `portfolio_link` varchar(255) DEFAULT NULL,
  `github_link` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `students` (`id`, `name`, `photo`, `nisn`, `kelas`, `email`, `password`, `portfolio_link`, `github_link`, `reset_token`, `reset_expires`) VALUES
('001', 'Abyan Alfarizi', 'student_001_1778723200.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('002', 'Aisyah Chyntia Devantara', 'student_002_1778723298.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('003', 'Alivia Cahaya Lukmana', 'student_003_1778723345.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('004', 'Andini Novriani', 'student_004_1778723416.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('005', 'Asyifa Nurmaulidya', 'student_005_1778723423.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('006', 'Bagus Pambudi Priyambodo', 'student_006_1778722684.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('007', 'Bramantyo Arsya Wijaya', 'student_007_1778723484.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('008', 'Crisna Juliana', 'student_008_1778723491.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('009', 'Davin Alfarrel Nasrullah', 'student_009_1778723551.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('010', 'Dema Arya Ramadhan', 'student_010_1778723559.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('011', 'Faneza Putri', 'student_012_1778722700.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('012', 'Faris Ahmad Ghaisan', 'student_013_1778723735.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('013', 'Habib Ramadhan', 'student_014_1778723793.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('014', 'Ilham Muhamad Fahri', 'student_015_1778723801.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('015', 'Intan Nuraeni', 'student_016_1778723850.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('016', 'Khaira Putri Madani', 'student_017_1778723931.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('017', 'Lulu Maulida', 'student_018_1778723939.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('018', 'Maisie Anzala Maramis', 'student_019_1778724013.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019', 'Muhamad Aditya Saputra', 'student_020_1778722877.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('020', 'Muhamad Anzas Adzahri', 'student_021_1778724003.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('021', 'Muhammad Alif Fatir Sya\'bani', 'student_022_1778724221.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('022', 'Muhammad Candra Kusuma', 'student_023_1778724280.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('023', 'Muhammad Hafiyz Nurhidayah', 'student_024_1778724326.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('024', 'Muhammad Noval Adil Adha', 'student_025_1778724316.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('025', 'Muhammad Rajib Zahir', 'student_026_1778724212.png', '2345678', 'XI PPLG 3', 'rajibjugi02@gmail.com', '$2y$10$9JddqwXnTpfKVcv85GbvfuIX5Q/WoznE4zRxBc5qYaDQcHeH/Nou.', '', 'https://github.com/rajibjugi02-ctrl/SMK-PENERBANGAN-BOGOR', 'f11df94671d60a684e7fc5171f64ee6b879d6fd1ca7cde1974e9e2e48a0d33fa', '2026-05-15 05:16:21'),
('026', 'Muhammad Refan Abiena Wafa', 'student_027_1778724399.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('027', 'Mutia Khamelia', 'student_028_1778725011.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('028', 'Nadine Shahmina', 'student_029_1778722718.jpeg', '0109463616', 'XI PPLG 3', 'nadineeshahminaa@gmail.com', '$2y$10$4aiCYZs/j8DS371SJuW2GOQTehj1.PwA1h7fLZmcTXOX9hRdddIdG', NULL, NULL, NULL, NULL),
('029', 'Nazhril Rizky Alfiansyah', 'student_030_1778725003.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('030', 'Niko Keandre Adinata', 'student_031_1778724994.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('031', 'Nur Syifa Fauziah', 'student_032_1778724971.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('032', 'Oktavia Indriani', 'student_033_1778724961.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('033', 'Rafi Udin', 'student_034_1778725126.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('034', 'Rafli', 'student_035_1778812776.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('035', 'Ranty Dwi Oktavia', 'student_036_1778725224.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('036', 'Reisya Auliaul Jannah', 'student_037_1778725213.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('037', 'Restu Alfarizhi', 'student_038_1778725204.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('038', 'Revand Aqila Al Hafiz', 'student_039_1778725285.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('039', 'Rizky Maulana', 'student_040_1778725293.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('040', 'Salsabila Azzahra', 'student_041_1778722842.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('041', 'Siti Ainun', 'student_042_1778725434.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('042', 'Siti Salwa Aulia', 'student_043_1778725375.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('043', 'Sulthan Azzam Rizqullah', 'student_044_1778725527.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('044', 'Taruna Jayalaksana Suwarman', 'student_045_1778725535.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('045', 'Nurul Nabilla Arti', 'student_045_nurul.png', NULL, 'XI PPLG 3', NULL, NULL, NULL, NULL, NULL, NULL);

-- ============================================
-- TABLE: visitors
-- ============================================
DROP TABLE IF EXISTS `visitors`;
CREATE TABLE `visitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `kelas` varchar(50) NOT NULL,
  `last_login` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `visitors` (`id`, `name`, `kelas`, `last_login`) VALUES
('1', 'siti maisaroh', 'x pplg 4', '2026-05-15 09:20:18'),
('2', 'zhirrbam', 'X PPLG 3', '2026-05-15 09:32:39'),
('3', 'Rafli', 'X PPLG 3', '2026-05-15 10:17:50'),
('4', 'susi', 'x pplg 5', '2026-05-15 10:26:10'),
('5', 'masasih', 'x bc 3', '2026-05-15 17:25:49'),
('6', 'zhirrbam', 'x to 2', '2026-05-15 23:39:21'),
('7', 'nadine jelek', 'xi farmasi 4', '2026-08-21 10:47:31'),
('8', 'murid40', 'xi farmasi 4', '2026-08-21 17:36:27');

-- ============================================
-- TABLE: activity_logs
-- ============================================
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` enum('admin','student','visitor') NOT NULL,
  `user_identifier` varchar(100) NOT NULL,
  `action` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `activity_logs` (`id`, `user_type`, `user_identifier`, `action`, `created_at`) VALUES
('1', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 08:56:16'),
('2', 'student', 'Muhammad Rajib Zahir', 'Updated profile biodata', '2026-05-15 08:57:39'),
('3', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 08:59:49'),
('4', 'visitor', 'siti maisaroh (x pplg 4)', 'Logged in to website', '2026-05-15 09:20:18'),
('5', 'visitor', 'siti maisaroh (x pplg 4)', 'Logged out', '2026-05-15 09:31:00'),
('6', 'visitor', 'zhirrbam (X PPLG 3)', 'Logged in to website', '2026-05-15 09:32:39'),
('7', 'visitor', 'zhirrbam (X PPLG 3)', 'Logged out', '2026-05-15 09:32:48'),
('8', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 09:33:03'),
('9', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 09:33:14'),
('10', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 09:33:30'),
('11', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 09:33:36'),
('12', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 09:50:47'),
('13', 'visitor', 'Rafli (X PPLG 3)', 'Logged in to website', '2026-05-15 09:50:58'),
('14', 'visitor', 'Rafli', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 09:51:03'),
('15', 'visitor', 'Rafli (X PPLG 3)', 'Logged out', '2026-05-15 09:52:11'),
('16', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 09:54:53'),
('17', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 09:57:02'),
('18', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:00:19'),
('19', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 10:05:46'),
('20', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 10:05:48'),
('21', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 10:05:57'),
('22', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 10:14:25'),
('23', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:17:35'),
('24', 'visitor', 'Rafli (X PPLG 3)', 'Logged in to website', '2026-05-15 10:17:50'),
('25', 'visitor', 'Rafli', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:17:54'),
('26', 'visitor', 'Rafli (X PPLG 3)', 'Logged out', '2026-05-15 10:18:09'),
('27', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 10:18:48'),
('28', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:18:56'),
('29', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:19:31'),
('30', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:23:22'),
('31', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 10:23:31'),
('32', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 10:23:59'),
('33', 'visitor', 'Unknown', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 10:25:03'),
('34', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 10:25:27'),
('35', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 10:25:43'),
('36', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:25:49'),
('37', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 10:26:00'),
('38', 'visitor', 'susi (x pplg 5)', 'Logged in to website', '2026-05-15 10:26:10'),
('39', 'visitor', 'susi', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 10:26:16'),
('40', 'visitor', 'susi', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 10:26:47'),
('41', 'visitor', 'susi (x pplg 5)', 'Logged out', '2026-05-15 10:26:57'),
('42', 'visitor', 'Unknown', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 16:33:40'),
('43', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 16:35:34'),
('44', 'visitor', 'Unknown', 'Membuka detail project: Radar Organisasi Dan Aspirasi', '2026-05-15 17:16:36'),
('45', 'visitor', 'Unknown', 'Membuka detail project: Radar Organisasi Dan Aspirasi', '2026-05-15 17:16:44'),
('46', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 17:24:14'),
('47', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 17:25:07'),
('48', 'visitor', 'Unknown', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 17:25:07'),
('49', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 17:25:12'),
('50', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 17:25:27'),
('51', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 17:25:39'),
('52', 'visitor', 'masasih (x bc 3)', 'Logged in to website', '2026-05-15 17:25:49'),
('53', 'visitor', 'masasih', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 17:25:54'),
('54', 'visitor', 'masasih (x bc 3)', 'Logged out', '2026-05-15 17:25:55'),
('55', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 17:28:37'),
('56', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 18:07:28'),
('57', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 18:07:42'),
('58', 'student', 'Muhammad Rajib Zahir', 'Logged in to Student Portal', '2026-05-15 23:32:28'),
('59', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 23:32:50'),
('60', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Perpustakaan PGRI 3', '2026-05-15 23:38:58'),
('61', 'student', 'Muhammad Rajib Zahir', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 23:39:03'),
('62', 'student', 'Muhammad Rajib Zahir', 'Logged out', '2026-05-15 23:39:10'),
('63', 'visitor', 'zhirrbam (x to 2)', 'Logged in to website', '2026-05-15 23:39:21'),
('64', 'visitor', 'zhirrbam', 'Membuka detail project: Tadika Anak It Al Muhajirin', '2026-05-15 23:39:29'),
('65', 'visitor', 'zhirrbam (x to 2)', 'Logged out', '2026-05-15 23:39:52'),
('66', 'student', 'Nadine Shahmina', 'Logged in to Student Portal', '2026-08-21 10:25:56'),
('67', 'student', 'Nadine Shahmina', 'Logged out', '2026-08-21 10:26:14'),
('68', 'student', 'Nadine Shahmina', 'Logged in to Student Portal', '2026-08-21 10:32:03'),
('69', 'student', 'Nadine Shahmina', 'Logged out', '2026-08-21 10:34:38'),
('70', 'student', 'Nadine Shahmina', 'Logged in to Student Portal', '2026-08-21 10:43:35'),
('71', 'student', 'Nadine Shahmina', 'Logged out', '2026-08-21 10:47:01'),
('72', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-08-21 10:47:04'),
('73', 'visitor', 'nadine jelek (xi farmasi 4)', 'Logged in to website', '2026-08-21 10:47:31'),
('74', 'visitor', 'nadine jelek', 'Membuka detail project: Perpustakaan PGRI 3', '2026-08-21 10:47:34'),
('75', 'visitor', 'nadine jelek (xi farmasi 4)', 'Logged out', '2026-08-21 10:47:58'),
('76', 'student', 'Nadine Shahmina', 'Logged in to Student Portal', '2026-08-21 15:04:23'),
('77', 'student', 'Nadine Shahmina', 'Logged out', '2026-08-21 15:06:46'),
('78', 'visitor', 'Unknown', 'Membuka detail project: Perpustakaan PGRI 3', '2026-08-21 17:35:21'),
('79', 'visitor', 'murid40 (xi farmasi 4)', 'Logged in to website', '2026-08-21 17:36:27'),
('80', 'visitor', 'murid40', 'Membuka detail project: Perpustakaan PGRI 3', '2026-08-21 17:36:31'),
('81', 'visitor', 'murid40 (xi farmasi 4)', 'Logged out', '2026-08-21 17:36:41');

-- ============================================
-- TABLE: gallery
-- ============================================
DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `gallery` (`id`, `image`, `caption`) VALUES
('2', 'gallery_1778720190_0.jpeg', 'Petugas Upacara 2026'),
('3', 'gallery_1778720397_0.jpeg', 'Maulid Nabi 2025'),
('4', 'gallery_1778720615_0.jpeg', 'Hari Guru 2025'),
('6', 'gallery_1778843741_0.jpeg', 'Foto Bersama Sebelum Puasa 2026'),
('8', 'gallery_1778843912_0.jpeg', 'X PPLG 3 Meraih Juara 1 Fashion Show Di Hari Kartini 2026'),
('9', 'gallery_1787384210_0.jpeg', 'Upacara 17 Agustus 2026'),
('10', 'gallery_1787384334_0.jpeg', 'Takziah Ayah Intan');

-- ============================================
-- TABLE: projects
-- ============================================
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT '',
  `link` varchar(255) DEFAULT '',
  `makers` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `projects` (`id`, `title`, `description`, `image`, `link`, `makers`) VALUES
('1', 'Radar Organisasi Dan Aspirasi', 'Website ini sebuah website roa atau radar organisasi dan aspirasi dari SMK PENERBANGAN BOGOR', 'project_1778720947.png', 'https://roangkasa.infinityfree.me/index.php', 'Don Matteu Abie Wewengkang , Muhammad Rajib Zahir , Nadine Shahmina'),
('2', 'Perpustakaan PGRI 3', 'Sebuah webiste perpustakaan pgri 3 yg di buat oleh kelompok davin x pplg 3, website ini bisa digunakan untuk peminjaman', 'project_1778721629.png', 'https://perpuspgri3.online/', 'Dema Arya Ramadhan , Davin Alfarel Nasrullah'),
('3', 'Tadika Anak It Al Muhajirin', 'Website kami di gunakan sebagai sarana informasi dan komunikasi antara orang tua murid dan pihak sekolah mengenai pertumbuhan anak dan lain lain.', 'project_1778724529.png', 'https://tadikakanakitalmuhajirin.my.id/', NULL);

-- ============================================
-- TABLE: project_comments
-- ============================================
DROP TABLE IF EXISTS `project_comments`;
CREATE TABLE `project_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `project_comments` (`id`, `project_id`, `user_name`, `comment`, `parent_id`, `is_visible`, `created_at`) VALUES
('1', '2', 'rajib', 'wih keren websitenya', NULL, '1', '2026-05-14 16:02:06'),
('2', '3', 'anjas', 'mungkin di webiste ini saya kasih rekomendasi misal BLA BLA BLA', NULL, '0', '2026-05-14 17:03:28'),
('3', '3', 'davin', 'iya terimakasih sarannya', '2', '1', '2026-05-14 17:04:13'),
('4', '2', 'Admin PPLG 3', 'Bangga punya kelas yg bisa membuat project sebagus ini', NULL, '1', '2026-05-15 10:05:35'),
('6', '2', 'Muhammad Rajib Zahir', 'iyakan min gila keren bangett', '4', '1', '2026-05-15 10:19:21'),
('9', '3', 'Admin PPLG 3', 'semangat lagi buat menampilkan website yg keren!!', NULL, '1', '2026-05-15 23:31:44'),
('10', '3', 'Muhammad Rajib Zahir', 'WOHOOOO!!', '9', '1', '2026-05-15 23:33:00'),
('11', '3', 'zhirrbam', 'lau sape mpruy?', '10', '0', '2026-05-15 23:39:41'),
('12', '2', 'nadine jelek', 'NADINE KAMUU TIDAK KERJA SAT UJI LEVEL', NULL, '0', '2026-08-21 10:47:51'),
('13', '2', 'murid40', 'sakabshdvvqkdv', NULL, '1', '2026-08-21 17:36:36');

-- ============================================
-- TABLE: contact
-- ============================================
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `instagram` varchar(255) DEFAULT '',
  `whatsapp` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `logo` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `contact` (`id`, `instagram`, `whatsapp`, `email`, `logo`) VALUES
('1', '@xpplg.3rd', '6281294862060', 'classxpplg3@gmail.com', 'logo_1787282041.jpeg');

-- ============================================
-- TABLE: jadwal_piket
-- ============================================
DROP TABLE IF EXISTS `jadwal_piket`;
CREATE TABLE `jadwal_piket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hari` varchar(20) NOT NULL,
  `nama_siswa` varchar(100) NOT NULL,
  `urutan` int(11) DEFAULT 1,
  `pj` varchar(100) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jadwal_piket` (`id`, `hari`, `nama_siswa`, `urutan`, `pj`, `created_at`) VALUES
('1', 'Senin', 'Aisyah', '1', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('2', 'Senin', 'Intan', '2', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('3', 'Senin', 'Nadine', '3', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('4', 'Senin', 'Salsa', '4', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('5', 'Senin', 'Abyan', '5', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('6', 'Senin', 'Dema', '6', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('7', 'Senin', 'Anzas', '7', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('8', 'Senin', 'Rajib', '8', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('9', 'Senin', 'Restu', '9', 'Alivia & Ainun', '2026-08-22 14:50:47'),
('10', 'Selasa', 'Alivia', '1', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('11', 'Selasa', 'Khaira', '2', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('12', 'Selasa', 'Nursyifa', '3', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('13', 'Selasa', 'Ainun', '4', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('14', 'Selasa', 'Bagus', '5', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('15', 'Selasa', 'Faris', '6', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('16', 'Selasa', 'Alif', '7', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('17', 'Selasa', 'Refan', '8', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('18', 'Selasa', 'Revand', '9', 'Lulu & Oktavia', '2026-08-22 14:50:47'),
('19', 'Rabu', 'Andini', '1', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('20', 'Rabu', 'Lulu', '2', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('21', 'Rabu', 'Oktavia', '3', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('22', 'Rabu', 'Salwa', '4', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('23', 'Rabu', 'Bramantyo', '5', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('24', 'Rabu', 'Habib', '6', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('25', 'Rabu', 'Candra', '7', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('26', 'Rabu', 'Raffi Udin', '8', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('27', 'Rabu', 'Rizky', '9', 'Asyifa & Ranty', '2026-08-22 14:50:47'),
('28', 'Kamis', 'Asyifa', '1', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('29', 'Kamis', 'Maisi', '2', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('30', 'Kamis', 'Ranty', '3', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('31', 'Kamis', 'Nurul', '4', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('32', 'Kamis', 'Crisna', '5', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('33', 'Kamis', 'Ilham', '6', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('34', 'Kamis', 'Hafiyz', '7', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('35', 'Kamis', 'Nazhril', '8', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('36', 'Kamis', 'Azzam', '9', 'Fanezza & Reisya', '2026-08-22 14:50:47'),
('37', 'Jumat', 'Faneza', '1', 'Intan & Nadine', '2026-08-22 14:50:47'),
('38', 'Jumat', 'Mutia', '2', 'Intan & Nadine', '2026-08-22 14:50:47'),
('39', 'Jumat', 'Reisya', '3', 'Intan & Nadine', '2026-08-22 14:50:47'),
('40', 'Jumat', 'M. Aditya', '4', 'Intan & Nadine', '2026-08-22 14:50:47'),
('41', 'Jumat', 'Davin', '5', 'Intan & Nadine', '2026-08-22 14:50:47'),
('42', 'Jumat', 'Noval', '6', 'Intan & Nadine', '2026-08-22 14:50:47'),
('43', 'Jumat', 'Rafli', '7', 'Intan & Nadine', '2026-08-22 14:50:47'),
('44', 'Jumat', 'Taruna', '8', 'Intan & Nadine', '2026-08-22 14:50:47'),
('45', 'Jumat', 'Niko', '9', 'Intan & Nadine', '2026-08-22 14:50:47');

-- ============================================
-- TABLE: jadwal_pelajaran
-- ============================================
DROP TABLE IF EXISTS `jadwal_pelajaran`;
CREATE TABLE `jadwal_pelajaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hari` varchar(20) NOT NULL,
  `jam_mulai` varchar(10) NOT NULL,
  `jam_selesai` varchar(10) NOT NULL,
  `mata_pelajaran` varchar(100) NOT NULL,
  `guru` varchar(100) DEFAULT '',
  `urutan` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jadwal_pelajaran` (`id`, `hari`, `jam_mulai`, `jam_selesai`, `mata_pelajaran`, `guru`, `urutan`, `created_at`) VALUES
('1', 'Senin', '07.30', '08.50', 'SEJARAH', 'BU RINA', '1', '2026-08-22 14:50:47'),
('2', 'Senin', '08.50', '09.30', 'PPKN', 'PA MAMAN', '2', '2026-08-22 14:50:47'),
('3', 'Senin', '09.30', '10.00', 'ISTIRAHAT', '-', '3', '2026-08-22 14:50:47'),
('4', 'Senin', '10.00', '10.40', 'PPKN', 'PA MAMAN', '4', '2026-08-22 14:50:47'),
('5', 'Senin', '10.40', '12.00', 'PPLG/PRODUKTIF', 'BU DIAH', '5', '2026-08-22 14:50:47'),
('6', 'Senin', '12.00', '13.00', 'ISTIRAHAT', '-', '6', '2026-08-22 14:50:47'),
('7', 'Senin', '13.00', '15.00', 'PPLG/PRODUKTIF', 'BU DELIKA', '7', '2026-08-22 14:50:47'),
('8', 'Selasa', '07.30', '08.50', 'BISNIS DIGITAL', 'PA DIDIN', '1', '2026-08-22 14:50:47'),
('9', 'Selasa', '08.50', '09.30', 'BAHASA INGGRIS', 'MIS. SUCI', '2', '2026-08-22 14:50:47'),
('10', 'Selasa', '09.30', '10.00', 'ISTIRAHAT', '-', '3', '2026-08-22 14:50:47'),
('11', 'Selasa', '10.00', '10.40', 'BAHASA INGGRIS', 'MIS. SUCI', '4', '2026-08-22 14:50:47'),
('12', 'Selasa', '10.40', '12.00', 'MATEMATIKA', 'BU DESI', '5', '2026-08-22 14:50:47'),
('13', 'Selasa', '12.00', '13.00', 'ISTIRAHAT', '-', '6', '2026-08-22 14:50:47'),
('14', 'Selasa', '13.00', '13.40', 'MATEMATIKA', 'BU DESI', '7', '2026-08-22 14:50:47'),
('15', 'Selasa', '13.40', '15.00', 'BAHASA INGGRIS', 'MIS. SUCI', '8', '2026-08-22 14:50:47'),
('16', 'Rabu', '07.30', '09.30', 'PAI', 'PA RAHMAT', '1', '2026-08-22 14:50:47'),
('17', 'Rabu', '09.30', '10.00', 'ISTIRAHAT', '-', '2', '2026-08-22 14:50:47'),
('18', 'Rabu', '10.00', '12.00', 'PPLG/PRODUKTIF', 'BU DIAH', '3', '2026-08-22 14:50:47'),
('19', 'Rabu', '12.00', '13.00', 'ISTIRAHAT', '-', '4', '2026-08-22 14:50:47'),
('20', 'Rabu', '13.00', '15.00', 'PPLG/PRODUKTIF', 'PA DIDIN', '5', '2026-08-22 14:50:47'),
('21', 'Kamis', '07.30', '09.30', 'BAHASA INDONESIA', 'BU MITA', '1', '2026-08-22 14:50:47'),
('22', 'Kamis', '09.30', '10.00', 'ISTIRAHAT', '-', '2', '2026-08-22 14:50:47'),
('23', 'Kamis', '10.00', '11.00', 'PJOK', 'PA YUDHI', '3', '2026-08-22 14:50:47'),
('24', 'Kamis', '11.20', '12.00', 'KIK', 'PA WANDA', '4', '2026-08-22 14:50:47'),
('25', 'Kamis', '12.00', '13.00', 'ISTIRAHAT', '-', '5', '2026-08-22 14:50:47'),
('26', 'Kamis', '13.00', '15.00', 'KIK', 'PA WANDA', '6', '2026-08-22 14:50:47'),
('27', 'Jumat', '07.30', '08.10', 'KIK', 'PA WANDA', '1', '2026-08-22 14:50:47'),
('28', 'Jumat', '08.10', '09.30', 'PPLG/PRODUKTIF', 'BU DELIKA', '2', '2026-08-22 14:50:47'),
('29', 'Jumat', '09.30', '09.45', 'ISTIRAHAT', '-', '3', '2026-08-22 14:50:47'),
('30', 'Jumat', '09.45', '11.45', 'PPLG/PRODUKTIF', 'PA DIDIN', '4', '2026-08-22 14:50:47'),
('31', 'Jumat', '12.00', '13.00', 'ISHOMA/SHOLJUM', '-', '5', '2026-08-22 14:50:47');

-- ============================================
-- TABLE: video_kelas
-- ============================================
DROP TABLE IF EXISTS `video_kelas`;
CREATE TABLE `video_kelas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `url_video` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT '',
  `tanggal` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `video_kelas` (`id`, `judul`, `deskripsi`, `url_video`, `thumbnail`, `tanggal`, `created_at`) VALUES
('4', 'Takziah Ayah Intan', 'Doa bersama untuk ayah intan...', 'assets/uploads/videos/video_1787385509_323.mp4', 'thumb_1787385536_389.jpeg', '2026-07-24', '2026-08-22 14:58:29'),
('5', 'Lomba Dekor Kelas', 'Mendekor kelas bersama tapi makan dulu hahaha', 'assets/uploads/videos/video_1787385653_938.mp4', 'thumb_1787385653_720.jpeg', '2026-08-15', '2026-08-22 15:00:53');

-- ============================================
-- TABLE: music_playlist
-- ============================================
DROP TABLE IF EXISTS `music_playlist`;
CREATE TABLE `music_playlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `artis` varchar(255) DEFAULT '',
  `file_name` varchar(255) NOT NULL,
  `urutan` int(11) DEFAULT 0,
  `aktif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `music_playlist` (`id`, `judul`, `artis`, `file_name`, `urutan`, `aktif`) VALUES
('1', 'Somebody''s Pleasure', 'Aziz Hendra', 'somebodys_pleasure.mp3', 1, 1),
('2', 'Malu-Malu', 'V1RST', 'malu_malu.mp3', 2, 1),
('3', 'Bersenjagurau', 'Raim Laode', 'bersenjagurau.mp3', 3, 1),
('4', 'LANY', 'LANY', 'lany.mp3', 4, 1);

-- ============================================
-- TABLE: posters
-- ============================================
DROP TABLE IF EXISTS `posters`;
CREATE TABLE `posters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `event_name` varchar(255) DEFAULT '',
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `aktif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


