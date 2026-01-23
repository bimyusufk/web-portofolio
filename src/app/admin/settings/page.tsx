"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Globe, Mail, Save, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

type SettingsFormData = {
  siteName: string;
  siteDescription: string;
  authorName: string;
  authorTitle: string;
  authorBio: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
};

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>({
    defaultValues: {
      siteName: "Bim Yusuf Portfolio",
      siteDescription:
        "Personal portfolio and research hub for Bim Yusuf — Full-stack developer, researcher, and technologist building impactful software solutions.",
      authorName: "Bim Yusuf",
      authorTitle: "Full-Stack Developer & Researcher",
      authorBio:
        "I'm a passionate developer and researcher focused on building impactful software solutions.",
      contactEmail: "hello@bimyusuf.com",
      githubUrl: "https://github.com/bimyusuf",
      linkedinUrl: "https://linkedin.com/in/bimyusuf",
      twitterUrl: "https://twitter.com/bimyusuf",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    // In a real implementation, this would save to a database or env vars
    console.log("Settings saved:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">
            Configure your portfolio site settings and metadata.
          </p>
        </div>

        {saved && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 ring-1 ring-green-200">
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Site Information */}
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <Globe className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Site Information</h2>
                <p className="text-sm text-slate-500">General site metadata and SEO settings</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">
                  Site Name
                </label>
                <input
                  id="siteName"
                  type="text"
                  {...register("siteName")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-slate-700">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  {...register("siteDescription")}
                  className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Used for SEO meta description and social sharing
                </p>
              </div>
            </div>
          </Card>

          {/* Author Information */}
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <User className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Author Information</h2>
                <p className="text-sm text-slate-500">Your personal details displayed on the site</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-slate-700">
                  Your Name
                </label>
                <input
                  id="authorName"
                  type="text"
                  {...register("authorName")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="authorTitle" className="block text-sm font-medium text-slate-700">
                  Job Title
                </label>
                <input
                  id="authorTitle"
                  type="text"
                  {...register("authorTitle")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="authorBio" className="block text-sm font-medium text-slate-700">
                  Short Bio
                </label>
                <textarea
                  id="authorBio"
                  rows={3}
                  {...register("authorBio")}
                  className="mt-1 w-full resize-none rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Contact & Social */}
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/20">
                <Mail className="h-5 w-5 text-mint-dark" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Contact & Social Links</h2>
                <p className="text-sm text-slate-500">How visitors can reach you</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  {...register("githubUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-700">
                  LinkedIn URL
                </label>
                <input
                  id="linkedinUrl"
                  type="url"
                  {...register("linkedinUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-slate-700">
                  Twitter/X URL
                </label>
                <input
                  id="twitterUrl"
                  type="url"
                  {...register("twitterUrl")}
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white/50 px-4 py-2.5 text-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>

        {/* Environment Info */}
        <Card className="bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Environment Information</h3>
          <p className="mt-2 text-sm text-slate-600">
            Some settings require environment variables to be configured. See your{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">.env.local</code> file for:
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            <li>
              <code className="rounded bg-slate-200 px-1 py-0.5">NEXT_PUBLIC_APP_URL</code> - Your production URL
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1 py-0.5">ADMIN_GITHUB_ID</code> - GitHub user ID for admin
              access
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1 py-0.5">AUTH_SECRET</code> - NextAuth secret key
            </li>
          </ul>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
