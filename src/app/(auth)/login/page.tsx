"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Chrome as Google, Sparkles } from "lucide-react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel: Brand */}
      <div className="hidden md:flex md:w-1/2 primary-gradient relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg opacity-20"></div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-4xl font-extrabold tracking-tighter text-white">glow</span>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-medium text-white/90">Your page. Your world.</h2>
          
          {/* Decorative Phone Mockup */}
          <div className="mt-12 iphone-frame w-[240px] h-[480px] bg-slate-900 rounded-[3rem] p-3 border-8 border-slate-800 shadow-2xl overflow-hidden opacity-90 scale-90">
             <div className="w-full h-full hero-gradient rounded-[2.2rem] flex flex-col items-center p-6 pt-12">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4"></div>
                <div className="w-24 h-4 bg-white/30 rounded-full mb-2"></div>
                <div className="w-16 h-2 bg-white/20 rounded-full mb-8"></div>
                <div className="w-full h-10 bg-white/20 rounded-xl mb-3"></div>
                <div className="w-full h-10 bg-white/20 rounded-xl mb-3"></div>
                <div className="w-full h-10 bg-white/20 rounded-xl"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-sm w-full space-y-8">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 text-sm font-semibold border-b border-slate-100 mb-6">
              <Link href="/signup" className="pb-4 text-slate-400 hover:text-slate-600 transition-colors">Sign Up</Link>
              <Link href="/login" className="pb-4 text-slate-900 border-b-2 border-primary">Log In</Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Log in to manage your page and view analytics.</p>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 gap-3 rounded-xl border-slate-200 font-semibold">
              <Google className="w-4 h-4" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-12 gap-3 rounded-xl border-slate-200 font-semibold">
              <Github className="w-4 h-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-bold tracking-widest">or</span>
            </div>
          </div>

          <form className="space-y-5" action={login}>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</Label>
              <Input name="email" type="email" required placeholder="you@example.com" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <Input name="password" type="password" required placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-12 primary-gradient text-white font-bold rounded-xl glow-shadow border-none">
              Log In
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            By logging in you agree to our <Link href="#" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
