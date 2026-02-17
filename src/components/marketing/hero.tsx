"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, UserPlus, CircleDollarSign, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-8 lg:px-16 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-hidden lg:overflow-visible">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-8 z-10">
        <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 border-violet-100 flex gap-2 items-center w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          Trusted by 10,000+ creators
        </Badge>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] md:leading-[1.05] tracking-tight text-slate-900">
          <span className="text-gradient">Your</span> page.<br />
          <span className="text-gradient">Your</span> world.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Create a stunning personal page in minutes. Share one link everywhere — Instagram, TikTok, LinkedIn, email, everywhere.
        </p>
        
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 w-full">
          <Button size="lg" className="primary-gradient text-white px-8 md:px-10 py-5 md:py-6 rounded-xl font-bold text-base md:text-lg glow-shadow hover:scale-105 transition-transform border-none h-auto w-full sm:w-auto" asChild>
            <Link href="/signup">Start Building — It&apos;s Free</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8 md:px-10 py-5 md:py-6 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-base md:text-lg hover:bg-slate-50 transition-colors h-auto w-full sm:w-auto" asChild>
            <Link href="#features">See Examples <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
        
        <div className="mt-8 md:mt-16 flex flex-col items-center lg:items-start gap-6 w-full">
          <p className="text-sm md:text-base font-bold text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Loved by 50,000+ creators worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-10 opacity-60">
            <img alt="Instagram" className="h-5 md:h-6 w-auto grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVX-UJuxdhE9yuD737xYQZ30NMsM7wpBS1JexpDzqp88CehfrAPkcxsxhJDCpCssay-ri5Seidu_tar8ZAaiFR3Ujkj5VWyCWo7tm6Nv2XhvnRoMzSuK4eN_BW9wwoLTdYjjN_wkecpMCkw5V59gGLRthbD_7nfoow1ok1o9v0qzh8i7mdIME00th95U4oP5kxO1RmjEhEZL_cMW4gAQsGqHjPS0G89-f8XTLV8WizWkEn5JRm3OuWLy-CfVi2mXCyPRpIo0VaFw" />
            <img alt="TikTok" className="h-5 md:h-6 w-auto grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFOm8FuDWl1And6yc9zsrDql1iqtwWLh1aSb_skI_r1tynnnmhTien01hkMUAN71NEF1ZZA-QoVT28jEwBgaJgaKVgmcgLnN0RB_LHk4G6Gf5yGKxjxRlK3xMObwyuwxL_ZOYoAKwTxmGYcTbrXq_627KZ4q7oFhjp85keObMye_i4V0lT7OJTD_M9_iXFGV7bREUHSC9ZvV70c31VHq0clEajLdPg_xVyviyrRo66kbRdsloS7Ghr1FNtGnLWB4SNE3-AUOPlRw" />
            <img alt="Spotify" className="h-5 md:h-6 w-auto grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq3fcrRVz4sjUTY5g4xL3ga_mmP-kyP8MVGFFd65dqVzlsRYwpYALyUZFsusxtomNl09gJ7GzSg6RZCsvoAzFY_gfHS_RGDCQJQhHPjmS9jZd9Uk9Ri4pRPf_2lYDwRnPDbT5aRr7EtQtGkoqgrCfvb1Fh6QClKNaHiuDBzNcuxpCw5B9iHTTdC4yTzHAClBaFYMnUWkNLVmEp7Nr3i8RXVVBSZiMDwHpaLNomUjvtrxtnIcqZ_0fQSSLBb593CdKNo1Qe1dQpfg" />
            
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img alt="User" className="w-full h-full object-cover" src={`https://i.pravatar.cc/150?u=${i}`} />
                </div>
              ))}
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white bg-violet-600 text-white flex items-center justify-center text-[8px] md:text-[10px] font-bold">
                +50k
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative flex justify-center items-center overflow-hidden lg:overflow-visible scale-75 sm:scale-90 md:scale-100 mt-8 lg:mt-0">
        <div className="absolute w-[130%] h-[130%] atmospheric-glow rounded-full -z-10 opacity-60"></div>
        
        {/* iPhone Mockup */}
        <div className="iphone-frame relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 border-[6px] sm:border-[8px] border-slate-800 overflow-hidden z-20">
          <div className="w-full h-full hero-gradient rounded-[2rem] relative overflow-hidden flex flex-col p-4 sm:p-6 items-center">
            <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white/30 backdrop-blur-sm shadow-xl overflow-hidden">
                <img alt="Sarah Chen" className="w-full h-full rounded-full object-cover" src="https://i.pravatar.cc/150?u=sarah" />
              </div>
              <div className="text-center text-white">
                <h3 className="text-lg sm:text-xl font-bold">Sarah Chen</h3>
                <p className="text-[10px] sm:text-xs opacity-80 font-medium tracking-wide">Designer & Creator</p>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-10 w-full flex flex-col gap-2.5 sm:gap-3">
              {["My Portfolio", "Latest YouTube Video", "Book a Call", "Shop My Prints"].map((link) => (
                <div key={link} className="w-full py-3 sm:py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm">
                  {link}
                </div>
              ))}
            </div>
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>
          </div>
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-6 sm:h-7 bg-slate-900 rounded-b-2xl"></div>
        </div>
        
        {/* Floating Notifications - Hidden on small screens to avoid mess */}
        <div className="absolute -right-4 md:-right-12 top-[10%] md:top-[15%] glass-card p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 z-30 animate-float hidden sm:flex" style={{ animationDelay: '0s' }}>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white shadow-inner">
            <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] text-cyan-600 font-extrabold uppercase tracking-widest">Growth</p>
            <p className="text-[10px] md:text-xs font-bold text-slate-800">New Subscriber!</p>
          </div>
        </div>
        
        <div className="absolute -left-8 md:-left-16 top-[35%] md:top-[40%] glass-card p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 z-30 animate-float hidden sm:flex" style={{ animationDelay: '1.5s' }}>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-inner">
            <CircleDollarSign className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">Earnings</p>
            <p className="text-[10px] md:text-xs font-bold text-slate-800">Payment received $50</p>
          </div>
        </div>
      </div>
    </section>
  );
}
