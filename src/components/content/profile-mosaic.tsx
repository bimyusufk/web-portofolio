import { Brain, Code2 } from "lucide-react";
import Image from "next/image";

/**
 * Profil dengan dekorasi mozaik di sekitarnya.
 *
 * Menampilkan image dengan animasi slide-in dari kanan dan background mozaik berwarna-warni
 * yang mengikuti design system GCP. Dua tile terbesar membawa ikon Brain dan Code2 -
 * sama persis dengan yang dipakai skill-grid.tsx untuk kategori "brain" dan "code" -
 * merepresentasikan riset dan rekayasa perangkat lunak, dua sisi yang tertulis di site.role.
 */
export function ProfileMosaic() {
  return (
    <div className="relative h-full min-h-[400px] w-full animate-slide-in-right">
      {/* Dekorasi mozaik latar belakang */}
      <div className="absolute inset-0 opacity-30">
        {/* Tile 1 - top left */}
        <div className="absolute left-0 top-0 h-24 w-24 rounded-lg bg-brand/20"></div>
        {/* Tile 2 - top right, riset & ML */}
        <div className="absolute right-0 top-12 flex h-32 w-32 items-center justify-center rounded-lg bg-green-500/15">
          <Brain className="h-12 w-12 text-green-700/40" aria-hidden="true" />
        </div>
        {/* Tile 3 - bottom left, rekayasa perangkat lunak */}
        <div className="absolute bottom-0 left-12 flex h-28 w-28 items-center justify-center rounded-lg bg-blue-500/15">
          <Code2 className="h-11 w-11 text-blue-700/40" aria-hidden="true" />
        </div>
        {/* Tile 4 - bottom right */}
        <div className="absolute bottom-12 right-0 h-24 w-24 rounded-lg bg-brand/15"></div>
        {/* Tile 5 - center accent */}
        <div className="absolute left-1/3 top-1/4 h-20 w-20 rounded-lg bg-amber-500/10"></div>
      </div>

      {/* Image container dengan frame */}
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="relative aspect-square w-full max-w-sm">
          {/* Outer frame/glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/20 to-transparent blur-2xl"></div>

          {/* Image */}
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-brand/20 shadow-lg">
            <Image
              src="/profile-image-removebg.png"
              alt="Profile"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Accent corner decorations */}
          <div className="absolute -bottom-2 -right-2 h-12 w-12 border-2 border-brand/40 rounded-full"></div>
          <div className="absolute -top-2 -left-2 h-8 w-8 border-2 border-brand/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
