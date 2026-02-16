"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = ["All", "Creator", "Professional", "Artist", "Minimal", "Dark"];

const templates = [
  {
    name: "Spotlight",
    category: "Creator",
    color: "bg-violet-600",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
    vibe: "bold"
  },
  {
    name: "Folio",
    category: "Professional",
    color: "bg-slate-50",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop",
    vibe: "clean"
  },
  {
    name: "Neon",
    category: "Artist",
    color: "bg-slate-950",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=600&fit=crop",
    vibe: "expressive"
  },
  {
    name: "Vinyl",
    category: "Artist",
    color: "bg-indigo-950",
    preview: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=600&fit=crop",
    vibe: "music"
  },
  {
    name: "Mono",
    category: "Minimal",
    color: "bg-white",
    preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop",
    vibe: "elegant"
  },
  {
    name: "Midnight",
    category: "Dark",
    color: "bg-slate-900",
    preview: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop",
    vibe: "moody"
  }
];

export function Templates() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Themes that make you stand out</h2>
          <p className="text-lg text-muted-foreground">Start with a template, then make it yours. Every detail is customizable.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={cn(
                "rounded-full px-6",
                activeCategory === category ? "bg-primary text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <div key={index} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={cn("h-72 w-full relative overflow-hidden flex items-center justify-center", template.color)}>
                <div className="absolute inset-0 opacity-40 mix-blend-multiply transition-opacity group-hover:opacity-60">
                   {/* Placeholder for template image */}
                   <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="primary-gradient text-white font-semibold rounded-xl px-8 shadow-lg" asChild>
                    <Link href="/signup">Use Template</Link>
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{template.name}</h3>
                <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-none font-semibold px-2 py-0.5">
                  {template.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
