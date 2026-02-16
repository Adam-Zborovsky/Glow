"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-card flex items-center px-8 lg:px-16 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-gradient">
          glow
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Features
        </Link>
        <Link href="#templates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Templates
        </Link>
        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Pricing
        </Link>
        <Link href="#examples" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Examples
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Log In
        </Button>
        <Button className="primary-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-full glow-shadow hover:scale-105 transition-all border-none">
          Get Started Free
        </Button>
      </div>
    </nav>
  );
}
