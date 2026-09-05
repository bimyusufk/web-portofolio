"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { SanityImage } from "@/sanity/lib/image";
import { urlForCrop, urlForImage } from "@/sanity/lib/image";

/**
 * Galeri kisi dengan penampil layar penuh.
 *
 * Memakai elemen <dialog> asli agar mendapat penjebakan fokus, tombol Esc,
 * dan semantik modal dari peramban tanpa pustaka tambahan.
 */
export function ImageGallery({
  images,
  title,
  hint,
}: {
  images: SanityImage[];
  title: string;
  hint?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setIndex(null);
  }, []);

  const open = useCallback((next: number) => {
    setIndex(next);
    dialogRef.current?.showModal();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, step]);

  if (images.length === 0) return null;

  const active = index === null ? null : images[index];
  const activeUrl = urlForImage(active, { width: 1920 });

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, position) => {
          const thumb = urlForCrop(image, 480, 320);
          if (!thumb) return null;

          return (
            <button
              key={`${image.asset?._ref ?? position}`}
              type="button"
              onClick={() => open(position)}
              className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-line bg-surface-subtle transition-shadow duration-fast hover:shadow-elevation-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Image
                src={thumb}
                alt={image.alt ?? `${title} ${position + 1}`}
                fill
                placeholder={image.lqip ? "blur" : "empty"}
                blurDataURL={image.lqip ?? undefined}
                className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
            </button>
          );
        })}
      </div>

      {hint && <p className="mt-3 text-caption text-ink-tertiary">{hint}</p>}

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(event) => {
          // Klik pada latar dialog (bukan isinya) menutup penampil.
          if (event.target === dialogRef.current) close();
        }}
        className="max-h-[92vh] w-[min(92vw,72rem)] max-w-none rounded-lg border border-line bg-surface p-0 text-ink backdrop:bg-black/70"
      >
        {active && activeUrl && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
              <p className="truncate text-ui text-ink-secondary">
                {active.alt || title}
                <span className="ml-2 tabular-nums text-ink-tertiary">
                  {(index ?? 0) + 1}/{images.length}
                </span>
              </p>
              <div className="flex items-center gap-1">
                {images.length > 1 && (
                  <>
                    <IconButton onClick={() => step(-1)} label="Sebelumnya">
                      <ChevronLeft className="h-5 w-5" />
                    </IconButton>
                    <IconButton onClick={() => step(1)} label="Berikutnya">
                      <ChevronRight className="h-5 w-5" />
                    </IconButton>
                  </>
                )}
                <IconButton onClick={close} label="Tutup">
                  <X className="h-5 w-5" />
                </IconButton>
              </div>
            </div>

            <div className="relative flex max-h-[78vh] items-center justify-center bg-surface-sunken p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- dimensi asli tidak diketahui; biarkan peramban menskalakan agar tidak terpotong. */}
              <img
                src={activeUrl}
                alt={active.alt ?? title}
                className="max-h-[76vh] w-auto max-w-full rounded object-contain"
              />
            </div>

            {active.caption && (
              <p className="border-t border-line px-4 py-2.5 text-ui text-ink-secondary">{active.caption}</p>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition-colors duration-fast hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {children}
    </button>
  );
}
