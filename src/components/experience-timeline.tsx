"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import Image from "next/image";

type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  descriptionMDX: string;
  highlights: string[];
  thumbnail?: {
    url: string;
    altText: string | null;
  } | null;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(date));
}

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative space-y-8">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-rose-200 via-rose-100 to-transparent md:left-1/2 md:-translate-x-0.5" />

      {experiences.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
            i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12 md:text-left"
          }`}
        >
          <div
            className={`absolute left-2 top-1 h-5 w-5 rounded-full border-4 border-rose-500 bg-white md:left-auto ${
              i % 2 === 0 ? "md:-right-2.5" : "md:-left-2.5"
            }`}
          />

          <div
            className={`rounded-2xl bg-white/80 dark:bg-slate-800/50 p-6 shadow-card ring-1 ring-rose-50 dark:ring-slate-700/50 backdrop-blur ${
              i % 2 === 0 ? "" : ""
            }`}
          >
            <div className={`flex items-start gap-3 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              {exp.thumbnail ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                  <Image
                    src={exp.thumbnail.url}
                    alt={exp.thumbnail.altText || exp.company}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <Briefcase className="h-5 w-5" />
                </span>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                <p className="text-sm font-medium text-rose-700">{exp.company}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                {exp.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 md:justify-end">
                    <MapPin className="h-3 w-3" /> {exp.location}
                  </p>
                )}
              </div>
            </div>

            {exp.highlights.length > 0 && (
              <ul className={`mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                {exp.highlights.map((h, j) => (
                  <li key={j}>• {h}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
