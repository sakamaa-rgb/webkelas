import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'XI PPLG 3 - SMK Penerbangan Bogor | Official Class Web',
  description: 'Website resmi kelas XI Pengembangan Perangkat Lunak dan Gim (PPLG) 3 - SMK Penerbangan Bogor. Berinovasi, solid, dan berprestasi.',
  keywords: ['XI PPLG 3', 'PPLG', 'SMK Penerbangan Bogor', 'Web Kelas', 'Software Engineering'],
  authors: [{ name: 'Siswa XI PPLG 3' }],
  icons: {
    icon: '/assets/uploads/logo/logo_1787282041.jpeg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-600 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
