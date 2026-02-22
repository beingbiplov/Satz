import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * supabaseServer()
 * - Async because Next's cookies() is async in newer Next versions.
 * - Returns a Supabase client wired to read/write auth cookies.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
