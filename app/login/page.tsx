"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

import { Button } from "@/components/common/button";

function GoogleIcon() {
  return (
    <svg
      viewBox='0 0 48 48'
      width='18'
      height='18'
      style={{ minWidth: 18 }}
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        fill='#EA4335'
        d='M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.9 2.1 30.4 0 24 0 14.6 0 6.4 5.5 2.4 13.5l8.1 6.3C12.4 13.1 17.7 9.5 24 9.5z'
      />
      <path
        fill='#34A853'
        d='M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.7-2 5-4.3 6.6l6.8 5.3c4-3.7 6.1-9.1 6.1-16.4z'
      />
      <path
        fill='#4A90E2'
        d='M10.5 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-8.1-6.3C.9 16.2 0 20 0 24s.9 7.8 2.4 11.5l8.1-6.3z'
      />
      <path
        fill='#FBBC05'
        d='M24 48c6.4 0 11.9-2.1 15.9-5.7l-6.8-5.3c-1.9 1.3-4.3 2-7.1 2-6.3 0-11.6-3.6-13.5-8.8l-8.1 6.3C6.4 42.5 14.6 48 24 48z'
      />
    </svg>
  );
}

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
    <main className='flex min-h-screen items-center justify-center bg-background px-6'>
      <div className='mx-auto w-full max-w-[360px]'>
        {/* Logo */}
        <div className='mb-10 text-center'>
          <h1 className='text-3xl font-semibold tracking-tight text-foreground'>Satz</h1>
          <p className='mt-2 text-sm text-muted-foreground'>Write German. Get better.</p>
        </div>

        {/* Card */}
        <div className='rounded-xl border border-border/60 bg-card shadow-sm p-[16px]'>
          <div className='mb-6'>
            <h2 className='text-lg font-medium text-foreground'>Sign in</h2>
            <p className='mt-1 text-sm text-muted-foreground'>Save progress and review your mistakes.</p>
          </div>

          <div className='flex justify-center'>
            <Button variant='outline' onClick={signInWithGoogle} className='px-4 py-2.5'>
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>

          <p className='mt-4 text-center text-xs text-muted-foreground'>No spam. Just learning.</p>
        </div>

        <p className='mt-8 text-center text-xs text-muted-foreground'>Minimal. Output-first. Built for A1 learners.</p>
      </div>
    </main>
  );
}
