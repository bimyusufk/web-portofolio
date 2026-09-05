import Link from "next/link";

import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Peringatan yang hanya muncul ketika kredensial Sanity belum diisi.
 *
 * Sengaja tampil di situs (bukan hanya di log) supaya kondisi "CMS belum
 * terhubung" tidak salah dibaca sebagai "konten belum ditulis".
 */
export function SetupNotice({ dict }: { dict: Dictionary }) {
  if (isSanityConfigured) return null;

  return (
    <div className="gcp-container pt-6">
      <Banner
        tone="warning"
        title={dict.setup.title}
        action={
          <Button variant="outlined" size="sm" asChild>
            <Link href="/studio">Studio</Link>
          </Button>
        }
      >
        <p>{dict.setup.body}</p>
        <p className="mt-1 text-ink-tertiary">{dict.setup.docs}</p>
      </Banner>
    </div>
  );
}
