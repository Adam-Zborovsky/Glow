# Glow — Build Your Page. Share Your World.

> One link. Your entire online presence. Beautiful by default.

Glow is a personal page builder — a block-based, drag-and-drop platform for creating beautiful, shareable landing pages. Sign up, build a page in minutes, and share one link everywhere: Instagram, TikTok, LinkedIn, email signatures, and resumes. Think Linktree with real design flexibility, a block editor, built-in analytics, and a free tier that isn't crippled.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple?logo=auth0)](https://authjs.dev)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

<!-- TODO: screenshot — add a hero image or GIF showing the editor + live preview side by side -->

## Highlights

- **Drag-and-drop block editor with live preview** — real-time, side-by-side phone mockup powered by `@dnd-kit` for smooth reordering and a Zustand store that hydrates from the server in one pass. Insertion point logic handles exact index placement mid-list.
- **Server Actions with defense-in-depth** — every mutation (`saveBlocks`, `publishPage`, `register`, `login`) validates input with Zod, re-verifies ownership against the session user, sanitizes HTML entities, and is rate-limited in-memory (swap to Redis for multi-instance deploys).
- **Multi-tenant page routing** — `[username]` and `[username]/[slug]` dynamic routes serve public pages with SSR-generated Open Graph metadata parsed from the BIO block. Page views and block clicks are recorded via fire-and-forget server actions.
- **JWT auth with credential + OAuth fallback** — NextAuth v5 configured with a credentials provider (bcrypt) and Google OAuth. The `proxy.ts` middleware enforces HTTPS redirects in production and protects `/dashboard/*` and `/editor/*` routes.
- **Prisma schema with cascading ownership** — Users own Pages, which own Blocks, which own BlockClicks. PageViews join to both User and Page. `@@unique([userId, slug])` and indexed timestamp columns keep queries fast as data grows.
- **Multi-stage Docker build** — `node:20-alpine` build stage compiles Next.js standalone output, then a slim runtime stage copies only `public/`, `.next/standalone/`, `.next/static/`, and `prisma/`. Runs as non-root `nextjs` user on port 80.
- **SEO-ready published pages** — each public page generates dynamic metadata (title, description, OG image, Twitter card) from the bio block. Custom SEO title/description fields override defaults, and Google Analytics + Facebook Pixel IDs can be set per page.
- **Template-aware rendering** — published pages render against one of three built-in themes (`creator`, `minimal`, `dark`) with a `cn()` utility that switches background, text, and border classes per template. Custom theme JSON is stored on the Page model for future per-page design tokens.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Cloudflare / Nginx                   │
│                  (HTTPS termination, proxy)              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Next.js 16 Server                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  middleware   │  │ Server       │  │  API Routes  │  │
│  │  (proxy.ts)  │  │ Actions      │  │  (NextAuth)  │  │
│  │  auth guard  │  │ (mutations)  │  │              │  │
│  └──────────────┘  └──────┬───────┘  └──────────────┘  │
│                           │                              │
│                    ┌──────▼───────┐                      │
│                    │  Prisma ORM  │                      │
│                    └──────┬───────┘                      │
└───────────────────────────┼──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│                     PostgreSQL 16                        │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐ │
│  │  users  │  │  pages  │  │  blocks  │  │ page_views│ │
│  └─────────┘  └─────────┘  └──────────┘  └───────────┘ │
│  ┌──────────┐  ┌─────────┐                              │
│  │ accounts │  │sessions │                              │
│  └──────────┘  └─────────┘                              │
└──────────────────────────────────────────────────────────┘
```

**Request lifecycle:** Browser → Next.js middleware (`proxy.ts`) checks auth state for protected routes → React Server Component fetches data via direct Prisma calls or server actions → mutations go through `actions.ts` which validates (Zod), rate-limits, sanitizes, checks ownership in a Prisma transaction, then revalidates affected paths with `revalidatePath()`.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui + Radix UI | latest |
| Drag & Drop | @dnd-kit | 6.3 / 10.0 |
| Auth | NextAuth.js v5 (JWT) | 5.0.0-beta.30 |
| Database | PostgreSQL | 16 |
| ORM | Prisma | 5.22 |
| Validation | Zod | 4.x |
| Forms | react-hook-form | 7.x |
| State | Zustand | 5.x |
| Charts | Recharts | 3.x |
| Animation | Framer Motion | 12.x |
| Color Picker | react-colorful | 5.x |
| Icons | lucide-react | 0.564 |
| Password Hashing | bcryptjs | 3.x |
| Container Runtime | Docker (multi-stage) | — |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (auth)/signup/         # Registration page
│   ├── (dashboard)/
│   │   ├── dashboard/         # Page list + stats
│   │   ├── editor/[pageId]/   # Block editor (client component)
│   │   ├── analytics/         # View/click charts
│   │   └── settings/          # Profile + account
│   ├── [username]/            # Public page (SSR)
│   ├── [username]/[slug]/     # Multi-page public route
│   └── api/auth/[...nextauth] # NextAuth handler
├── components/
│   ├── editor/                # BlockSidebar, EditorCanvas, SettingsPanel, PreviewOverlay
│   ├── published/             # PageRenderer — renders public page blocks
│   ├── dashboard/             # Dashboard cards, nav, settings form
│   ├── marketing/             # Landing page sections
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── actions.ts             # All server actions (auth, pages, blocks, analytics)
│   ├── auth.ts                # NextAuth instance with credentials provider
│   ├── auth.config.ts         # NextAuth config (Google provider, callbacks, pages)
│   ├── db.ts                  # Prisma singleton
│   ├── env.ts                 # Zod-validated env with Proxy fallback
│   ├── validation.ts          # Zod schemas (blocks, metadata, file upload)
│   ├── rate-limit.ts          # In-memory rate limiter
│   ├── storage.ts             # Local file storage (swap for S3/Cloudinary)
│   ├── logger.ts              # Console logger (production-aware)
│   └── utils.ts               # cn() helper (tailwind-merge + clsx)
├── stores/
│   └── editor-store.ts        # Zustand store for editor state
├── types/
│   └── next-auth.d.ts         # NextAuth type augmentation
└── proxy.ts                   # Auth middleware + HTTPS redirect
prisma/
├── schema.prisma              # Data model
└── seed.js                    # Dev seed script
assets/                        # HTML mockups, design assets
docker-compose.yml             # Postgres + app services
Dockerfile                     # Multi-stage production build
start.sh                       # Container entrypoint (db push + start)
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL 16 (or Docker)
- npm

### Local development (with Docker Postgres)

```bash
# 1. Clone and install
git clone https://github.com/Adam-Zborovsky/Glow.git
cd Glow

# 2. Copy env template and fill in required values
cp .env.example .env
# Edit .env:
#   AUTH_SECRET — generate with: openssl rand -base64 32
#   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET — from Google Cloud Console (optional)

# 3. Start PostgreSQL via Docker
docker compose up -d glow-db

# 4. Install deps, push schema, seed
npm install
npx prisma db push
npx prisma db seed   # creates demo users

# 5. Run
npm run dev
# → http://localhost:3000
```

### Full Docker deployment

```bash
# Copy env and configure
cp .env.example .env
# Required: AUTH_SECRET, AUTH_URL (your public domain)
# Optional: POSTGRES_PASSWORD (defaults to "postgres")

# Build and start both services
docker compose up -d --build

# The app runs on port 80 inside the container.
# Expose it via a reverse proxy (nginx, Cloudflare Tunnel, etc.).
```

## Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/db?schema=public`) |
| `AUTH_SECRET` | Yes | — | NextAuth secret, min 32 chars. Generate: `openssl rand -base64 32` |
| `AUTH_URL` | Yes | — | Canonical URL of the app (e.g., `https://glow.example.com`) |
| `AUTH_GOOGLE_ID` | No | — | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | No | — | Google OAuth client secret |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `POSTGRES_PASSWORD` | No | `postgres` | Postgres superuser password (docker-compose only) |

## API / Server Actions

All mutations are Next.js Server Actions — called from client components via `"use server"` imports.

| Action | Access | Description |
|--------|--------|-------------|
| `register(prevState, formData)` | Public | Create account with email/password/username. Rate limited: 5/hr per email. |
| `login(prevState, formData)` | Public | Credentials sign-in. Rate limited: 10/15min per email. |
| `getPages()` | Auth | List all pages for current user with view counts |
| `createPage()` | Auth | Create new page with a BIO block, redirect to editor |
| `deletePage(pageId)` | Auth | Delete page (ownership-verified) |
| `duplicatePage(pageId)` | Auth | Deep-clone page with all blocks, mark as draft |
| `getPageWithBlocks(pageId)` | Auth | Fetch page + sorted blocks, parse JSON content |
| `saveBlocks(pageId, blocks, themeId?)` | Auth | Validates, sanitizes, deletes + recreates blocks in a transaction. Rate limited: 20/min |
| `publishPage(pageId, published)` | Auth | Toggle publish status |
| `updatePageMetadata(pageId, title, seoTitle, seoDesc)` | Auth | Update page title + SEO fields |
| `uploadFile(formData)` | Auth | Upload image (≤2MB, jpg/png/webp) to local storage |
| `updateProfile(formData)` | Auth | Update name, username (uniqueness check), avatar |
| `getPublicPage(username, slug?)` | Public | Fetch published page data for rendering |
| `recordPageView(pageId, userId)` | Public (called from page render) | Record view with device/referrer detection. Rate limited: 60/min per IP |
| `recordBlockClick(blockId, url?)` | Public | Record click event. Rate limited: 100/min per IP |
| `getAnalyticsSummary()` | Auth | 30-day views + clicks aggregated by device and referrer |

## Data Model

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | id, email (unique), username (unique), passwordHash, plan, stripeCustomerId, stripeSubId | Supports FREE/PRO plans; Stripe fields reserved |
| `accounts` | userId, provider, providerAccountId | NextAuth OAuth accounts, cascades on user delete |
| `sessions` | sessionToken (unique), userId, expires | NextAuth session storage |
| `pages` | userId, slug, title, published, themeId, customTheme (JSON), seoTitle, seoDesc, ogImageUrl, customDomain, customCss, gaId, fbPixelId | `@@unique([userId, slug])` |
| `blocks` | pageId, type (enum), content (JSON string), sortOrder, visible | Indexed on `[pageId, sortOrder]` |
| `page_views` | pageId, userId, referrer, country, device, browser, timestamp | Indexed on `[pageId, timestamp]` and `[userId, timestamp]` |
| `block_clicks` | blockId, url, referrer, country, device, timestamp | Indexed on `[blockId, timestamp]` |

## Engineering Notes

- **Rate limiting is in-memory (Map-based).** Works for single-instance dev but will not share state across containers. Replace with `@upstash/ratelimit` (Redis) or a database-backed limiter before multi-instance production use.
- **Block storage uses delete-all + recreate in a transaction.** This is simple and atomic, but means block IDs change on every save. If you need stable block IDs (e.g., for deep-linking or external analytics), switch to upsert logic keyed by a stable identifier.
- **Custom themes are stored as raw JSON strings on the Page model.** The parser trusts this JSON in `getPublicPage` — the theme JSON is server-authored (not user-supplied), so this is safe, but future user-facing custom themes should be validated against a Zod schema before storage.
- **File storage writes to `public/uploads/` on disk.** This works for single-server Docker deploys but won't survive ephemeral environments (Vercel, Heroku). The `storeFile()` function is abstracted — drop in an S3 or Cloudinary adapter by swapping the implementation.
- **The `env.ts` Proxy pattern** provides Zod-validated env access with `process.env` fallback during build phases where Next.js may not load all variables identically. This avoids the common "env vars missing during build" issue.

## Roadmap

- [ ] Stripe integration for PRO tier (billing, webhooks)
- [ ] Redis-backed rate limiting for multi-instance deploys
- [ ] S3/Cloudinary storage adapter
- [ ] Email verification flow
- [ ] Custom domain DNS verification automation
- [ ] Additional block types (newsletter, contact form, countdown, map)
- [ ] Template marketplace
- [ ] Team/collaboration mode

## License

No license file is present in this repository. Consider adding one (e.g., MIT, AGPL-3.0, or a commercial license) before public distribution.
