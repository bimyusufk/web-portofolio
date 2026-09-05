import { defineArrayMember, defineField, defineType } from "sanity";
import { Layers } from "lucide-react";

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Kelompok keahlian",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "category",
      title: "Kategori",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      description: "Menentukan ikon yang dipakai situs.",
      options: {
        list: [
          { title: "Kode - bahasa pemrograman", value: "code" },
          { title: "Lapisan - framework", value: "layers" },
          { title: "Basis data", value: "database" },
          { title: "Otak - data & ML", value: "brain" },
          { title: "Orang - soft skill", value: "users" },
          { title: "Terminal - perkakas", value: "terminal" },
          { title: "Awan - infrastruktur", value: "cloud" },
        ],
        layout: "dropdown",
      },
      initialValue: "code",
    }),
    defineField({
      name: "skills",
      title: "Daftar keahlian",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Urutan tampil",
      type: "number",
      description: "Angka lebih kecil tampil lebih dulu.",
    }),
  ],
  orderings: [{ title: "Urutan tampil", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "category.id", skills: "skills", order: "order" },
    prepare: (selection) => ({
      title: selection.order ? selection.order + ". " + selection.title : selection.title,
      subtitle: Array.isArray(selection.skills) ? selection.skills.join(", ") : undefined,
    }),
  },
});
