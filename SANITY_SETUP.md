# Menghubungkan Sanity

Situs ini memakai Sanity sebagai satu-satunya sumber konten. Sebelum langkah di
bawah dijalankan, situs tetap bisa dibuka: seluruh kueri mengembalikan data
kosong dan sebuah banner peringatan muncul di halaman utama.

Perkiraan waktu: 10–15 menit.

---

## 1. Buat project Sanity

```bash
npx sanity login
npx sanity init --env
```

Saat ditanya:

| Pertanyaan | Jawab |
| --- | --- |
| Create new project | **Yes** |
| Project name | `portofolio-bim` (bebas) |
| Use the default dataset configuration | **Yes** → dataset `production` |
| Project output path | tekan Enter (folder saat ini) |
| Select project template | **Clean project with no predefined schemas** |
| Add sample data | **No** |

`--env` membuat berkas `.env.local` berisi `NEXT_PUBLIC_SANITY_PROJECT_ID` dan
`NEXT_PUBLIC_SANITY_DATASET`.

> Jika `sanity init` menawarkan untuk menimpa `sanity.config.ts` atau
> `sanity.cli.ts`, **tolak**. Kedua berkas itu sudah berisi skema dan struktur
> Studio milik proyek ini.

## 2. Lengkapi `.env.local`

Salin sisa kunci dari `.env.example`:

```bash
cp .env.example .env.local   # lalu isi nilainya
```

Buat token di <https://sanity.io/manage> → pilih project → **API** → **Tokens**:

| Variabel | Peran token | Kegunaan |
| --- | --- | --- |
| `SANITY_API_WRITE_TOKEN` | Editor | Skrip migrasi (langkah 3). Boleh dihapus setelah selesai. |
| `SANITY_API_READ_TOKEN` | Viewer | Opsional, untuk pratinjau draf. |
| `SANITY_REVALIDATE_SECRET` | — | String acak buatan sendiri, untuk webhook (langkah 5). |

Menghasilkan rahasia acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Pindahkan konten lama

Basis data lama (`prisma/dev.db`) dan gambar di `public/uploads/` masih ada di
repositori sebagai sumber migrasi. Periksa dulu rencananya:

```bash
npm run sanity:migrate -- --dry-run
```

Keluarannya menampilkan setiap dokumen yang akan dibuat tanpa menulis apa pun.
Bila sudah sesuai, jalankan migrasi:

```bash
npm run sanity:migrate
```

Yang dilakukan skrip:

- mengunggah 45 berkas gambar, dicocokkan lewat sha1 sehingga berkas identik
  hanya diunggah sekali;
- membuat 5 proyek, 1 riset, dan 6 pengalaman beserta sampul dan galerinya;
- mengubah `mdxContent` teks polos menjadi Portable Text (paragraf dan daftar);
- mengisi **Pengaturan situs** dan lima **Kelompok keahlian**.

Skrip bersifat idempoten — setiap dokumen memakai `_id` deterministik, jadi
menjalankannya ulang memperbarui, bukan menggandakan. Karena itu pula, migrasi
sebaiknya dijalankan **sekali di awal**: menjalankannya lagi setelah Anda
menyunting di Studio akan menimpa suntingan tersebut.

## 4. Buka Studio

```bash
npm run dev
```

- Situs: <http://localhost:3000> (dialihkan otomatis ke `/id` atau `/en`)
- Studio: <http://localhost:3000/studio>

Setelah konten muncul, hapus berkas migrasi yang tidak lagi diperlukan:

```bash
rm -rf prisma public/uploads
```

## 5. Webhook revalidasi

Tanpa webhook, perubahan konten baru tampil setelah cache 60 detik kedaluwarsa.
Webhook membuatnya langsung terbit.

Di <https://sanity.io/manage> → project → **API** → **Webhooks** → *Create webhook*:

| Field | Nilai |
| --- | --- |
| Name | `revalidate` |
| URL | `https://DOMAIN-ANDA/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["project","research","experience","activity","skillGroup","siteSettings"]` |
| Projection | `{ "_type": _type, "slug": slug.current }` |
| HTTP method | `POST` |
| API version | `v2025-01-01` |
| Secret | nilai `SANITY_REVALIDATE_SECRET` yang sama |

## 6. Deploy

Di Vercel (atau host lain), isi variabel lingkungan berikut:

| Variabel | Catatan |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | wajib |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SITE_URL` | URL produksi, tanpa garis miring di akhir |
| `SANITY_REVALIDATE_SECRET` | wajib agar webhook berfungsi |
| `SANITY_API_READ_TOKEN` | opsional |

`SANITY_API_WRITE_TOKEN` **tidak perlu** dipasang di produksi — token itu hanya
dipakai skrip migrasi di mesin lokal.

Terakhir, tambahkan domain produksi ke daftar CORS: sanity.io/manage → project →
**API** → **CORS origins** → *Add origin* (centang *Allow credentials* agar
Studio yang disematkan bisa dipakai dari domain tersebut).

---

## Cara kerja bilingual

Setiap field teks disimpan sebagai objek dua bahasa di dalam **satu** dokumen:

```json
{ "title": { "id": "Sistem Informasi …", "en": "Information System …" } }
```

- Bahasa Indonesia wajib diisi; bahasa Inggris opsional.
- Field bahasa Inggris yang kosong otomatis menampilkan teks Indonesia
  (`coalesce(title[$lang], title.id, title.en)` di setiap kueri GROQ).
- Satu slug melayani kedua bahasa, jadi `/id/projects/x` dan `/en/projects/x`
  selalu menunjuk karya yang sama.

**Setelah migrasi, seluruh field bahasa Inggris masih kosong.** Situs versi
`/en` akan menampilkan teks Indonesia sampai Anda mengisi terjemahannya di
Studio — di setiap field, buka bagian **Terjemahan**.

## Struktur Studio

| Menu | Tipe | Catatan |
| --- | --- | --- |
| Pengaturan situs | `siteSettings` | Dokumen tunggal: identitas, kontak, CV, metrik beranda. |
| Proyek | `project` | Studi kasus. Field **Metrik dampak** mengisi angka di kartu sorotan. |
| Riset | `research` | Publikasi; status `ongoing`/`review`/`published`. |
| Pengalaman | `experience` | Linimasa; kosongkan tanggal selesai bila masih berjalan. |
| Aktivitas | `activity` | Pembicara, mentoring, penghargaan, sumber terbuka. |
| Kelompok keahlian | `skillGroup` | Kartu keahlian di beranda dan halaman Tentang. |

## Pemecahan masalah

**Banner "Sanity belum terhubung" masih muncul.**
`NEXT_PUBLIC_*` dibaca saat proses start. Hentikan `npm run dev`, lalu jalankan lagi.

**`Unauthorized` saat migrasi.**
Token bukan peran Editor, atau disalin tidak utuh. Buat ulang di sanity.io/manage.

**Gambar tidak muncul.**
Aset ada di CDN Sanity; pastikan `cdn.sanity.io` tercantum pada `images.remotePatterns`
di `next.config.ts` (sudah diatur secara bawaan).

**Studio menampilkan halaman kosong.**
Domain belum terdaftar di CORS origins — lihat langkah 6.
