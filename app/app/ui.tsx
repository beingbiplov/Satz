"use client";

import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/common/button";

export default function AppShell({ email }: { email: string }) {
  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className='relative min-h-screen bg-background text-foreground'>
      {/* subtle brand glow */}
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-16 h-[220px] w-[600px] -translate-x-1/2 blur-3xl'
        style={{
          background: "rgb(var(--primary))",
          opacity: 0.08,
        }}
      />

      <header
        className='relative border-b bg-background/90 backdrop-blur'
        style={{
          borderColor: "rgb(var(--primary) / 0.40)",
        }}
      >
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
          {/* Logo with a green accent (no hex hardcode) */}
          <Link href='/' className='text-lg font-semibold tracking-tight'>
            Sat
            <span style={{ color: "rgb(var(--primary))" }}>z</span>
          </Link>

          <div className='flex items-center gap-3'>
            <div className='hidden text-sm text-muted-foreground sm:block'>{email}</div>

            <Button variant='ghost' onClick={signOut} size='sm'>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className='relative mx-auto max-w-6xl px-6 py-10'>
        <div
          className='rounded-2xl bg-card p-6 shadow-sm ring-1'
          style={{
            // subtle brand-tinted ring
            boxShadow: "0 0 0 1px rgb(var(--primary) / 0.20)",
          }}
        >
          <div className='text-sm font-semibold'>Authenticated ✅</div>
          <div className='mt-1 text-sm text-muted-foreground'>Brand tokens active.</div>
        </div>
      </div>
    </main>
  );
}
