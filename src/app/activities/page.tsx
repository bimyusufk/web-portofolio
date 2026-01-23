import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ActivityCard } from "@/components/activity-card";
import { db } from "@/lib/prisma";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activities — Bim Yusuf",
  description: "Speaking engagements, mentoring, awards, and open-source contributions by Bim Yusuf.",
};

type ParsedActivity = {
  id: string;
  title: string;
  type: "SPEAKER" | "MENTOR" | "AWARD" | "OSS";
  date: Date;
  descriptionMDX: string;
  links: string[];
  thumbnailId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function ActivitiesPage() {
  const activities = await db.activity.findMany({
    orderBy: { date: "desc" },
  });

  // Parse JSON fields and type-cast
  const parsedActivities: ParsedActivity[] = activities.map((a) => ({
    ...a,
    links: JSON.parse(a.links) as string[],
    type: a.type as "SPEAKER" | "MENTOR" | "AWARD" | "OSS",
  }));

  const grouped = {
    SPEAKER: parsedActivities.filter((a) => a.type === "SPEAKER"),
    MENTOR: parsedActivities.filter((a) => a.type === "MENTOR"),
    AWARD: parsedActivities.filter((a) => a.type === "AWARD"),
    OSS: parsedActivities.filter((a) => a.type === "OSS"),
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 lg:py-16">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Activities</h1>
          <p className="mt-2 text-lg text-[rgb(var(--foreground)/0.70)]">
            Speaking, mentoring, awards, and open-source contributions.
          </p>
        </div>

        {parsedActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/50 px-8 py-16 text-center">
            <p className="text-slate-600">No activities yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.SPEAKER.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Speaking</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grouped.SPEAKER.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              </section>
            )}

            {grouped.MENTOR.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Mentoring</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grouped.MENTOR.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              </section>
            )}

            {grouped.AWARD.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Awards</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grouped.AWARD.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              </section>
            )}

            {grouped.OSS.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Open Source</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grouped.OSS.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
