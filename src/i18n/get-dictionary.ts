import "server-only";

import { defaultLocale, type Locale } from "./config";
import type id from "./dictionaries/id.json";

/**
 * Kamus dimuat lewat dynamic import agar hanya bahasa yang diminta
 * yang ikut ke dalam bundel server tiap permintaan.
 */
const dictionaries = {
  id: () => import("./dictionaries/id.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export type Dictionary = typeof id;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries[defaultLocale];
  return (await load()) as Dictionary;
}
