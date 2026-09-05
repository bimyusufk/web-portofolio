import { defineArrayMember, defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

/** Dokumen tunggal - dikunci sebagai singleton lewat struktur desk di src/sanity/structure.ts. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan situs",
  type: "document",
  icon: Settings,
  groups: [
    { name: "identity", title: "Identitas", default: true },
    { name: "contact", title: "Kontak" },
    { name: "impact", title: "Dampak" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nama lengkap",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Jabatan / peran",
      type: "localeString",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Judul utama beranda",
      type: "localeString",
      group: "identity",
      description: "Kosongkan untuk memakai teks bawaan dari kamus bahasa situs.",
    }),
    defineField({
      name: "bio",
      title: "Biografi",
      type: "localeBlock",
      group: "identity",
    }),
    defineField({
      name: "focus",
      title: "Fokus saat ini",
      type: "localeText",
      group: "identity",
      description: "Satu paragraf tentang yang sedang dikerjakan atau dipelajari.",
    }),
    defineField({ name: "avatar", title: "Foto profil", type: "contentImage", group: "identity" }),
    defineField({ name: "cv", title: "Berkas CV (PDF)", type: "file", group: "identity" }),
    defineField({ name: "location", title: "Lokasi", type: "string", group: "contact" }),
    defineField({
      name: "email",
      title: "Surel",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({ name: "phone", title: "Telepon / WhatsApp", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      title: "Tautan sosial",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "metrics",
      title: "Metrik beranda",
      type: "array",
      group: "impact",
      of: [defineArrayMember({ type: "metric" })],
      description: "Tiga sampai empat angka teratas yang tampil di beranda.",
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role.id", media: "avatar" },
  },
});
