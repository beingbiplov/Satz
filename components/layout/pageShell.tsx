import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function PageShell({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <Navbar />

      <main className='flex-1'>
        {fullWidth ? children : <div className='mx-auto w-full max-w-3xl px-6 py-10'>{children}</div>}
      </main>

      <Footer />
    </div>
  );
}
