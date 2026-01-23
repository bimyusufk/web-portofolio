/**
 * IMPORTANT:
 * You CANNOT use Prisma (directly or indirectly through NextAuth PrismaAdapter)
 * inside Next.js Middleware because it runs on the Edge runtime.
 *
 * We intentionally keep this middleware empty to avoid triggering
 * "PrismaClient is not configured to run in Edge Runtime".
 *
 * Admin protection is handled in server components/routes instead (Node runtime).
 */

import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
