#!/usr/bin/env node
/**
 * Migrasi satu arah: SQLite (Prisma lama) -> Sanity.
 *
 * Menjalankan ulang skrip ini aman: setiap dokumen memakai _id deterministik
 * yang diturunkan dari slug, dan setiap gambar dicocokkan lebih dulu lewat
 * sha1 sehingga berkas yang sama tidak pernah diunggah dua kali.
 *
 * Pemakaian:
 *   node scripts/migrate-sqlite-to-sanity.mjs            # jalankan migrasi
 *   node scripts/migrate-sqlite-to-sanity.mjs --dry-run  # tampilkan rencana saja
 *   node scripts/migrate-sqlite-to-sanity.mjs --db=path/to/dev.db
 *
 * Variabel lingkungan yang dibutuhkan (dibaca dari .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN         (Editor/Administrator, dibuat di sanity.io/manage)
 */

import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const DB_PATH = resolve(ROOT, args.find((a) => a.startsWith("--db="))?.slice(5) ?? "prisma/dev.db");

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

/** Membaca .env.local tanpa dependensi tambahan. */
function loadEnvLocal() {
  for (const file of [".env.local", ".env"]) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  }
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!existsSync(DB_PATH)) fail(`Basis data tidak ditemukan: ${DB_PATH}`);
if (!DRY_RUN && !projectId) fail("NEXT_PUBLIC_SANITY_PROJECT_ID belum diisi di .env.local");
if (!DRY_RUN && !token) fail("SANITY_API_WRITE_TOKEN belum diisi di .env.local");

const client =
  DRY_RUN && !projectId
    ? null
    : createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });

const db = new DatabaseSync(DB_PATH, { readOnly: true });

/** Kolom JSON di SQLite lama disimpan sebagai string; kembalikan array kosong bila rusak. */
function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Slug aman untuk dipakai sebagai bagian dari _id dokumen.
 *
 * Bila teks harus dipotong, sufiks hash pendek ditambahkan supaya dua sumber
 * berbeda yang awalannya sama tidak pernah berakhir dengan _id yang identik
 * (mis. dua kepanitiaan di organisasi sama dengan tanggal mulai berdekatan).
 */
const ID_MAX = 60;

function safeId(prefix, value) {
  const source = String(value);
  const clean = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (clean.length <= ID_MAX) return `${prefix}.${clean}`;

  const digest = createHash("sha1").update(source).digest("hex").slice(0, 8);
  return `${prefix}.${clean.slice(0, ID_MAX)}-${digest}`;
}

/**
 * Mengubah teks polos (mdxContent lama) menjadi Portable Text.
 *
 * Konten lama tidak pernah benar-benar MDX - isinya paragraf dipisah baris baru,
 * kadang dengan penanda daftar. Baris berawalan "-" atau "*" menjadi butir daftar,
 * sisanya menjadi paragraf.
 */
function textToPortableText(text) {
  if (!text || !String(text).trim()) return [];

  const blocks = [];
  const paragraphs = String(text)
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
    const allBullets = lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l));

    if (allBullets) {
      for (const line of lines) {
        blocks.push(makeBlock(line.replace(/^[-*•]\s+/, ""), { listItem: "bullet", level: 1 }));
      }
      continue;
    }

    blocks.push(makeBlock(lines.join(" ")));
  }

  return blocks;
}

function makeBlock(text, extra = {}) {
  return {
    _type: "block",
    _key: randomUUID().replace(/-/g, "").slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID().replace(/-/g, "").slice(0, 12), text, marks: [] }],
    ...extra,
  };
}

/* ------------------------------------------------------------------ gambar */

const assetCache = new Map();

/**
 * Mengunggah satu berkas media ke Sanity, atau memakai kembali aset yang sudah ada.
 *
 * Pencocokan dilakukan lewat sha1 isi berkas, bukan nama berkas, karena basis
 * data lama menyimpan beberapa baris Media berbeda yang menunjuk gambar identik.
 */
async function uploadImage(mediaRow) {
  if (!mediaRow) return null;

  const cached = assetCache.get(mediaRow.id);
  if (cached !== undefined) return cached;

  // URL lama berbentuk /uploads/media/images/<uuid>.png relatif terhadap public/.
  const localPath = join(ROOT, "public", mediaRow.url.replace(/^\//, ""));

  if (!existsSync(localPath)) {
    console.warn(`  ! berkas hilang, dilewati: ${mediaRow.url}`);
    assetCache.set(mediaRow.id, null);
    return null;
  }

  const buffer = readFileSync(localPath);
  const sha1 = createHash("sha1").update(buffer).digest("hex");

  if (DRY_RUN) {
    const stub = { _id: `image-${sha1}`, sha1hash: sha1 };
    assetCache.set(mediaRow.id, stub);
    return stub;
  }

  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]{_id, sha1hash}',
    { sha1 },
  );

  if (existing) {
    assetCache.set(mediaRow.id, existing);
    return existing;
  }

  const asset = await client.assets.upload("image", buffer, {
    filename: mediaRow.filename || basename(localPath),
    contentType: mediaRow.mimeType || undefined,
  });

  console.log(`  + unggah ${mediaRow.filename} -> ${asset._id}`);
  assetCache.set(mediaRow.id, asset);
  return asset;
}

/** Membungkus aset menjadi objek `contentImage` sesuai skema. */
function imageField(asset, alt, caption) {
  if (!asset) return undefined;
  return {
    _type: "contentImage",
    asset: { _type: "reference", _ref: asset._id },
    alt: alt || "Tangkapan layar proyek",
    ...(caption ? { caption } : {}),
  };
}

/** Field bilingual: konten lama seluruhnya berbahasa Indonesia. */
function locale(value) {
  if (value === null || value === undefined || value === "") return undefined;
  return { id: value };
}

/* --------------------------------------------------------------- dokumen */

function buildProjects(mediaById, galleryByProject) {
  const rows = db.prepare("SELECT * FROM Project").all();

  return rows.map((row) => {
    const slug = row.slug;
    const thumb = row.thumbnailId ? mediaById.get(row.thumbnailId) : null;
    const gallery = galleryByProject.get(row.id) ?? [];
    const year = row.publishedAt ? new Date(row.publishedAt).getFullYear().toString() : undefined;

    return {
      _row: row,
      _thumb: thumb,
      _gallery: gallery,
      doc: {
        _id: safeId("project", slug),
        _type: "project",
        title: locale(row.title),
        slug: { _type: "slug", current: slug },
        summary: locale(row.summary),
        body: row.mdxContent ? { id: textToPortableText(row.mdxContent) } : undefined,
        role: locale(row.role),
        projectType: locale(row.type),
        techStack: parseJsonArray(row.tech),
        demoUrl: row.demoUrl || undefined,
        repoUrl: row.repoUrl || undefined,
        featured: Boolean(row.featured),
        year,
        publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
      },
    };
  });
}

function buildResearch(mediaById) {
  const rows = db.prepare("SELECT * FROM Research").all();

  return rows.map((row) => ({
    _row: row,
    _thumb: row.thumbnailId ? mediaById.get(row.thumbnailId) : null,
    doc: {
      _id: safeId("research", row.slug),
      _type: "research",
      title: locale(row.title),
      slug: { _type: "slug", current: row.slug },
      summary: locale(row.summary),
      body: row.mdxContent ? { id: textToPortableText(row.mdxContent) } : undefined,
      authors: parseJsonArray(row.authors),
      keywords: parseJsonArray(row.keywords),
      venue: row.venue || undefined,
      year: row.year ?? undefined,
      doi: row.doi || undefined,
      pdfUrl: row.pdfUrl || undefined,
      // Judul lama diawali "(on going)"; statusnya dipindahkan ke field terstruktur.
      state: /on\s*going/i.test(row.title ?? "") ? "ongoing" : "published",
    },
  }));
}

function buildExperience(mediaById) {
  const rows = db.prepare("SELECT * FROM Experience ORDER BY startDate DESC").all();

  return rows.map((row) => {
    const highlights = parseJsonArray(row.highlights);

    return {
      _row: row,
      _thumb: row.thumbnailId ? mediaById.get(row.thumbnailId) : null,
      doc: {
        _id: safeId("experience", `${row.company}-${row.startDate}`),
        _type: "experience",
        company: row.company,
        role: locale((row.role ?? "").trim()),
        startDate: toDateOnly(row.startDate),
        endDate: row.endDate ? toDateOnly(row.endDate) : undefined,
        location: row.location || undefined,
        description: row.descriptionMDX ? { id: textToPortableText(row.descriptionMDX) } : undefined,
        highlights: highlights.length ? { id: highlights } : undefined,
        employmentType: "organisation",
      },
    };
  });
}

function buildActivities() {
  const rows = db.prepare("SELECT * FROM Activity").all();

  return rows.map((row) => ({
    _row: row,
    _thumb: null,
    doc: {
      _id: safeId("activity", `${row.title}-${row.date}`),
      _type: "activity",
      title: locale(row.title),
      category: row.type,
      date: toDateOnly(row.date),
      description: locale(row.descriptionMDX),
      links: parseJsonArray(row.links).map((url) => ({
        _type: "externalLink",
        _key: randomUUID().replace(/-/g, "").slice(0, 12),
        label: url,
        url,
      })),
    },
  }));
}

/** Kolom tanggal lama berupa epoch milidetik; skema Sanity memakai tanggal saja. */
function toDateOnly(value) {
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

/* ------------------------------------------------------- pengaturan situs */

/**
 * Dokumen tunggal identitas situs.
 *
 * Nilai diambil dari basis data lama jika ada; sisanya memakai data kontak yang
 * sebelumnya tertulis langsung di dalam komponen React.
 */
function buildSiteSettings() {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Bim Yusuf Karang",
    role: { id: "Software Engineer & Peneliti", en: "Software Engineer & Researcher" },
    location: "Bandung, Jawa Barat, Indonesia",
    email: "bimyusufkarang21@gmail.com",
    phone: "+62 813 1444 891",
    socials: [
      { _type: "socialLink", _key: "gh", platform: "github", label: "GitHub", url: "https://github.com/bimyusufk" },
      {
        _type: "socialLink",
        _key: "li",
        platform: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/bim-yusuf-k/",
      },
      {
        _type: "socialLink",
        _key: "ig",
        platform: "instagram",
        label: "Instagram",
        url: "https://instagram.com/bim_yusuf21",
      },
      {
        _type: "socialLink",
        _key: "wa",
        platform: "whatsapp",
        label: "WhatsApp",
        url: "https://wa.me/628131444891",
      },
    ],
    metrics: [
      {
        _type: "metric",
        _key: "m1",
        value: "4.500+",
        label: {
          id: "Peserta terlayani pada platform Padjadjaran Career Expo",
          en: "Participants served on the Padjadjaran Career Expo platform",
        },
      },
      {
        _type: "metric",
        _key: "m2",
        value: "9.696",
        label: {
          id: "Sertifikat terbit otomatis lewat sistem Prabu Unpad 2024",
          en: "Certificates issued automatically by the Prabu Unpad 2024 system",
        },
      },
      {
        _type: "metric",
        _key: "m3",
        value: "28",
        label: {
          id: "Unit dan fakultas memakai sistem pemantauan audit SIPTL-UNRI",
          en: "Units and faculties using the SIPTL-UNRI audit monitoring system",
        },
      },
    ],
  };
}

const SKILL_GROUPS = [
  {
    key: "languages",
    icon: "code",
    category: { id: "Bahasa Pemrograman", en: "Programming Languages" },
    skills: ["TypeScript", "JavaScript", "Python", "PHP", "SQL"],
  },
  {
    key: "frameworks",
    icon: "layers",
    category: { id: "Framework & Library", en: "Frameworks & Libraries" },
    skills: ["Next.js", "React", "Laravel", "Livewire", "Tailwind CSS", "Node.js", "Express.js"],
  },
  {
    key: "data",
    icon: "database",
    category: { id: "Basis Data & Perkakas", en: "Databases & Tooling" },
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Prisma ORM", "Supabase", "Git", "Vercel"],
  },
  {
    key: "ml",
    icon: "brain",
    category: { id: "Data & Machine Learning", en: "Data & Machine Learning" },
    skills: ["PyTorch", "OpenCV", "Scikit-learn", "MLxtend", "Pandas", "NumPy", "Streamlit"],
  },
  {
    key: "leadership",
    icon: "users",
    category: { id: "Kepemimpinan", en: "Leadership" },
    skills: ["Technical Leadership", "Manajemen Proyek", "Agile/Scrum", "Penulisan Teknis"],
  },
];

function buildSkillGroups() {
  return SKILL_GROUPS.map((group, index) => ({
    _id: safeId("skillGroup", group.key),
    _type: "skillGroup",
    category: group.category,
    icon: group.icon,
    skills: group.skills,
    order: index + 1,
  }));
}

/* ------------------------------------------------------------------ utama */

async function main() {
  console.log(`\nMigrasi SQLite -> Sanity`);
  console.log(`  sumber  : ${DB_PATH}`);
  console.log(`  tujuan  : ${projectId ?? "(dry run)"} / ${dataset}`);
  console.log(`  mode    : ${DRY_RUN ? "DRY RUN (tidak menulis apa pun)" : "TULIS"}\n`);

  const mediaRows = db.prepare("SELECT * FROM Media").all();
  const mediaById = new Map(mediaRows.map((row) => [row.id, row]));

  const galleryByProject = new Map();
  for (const row of mediaRows) {
    if (!row.projectGalleryId) continue;
    const list = galleryByProject.get(row.projectGalleryId) ?? [];
    list.push(row);
    galleryByProject.set(row.projectGalleryId, list);
  }

  const projects = buildProjects(mediaById, galleryByProject);
  const research = buildResearch(mediaById);
  const experience = buildExperience(mediaById);
  const activities = buildActivities();

  console.log(
    `Ditemukan: ${projects.length} proyek, ${research.length} riset, ` +
      `${experience.length} pengalaman, ${activities.length} aktivitas, ${mediaRows.length} media.\n`,
  );

  // Gambar diunggah lebih dulu agar dokumen bisa langsung mereferensikan asetnya.
  console.log("Memproses gambar...");
  for (const entry of [...projects, ...research, ...experience]) {
    const thumbAsset = await uploadImage(entry._thumb);
    if (thumbAsset) {
      const alt = entry.doc.title?.id ?? entry.doc.company ?? "";
      const field = imageField(thumbAsset, alt);
      if (entry.doc._type === "experience") entry.doc.logo = field;
      else entry.doc.cover = field;
    }

    if (entry._gallery?.length) {
      const gallery = [];
      for (const media of entry._gallery) {
        const asset = await uploadImage(media);
        if (!asset) continue;
        gallery.push({
          ...imageField(asset, `${entry.doc.title?.id ?? ""} - ${media.filename}`),
          _key: randomUUID().replace(/-/g, "").slice(0, 12),
        });
      }
      if (gallery.length) entry.doc.gallery = gallery;
    }
  }

  const documents = [
    buildSiteSettings(),
    ...buildSkillGroups(),
    ...projects.map((e) => e.doc),
    ...research.map((e) => e.doc),
    ...experience.map((e) => e.doc),
    ...activities.map((e) => e.doc),
  ];

  if (DRY_RUN) {
    console.log("\nDokumen yang akan ditulis:");
    for (const doc of documents) {
      console.log(`  ${doc._type.padEnd(14)} ${doc._id}`);
    }
    console.log(`\nTotal ${documents.length} dokumen. Tidak ada yang ditulis (--dry-run).\n`);
    return;
  }

  console.log(`\nMenulis ${documents.length} dokumen...`);

  // createOrReplace membuat skrip idempoten: menjalankan ulang memperbarui,
  // bukan menggandakan. Perubahan manual di Studio pada dokumen yang sama akan
  // tertimpa - itulah sebabnya migrasi hanya dijalankan sekali di awal.
  let transaction = client.transaction();
  for (const doc of documents) {
    transaction = transaction.createOrReplace(stripUndefined(doc));
  }

  await transaction.commit();

  console.log("\nSelesai. Buka /studio untuk memeriksa hasilnya.");
  console.log("Catatan: seluruh field terjemahan bahasa Inggris masih kosong dan");
  console.log("otomatis jatuh kembali ke teks bahasa Indonesia sampai Anda mengisinya.\n");
}

/** Sanity menolak nilai undefined di dalam dokumen. */
function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    );
  }
  return value;
}

main()
  .catch((error) => {
    console.error("\nMigrasi gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.close());
