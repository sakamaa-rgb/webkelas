'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Code2, Sparkles } from 'lucide-react';
import { initialProjects } from '@/data/seedData';
import { Project } from '@/types/database';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    const loadProjects = () => {
      const saved = localStorage.getItem('class_projects_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setProjects(initialProjects);
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);
    window.addEventListener('class_projects_updated', loadProjects);
    return () => {
      window.removeEventListener('storage', loadProjects);
      window.removeEventListener('class_projects_updated', loadProjects);
    };
  }, []);

  // Ordered descending by ID as in the original PHP site: SELECT * FROM projects ORDER BY id DESC
  const sortedProjects = [...projects].sort((a, b) => b.id - a.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-3">
          <Code2 className="w-3.5 h-3.5" />
          <span>Karya & Inovasi Digital</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Project <span className="text-blue-600">Kami</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500">
          Koleksi proyek yang sedang dan telah dikerjakan oleh siswa XI PPLG 3 SMK Penerbangan Bogor.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-16">
        {sortedProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group block rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            {/* Image Container with Badge and Hover Overlay */}
            <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
              <img
                src={project.image || '/assets/uploads/projects/default.png'}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Blue "PROJECT" pill on top left */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  PROJECT
                </span>
                {project.featured && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Unggulan
                  </span>
                )}
              </div>

              {/* Hover Overlay with Eye Icon */}
              <div className="absolute inset-0 bg-blue-600/75 flex flex-col items-center justify-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <Eye className="w-7 h-7" />
                <span className="text-sm font-semibold">Lihat Detail</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>
              </div>

              {/* Tech stack badges */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {project.tech_stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
