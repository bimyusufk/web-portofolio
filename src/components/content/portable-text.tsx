import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

import { CodeBlock } from "@/components/ui/code-block";
import { urlForImage, type SanityImage } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

/**
 * Pemeta Portable Text ke sistem desain.
 *
 * Tautan eksternal otomatis mendapat rel="noopener noreferrer" dan target baru,
 * sedangkan tautan internal tetap memakai <Link> agar navigasi tidak memuat ulang.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 text-body leading-[1.75] text-ink-secondary">{children}</p>,
    h2: ({ children, value }) => (
      <h2 id={slugify(value)} className="mb-4 mt-12 scroll-mt-24 text-title text-ink first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugify(value)} className="mb-3 mt-8 scroll-mt-24 text-subtitle text-ink">
        {children}
      </h3>
    ),
    h4: ({ children }) => <h4 className="mb-2 mt-6 text-ui font-medium text-ink">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-brand bg-surface-subtle py-4 pl-5 pr-4 text-body text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 space-y-2 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 list-inside list-decimal space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-5 text-body text-ink-secondary before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand">
        {children}
      </li>
    ),
    number: ({ children }) => <li className="text-body text-ink-secondary">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.9em] text-ink">{children}</code>
    ),
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href);
      const className =
        "text-brand underline decoration-brand/30 underline-offset-[3px] transition-colors hover:decoration-brand";

      return isExternal ? (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
  types: {
    contentImage: ({ value }) => {
      const image = value as SanityImage;
      const src = urlForImage(image, { width: 1280 });
      if (!src) return null;

      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-lg border border-line bg-surface-subtle">
            <Image
              src={src}
              alt={image.alt ?? ""}
              width={1280}
              height={Math.round(1280 / (image.aspectRatio || 1.6))}
              placeholder={image.lqip ? "blur" : "empty"}
              blurDataURL={image.lqip ?? undefined}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 720px, 100vw"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-2 text-caption text-ink-tertiary">{image.caption}</figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      const block = value as { code: string; language?: string; filename?: string };
      return <CodeBlock className="my-8" code={block.code} language={block.language} filename={block.filename} />;
    },
  },
};

export function PortableText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value || value.length === 0) return null;

  return (
    <div className={cn("max-w-prose", className)}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  );
}

/** Id anchor dari teks heading, dipakai juga oleh daftar "Di halaman ini". */
function slugify(block: PortableTextBlock): string {
  return headingText(block)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function headingText(block: PortableTextBlock): string {
  const children = (block.children ?? []) as { text?: string }[];
  return children.map((child) => child.text ?? "").join("");
}

/** Mengambil daftar heading h2 untuk navigasi "Di halaman ini". */
export function extractHeadings(value: PortableTextBlock[] | null | undefined) {
  if (!value) return [];
  return value
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => ({ id: slugify(block), text: headingText(block) }))
    .filter((heading) => heading.text.length > 0);
}
