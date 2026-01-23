"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePicker } from "@/components/image-picker";
import { GalleryManager } from "@/components/gallery-manager";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [galleryIds, setGalleryIds] = useState<string[]>([]);

  const { data: project, isLoading } = trpc.content.getProject.useQuery({ id });

  const updateProject = trpc.content.updateProject.useMutation({
    onSuccess: () => {
      router.push("/admin/content/projects");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const publishProject = trpc.content.publishProject.useMutation({
    onSuccess: () => {
      router.push("/admin/content/projects");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        mdxContent: project.mdxContent,
        role: project.role || "",
        tech: project.tech.join(", "),
        type: project.type || "",
        demoUrl: project.demoUrl || "",
        repoUrl: project.repoUrl || "",
        featured: project.featured,
      });
      setThumbnailId((project as any).thumbnailId || null);
      setGalleryIds((project as any).galleryIds || []);
    }
  }, [project, reset]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    updateProject.mutate({
      id,
      ...data,
      tech: data.tech.split(",").map((t) => t.trim()).filter(Boolean),
      demoUrl: data.demoUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      thumbnailId: thumbnailId || undefined,
      galleryIds,
    });
  };

  const handlePublish = () => {
    publishProject.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface/60">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface/60">
        <p className="text-slate-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/content/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900">Edit Project</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                project.status === "PUBLISHED"
                  ? "bg-accent/10 text-accent ring-accent/20"
                  : project.status === "DRAFT"
                  ? "bg-slate-100 text-slate-600 ring-slate-200"
                  : "bg-amber-50 text-amber-700 ring-amber-200"
              }`}
            >
              {project.status}
            </span>
          </div>
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
                placeholder="Tulis konten Anda di sini. Baris baru akan dipertahankan."
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            {project.status !== "PUBLISHED" && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePublish}
                disabled={publishProject.isPending}
              >
                <Send className="h-4 w-4" />
                {publishProject.isPending ? "Publishing..." : "Publish"}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || updateProject.isPending}>
              <Save className="h-4 w-4" />
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
