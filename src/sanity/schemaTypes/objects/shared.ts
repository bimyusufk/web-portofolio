import { defineArrayMember, defineField, defineType } from "sanity";

/** Angka dampak yang tampil pada kartu statistik. */
export const metric = defineType({
  name: "metric",
  title: "Metrik",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Nilai",
      type: "string",
      description: 'Contoh: "4.500+", "9.696", "28".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Keterangan",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { value: "value", label: "label.id" },
    prepare: ({ value, label }) => ({ title: value, subtitle: label }),
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Tautan sosial",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Instagram", value: "instagram" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Email", value: "email" },
          { title: "Google Scholar", value: "scholar" },
          { title: "Lainnya", value: "other" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

export const externalLink = defineType({
  name: "externalLink",
  title: "Tautan",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

/** Gambar dengan alt wajib — aksesibilitas ditegakkan di level skema. */
export const contentImage = defineType({
  name: "contentImage",
  title: "Gambar",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Teks alternatif",
      type: "string",
      description: "Deskripsi singkat isi gambar untuk pembaca layar dan mesin pencari.",
      validation: (rule) => rule.required().min(4),
    }),
    defineField({ name: "caption", title: "Keterangan", type: "string" }),
  ],
  preview: { select: { media: "asset", title: "alt", subtitle: "caption" } },
});

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Blok kode",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Bahasa",
      type: "string",
      options: {
        list: ["typescript", "javascript", "python", "php", "sql", "bash", "json", "text"],
      },
      initialValue: "typescript",
    }),
    defineField({ name: "filename", title: "Nama berkas", type: "string" }),
    defineField({
      name: "code",
      title: "Kode",
      type: "text",
      rows: 10,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: "language", filename: "filename" },
    prepare: ({ language, filename }) => ({ title: filename || `Kode ${language}`, subtitle: language }),
  },
});

export const galleryArray = defineArrayMember({ type: "contentImage" });
