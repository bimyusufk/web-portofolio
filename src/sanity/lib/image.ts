import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

export type SanityImage = {
  asset?: { _ref?: string; _id?: string };
  alt?: string | null;
  caption?: string | null;
  hotspot?: unknown;
  crop?: unknown;
  lqip?: string | null;
  aspectRatio?: number | null;
};

/** URL gambar berukuran tetap; mengembalikan null bila aset atau konfigurasi tidak ada. */
export function urlForImage(
  source: SanityImageSource | null | undefined,
  options: { width?: number; height?: number; quality?: number } = {},
): string | null {
  if (!builder || !source) return null;

  const asset = source as { asset?: { _ref?: string } };
  if (asset.asset && !asset.asset._ref) return null;

  let image = builder.image(source).auto("format").fit("max");
  if (options.width) image = image.width(options.width);
  if (options.height) image = image.height(options.height);
  image = image.quality(options.quality ?? 82);

  return image.url();
}

/** Varian potong rasio tetap untuk kartu dan thumbnail galeri. */
export function urlForCrop(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number,
): string | null {
  if (!builder || !source) return null;
  return builder.image(source).width(width).height(height).fit("crop").auto("format").quality(80).url();
}
