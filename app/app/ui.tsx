"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

import { Button } from "@/components/common/button";

export default function AppShell({ email }: { email: string }) {
  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className='min-h-screen bg-satz-bg text-satz-text'>
      <header className='border-b border-satz-border/50'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
          <div className='text-lg font-semibold tracking-tight'>Satz</div>

          <div className='flex items-center gap-3'>
            <div className='hidden text-sm text-satz-muted sm:block'>{email}</div>
            <Button variant='ghost' onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-6xl px-6 py-10'>
        <div className='rounded-2xl border border-satz-border/60 bg-white/5 p-6'>
          <div className='text-sm font-semibold'>Authenticated ✅</div>
        </div>
      </div>
    </main>
  );
}
