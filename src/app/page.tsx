import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Templates } from "@/components/marketing/templates";
import { Pricing } from "@/components/marketing/pricing";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen mesh-gradient-bg selection:bg-violet-100 selection:text-violet-900">
      <Navbar user={session?.user} />
      <main>
        <Hero />
        <Features />
        <Templates />
        <Pricing />
      </main>
      
      {/* Footer / Copyright */}
      <footer className="py-12 px-8 lg:px-16 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-gradient">glow</span>
            <span className="text-sm text-muted-foreground ml-2">© 2026 Glow Page Builder</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
