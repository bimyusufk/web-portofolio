import "server-only";

import { client } from "./client";
import { isSanityConfigured } from "../env";

type FetchOptions = {
  /** Detik sebelum cache dianggap basi. Webhook `/api/revalidate` bisa mem-bypass ini. */
  revalidate?: number;
  /** Tag cache agar webhook Sanity bisa menyegarkan tipe dokumen tertentu saja. */
  tags?: string[];
};

/**
 * Pembungkus tunggal untuk semua kueri GROQ.
 *
 * Mengembalikan `fallback` alih-alih melempar error ketika Sanity belum
 * dikonfigurasi atau kueri gagal, supaya satu dokumen bermasalah tidak
 * menjatuhkan seluruh halaman. Kegagalan tetap dicatat di log server.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
  options: FetchOptions = {},
): Promise<T> {
  if (!isSanityConfigured || !client) return fallback;

  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: options.revalidate ?? 60,
        tags: options.tags,
      },
    });
  } catch (error) {
    console.error("[sanity] kueri gagal:", (error as Error).message);
    return fallback;
  }
}
