import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

/**
 * Studio ditempelkan di dalam aplikasi Next pada /studio,
 * jadi tidak ada deployment terpisah yang harus dijaga.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Portofolio Bim Yusuf",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision hanya berguna saat pengembangan untuk menguji GROQ.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  document: {
    // Singleton tidak boleh diduplikasi atau dihapus dari menu aksi.
    actions: (input, context) =>
      context.schemaType === "siteSettings"
        ? input.filter(({ action }) => action !== "unpublish" && action !== "duplicate" && action !== "delete")
        : input,
  },
});
