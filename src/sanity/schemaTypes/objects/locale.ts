import { defineField, defineType, type FieldDefinition, type Rule, type SchemaTypeDefinition } from "sanity";

import { defaultLocale, localeNames, locales } from "../../../i18n/config";

/**
 * Pabrik tipe terlokalisasi.
 *
 * Tiap field bilingual disimpan sebagai objek `{ id, en }` di dalam satu dokumen,
 * bukan dua dokumen terpisah. Konsekuensinya satu slug melayani kedua bahasa,
 * sehingga /id/projects/x dan /en/projects/x selalu menunjuk karya yang sama.
 *
 * Bahasa default wajib diisi; bahasa lain opsional dan otomatis jatuh kembali
 * ke default lewat `coalesce` pada kueri GROQ.
 */
function localeFields(options: {
  of: string;
  rows?: number;
  arrayOf?: string;
}): FieldDefinition[] {
  return locales.map((locale) => {
    const isDefault = locale === defaultLocale;

    return {
      name: locale,
      title: localeNames[locale],
      type: options.of,
      // Bahasa non-default masuk fieldset yang bisa diciutkan agar form tetap ringkas.
      fieldset: isDefault ? undefined : "translations",
      validation: isDefault ? (rule: Rule) => rule.required() : undefined,
      ...(options.rows ? { rows: options.rows } : {}),
      ...(options.arrayOf ? { of: [{ type: options.arrayOf }] } : {}),
    } as FieldDefinition;
  });
}

const translationsFieldset = [
  { name: "translations", title: "Terjemahan", options: { collapsible: true, collapsed: false } },
];

function localeType(options: {
  name: string;
  title: string;
  of: string;
  rows?: number;
  arrayOf?: string;
}): SchemaTypeDefinition {
  return defineType({
    name: options.name,
    title: options.title,
    type: "object",
    fieldsets: translationsFieldset,
    fields: localeFields(options),
  });
}

export const localeString = localeType({
  name: "localeString",
  title: "Teks singkat (2 bahasa)",
  of: "string",
});

export const localeText = localeType({
  name: "localeText",
  title: "Teks panjang (2 bahasa)",
  of: "text",
  rows: 4,
});

export const localeStringList = localeType({
  name: "localeStringList",
  title: "Daftar teks (2 bahasa)",
  of: "array",
  arrayOf: "string",
});

/** Portable Text bilingual - dipakai untuk isi studi kasus dan deskripsi panjang. */
export const localeBlock = defineType({
  name: "localeBlock",
  title: "Konten kaya (2 bahasa)",
  type: "object",
  fieldsets: translationsFieldset,
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "array",
      of: [{ type: "block" }, { type: "contentImage" }, { type: "codeBlock" }],
      fieldset: locale === defaultLocale ? undefined : "translations",
    }),
  ),
});
