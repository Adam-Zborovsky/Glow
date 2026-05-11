# Glow — Build Your Page. Share Your World.

> One link. Your entire online presence. Beautiful by default.

Glow is a personal page builder. Sign up, pick a template, add your links and content — in under 5 minutes you have a beautiful page at `glow.page/yourname` to share everywhere: Instagram, TikTok, LinkedIn, email signatures, resumes, business cards.

Think Linktree, but actually beautiful, more powerful, and with a free tier that doesn't feel crippled.

## Why Glow?

| Linktree Problem | Glow Solution |
|-----------------|---------------|
| Boring, identical designs | 20+ professionally designed templates with real visual variety |
| Locked behind $5-24/mo paywall for basic features | Unlimited links, all templates, basic analytics — free forever |
| Links only | Rich blocks: bio, photos, video, music, testimonials, forms, newsletter |
| No real customization | Colors, fonts, backgrounds, layouts, custom CSS (Pro) |
| Clunky editor | Drag-and-drop block editor with live phone preview |

## Features

- **Block-based editor** — 16+ content blocks: links, bio, images, video embeds, music players, contact forms, newsletter signups, testimonials, countdowns, and more
- **Drag-and-drop reordering** with real-time live preview
- **20+ templates** across categories: Creator, Professional, Artist, Music, Minimal, Dark
- **Full theme customization** — colors, fonts, button styles, backgrounds, spacing
- **Built-in analytics** — page views, link clicks, traffic sources, geography, device breakdown
- **Custom domains** — use `glow.page/you` free or connect your own domain (Pro)
- **SEO-optimized** — custom meta tags, Open Graph images, structured data
- **Blazing fast** — static page generation with sub-second load times

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Editor | @dnd-kit (drag-and-drop) |
| Auth | NextAuth.js v5 (Google OAuth + email) |
| Database | PostgreSQL via Prisma ORM |
| File Storage | Vercel Blob |
| Charts | Recharts |
| Animation | Framer Motion |
| Payments | Stripe (Pro tier) |

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your credentials
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Landing page, pricing, templates
│   ├── (auth)/          # Login, signup
│   ├── (dashboard)/     # Dashboard, editor, analytics, settings
│   ├── [username]/      # Published page route (SSG)
│   └── api/             # REST API routes
├── components/
│   ├── editor/          # Block sidebar, canvas, settings panel
│   ├── published/       # Published page block renderers
│   ├── analytics/       # Charts, traffic sources, top links
│   └── ui/              # shadcn/ui primitives
├── lib/                 # Prisma client, auth, Stripe, themes, blocks, utils
├── stores/              # Zustand editor state
└── types/               # TypeScript type definitions
```

## Pricing

| | Free | Pro ($8/mo) |
|---|------|-------------|
| Links & blocks | Unlimited | Unlimited |
| Templates | All | All |
| Custom domain | — | ✓ |
| Remove branding | — | ✓ |
| Analytics | 7-day | All-time + sources + geography |
| Custom CSS | — | ✓ |
| Newsletter integrations | — | ✓ |
| Custom OG images | — | ✓ |

## Status

**Work in progress** — core editor, block system, and auth are functional. See [CONTEXT.md](./CONTEXT.md) for the full product spec and development roadmap.
