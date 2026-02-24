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

  // refresh + get user in one call
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // --- Route groups ---
  const isAppRoute = pathname === "/app" || pathname.startsWith("/app/");
  const isApiRoute = pathname.startsWith("/api/");
  const isLoginRoute = pathname === "/login";
  const isAuthCallback = pathname.startsWith("/auth/callback"); // allow always

  // Always allow auth callback (prevents loops during OAuth)
  if (isAuthCallback) return res;

  // Protect app pages
  if (!user && isAppRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // optional: send them back after login
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Protect API routes (recommended if you don’t want public LLM access)
  // If you prefer API to return 401 JSON instead of redirect, see note below.
  if (!user && isApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If logged in, don’t show login page
  if (user && isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return res;
}

/**
 * Only run middleware on real pages/api routes (not static assets).
 * Also exclude auth callback from matcher if you want (optional),
 * but we already allow it inside middleware.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
