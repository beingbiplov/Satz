import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware runs before routes.
 * Here we:
 * - create a Supabase server client using request cookies
 * - call getUser() which refreshes session cookies if needed
 * - return the response with updated cookies
 *
 * This prevents "randomly logged out" feeling and keeps SSR auth consistent.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // This refreshes auth session if expired/needs refresh
  await supabase.auth.getUser();

  return res;
}

/**
 * Only run middleware on real pages/api routes (not static assets).
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
