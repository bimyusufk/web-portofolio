"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePicker } from "@/components/image-picker";
import { GalleryManager } from "@/components/gallery-manager";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  title: string;
  slug: string;
  authors: string;
  venue: string;
  year: string;
  doi: string;
  pdfUrl: string;
  summary: string;
  mdxContent: string;
  keywords: string;
};

export default function NewResearchPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [galleryIds, setGalleryIds] = useState<string[]>([]);

  const createResearch = trpc.content.createResearch.useMutation({
    onSuccess: () => {
      router.push("/admin/content/research");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      slug: "",
      authors: "",
      venue: "",
      year: new Date().getFullYear().toString(),
      doi: "",
      pdfUrl: "",
      summary: "",
      mdxContent: "",
      keywords: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    createResearch.mutate({
      title: data.title,
      slug: data.slug,
      authors: data.authors.split(",").map((a) => a.trim()).filter(Boolean),
      venue: data.venue || undefined,
      year: data.year ? parseInt(data.year) : undefined,
      doi: data.doi || undefined,
      pdfUrl: data.pdfUrl || undefined,
      summary: data.summary,
      mdxContent: data.mdxContent,
      keywords: data.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      thumbnailId: thumbnailId || undefined,
      galleryIds,
    });
  };

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/content/research"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Research
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">New Research Paper</h1>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Basic Info</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="My Research Paper Title"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                  Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  {...register("slug", { required: "Slug is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="my-research-paper"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label htmlFor="authors" className="block text-sm font-medium text-slate-700">
                  Authors * (comma-separated)
                </label>
                <input
                  id="authors"
                  type="text"
                  {...register("authors", { required: "Authors are required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="Bim Yusuf, John Doe, Jane Smith"
                />
                {errors.authors && <p className="mt-1 text-xs text-red-500">{errors.authors.message}</p>}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Images</h2>
            <div className="mt-4 space-y-4">
              <ImagePicker
                selectedImageId={thumbnailId}
                onSelect={(id) => setThumbnailId(id)}
                label="Thumbnail"
                aspectRatio="video"
              />
              <GalleryManager
                galleryImageIds={galleryIds}
                onChange={setGalleryIds}
                label="Research Gallery"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Publication Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-slate-700">
                  Venue
                </label>
                <input
                  id="venue"
                  type="text"
                  {...register("venue")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="NeurIPS, ACL, EMNLP..."
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  {...register("year")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="2024"
                />
              </div>

              <div>
                <label htmlFor="doi" className="block text-sm font-medium text-slate-700">
                  DOI
                </label>
                <input
                  id="doi"
                  type="text"
                  {...register("doi")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="10.1234/example.doi"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pdfUrl" className="block text-sm font-medium text-slate-700">
                  PDF URL
                </label>
                <input
                  id="pdfUrl"
                  type="url"
                  {...register("pdfUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://arxiv.org/pdf/..."
                />
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-700">
                  Keywords (comma-separated)
                </label>
                <input
                  id="keywords"
                  type="text"
                  {...register("keywords")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="NLP, Machine Learning, Transformers"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Summary</h2>
            <div className="mt-4">
              <textarea
                id="summary"
                rows={4}
                {...register("summary", { required: "Summary is required" })}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                placeholder="A brief abstract or summary of the research..."
              />
              {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary.message}</p>}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Content (MDX)</h2>
            <div className="mt-4">
              <textarea
                id="mdxContent"
                rows={12}
                {...register("mdxContent")}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 font-mono text-sm"
                style={{ whiteSpace: 'pre-wrap' }}
                placeholder="Tulis detail research paper Anda di sini.&#10;&#10;Paragraf pertama.&#10;&#10;Paragraf kedua.&#10;&#10;Baris baru akan dipertahankan."
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createResearch.isPending}>
              <Save className="h-4 w-4" />
              {createResearch.isPending ? "Saving..." : "Save as Draft"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
