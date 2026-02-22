import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Google -> Supabase -> your app lands here with ?code=...
 * We exchange the code for a session and set auth cookies on the response.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // We'll redirect to /app if exchange succeeds
  const response = NextResponse.redirect(`${origin}/app`);

  const supabase = createServerClient(
    mustGetEnv("NEXT_PUBLIC_SUPABASE_URL"),
    mustGetEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        // Read cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },
        // Write cookies to the outgoing response
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  return response;
}
