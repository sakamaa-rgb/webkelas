'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialContact } from '@/data/seedData';
import { getContactInfo } from '@/lib/supabase/dataService';


export interface ClassProfile {
  className: string;
  schoolName: string;
  tagline: string;
  year: string;
  description: string;
  logo: string;
}

export interface ClassContact {
  instagram: string;
  whatsapp: string;
  email: string;
  tiktok: string;
  address: string;
}

export const defaultClassProfile: ClassProfile = {
  className: 'XI PPLG 3',
  schoolName: 'SMK Penerbangan Bogor',
  tagline: 'Unggul dalam Teknologi, Kreatif dalam Inovasi & Bersatu',
  year: '2026 / 2027',
  description: 'Portal web resmi kelas XI PPLG 3 SMK Penerbangan Bogor sebagai wadah karya, portofolio digital, dan dokumentasi kebersamaan siswa.',
  logo: initialContact.logo || '/assets/uploads/logo/logo_1787282041.jpeg'
};

export const defaultClassContact: ClassContact = {
  instagram: initialContact.instagram || '@xpplg.3rd',
  whatsapp: initialContact.whatsapp || '6281294862060',
  email: initialContact.email || 'classxpplg3@gmail.com',
  tiktok: '@xipplg3.official',
  address: 'SMK Penerbangan Bogor, Jl. Raya Sukabumi No. 12, Kota Bogor'
};

interface ClassProfileContextType {
  profile: ClassProfile;
  contact: ClassContact;
  updateProfile: (newProfile: Partial<ClassProfile>) => void;
  updateContact: (newContact: Partial<ClassContact>) => void;
}

const ClassProfileContext = createContext<ClassProfileContextType>({
  profile: defaultClassProfile,
  contact: defaultClassContact,
  updateProfile: () => {},
  updateContact: () => {}
});

export function ClassProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ClassProfile>(defaultClassProfile);
  const [contact, setContact] = useState<ClassContact>(defaultClassContact);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedProfile = localStorage.getItem('class_web_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
        const savedContact = localStorage.getItem('class_web_contact');
        if (savedContact) {
          const parsed = JSON.parse(savedContact);
          setContact((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadFromStorage();

    // Live sync from Supabase cloud database
    getContactInfo().then((info) => {
      if (info) {
        setProfile((prev) => ({
          ...prev,
          className: info.class_name || prev.className,
          schoolName: info.school_name || prev.schoolName,
          tagline: info.tagline || prev.tagline,
          year: info.year || prev.year,
          description: info.description || prev.description,
          logo: info.logo || prev.logo
        }));
        setContact((prev) => ({
          ...prev,
          instagram: info.instagram || prev.instagram,
          whatsapp: info.whatsapp || prev.whatsapp,
          email: info.email || prev.email,
          tiktok: info.tiktok || prev.tiktok,
          address: info.address || prev.address
        }));
      }
    });

    const handleProfileUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener('storage', handleProfileUpdate);
    window.addEventListener('class_profile_updated', handleProfileUpdate);


    return () => {
      window.removeEventListener('storage', handleProfileUpdate);
      window.removeEventListener('class_profile_updated', handleProfileUpdate);
    };
  }, []);

  const updateProfile = (newProfile: Partial<ClassProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem('class_web_profile', JSON.stringify(updated));
        window.dispatchEvent(new Event('class_profile_updated'));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const updateContact = (newContact: Partial<ClassContact>) => {
    setContact((prev) => {
      const updated = { ...prev, ...newContact };
      try {
        localStorage.setItem('class_web_contact', JSON.stringify(updated));
        window.dispatchEvent(new Event('class_profile_updated'));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  return (
    <ClassProfileContext.Provider value={{ profile, contact, updateProfile, updateContact }}>
      {children}
    </ClassProfileContext.Provider>
  );
}

export function useClassProfile() {
  return useContext(ClassProfileContext);
}
