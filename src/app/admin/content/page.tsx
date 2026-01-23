import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
export const runtime = "nodejs";

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/admin/content");
  }

  const [projects, research] = await Promise.all([
    db.project.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
    db.research.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
  ]);

  type Project = (typeof projects)[number];
  type Research = (typeof research)[number];

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900">Content</h1>
            <p className="text-slate-600">Drafts, scheduled items, and recently updated entries.</p>
          </div>
          <Link
            href="/admin/content/new"
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-floating"
          >
            New entry
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
              <Link href="/admin/content/projects" className="text-sm font-semibold text-rose-700">
                Manage
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {projects.length === 0 && <p className="text-sm text-slate-600">No projects yet.</p>}
              {projects.map((item: Project) => (
                <div key={item.id} className="rounded-xl bg-white/60 px-3 py-2 text-sm shadow-inner ring-1 ring-rose-50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Research</h2>
              <Link href="/admin/content/research" className="text-sm font-semibold text-rose-700">
                Manage
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {research.length === 0 && <p className="text-sm text-slate-600">No research entries yet.</p>}
              {research.map((item: Research) => (
                <div key={item.id} className="rounded-xl bg-white/60 px-3 py-2 text-sm shadow-inner ring-1 ring-rose-50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
