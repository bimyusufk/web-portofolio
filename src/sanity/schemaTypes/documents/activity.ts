import { defineArrayMember, defineField, defineType } from "sanity";
import { CalendarDays } from "lucide-react";

export const activity = defineType({
  name: "activity",
  title: "Aktivitas",
  type: "document",
  icon: CalendarDays,
  fields: [
    defineField({ name: "title", title: "Judul", type: "localeString", validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Pembicara", value: "SPEAKER" },
          { title: "Mentoring", value: "MENTOR" },
          { title: "Penghargaan", value: "AWARD" },
          { title: "Sumber terbuka", value: "OSS" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "Tanggal", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "organiser", title: "Penyelenggara", type: "string" }),
    defineField({ name: "description", title: "Deskripsi", type: "localeText" }),
    defineField({
      name: "links",
      title: "Tautan",
      type: "array",
      of: [defineArrayMember({ type: "externalLink" })],
    }),
    defineField({ name: "cover", title: "Gambar", type: "contentImage" }),
  ],
  orderings: [{ title: "Terbaru", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title.id", category: "category", date: "date", media: "cover" },
    prepare: ({ title, category, date, media }) => ({
      title,
      subtitle: [category, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
