"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePicker } from "@/components/image-picker";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

type FormData = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  descriptionMDX: string;
  highlights: string;
};

export default function EditExperiencePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);

  const { data: experience, isLoading } = trpc.content.getExperience.useQuery({ id });

  const updateExperience = trpc.content.updateExperience.useMutation({
    onSuccess: () => {
      router.push("/admin/experience");
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
    if (experience) {
      reset({
        company: experience.company,
        role: experience.role,
        startDate: new Date(experience.startDate).toISOString().split("T")[0],
        endDate: experience.endDate
          ? new Date(experience.endDate).toISOString().split("T")[0]
          : "",
        location: experience.location || "",
        descriptionMDX: experience.descriptionMDX,
        highlights: experience.highlights.join("\n"),
      });
      setThumbnailId((experience as any).thumbnailId || null);
    }
  }, [experience, reset]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    updateExperience.mutate({
      id,
      company: data.company,
      role: data.role,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      location: data.location || null,
      descriptionMDX: data.descriptionMDX,
      highlights: data.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      thumbnailId: thumbnailId || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface/60">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface/60">
        <p className="text-slate-600">Experience not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/experience"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Experience
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">Edit Experience</h1>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Position Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                  Company *
                </label>
                <input
                  id="company"
                  type="text"
                  {...register("company", { required: "Company is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                  Role *
                </label>
                <input
                  id="role"
                  type="text"
                  {...register("role", { required: "Role is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  {...register("startDate", { required: "Start date is required" })}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">Leave empty for current position</p>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  {...register("location")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Company Logo</h2>
            <div className="mt-4">
              <ImagePicker
                selectedImageId={thumbnailId}
                onSelect={(id) => setThumbnailId(id)}
                label="Logo"
                aspectRatio="square"
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
              />
            </div>

            <div className="mt-4">
              <label htmlFor="highlights" className="block text-sm font-medium text-slate-700">
                Key Highlights (one per line)
              </label>
              <textarea
                id="highlights"
                rows={5}
                {...register("highlights")}
                className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateExperience.isPending}>
              <Save className="h-4 w-4" />
              {updateExperience.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
