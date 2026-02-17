"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-card flex items-center px-6 md:px-8 lg:px-16 justify-between transition-all">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-gradient">
          glow
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-8">
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

      <div className="flex items-center gap-3 md:gap-6">
        {user ? (
          <Button className="primary-gradient text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full glow-shadow hover:scale-105 transition-all border-none h-auto" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2 md:gap-6">
            <Button variant="ghost" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 md:px-4" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="primary-gradient text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full glow-shadow hover:scale-105 transition-all border-none h-auto" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        )}

        <button 
          className="lg:hidden p-2 text-slate-600 hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 top-16 bg-white z-40 flex flex-col p-8 gap-6 lg:hidden transition-all duration-300 ease-in-out origin-top",
        isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
      )}>
        <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Features</Link>
        <Link href="#templates" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Templates</Link>
        <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Pricing</Link>
        <Link href="#examples" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Examples</Link>
        
        <div className="mt-auto flex flex-col gap-4">
          {!user && (
            <>
              <Button variant="outline" className="w-full py-6 rounded-2xl font-bold border-2" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="w-full py-6 rounded-2xl font-bold primary-gradient text-white border-none" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
