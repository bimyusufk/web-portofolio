import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId, readToken } from "../env";

/**
 * Satu klien baca untuk seluruh aplikasi.
 * Null ketika kredensial belum diisi — lihat `sanityFetch` di ./fetch.
 *
 * `useCdn: false` disengaja: CDN publik Sanity punya cache sendiri yang tidak
 * bisa kita kontrol atau bypass, dan propagasinya sempat terbukti basi
 * (dokumen yang baru dipublish masih menunjukkan hasil kosong lewat CDN).
 * Kesegaran data cukup diatur satu tempat - `sanityFetch` di ./fetch, lewat
 * `revalidate: 60` dan tag yang disegarkan webhook /api/revalidate - jadi
 * lapisan cache kedua dari Sanity hanya menambah titik gagal tanpa manfaat
 * nyata untuk traffic situs portofolio ini.
 *
 * `token` disertakan karena dataset defaultnya dibuat private oleh
 * `npx sanity init` (bukan public seperti banyak dikira) - tanpa token, query
 * ke dokumen yang sudah dipublish pun kembali kosong, bukan error, sehingga
 * mudah disangka "belum ada konten" padahal sebenarnya masalah izin baca.
 * Aman ditaruh di sini karena berkas ini hanya diimpor lewat fetch.ts yang
 * bertanda "server-only" - tidak pernah masuk ke bundel klien.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: readToken || undefined,
      useCdn: false,
      perspective: "published",
      stega: false,
    })
  : null;
