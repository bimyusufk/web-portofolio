import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth, signOut } from "@/lib/auth";
import { Award, Briefcase, FileText, FolderOpen, Image, Lightbulb, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
export const runtime = "nodejs";

const adminSections = [
  {
    title: "Projects",
    description: "Manage portfolio projects",
    href: "/admin/content/projects",
    icon: FolderOpen,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Research",
    description: "Academic papers and articles",
    href: "/admin/content/research",
    icon: Lightbulb,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Experience",
    description: "Work history and roles",
    href: "/admin/experience",
    icon: Briefcase,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Activities",
    description: "Speaking, awards, and OSS",
    href: "/admin/activities",
    icon: Award,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Media Library",
    description: "Images and file uploads",
    href: "/admin/media",
    icon: Image,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Settings",
    description: "Site configuration",
    href: "/admin/settings",
    icon: Settings,
    color: "bg-slate-100 text-slate-600",
  },
];

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    console.warn("No session found, redirecting to sign-in page.");
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Private owner-only controls for content and media.</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </div>

        {/* User Info Card */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">Signed in as</p>
              <p className="text-sm text-slate-700">{session.user.email ?? session.user.name}</p>
              <p className="text-xs text-slate-500">GitHub ID: {session.user.githubId ?? "not linked"}</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
              {session.user.role ?? "OWNER"}
            </span>
          </div>
        </Card>

        {/* Admin Sections Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="group h-full transition-all hover:ring-2 hover:ring-rose-200">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-rose-700">{section.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-rose-50 to-amber-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-600">Add new content to your portfolio</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/admin/content/projects/new">
                  <FileText className="h-4 w-4" /> New Project
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/admin/content/research/new">
                  <Lightbulb className="h-4 w-4" /> New Research
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
