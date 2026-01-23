import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";

const githubId = process.env.GITHUB_ID || "placeholder-client-id";
const githubSecret = process.env.GITHUB_SECRET || "placeholder-client-secret";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [
    GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      const allowedGithubId = process.env.ADMIN_GITHUB_ID;
      if (allowedGithubId && account?.providerAccountId !== allowedGithubId) {
        console.log("Unauthorized GitHub ID:", account?.providerAccountId);
        return false;
      }
      return true;
    },
    authorized({ request, auth }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) return Boolean(auth);
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const typedUser = user as { role?: string | null; githubId?: string | null };
        session.user.role = typedUser.role ?? undefined;
        session.user.githubId = typedUser.githubId ?? undefined;
      }
      return session;
    },
  },
});
