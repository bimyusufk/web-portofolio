import type { StructureResolver } from "sanity/structure";
import { Boxes, Briefcase, CalendarDays, FlaskConical, Layers, Settings } from "lucide-react";

/**
 * Susunan menu Studio.
 *
 * "Pengaturan situs" dijadikan singleton (satu dokumen tetap ber-_id `siteSettings`)
 * supaya tidak ada dua versi identitas yang saling bertabrakan.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Pengaturan situs")
        .icon(Settings)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Pengaturan situs")),

      S.divider(),

      S.documentTypeListItem("project").title("Proyek").icon(Boxes),
      S.documentTypeListItem("research").title("Riset").icon(FlaskConical),
      S.documentTypeListItem("experience").title("Pengalaman").icon(Briefcase),
      S.documentTypeListItem("activity").title("Aktivitas").icon(CalendarDays),

      S.divider(),

      S.documentTypeListItem("skillGroup").title("Kelompok keahlian").icon(Layers),
    ]);
