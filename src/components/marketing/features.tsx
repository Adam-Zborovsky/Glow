"use client";

import { LayoutGrid, Palette, BarChart2, Globe, Share2, Mail } from "lucide-react";

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-100",
    glow: "bg-violet-500/10",
    title: "Drag & Drop Blocks",
    description: "Links, images, forms, and more. Build your unique digital space by simply snapping blocks together."
  },
  {
    icon: <Palette className="w-6 h-6 text-pink-600" />,
    bg: "bg-pink-100",
    glow: "bg-pink-500/10",
    title: "20+ Designer Themes",
    description: "Professionally designed templates that look like custom sites. Pick a vibe and make it yours in seconds."
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
    bg: "bg-blue-100",
    glow: "bg-blue-500/10",
    title: "Real-Time Analytics",
    description: "Deep insights into who is visiting and what they are clicking. Optimize your performance with real data."
  },
  {
    icon: <Globe className="w-6 h-6 text-cyan-600" />,
    bg: "bg-cyan-100",
    glow: "bg-cyan-500/10",
    title: "Custom Domains",
    description: "Use your own name. We handle the SSL, the performance optimization, and the lightning-fast speed."
  },
  {
    icon: <Share2 className="w-6 h-6 text-orange-600" />,
    bg: "bg-orange-100",
    glow: "bg-orange-500/10",
    title: "SEO & Social",
    description: "Custom meta tags and OG images for every page. Look professional and polished whenever you're shared."
  },
  {
    icon: <Mail className="w-6 h-6 text-emerald-600" />,
    bg: "bg-emerald-100",
    glow: "bg-emerald-500/10",
    title: "Newsletter Ready",
    description: "Capture emails directly on your page. Seamlessly integrates with your favorite email marketing tools."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-20 flex flex-col items-center">
        <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.15em] mb-4">
          THE GLOW DIFFERENCE
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          Everything you need to <br /> build your world.
        </h2>
        <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
          A complete toolkit for the modern creator. Simple enough for a bio link, powerful enough for a portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-primary hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${feature.bg} mb-6 relative overflow-hidden group-hover:scale-110 transition-transform`}>
              <div className={`absolute inset-0 ${feature.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
            <p className="text-[14px] leading-6 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-20 flex justify-center opacity-50">
        <div className="w-[800px] h-[300px] bg-gradient-to-r from-primary/5 via-pink-500/5 to-cyan-500/5 blur-3xl rounded-full"></div>
      </div>
    </section>
  );
}
