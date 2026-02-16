"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const freeFeatures = [
  { name: "Unlimited links & blocks", included: true },
  { name: "All templates", included: true },
  { name: "glow.page/username URL", included: true },
  { name: "Basic analytics (7-day)", included: true },
  { name: "Mobile-optimized pages", included: true },
  { name: "SSL included", included: true },
  { name: "Custom domain", included: false },
  { name: "Remove Glow branding", included: false },
  { name: "Advanced analytics", included: false },
];

const proFeatures = [
  { name: "Everything in Free", included: true, highlight: true },
  { name: "Custom domain", included: true },
  { name: "Remove Glow branding", included: true },
  { name: "Advanced analytics (all-time)", included: true },
  { name: "Priority support", included: true },
  { name: "Custom CSS", included: true },
  { name: "Newsletter integrations", included: true },
  { name: "Payment links (Stripe)", included: true },
  { name: "Custom OG images", included: true },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Simple pricing. Generous free tier.</h2>
          <p className="text-lg text-muted-foreground">Start free, upgrade when you&apos;re ready. No credit card required.</p>
        </div>

        <div className="flex items-center gap-4 mb-12">
          <span className={cn("text-sm font-medium transition-colors", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
          <div 
            className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer flex items-center px-1"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          >
            <div className={cn(
              "w-4 h-4 rounded-full transition-all duration-300",
              billingCycle === "yearly" ? "translate-x-6 bg-primary" : "translate-x-0 bg-white shadow-sm"
            )} />
            {billingCycle === "yearly" && <div className="absolute inset-0 primary-gradient opacity-20 rounded-full" />}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium transition-colors", billingCycle === "yearly" ? "text-slate-900" : "text-slate-400")}>Yearly</span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Save 33%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Free Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col hover:border-slate-300 transition-all duration-300">
            <div className="mb-6">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Free</span>
              <div className="flex items-baseline mt-2">
                <span className="text-5xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-400 ml-2 font-mono">/forever</span>
              </div>
              <p className="mt-4 text-slate-600 text-sm">Everything you need to get started.</p>
            </div>
            
            <hr className="border-slate-100 mb-8" />
            
            <ul className="space-y-4 mb-8 flex-grow">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <span className={cn("text-sm", feature.included ? "text-slate-900" : "text-slate-400 line-through")}>{feature.name}</span>
                </li>
              ))}
            </ul>
            
            <Button variant="outline" className="w-full py-6 rounded-xl border-slate-200 text-slate-900 font-bold text-base hover:bg-slate-50 transition-colors h-auto">
              Get Started Free
            </Button>
          </div>

          {/* Pro Card */}
          <div className="bg-white border-2 border-primary rounded-3xl p-8 flex flex-col relative shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-4 right-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">
              Most Popular
            </div>
            
            <div className="mb-6">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Pro</span>
              <div className="flex items-baseline mt-2">
                <span className="text-5xl font-extrabold text-slate-900">{billingCycle === 'monthly' ? '$12' : '$8'}</span>
                <span className="text-slate-400 ml-2 font-mono">/month</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="mt-1 text-xs text-slate-400 font-medium tracking-wide">billed yearly ($96/yr)</p>
              )}
              <p className="mt-4 text-slate-600 text-sm">For creators and professionals who want more.</p>
            </div>
            
            <hr className="border-slate-100 mb-8" />
            
            <ul className="space-y-4 mb-8 flex-grow">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className={cn("w-5 h-5 shrink-0", feature.highlight ? "text-primary" : "text-emerald-500")} />
                  <span className={cn("text-sm", feature.highlight ? "font-bold text-primary" : "text-slate-900")}>{feature.name}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full py-6 rounded-xl primary-gradient text-white font-bold text-base glow-shadow hover:scale-[1.02] transition-transform border-none h-auto">
              <Sparkles className="w-4 h-4 mr-2" /> Start 14-Day Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
