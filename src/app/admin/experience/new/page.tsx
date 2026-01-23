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
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  descriptionMDX: string;
  highlights: string;
};

export default function NewExperiencePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);

  const createExperience = trpc.content.createExperience.useMutation({
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
  } = useForm<FormData>({
    defaultValues: {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      descriptionMDX: "",
      highlights: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    createExperience.mutate({
      company: data.company,
      role: data.role,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      location: data.location || undefined,
      descriptionMDX: data.descriptionMDX,
      highlights: data.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      thumbnailId: thumbnailId || undefined,
    });
  };

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
          <h1 className="text-3xl font-bold text-slate-900">Add Experience</h1>
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
                  placeholder="Company Name"
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
                  placeholder="Software Engineer"
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
                  placeholder="San Francisco, CA"
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
                placeholder="Describe your role and responsibilities..."
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
                placeholder="Led a team of 5 engineers&#10;Increased performance by 40%&#10;Launched 3 major features"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createExperience.isPending}>
              <Save className="h-4 w-4" />
              {createExperience.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
