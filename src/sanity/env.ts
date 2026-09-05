/**
 * Konfigurasi koneksi Sanity.
 *
 * Situs sengaja dibuat tetap bisa dirender ketika kredensial belum diisi:
 * `isSanityConfigured` dipakai lapisan fetch untuk mengembalikan data kosong
 * alih-alih melempar error, sehingga `npm run dev` dan `npm run build`
 * tetap berhasil sebelum project Sanity dibuat.
 */
/**
 * Membuang spasi dan sepasang kutip pembungkus dari nilai environment variable.
 *
 * Dashboard hosting (Vercel dkk.) menyimpan apa pun yang diketik ke kolom teks
 * persis apa adanya - beda dengan .env.local yang diparse dan otomatis
 * membuang kutip. Kalau seseorang copy-paste `"nilai"` lengkap dengan kutipnya
 * ke kolom itu, kutip tadi ikut jadi bagian dari string dan bikin Sanity
 * menolaknya. Dipakai untuk semua env var Sanity supaya kelas kesalahan yang
 * sama tidak terulang di tiap variabel satu per satu.
 */
function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^(['"])(.*)\1$/, "$2");
}

/**
 * `||` dipakai, bukan `??`, karena .env.local menulis variabel kosong sebagai
 * string kosong ("") - bukan tidak diset - dan Sanity menolak apiVersion "".
 */
export const apiVersion = cleanEnv(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || "2025-01-01";

/**
 * Project ID Sanity hanya boleh huruf kecil, angka, dan strip. Nilai yang
 * tidak valid diperlakukan sebagai "belum diisi" - dengan peringatan di log
 * build - alih-alih membuat createClient() melempar error dan menggagalkan
 * seluruh build.
 */
const rawProjectId = cleanEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const isValidProjectId = /^[a-z0-9-]+$/.test(rawProjectId);

if (rawProjectId && !isValidProjectId) {
  console.warn(
    `[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID tidak valid: "${rawProjectId}". ` +
      "Hanya boleh huruf kecil, angka, dan strip - cek ulang tanpa kutip/spasi di pengaturan environment variable. " +
      "Situs akan berjalan dengan data cadangan sampai ini diperbaiki.",
  );
}

export const projectId = isValidProjectId ? rawProjectId : "";

/** Dataset Sanity hanya boleh huruf/angka/strip/garis bawah. */
const rawDataset = cleanEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) || "production";
const isValidDataset = /^[a-zA-Z0-9_-]+$/.test(rawDataset);

if (!isValidDataset) {
  console.warn(
    `[sanity] NEXT_PUBLIC_SANITY_DATASET tidak valid: "${rawDataset}". ` +
      "Cek ulang tanpa kutip/spasi di pengaturan environment variable. Memakai \"production\" sebagai cadangan.",
  );
}

export const dataset = isValidDataset ? rawDataset : "production";

/** Token hanya dipakai di server (draft preview & skrip migrasi). */
export const readToken = cleanEnv(process.env.SANITY_API_READ_TOKEN);

export const isSanityConfigured = Boolean(projectId && dataset);
