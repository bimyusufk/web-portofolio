import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";

// Helper for SQLite JSON arrays
const serialize = (data: any) => JSON.stringify(data || []);
const deserialize = (data: string | null) => {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const projectInput = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  mdxContent: z.string().default(""),
  role: z.string().optional(),
  tech: z.array(z.string()).default([]),
  type: z.string().optional(),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  images: z.array(z.string()).default([]),
  thumbnailId: z.string().nullable().optional(),
  galleryIds: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
});

const projectUpdateInput = projectInput.partial().extend({
  id: z.string(),
});

const researchInput = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  authors: z.array(z.string()),
  venue: z.string().optional(),
  year: z.number().int().optional(),
  doi: z.string().optional(),
  pdfUrl: z.string().url().optional(),
  summary: z.string().min(10),
  mdxContent: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  thumbnailId: z.string().nullable().optional(),
  galleryIds: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
});

const researchUpdateInput = researchInput.partial().extend({
  id: z.string(),
});

export const contentRouter = router({
  // Projects
  listProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return projects.map((p) => ({
      ...p,
      tech: deserialize(p.tech),
      images: deserialize(p.images),
    }));
  }),
  
  getProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
      });
      if (!project) return null;
      // Fetch gallery images separately due to schema structure
      const galleryImages = await ctx.db.media.findMany({
        where: { projectGalleryId: project.id },
        select: { id: true },
      });
      return {
        ...project,
        tech: deserialize(project.tech),
        images: deserialize(project.images),
        galleryIds: galleryImages.map((img) => img.id),
      };
    }),
    
  createProject: adminProcedure.input(projectInput).mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) throw new Error("Missing user id");
    const { galleryIds, tech, images, ...projectData } = input;
    
    // @ts-ignore - types mismatch with old generation
    const project = await ctx.db.project.create({
      data: {
        ...projectData,
        tech: serialize(tech),
        images: serialize(images),
        createdById: userId,
      },
    });
    
    // Link gallery images if provided
    if (galleryIds && galleryIds.length > 0) {
      await ctx.db.media.updateMany({
        where: { id: { in: galleryIds } },
        data: { projectGalleryId: project.id },
      });
    }
    
    return {
      ...project,
      tech: deserialize(project.tech),
      images: deserialize(project.images),
    };
  }),
  
  updateProject: adminProcedure.input(projectUpdateInput).mutation(async ({ ctx, input }) => {
    const { id, galleryIds, tech, images, ...data } = input;
    
    // Update basic fields including thumbnailId
    // @ts-ignore
    await ctx.db.project.update({
      where: { id },
      data: {
        ...data,
        ...(tech && { tech: serialize(tech) }),
        ...(images && { images: serialize(images) }),
      },
    });
    
    // If galleryIds is provided, update the gallery
    if (galleryIds !== undefined) {
      // First, remove this project from all media items
      await ctx.db.media.updateMany({
        where: { projectGalleryId: id },
        data: { projectGalleryId: null },
      });
      // Then, add the new gallery items
      if (galleryIds.length > 0) {
        await ctx.db.media.updateMany({
          where: { id: { in: galleryIds } },
          data: { projectGalleryId: id },
        });
      }
    }
    
    const updated = await ctx.db.project.findUnique({ where: { id } });
    if (!updated) return null;
    return {
      ...updated,
      tech: deserialize(updated.tech),
      images: deserialize(updated.images),
    };
  }),
  
  deleteProject: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),
    
  publishProject: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    }),

  // Research
  listResearch: protectedProcedure.query(async ({ ctx }) => {
    const research = await ctx.db.research.findMany({ orderBy: { updatedAt: "desc" } });
    return research.map((r) => ({
      ...r,
      authors: deserialize(r.authors),
      keywords: deserialize(r.keywords),
    }));
  }),
  
  getResearch: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const research = await ctx.db.research.findUnique({
        where: { id: input.id },
      });
      if (!research) return null;
      // Fetch gallery images separately due to schema structure
      const galleryImages = await ctx.db.media.findMany({
        where: { researchGalleryId: research.id },
        select: { id: true },
      });
      return {
        ...research,
        authors: deserialize(research.authors),
        keywords: deserialize(research.keywords),
        galleryIds: galleryImages.map((img) => img.id),
      };
    }),
    
  createResearch: adminProcedure.input(researchInput).mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) throw new Error("Missing user id");
    const { galleryIds, authors, keywords, ...researchData } = input;
    
    // @ts-ignore
    const research = await ctx.db.research.create({
      data: {
        ...researchData,
        authors: serialize(authors),
        keywords: serialize(keywords),
        createdById: userId,
      },
    });
    
    // Link gallery images if provided
    if (galleryIds && galleryIds.length > 0) {
      await ctx.db.media.updateMany({
        where: { id: { in: galleryIds } },
        data: { researchGalleryId: research.id },
      });
    }
    
    return {
      ...research,
      authors: deserialize(research.authors),
      keywords: deserialize(research.keywords),
    };
  }),
  
  updateResearch: adminProcedure.input(researchUpdateInput).mutation(async ({ ctx, input }) => {
    const { id, galleryIds, authors, keywords, ...data } = input;
    
    // Update basic fields including thumbnailId
    // @ts-ignore
    await ctx.db.research.update({
      where: { id },
      data: {
        ...data,
        ...(authors && { authors: serialize(authors) }),
        ...(keywords && { keywords: serialize(keywords) }),
      },
    });
    
    // If galleryIds is provided, update the gallery
    if (galleryIds !== undefined) {
      // First, remove this research from all media items
      await ctx.db.media.updateMany({
        where: { researchGalleryId: id },
        data: { researchGalleryId: null },
      });
      // Then, add the new gallery items
      if (galleryIds.length > 0) {
        await ctx.db.media.updateMany({
          where: { id: { in: galleryIds } },
          data: { researchGalleryId: id },
        });
      }
    }
    
    const updated = await ctx.db.research.findUnique({ where: { id } });
    if (!updated) return null;
    return {
      ...updated,
      authors: deserialize(updated.authors),
      keywords: deserialize(updated.keywords),
    };
  }),
  
  deleteResearch: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.research.delete({ where: { id: input.id } });
    }),
    
  publishResearch: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.research.update({
        where: { id: input.id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    }),

  // Experience
  listExperience: protectedProcedure.query(async ({ ctx }) => {
    const experiences = await ctx.db.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return experiences.map((e) => ({
      ...e,
      highlights: deserialize(e.highlights),
    }));
  }),

  getExperience: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const exp = await ctx.db.experience.findUnique({ where: { id: input.id } });
      if (!exp) return null;
      return {
        ...exp,
        highlights: deserialize(exp.highlights),
      };
    }),

  createExperience: adminProcedure
    .input(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        startDate: z.date(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        descriptionMDX: z.string().default(""),
        highlights: z.array(z.string()).default([]),
        thumbnailId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { highlights, ...data } = input;
      // @ts-ignore
      const created = await ctx.db.experience.create({ 
        data: {
          ...data,
          highlights: serialize(highlights),
        }
      });
      return { ...created, highlights: deserialize(created.highlights) };
    }),

  updateExperience: adminProcedure
    .input(
      z.object({
        id: z.string(),
        company: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional().nullable(),
        location: z.string().optional().nullable(),
        descriptionMDX: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        thumbnailId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, highlights, ...data } = input;
      // @ts-ignore
      await ctx.db.experience.update({ 
        where: { id }, 
        data: {
          ...data,
          ...(highlights && { highlights: serialize(highlights) }),
        } 
      });
      const updated = await ctx.db.experience.findUnique({ where: { id } });
      if (!updated) return null;
      return { ...updated, highlights: deserialize(updated.highlights) };
    }),

  deleteExperience: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.experience.delete({ where: { id: input.id } });
    }),

  // Activities
  listActivities: protectedProcedure.query(async ({ ctx }) => {
    const activities = await ctx.db.activity.findMany({
      orderBy: { date: "desc" },
    });
    return activities.map((a) => ({
      ...a,
      links: deserialize(a.links),
    }));
  }),

  getActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const act = await ctx.db.activity.findUnique({ where: { id: input.id } });
      if (!act) return null;
      return {
        ...act,
        links: deserialize(act.links),
      };
    }),

  createActivity: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        type: z.enum(["SPEAKER", "MENTOR", "AWARD", "OSS"]),
        date: z.date(),
        descriptionMDX: z.string().default(""),
        links: z.array(z.string()).default([]),
        thumbnailId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { links, ...data } = input;
      // @ts-ignore
      const created = await ctx.db.activity.create({ 
        data: {
          ...data,
          links: serialize(links),
        }
      });
      return { ...created, links: deserialize(created.links) };
    }),

  updateActivity: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        type: z.enum(["SPEAKER", "MENTOR", "AWARD", "OSS"]).optional(),
        date: z.date().optional(),
        descriptionMDX: z.string().optional(),
        links: z.array(z.string()).optional(),
        thumbnailId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, links, ...data } = input;
      // @ts-ignore
      await ctx.db.activity.update({ 
        where: { id }, 
        data: {
          ...data,
          ...(links && { links: serialize(links) }),
        } 
      });
      const updated = await ctx.db.activity.findUnique({ where: { id } });
      if (!updated) return null;
      return { ...updated, links: deserialize(updated.links) };
    }),

  deleteActivity: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.activity.delete({ where: { id: input.id } });
    }),
});
