"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Sanity Studio yang disematkan.
 *
 * Ditandai "use client" karena Studio membangun konteks React saat modul dievaluasi;
 * tanpa itu, paket `sanity` ikut dievaluasi di server dan build gagal.
 * Rute ini berada di luar segmen [lang] karena Studio punya antarmuka sendiri.
 */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return <NotConfigured />;
  }

  return <NextStudio config={config} />;
}

function NotConfigured() {
  return (
    <main className="gcp-container py-20">
      <h1 className="text-headline text-ink">Sanity belum dikonfigurasi</h1>
      <p className="mt-3 max-w-prose text-body text-ink-secondary">
        Isi <code className="font-mono text-ui">NEXT_PUBLIC_SANITY_PROJECT_ID</code> dan{" "}
        <code className="font-mono text-ui">NEXT_PUBLIC_SANITY_DATASET</code> pada{" "}
        <code className="font-mono text-ui">.env.local</code>, lalu jalankan ulang server.
      </p>
      <p className="mt-2 text-ui text-ink-tertiary">
        Langkah lengkap ada di <code className="font-mono">SANITY_SETUP.md</code>.
      </p>
    </main>
  );
}
