import type { PortableTextBlock } from "@portabletext/react";

import type { SanityImage } from "@/sanity/lib/image";

/** Bentuk hasil kueri GROQ setelah field terlokalisasi diratakan ke satu bahasa. */

export type Metric = { value: string; label: string };

export type ProjectCardData = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  role: string | null;
  projectType: string | null;
  techStack: string[] | null;
  featured: boolean | null;
  publishedAt: string | null;
  year: string | null;
  cover: SanityImage | null;
  metrics: Metric[] | null;
};

export type ProjectDetailData = ProjectCardData & {
  _updatedAt: string;
  body: PortableTextBlock[] | null;
  demoUrl: string | null;
  repoUrl: string | null;
  gallery: SanityImage[] | null;
};

export type ResearchState = "ongoing" | "review" | "published";

export type ResearchCardData = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  authors: string[] | null;
  venue: string | null;
  year: number | null;
  doi: string | null;
  state: ResearchState | null;
  keywords: string[] | null;
  pdfUrl: string | null;
  cover: SanityImage | null;
};

export type ResearchDetailData = ResearchCardData & {
  _updatedAt: string;
  body: PortableTextBlock[] | null;
  gallery: SanityImage[] | null;
};

export type ExperienceData = {
  _id: string;
  company: string;
  role: string;
  description: PortableTextBlock[] | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  employmentType: string | null;
  highlights: string[] | null;
  logo: SanityImage | null;
};

export type ActivityCategory = "SPEAKER" | "MENTOR" | "AWARD" | "OSS";

export type ActivityData = {
  _id: string;
  title: string;
  description: string | null;
  category: ActivityCategory;
  date: string;
  organiser: string | null;
  links: { label: string; url: string }[] | null;
  cover: SanityImage | null;
};

export type SkillGroupData = {
  _id: string;
  category: string;
  icon: string | null;
  skills: string[];
};

export type AdjacentProject = { title: string; slug: string; summary: string } | null;
