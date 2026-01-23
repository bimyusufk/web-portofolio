"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePicker } from "@/components/image-picker";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  title: string;
  type: "SPEAKER" | "MENTOR" | "AWARD" | "OSS";
  date: string;
  descriptionMDX: string;
  links: string;
};

export default function NewActivityPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);

  const createActivity = trpc.content.createActivity.useMutation({
    onSuccess: () => {
      router.push("/admin/activities");
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
      type: "SPEAKER",
      date: "",
      descriptionMDX: "",
      links: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    createActivity.mutate({
      title: data.title,
      type: data.type,
      date: new Date(data.date),
      descriptionMDX: data.descriptionMDX,
      links: data.links.split("\n").map((l) => l.trim()).filter(Boolean),
      thumbnailId: thumbnailId || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/activities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Activities
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">Add Activity</h1>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Activity Details</h2>
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
                  placeholder="Keynote Speaker at Conference XYZ"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                  Type *
                </label>
                <select
                  id="type"
                  {...register("type", { required: "Type is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                >
                  <option value="SPEAKER">Speaker</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="AWARD">Award</option>
                  <option value="OSS">Open Source</option>
                </select>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Thumbnail</h2>
            <div className="mt-4">
              <ImagePicker
                selectedImageId={thumbnailId}
                onSelect={(id) => setThumbnailId(id)}
                label="Activity Thumbnail"
                aspectRatio="auto"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Description</h2>
            <div className="mt-4">
              <label htmlFor="descriptionMDX" className="block text-sm font-medium text-slate-700">
                Description (MDX)
              </label>
              <textarea
                id="descriptionMDX"
                rows={6}
                {...register("descriptionMDX")}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 font-mono text-sm"
                placeholder="Describe the activity..."
              />
            </div>

            <div className="mt-4">
              <label htmlFor="links" className="block text-sm font-medium text-slate-700">
                Related Links (one URL per line)
              </label>
              <textarea
                id="links"
                rows={3}
                {...register("links")}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                placeholder="https://example.com/talk&#10;https://slides.com/my-slides"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createActivity.isPending}>
              <Save className="h-4 w-4" />
              {createActivity.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
