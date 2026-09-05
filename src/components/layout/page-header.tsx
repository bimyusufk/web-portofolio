import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";

/**
 * Kepala halaman interior.
 *
 * Menggabungkan dua pola: breadcrumb Cloud Console di atas, lalu judul dan
 * lead bergaya halaman produk. Latar permukaan halus memisahkannya dari isi
 * tanpa perlu bayangan.
 */
export function PageHeader({
  crumbs,
  title,
  lead,
  meta,
  actions,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line bg-surface-subtle">
      <div className="gcp-container py-8 lg:py-12">
        <Breadcrumb items={crumbs} className="mb-5" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-headline text-ink sm:text-display-sm">{title}</h1>
            {lead && <p className="mt-3 text-body text-ink-secondary">{lead}</p>}
            {meta && <div className="mt-4">{meta}</div>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
