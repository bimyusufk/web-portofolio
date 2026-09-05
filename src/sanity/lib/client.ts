import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Satu klien baca untuk seluruh aplikasi.
 * Null ketika kredensial belum diisi — lihat `sanityFetch` di ./fetch.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: false,
    })
  : null;
