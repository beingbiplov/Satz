"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/button";
import { supabaseBrowser } from "@/lib/supabase/browser";

function Container({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto w-full max-w-5xl px-6'>{children}</div>;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
      {children}
    </Link>
  );
}

export function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = supabaseBrowser();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className='relative border-b bg-white' style={{ borderColor: "rgb(var(--primary) / 0.28)" }}>
      <Container>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link href='/' className='text-lg font-semibold tracking-tight'>
              Sat<span style={{ color: "rgb(var(--primary))" }}>z</span>
            </Link>

            <nav className='hidden items-center gap-6 md:flex'>
              <NavLink href='#how'>How it works</NavLink>
              <NavLink href='#demo'>Demo</NavLink>
              <NavLink href='#why'>Why Satz</NavLink>
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            {email ? (
              <>
                <div className='hidden sm:block text-sm text-muted-foreground'>{email}</div>

                <Button variant='ghost' size='sm' onClick={handleSignOut}>
                  Sign out
                </Button>

                <Button href='/app' size='sm'>
                  App
                </Button>
              </>
            ) : (
              <>
                <Button href='/login' variant='ghost' size='sm'>
                  Sign in
                </Button>
                <Button href='/app' size='sm'>
                  Start writing
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
