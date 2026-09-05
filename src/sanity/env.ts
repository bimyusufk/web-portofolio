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

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Token hanya dipakai di server (draft preview & skrip migrasi). */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

export const isSanityConfigured = Boolean(projectId && dataset);

/** Project ID Sanity selalu alfanumerik huruf kecil. */
export function assertValidProjectId(value: string): void {
  if (!/^[a-z0-9]+$/.test(value)) {
    throw new Error(
      `NEXT_PUBLIC_SANITY_PROJECT_ID tidak valid: "${value}". ` +
        "Nilai ini hanya boleh berisi huruf kecil dan angka.",
    );
  }
}
