-- SQL Update Script for Structure Table
-- Run this in phpMyAdmin to add new fields for detailed profiles

USE `webkelas_pplg3`;

-- Add new columns to structure table
ALTER TABLE `structure` 
ADD COLUMN `expertise` VARCHAR(255) DEFAULT NULL AFTER `photo`,
ADD COLUMN `description` TEXT DEFAULT NULL AFTER `expertise`,
ADD COLUMN `message` TEXT DEFAULT NULL AFTER `description`,
ADD COLUMN `year` VARCHAR(50) DEFAULT '2025 - 2026' AFTER `message`,
ADD COLUMN `subject` VARCHAR(255) DEFAULT 'PPLG (Software Engineering)' AFTER `year`,
ADD COLUMN `motto` VARCHAR(255) DEFAULT 'Code Your Dreams' AFTER `subject`;

-- Update existing data with sample information
UPDATE `structure` SET 
    expertise = 'Ahli Bahasa Sunda',
    description = 'Beliau adalah wali kelas X PPLG 3 yang berdedikasi tinggi dalam membimbing siswa-siswanya. Dengan latar belakang pendidikan Bahasa Sunda, Pak Firman selalu mendorong kami untuk menjadi inovator muda di bidang teknologi.',
    message = 'Teruslah belajar dan jangan pernah menyerah. Teknologi adalah masa depan, dan kalian adalah pembangun masa depan itu. Jadilah programmer yang tidak hanya pandai coding, tetapi juga memiliki karakter yang baik.',
    year = '2025 - 2026',
    subject = 'Bahasa Sunda',
    motto = 'Silih Asah, Silih Asih, Silih Asuh'
WHERE role = 'Wali Kelas';

UPDATE `structure` SET 
    expertise = 'Leadership & Management',
    description = 'Ketua kelas yang bertanggung jawab memimpin dan mengkoordinasikan seluruh kegiatan kelas. Memiliki jiwa kepemimpinan yang kuat dan selalu siap membantu teman-teman.',
    message = 'Mari kita bersama-sama membangun kelas yang solid dan kompak. Setiap masalah pasti ada solusinya jika kita bekerja sama dengan baik.',
    year = '2025 - 2026',
    subject = 'PPLG (Software Engineering)',
    motto = 'Together We Achieve More'
WHERE role = 'Ketua Kelas';

UPDATE `structure` SET 
    expertise = 'Organization & Coordination',
    description = 'Wakil ketua kelas yang siap mendukung ketua dalam menjalankan tugas dan tanggung jawab. Aktif dalam mengkoordinasikan kegiatan kelas.',
    message = 'Kita adalah tim yang hebat. Mari saling mendukung dan membantu satu sama lain untuk mencapai tujuan bersama.',
    year = '2025 - 2026',
    subject = 'PPLG (Software Engineering)',
    motto = 'Unity in Diversity'
WHERE role = 'Wakil Ketua';

UPDATE `structure` SET 
    expertise = 'Documentation & Administration',
    description = 'Sekretaris kelas yang bertanggung jawab mencatat dan mendokumentasikan seluruh kegiatan kelas dengan rapi dan terorganisir.',
    message = 'Dokumentasi yang baik adalah kunci kesuksesan organisasi. Mari kita jaga catatan kelas kita dengan baik.',
    year = '2025 - 2026',
    subject = 'PPLG (Software Engineering)',
    motto = 'Detail Matters'
WHERE role LIKE 'Sekretaris%';

UPDATE `structure` SET 
    expertise = 'Financial Management',
    description = 'Bendahara kelas yang mengelola keuangan kelas dengan transparan dan bertanggung jawab. Memastikan setiap pengeluaran tercatat dengan baik.',
    message = 'Kejujuran dan transparansi adalah kunci dalam mengelola keuangan. Mari kita jaga kepercayaan bersama.',
    year = '2025 - 2026',
    subject = 'PPLG (Software Engineering)',
    motto = 'Trust Through Transparency'
WHERE role LIKE 'Bendahara%';

UPDATE `structure` SET 
    expertise = 'Media & Documentation',
    description = 'Bertanggung jawab atas publikasi, dekorasi, dan dokumentasi seluruh kegiatan kelas. Memastikan setiap momen berharga terabadikan dengan baik.',
    message = 'Setiap momen adalah cerita. Mari kita abadikan perjalanan kita bersama dengan dokumentasi yang kreatif dan bermakna.',
    year = '2025 - 2026',
    subject = 'PPLG (Software Engineering)',
    motto = 'Capture The Moment'
WHERE role = 'PDD';

-- Show updated structure
SELECT * FROM `structure` ORDER BY `order_num` ASC;
