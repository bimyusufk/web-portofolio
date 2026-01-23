"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, ExternalLink, Mic, Users, Code } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  type: "SPEAKER" | "MENTOR" | "AWARD" | "OSS";
  date: Date;
  descriptionMDX: string;
  links: string[];
};

const icons = {
  SPEAKER: Mic,
  MENTOR: Users,
  AWARD: Award,
  OSS: Code,
};

const colors = {
  SPEAKER: "bg-rose-50 text-rose-700",
  MENTOR: "bg-amber-50 text-amber-700",
  AWARD: "bg-accent/10 text-accent",
  OSS: "bg-slate-100 text-slate-700",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(date));
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = icons[activity.type];

  return (
    <motion.article
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group rounded-2xl bg-white/80 dark:bg-slate-800/50 p-5 shadow-card ring-1 ring-rose-50 dark:ring-slate-700/50 backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[activity.type]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-foreground">{activity.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(activity.date)}</p>
          <p className="text-sm text-[rgb(var(--foreground)/0.80)]">{activity.descriptionMDX}</p>
          {activity.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {activity.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-800"
                >
                  <ExternalLink className="h-3 w-3" /> Link
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
