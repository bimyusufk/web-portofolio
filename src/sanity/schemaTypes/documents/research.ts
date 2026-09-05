import { defineArrayMember, defineField, defineType } from "sanity";
import { FlaskConical } from "lucide-react";

export const research = defineType({
  name: "research",
  title: "Riset",
  type: "document",
  icon: FlaskConical,
  groups: [
    { name: "content", title: "Konten", default: true },
    { name: "publication", title: "Publikasi" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "localeString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: (doc: Record<string, unknown>) => (doc.title as { id?: string } | undefined)?.id ?? "",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Abstrak singkat",
      type: "localeText",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", title: "Isi lengkap", type: "localeBlock", group: "content" }),
    defineField({
      name: "authors",
      title: "Penulis",
      type: "array",
      group: "publication",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "venue", title: "Venue / penerbit", type: "string", group: "publication" }),
    defineField({
      name: "year",
      title: "Tahun",
      type: "number",
      group: "publication",
      validation: (rule) => rule.min(1990).max(2100).integer(),
    }),
    defineField({
      name: "state",
      title: "Status",
      type: "string",
      group: "publication",
      options: {
        list: [
          { title: "Sedang berjalan", value: "ongoing" },
          { title: "Dalam peninjauan", value: "review" },
          { title: "Terbit", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "ongoing",
    }),
    defineField({ name: "doi", title: "DOI", type: "string", group: "publication" }),
    defineField({ name: "pdf", title: "Berkas PDF", type: "file", group: "publication" }),
    defineField({
      name: "pdfUrl",
      title: "URL PDF eksternal",
      type: "url",
      group: "publication",
      description: "Dipakai bila berkas dihosting di luar Sanity.",
    }),
    defineField({
      name: "keywords",
      title: "Kata kunci",
      type: "array",
      group: "publication",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({ name: "cover", title: "Gambar sampul", type: "contentImage", group: "media" }),
    defineField({
      name: "gallery",
      title: "Gambar pendukung",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "contentImage" })],
      options: { layout: "grid" },
    }),
  ],
  orderings: [{ title: "Tahun terbaru", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
  preview: {
    select: { title: "title.id", venue: "venue", year: "year", media: "cover" },
    prepare: ({ title, venue, year, media }) => ({
      title,
      subtitle: [venue, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
