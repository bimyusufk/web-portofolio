import type { Locale } from "@/i18n/config";
import type { Metric, SkillGroupData } from "@/lib/types";

/**
 * Isi cadangan untuk bagian yang tidak boleh kosong.
 *
 * Dipakai hanya ketika dataset Sanity belum berisi dokumen terkait, sehingga
 * beranda tetap utuh sebelum migrasi dijalankan. Begitu dokumen asli ada di
 * Sanity, nilai di sini otomatis tidak terpakai.
 */

export const fallbackMetrics: Record<Locale, Metric[]> = {
  id: [
    { value: "4.500+", label: "Peserta terlayani pada platform Padjadjaran Career Expo" },
    { value: "9.696", label: "Sertifikat terbit otomatis lewat sistem Prabu Unpad 2024" },
    { value: "28", label: "Unit dan fakultas memakai sistem pemantauan audit SIPTL-UNRI" },
  ],
  en: [
    { value: "4,500+", label: "Participants served on the Padjadjaran Career Expo platform" },
    { value: "9,696", label: "Certificates issued automatically by the Prabu Unpad 2024 system" },
    { value: "28", label: "Units and faculties using the SIPTL-UNRI audit monitoring system" },
  ],
};

export const fallbackSkillGroups: Record<Locale, SkillGroupData[]> = {
  id: [
    {
      _id: "fallback-languages",
      category: "Bahasa Pemrograman",
      icon: "code",
      skills: ["TypeScript", "JavaScript", "Python", "PHP", "SQL"],
    },
    {
      _id: "fallback-frameworks",
      category: "Framework & Library",
      icon: "layers",
      skills: ["Next.js", "React", "Laravel", "Livewire", "Tailwind CSS", "Node.js"],
    },
    {
      _id: "fallback-data",
      category: "Basis Data & Perkakas",
      icon: "database",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "Prisma ORM", "Supabase", "Git"],
    },
    {
      _id: "fallback-ml",
      category: "Data & Machine Learning",
      icon: "brain",
      skills: ["PyTorch", "OpenCV", "Scikit-learn", "Pandas", "NumPy", "Streamlit"],
    },
    {
      _id: "fallback-soft",
      category: "Kepemimpinan",
      icon: "users",
      skills: ["Technical Leadership", "Manajemen Proyek", "Agile/Scrum", "Penulisan Teknis"],
    },
  ],
  en: [
    {
      _id: "fallback-languages",
      category: "Programming Languages",
      icon: "code",
      skills: ["TypeScript", "JavaScript", "Python", "PHP", "SQL"],
    },
    {
      _id: "fallback-frameworks",
      category: "Frameworks & Libraries",
      icon: "layers",
      skills: ["Next.js", "React", "Laravel", "Livewire", "Tailwind CSS", "Node.js"],
    },
    {
      _id: "fallback-data",
      category: "Databases & Tooling",
      icon: "database",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "Prisma ORM", "Supabase", "Git"],
    },
    {
      _id: "fallback-ml",
      category: "Data & Machine Learning",
      icon: "brain",
      skills: ["PyTorch", "OpenCV", "Scikit-learn", "Pandas", "NumPy", "Streamlit"],
    },
    {
      _id: "fallback-soft",
      category: "Leadership",
      icon: "users",
      skills: ["Technical leadership", "Project management", "Agile/Scrum", "Technical writing"],
    },
  ],
};
