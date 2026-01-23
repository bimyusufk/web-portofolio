import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Bim Yusuf",
  description:
    "Learn about Bim Yusuf (Bim Yusuf Karang) — product engineer and researcher building performant, human-first experiences.",
};

const skills = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "tRPC", "Prisma", "PostgreSQL"] },
  { category: "Tools", items: ["Git", "Docker", "Vercel", "Supabase", "Figma"] },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 lg:py-16">
        <section className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="relative h-48 w-48 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 shadow-card ring-1 ring-rose-100">
              <Image
                src="/avatar.svg"
                alt="Bim Yusuf"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <Button asChild>
                <Link href="/cv-bim-yusuf-karang.pdf" download>
                  <Download className="h-4 w-4" /> CV
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/contact">
                  <Mail className="h-4 w-4" /> Contact
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Bim Yusuf</h1>
              <p className="mt-1 text-lg text-slate-600">Product Engineer &amp; Researcher</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4" /> Indonesia
              </p>
            </div>

            <div className="prose prose-slate max-w-none">
              <p>
                Hi, I&apos;m <strong>Bim Yusuf</strong> (legal name: <em>Bim Yusuf Karang</em>). I&apos;m
                a product engineer and researcher focused on building performant, human-first digital
                experiences backed by solid systems.
              </p>
              <p>
                I specialize in full-stack development with TypeScript, React/Next.js, and modern
                backend technologies. My work spans from crafting intuitive user interfaces to
                designing scalable APIs and data pipelines.
              </p>
              <p>
                Beyond engineering, I&apos;m passionate about human-computer interaction research,
                exploring how we can make technology more accessible and delightful for everyone.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me reading research papers, contributing to
                open-source projects, or mentoring aspiring developers.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Skills &amp; Technologies</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <Card key={skill.category}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">
                  {skill.category}
                </h3>
                <ul className="mt-3 space-y-1">
                  {skill.items.map((item) => (
                    <li key={item} className="text-sm text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
          <p className="text-slate-600">
            Interested in working together or just want to chat? Feel free to reach out!
          </p>
          <Button asChild>
            <Link href="/contact">Let&apos;s talk</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
