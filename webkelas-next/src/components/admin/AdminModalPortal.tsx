'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AdminModalPortalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  zIndex?: string;
  backdropClass?: string;
}

export default function AdminModalPortal({
  isOpen,
  onClose,
  children,
  zIndex = 'z-50',
  backdropClass = 'bg-slate-900/50 backdrop-blur-sm'
}: AdminModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-y-0 right-0 left-0 lg:left-64 ${zIndex} ${backdropClass} flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200`}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {children}
    </div>,
    document.body
  );
}
