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
  summary: string;
  mdxContent: string;
  role: string;
  tech: string;
  type: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
};

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [galleryIds, setGalleryIds] = useState<string[]>([]);

  const createProject = trpc.content.createProject.useMutation({
    onSuccess: () => {
      router.push("/admin/content");
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
      summary: "",
      mdxContent: "",
      role: "",
      tech: "",
      type: "",
      demoUrl: "",
      repoUrl: "",
      featured: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    createProject.mutate({
      ...data,
      tech: data.tech.split(",").map((t) => t.trim()).filter(Boolean),
      demoUrl: data.demoUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      thumbnailId: thumbnailId || undefined,
      galleryIds,
    });
  };

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Content
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">New Project</h1>
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
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="My Awesome Project"
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
                  placeholder="my-awesome-project"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="summary" className="block text-sm font-medium text-slate-700">
                Summary *
              </label>
              <textarea
                id="summary"
                rows={3}
                {...register("summary", { required: "Summary is required" })}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                placeholder="A brief description of the project..."
              />
              {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary.message}</p>}
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
                label="Project Gallery"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  {...register("role")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="Full-stack Developer"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                  Type
                </label>
                <input
                  id="type"
                  type="text"
                  {...register("type")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="Web App, Research, OSS..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="tech" className="block text-sm font-medium text-slate-700">
                Technologies (comma-separated)
              </label>
              <input
                id="tech"
                type="text"
                {...register("tech")}
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                placeholder="Next.js, TypeScript, Prisma, Supabase"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="demoUrl" className="block text-sm font-medium text-slate-700">
                  Demo URL
                </label>
                <input
                  id="demoUrl"
                  type="url"
                  {...register("demoUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div>
                <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-700">
                  Repository URL
                </label>
                <input
                  id="repoUrl"
                  type="url"
                  {...register("repoUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="h-4 w-4 rounded border-rose-300 text-rose-500 focus:ring-rose-200"
                />
                <span className="text-sm font-medium text-slate-700">Featured project</span>
              </label>
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
                placeholder="Tulis deskripsi project Anda di sini.&#10;&#10;Paragraf pertama.&#10;&#10;Paragraf kedua.&#10;&#10;Baris baru akan dipertahankan."
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createProject.isPending}>
              <Save className="h-4 w-4" />
              {createProject.isPending ? "Saving..." : "Save as Draft"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
