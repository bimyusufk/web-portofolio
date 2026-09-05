/**
 * Tanda identitas situs.
 *
 * Dua bidang bertumpuk - membaca sebagai "lapisan sistem", sesuai isi portofolio.
 * Sengaja memakai geometri sederhana dan satu warna merek, bukan tiruan logo Google.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect x="2" y="7" width="13" height="13" rx="2.5" className="fill-brand" opacity="0.28" />
      <rect x="9" y="4" width="13" height="13" rx="2.5" className="fill-brand" />
    </svg>
  );
}
