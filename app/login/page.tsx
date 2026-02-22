"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className='min-h-screen bg-satz-bg text-satz-text'>
      <div className='mx-auto flex min-h-screen max-w-md items-center px-6'>
        <div className='w-full rounded-2xl border border-satz-border/60 bg-white/5 p-6'>
          <div className='text-xl font-semibold tracking-tight'>Satz</div>
          <p className='mt-2 text-sm text-satz-muted'>Sign in to continue.</p>

          <button
            onClick={signInWithGoogle}
            className='mt-6 w-full rounded-lg bg-satz-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-satz-blue/90'
          >
            Continue with Google
          </button>

          <p className='mt-4 text-xs text-satz-muted'>By continuing, you agree to the Terms and Privacy Policy.</p>
        </div>
      </div>
    </main>
  );
}
