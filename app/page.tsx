import { PageShell } from "@/components/layout/pageShell";
import Link from "next/link";
import { Button } from "@/components/common/button";

function Container({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto w-full max-w-5xl px-6'>{children}</div>;
}

function Divider() {
  return (
    <div className='mx-auto w-full max-w-5xl'>
      <div
        className='h-px w-full'
        style={{
          background: "linear-gradient(to right, transparent, rgb(var(--primary) / 0.28), transparent)",
        }}
      />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className='inline-flex items-center rounded-full px-3 py-1 text-xs text-muted-foreground'
      style={{
        backgroundColor: "rgb(var(--primary) / 0.06)",
        border: "1px solid rgb(var(--primary) / 0.20)",
      }}
    >
      {children}
    </span>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      className='transition-colors'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path d={path} stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function Step({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className='group flex flex-col items-center text-center transition-colors'>
      <div
        className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105'
        style={{
          backgroundColor: "rgb(var(--primary) / 0.06)",
          boxShadow: "0 0 0 1px rgb(var(--primary) / 0.25)",
        }}
      >
        <div className='text-muted-foreground transition-colors duration-200 group-hover:text-[rgb(var(--primary))]'>
          {icon}
        </div>
      </div>

      <div className='text-base font-semibold text-foreground'>{title}</div>

      <p className='mt-2 max-w-xs text-sm leading-6 text-muted-foreground'>{desc}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className='rounded-xl px-4 py-3 shadow-sm'
      style={{
        backgroundColor: "rgb(var(--primary) / 0.06)",
        border: "1px solid rgb(var(--primary) / 0.22)",
      }}
    >
      <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      <div className='mt-1 text-sm font-semibold text-foreground'>{value}</div>
    </div>
  );
}

function MockCard() {
  return (
    <div
      className='rounded-2xl bg-card p-6 sm:p-8 border shadow-sm'
      style={{
        borderColor: "rgb(var(--border))",
        boxShadow: `
          0 1px 2px rgba(0,0,0,0.04),
          0 0 0 1px rgb(var(--primary) / 0.18)
        `,
      }}
    >
      <div className='text-xs font-semibold tracking-widest text-muted-foreground'>TRANSLATE THIS SENTENCE</div>

      <div className='mt-2 text-2xl font-semibold text-foreground sm:text-3xl'>I would like two coffees.</div>

      <div className='mt-6 grid gap-3'>
        <div
          className='rounded-xl px-4 py-3 text-muted-foreground'
          style={{
            backgroundColor: "rgb(var(--primary) / 0.05)",
            border: "1px solid rgb(var(--primary) / 0.22)",
          }}
        >
          Ich möchte zwei Kaffee
          <span className='animate-pulse'>|</span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='h-px flex-1' style={{ backgroundColor: "rgb(var(--primary) / 0.25)" }} />
          <div className='text-xs text-muted-foreground'>feedback</div>
          <div className='h-px flex-1' style={{ backgroundColor: "rgb(var(--primary) / 0.25)" }} />
        </div>

        <div
          className='rounded-xl px-4 py-3'
          style={{
            backgroundColor: "rgb(var(--primary) / 0.12)",
            border: "1px solid rgb(var(--primary) / 0.40)",
          }}
        >
          <div className='text-sm font-semibold text-foreground'>Ich hätte gern zwei Kaffees.</div>
        </div>

        <p className='text-sm leading-6 text-muted-foreground'>
          Use <span className='text-foreground'>“Ich hätte gern”</span> for a more natural, polite request than{" "}
          <span className='text-foreground'>“Ich möchte”</span>.
        </p>

        <div className='flex flex-wrap gap-2'>
          <Pill>politeness</Pill>
          <Pill>plural</Pill>
          <Pill>idiom</Pill>
        </div>

        <div className='mt-1 flex flex-wrap gap-3'>
          <Button href='/app' size='sm'>
            Try one
          </Button>
          <Button href='#how' variant='outline' size='sm'>
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PageShell fullWidth>
      {/* HERO */}
      <section className='relative py-20 sm:py-24 overflow-hidden'>
        <div
          aria-hidden
          className='absolute inset-0'
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgb(var(--primary) / 0.10),
                rgb(var(--primary) / 0.05) 30%,
                transparent 70%
              )
            `,
          }}
        />

        <Container>
          <div className='relative flex flex-col items-center text-center'>
            <Pill>Minimal • Output-first • Built for A1</Pill>

            <h1 className='mt-6 text-4xl font-semibold tracking-tight sm:text-5xl'>Write German. Get Better.</h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg'>
              Daily sentence practice with instant correction. No streak-chasing, no gimmicks - just output, feedback,
              and review.
            </p>

            <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
              <Button href='/app' size='lg'>
                Start your first sentence
              </Button>
              <Button href='#demo' variant='outline' size='lg'>
                See it in action
              </Button>
            </div>

            <div className='mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3'>
              <Stat label='Daily practice' value='5 minutes, focused' />
              <Stat label='Feedback' value='Instant + specific' />
              <Stat label='Review' value='Only your real mistakes' />
            </div>
          </div>
        </Container>
      </section>

      <Divider />

      {/* HOW */}
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

      {/* DEMO */}
      <section id='demo' className='py-16 sm:py-20'>
        <Container>
          <h2 className='text-center text-3xl font-semibold tracking-tight'>See it in action</h2>
          <p className='mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-muted-foreground'>
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

      {/* WHY */}
      <section id='why' className='py-16 sm:py-20'>
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-semibold tracking-tight'>Practice output, not guessing.</h2>
            <p className='mt-4 text-base leading-7 text-muted-foreground'>
              Most language apps test recognition. Satz makes you produce language from scratch, write sentences, get
              corrected, and review your real mistakes over time. That’s how fluency works.
            </p>

            <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
              <Button href='/app' size='lg'>
                Start your first sentence
              </Button>
              <Button href='#how' variant='outline' size='lg'>
                How it works
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
