import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import type { Session } from "next-auth";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import superjson from "superjson";

export type Context = {
  session: Session | null;
  db: typeof db;
};

export async function createContext(): Promise<Context> {
  const session = (await auth()) as Session | null;
  return { session, db };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.session?.user?.role ?? "OWNER";
  if (role !== "OWNER" && role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});
