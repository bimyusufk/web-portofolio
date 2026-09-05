/**
 * Konfigurasi koneksi Sanity.
 *
 * Situs sengaja dibuat tetap bisa dirender ketika kredensial belum diisi:
 * `isSanityConfigured` dipakai lapisan fetch untuk mengembalikan data kosong
 * alih-alih melempar error, sehingga `npm run dev` dan `npm run build`
 * tetap berhasil sebelum project Sanity dibuat.
 */
/**
 * `||` dipakai, bukan `??`, karena .env.local menulis variabel kosong sebagai
 * string kosong ("") - bukan tidak diset - dan Sanity menolak apiVersion "".
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/**
 * Project ID Sanity hanya boleh huruf kecil, angka, dan strip. Nilai yang
 * tidak valid (kutip/spasi/baris baru ikut ter-copy-paste ke dashboard hosting)
 * diperlakukan sebagai "belum diisi" - dengan peringatan di log build - alih-alih
 * membuat createClient() melempar error dan menggagalkan seluruh build.
 */
const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
const isValidProjectId = /^[a-z0-9-]+$/.test(rawProjectId);

if (rawProjectId && !isValidProjectId) {
  console.warn(
    `[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID tidak valid: "${rawProjectId}". ` +
      "Hanya boleh huruf kecil, angka, dan strip - cek ulang tanpa kutip/spasi di pengaturan environment variable. " +
      "Situs akan berjalan dengan data cadangan sampai ini diperbaiki.",
  );
}

export const projectId = isValidProjectId ? rawProjectId : "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Token hanya dipakai di server (draft preview & skrip migrasi). */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

export const isSanityConfigured = Boolean(projectId && dataset);
