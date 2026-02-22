import { createBrowserClient } from "@supabase/ssr";

/**
 * supabaseBrowser()
 * - Used in Client Components (runs in the browser).
 * - Stores/reads session from browser cookies/local storage automatically.
 * - Used for actions like: signInWithOAuth, signOut, reading session client-side.
 */
export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
