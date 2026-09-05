import { defineField, defineType } from "sanity";
import { Briefcase } from "lucide-react";

export const experience = defineType({
  name: "experience",
  title: "Pengalaman",
  type: "document",
  icon: Briefcase,
  fields: [
    defineField({
      name: "company",
      title: "Organisasi / perusahaan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Peran", type: "localeString", validation: (rule) => rule.required() }),
    defineField({
      name: "employmentType",
      title: "Jenis keterlibatan",
      type: "string",
      options: {
        list: [
          { title: "Penuh waktu", value: "fulltime" },
          { title: "Paruh waktu", value: "parttime" },
          { title: "Magang", value: "internship" },
          { title: "Kepanitiaan / organisasi", value: "organisation" },
          { title: "Kontrak", value: "contract" },
        ],
      },
      initialValue: "organisation",
    }),
    defineField({
      name: "startDate",
      title: "Tanggal mulai",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Tanggal selesai",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      description: "Kosongkan bila masih berjalan.",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate;
          if (!endDate || !start) return true;
          return new Date(endDate) >= new Date(start) || "Tanggal selesai harus setelah tanggal mulai.";
        }),
    }),
    defineField({ name: "location", title: "Lokasi", type: "string" }),
    defineField({ name: "description", title: "Deskripsi", type: "localeBlock" }),
    defineField({
      name: "highlights",
      title: "Capaian utama",
      type: "localeStringList",
      description: "Satu capaian per baris. Sebaiknya mengandung angka.",
    }),
    defineField({ name: "logo", title: "Logo", type: "contentImage" }),
  ],
  orderings: [{ title: "Terbaru", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] }],
  preview: {
    select: { title: "company", role: "role.id", start: "startDate", media: "logo" },
    prepare: ({ title, role, start, media }) => ({
      title,
      subtitle: [role, start ? start.slice(0, 4) : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
