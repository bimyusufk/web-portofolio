import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Code2, Database, Brain, Container, GitBranch, Zap } from "lucide-react";
import Link from "next/link";

const keyMetrics = [
  { value: "9.600+", label: "Sertifikat Digital Diterbitkan Secara Otomatis" },
  { value: "4.500+", label: "Pengguna Aktif Dilayani Secara Stabil" },
  { value: "5+", label: "Proyek Teknologi Berskala Besar" },
  { value: "6", label: "Pengalaman Kerja & Kepemimpinan Organisasi" },
];

const techStack = [
  {
    category: "Web Architecture",
    icon: Code2,
    skills: ["Next.js", "Laravel", "TALL Stack", "Database Design"],
  },
  {
    category: "Data & AI",
    icon: Brain,
    skills: ["Python", "MongoDB", "ML Research", "Statistics"],
  },
  {
    category: "Tools",
    icon: Container,
    skills: ["Docker", "Git", "Vercel", "CI/CD"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-6xl flex-col gap-16 px-[72px] pt-0 pb-12 md:px-[96px] lg:px-[144px] xl:px-[192px] lg:pt-0 lg:pb-40">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 shadow-2xl ring-1 ring-emerald-500/20 md:px-12 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur">
              <Zap className="h-4 w-4" />
              <span>Tech Lead & Software Engineer</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Membangun Solusi dengan Arsitektur Digital dan AI untuk{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Dampak Nyata
              </span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 text-base">
                <Link href="/projects">
                  Lihat Proyek Saya
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-6 py-3 text-base">
                <Link href="/contact">Hubungi Saya</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keyMetrics.map((metric, i) => (
              <Card key={i} className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 text-center shadow-lg">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)]" aria-hidden />
                <div className="relative space-y-2">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 lg:text-5xl">
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Value Proposition */}
        <section className="space-y-6">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="text-3xl font-bold text-white">Tentang Saya</h2>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Saya menjembatani kebutuhan organisasi dengan solusi teknologi. Berpengalaman memimpin tim teknis dalam mentransformasi proses manual menjadi sistem digital yang efisien dan otomatis.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/experience" className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/30 transition hover:bg-emerald-100 dark:hover:bg-emerald-950/50">
                Lihat Pengalaman
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/research" className="inline-flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 transition hover:bg-slate-100 dark:hover:bg-slate-700">
                Riset & Publikasi
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Keahlian Utama</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Teknologi yang saya kuasai untuk membangun solusi end-to-end</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {techStack.map((stack, i) => {
              const Icon = stack.icon;
              return (
                <Card key={i} className="border-emerald-500/20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-500/10 p-2.5">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{stack.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stack.skills.map((skill, j) => (
                        <span
                          key={j}
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
