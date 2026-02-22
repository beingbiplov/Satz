import Link from "next/link";

function Container({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto w-full max-w-5xl px-6'>{children}</div>;
}

function Divider() {
  return (
    <div className='mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent' />
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full border border-satz-border/60 bg-white/5 px-3 py-1 text-xs text-satz-muted'>
      {children}
    </span>
  );
}

function Button({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-satz-blue/60 focus:ring-offset-0 active:translate-y-[1px]";
  const styles =
    variant === "primary"
      ? "bg-satz-blue text-white hover:bg-satz-blue/90 shadow-[0_10px_30px_rgba(37,99,235,0.18)]"
      : "border border-satz-border/70 bg-white/5 text-satz-text hover:bg-white/10";
  return (
    <Link className={`${base} ${styles}`} href={href}>
      {children}
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className='text-sm text-satz-muted transition hover:text-satz-text'>
      {children}
    </Link>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      className='text-satz-muted'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d={path} stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function Step({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className='group flex flex-col items-center text-center'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-satz-border/60 bg-white/5 transition group-hover:bg-white/7'>
        {icon}
      </div>
      <div className='text-base font-semibold text-satz-text'>{title}</div>
      <p className='mt-2 max-w-xs text-sm leading-6 text-satz-muted'>{desc}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-xl border border-satz-border/60 bg-white/5 px-4 py-3'>
      <div className='text-xs font-medium text-satz-muted'>{label}</div>
      <div className='mt-1 text-sm font-semibold text-satz-text'>{value}</div>
    </div>
  );
}

function MockCard() {
  return (
    <div className='rounded-2xl border border-satz-border/60 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8'>
      <div className='text-xs font-semibold tracking-widest text-satz-muted'>TRANSLATE THIS SENTENCE</div>

      <div className='mt-2 text-2xl font-semibold text-satz-text sm:text-3xl'>I would like two coffees.</div>

      <div className='mt-6 grid gap-3'>
        <div className='rounded-xl border border-satz-border/60 bg-white/5 px-4 py-3 text-satz-muted'>
          Ich möchte zwei Kaffee<span className='animate-pulse'>|</span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='h-px flex-1 bg-white/10' />
          <div className='text-xs text-satz-muted'>feedback</div>
          <div className='h-px flex-1 bg-white/10' />
        </div>

        <div className='rounded-xl border border-satz-green/30 bg-satz-green/10 px-4 py-3'>
          <div className='text-sm font-semibold text-satz-green'>Ich hätte gern zwei Kaffees.</div>
        </div>

        <p className='text-sm leading-6 text-satz-muted'>
          Use <span className='text-satz-text'>“Ich hätte gern”</span> for a more natural, polite request than{" "}
          <span className='text-satz-text'>“Ich möchte”</span>.
        </p>

        <div className='flex flex-wrap gap-2'>
          <Pill>politeness</Pill>
          <Pill>plural</Pill>
          <Pill>idiom</Pill>
        </div>

        <div className='mt-1 flex gap-3'>
          <Button href='/app'>Try one</Button>
          <Button href='#how' variant='secondary'>
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className='min-h-screen overflow-hidden'>
      {/* Subtle hero glow */}
      <div aria-hidden className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-satz-blue/10 blur-3xl' />
        <div className='absolute left-[20%] top-[120px] h-[260px] w-[260px] rounded-full bg-satz-green/7 blur-3xl' />
      </div>

      {/* Header */}
      <header className='relative border-b border-satz-border/50'>
        <Container>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center gap-8'>
              <div className='text-lg font-semibold tracking-tight'>Satz</div>
              <nav className='hidden items-center gap-6 md:flex'>
                <NavLink href='#how'>How it works</NavLink>
                <NavLink href='#demo'>Demo</NavLink>
                <NavLink href='#why'>Why Satz</NavLink>
              </nav>
            </div>
            <div className='flex items-center gap-2'>
              <Button href='/app' variant='secondary'>
                Sign in
              </Button>
              <Button href='/app'>Start writing</Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className='relative py-20 sm:py-24'>
        <Container>
          <div className='flex flex-col items-center text-center'>
            <Pill>Minimal • Output-first • Built for A1</Pill>

            <h1 className='mt-6 text-4xl font-semibold tracking-tight sm:text-5xl'>Write German. Get Better.</h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-satz-muted sm:text-lg'>
              Daily sentence practice with instant correction. No streak-chasing, no gimmicks - just output, feedback,
              and review.
            </p>

            <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
              <Button href='/app'>Start your first sentence</Button>
              <Button href='#demo' variant='secondary'>
                See it in action
              </Button>
            </div>

            {/* Trust cues */}
            <div className='mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3'>
              <Stat label='Daily practice' value='5 minutes, focused' />
              <Stat label='Feedback' value='Instant + specific' />
              <Stat label='Review' value='Only your real mistakes' />
            </div>
          </div>
        </Container>
      </section>

      <Divider />

      {/* How it works */}
      <section id='how' className='py-16 sm:py-20'>
        <Container>
          <h2 className='text-center text-3xl font-semibold tracking-tight'>How it works</h2>

          <div className='mt-12 grid grid-cols-1 gap-10 md:grid-cols-3'>
            <Step
              title='Get a sentence'
              desc='Receive a new English sentence tailored to your level.'
              icon={<Icon path='M6 7h12M6 12h8M6 17h12' />}
            />
            <Step
              title='Write your translation'
              desc='Type your best German translation from memory.'
              icon={<Icon path='M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z' />}
            />
            <Step
              title='Get instant feedback'
              desc='See corrections, short notes, and mistake categories.'
              icon={<Icon path='M20 6 9 17l-5-5' />}
            />
          </div>
        </Container>
      </section>

      <Divider />

      {/* Demo */}
      <section id='demo' className='py-16 sm:py-20'>
        <Container>
          <h2 className='text-center text-3xl font-semibold tracking-tight'>See it in action</h2>
          <p className='mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-satz-muted'>
            One prompt. One answer. Clear correction. Then you review only what you miss.
          </p>

          <div className='mt-10 flex justify-center'>
            <div className='w-full max-w-3xl'>
              <MockCard />
            </div>
          </div>
        </Container>
      </section>

      <Divider />

      {/* Why */}
      <section id='why' className='py-16 sm:py-20'>
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-semibold tracking-tight'>Practice output, not guessing.</h2>
            <p className='mt-4 text-base leading-7 text-satz-muted'>
              Most language apps test recognition. Satz makes you produce language from scratch, write sentences, get
              corrected, and review your real mistakes over time. That’s how fluency works.
            </p>

            <div className='mt-8 flex items-center justify-center gap-3'>
              <Button href='/app'>Start your first sentence</Button>
              <Button href='#how' variant='secondary'>
                How it works
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className='border-t border-satz-border/50 py-10'>
        <Container>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='text-sm text-satz-muted'>© {new Date().getFullYear()} Satz</div>

            <div className='flex items-center gap-6 text-sm text-satz-muted'>
              <Link className='hover:text-satz-text' href='/privacy'>
                Privacy
              </Link>
              <Link className='hover:text-satz-text' href='/terms'>
                Terms
              </Link>
              <Link className='hover:text-satz-text' href='/contact'>
                Contact
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
