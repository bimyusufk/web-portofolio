"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const heroBadge = {
  title: "Bim Yusuf",
  subtitle: "Product engineer & researcher",
  blurb: "Designing performant, human-first experiences backed by solid systems.",
};

const highlights = [
  {
    label: "Full-stack",
    value: "Next.js · tRPC · Prisma · Supabase",
  },
  {
    label: "Research",
    value: "Human-computer interaction, ML systems",
  },
  {
    label: "Recent work",
    value: "Case studies shipped to production",
  },
];

const tech = ["TypeScript", "Next.js", "Supabase", "tRPC", "Tailwind", "Framer Motion"];

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.48, staggerChildren: 0.08 } },
  };

  const child = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
  };

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-hero-grad px-8 py-14 shadow-card ring-1 ring-rose-50 md:px-12 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,107,74,0.09),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(6,214,160,0.12),transparent_32%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 160 160%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-60"
        aria-hidden
      />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial="hidden" animate="visible" variants={container} className="space-y-6">
          <motion.div variants={child} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden />
            <span className="text-slate-700">{heroBadge.title}</span>
            <span className="text-slate-700">· {heroBadge.subtitle}</span>
          </motion.div>

          <motion.h1
            variants={child}
            className="text-2xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Building calm, resilient products that balance research depth and shipping speed.
          </motion.h1>

          <motion.p variants={child} className="max-w-2xl text-lg text-white">
            {heroBadge.blurb}
          </motion.p>

          <motion.div variants={child} className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/resume.pdf" download>
                <Download className="h-4 w-4" /> Download Resume
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/contact">
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={child} className="grid gap-4 rounded-2xl border border-rose-100 bg-white/70 p-4 backdrop-blur-md sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.08em] text-rose-700">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={child} className="flex flex-wrap gap-3 text-sm text-rose-700">
            {tech.map((label) => (
              <span
                key={label}
                className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 ring-1 ring-rose-100"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, transition: { duration: 0.5 } }}
        >
          <Card className="relative overflow-hidden bg-white/90 p-6 shadow-2xl ring-1 ring-rose-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-rose-700">Featured project</p>
                <h2 className="text-2xl font-bold text-[rgb(var(--foreground)/0.80)]">ResearchOps Dashboard</h2>
                <p className="text-sm text-[rgb(var(--foreground)/0.80)]">
                  End-to-end workflow for publishing research summaries, preview links, and media.
                </p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">
                Live demo
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-100 shadow-inner">
              <div className="relative aspect-[16/10]">
                <Image src="/hero-preview.svg" alt="Project preview" fill className="object-cover" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[rgb(var(--foreground)/0.80)]">
              {["tRPC", "Prisma", "Supabase Storage", "MDX", "Framer Motion"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/70 px-3 py-1 font-medium ring-1 ring-rose-100 dark:bg-slate-700/30"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
