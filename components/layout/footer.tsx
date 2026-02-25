import Link from "next/link";

export function Footer() {
  return (
    <footer className='border-t border-border bg-background' style={{ borderColor: "rgb(var(--primary) / 0.28)" }}>
      <div className='mx-auto w-full max-w-6xl px-6 py-5'>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          <div className='text-sm text-muted-foreground'>© {new Date().getFullYear()} Satz</div>

          <div className='flex items-center gap-6 text-sm text-muted-foreground'>
            <Link className='transition-colors hover:text-foreground' href='/privacy'>
              Privacy
            </Link>
            <Link className='transition-colors hover:text-foreground' href='/terms'>
              Terms
            </Link>
            <Link className='transition-colors hover:text-foreground' href='/contact'>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
