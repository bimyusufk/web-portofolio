import { cn } from "@/lib/utils";

/**
 * Blok kode bergaya dokumentasi Google Cloud: bar nama berkas di atas,
 * badan bergulir horizontal, huruf Google Sans Code.
 */
export function CodeBlock({
  code,
  language,
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-lg border border-line", className)}>
      {(filename || language) && (
        <figcaption className="flex items-center justify-between border-b border-line bg-surface-subtle px-4 py-2">
          <span className="font-mono text-caption text-ink-secondary">{filename ?? language}</span>
          {filename && language && (
            <span className="text-caption uppercase tracking-[0.05em] text-ink-tertiary">{language}</span>
          )}
        </figcaption>
      )}
      <pre className="scrollbar-thin overflow-x-auto bg-surface p-4">
        <code className="font-mono text-ui leading-relaxed text-ink">{code}</code>
      </pre>
    </figure>
  );
}
