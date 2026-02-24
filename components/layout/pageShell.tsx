import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className='relative min-h-screen bg-background text-foreground'>
      <Navbar />
      <div className='relative'>{children}</div>
      <Footer />
    </main>
  );
}
