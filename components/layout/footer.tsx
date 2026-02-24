import Link from "next/link";

export function Footer() {
  return (
    <footer className='border-t border-brand-30 py-5'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row'>
        <div className='text-sm text-muted-foreground'>© {new Date().getFullYear()} Satz</div>

        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
          <Link className='hover:text-foreground transition-colors' href='/privacy'>
            Privacy
          </Link>
          <Link className='hover:text-foreground transition-colors' href='/terms'>
            Terms
          </Link>
          <Link className='hover:text-foreground transition-colors' href='/contact'>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
