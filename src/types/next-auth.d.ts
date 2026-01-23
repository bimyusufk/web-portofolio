import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string | null;
      githubId?: string | null;
    };
  }

  interface User {
    role?: string | null;
    githubId?: string | null;
  }
}
