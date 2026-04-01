# Pulse AI

**Live Demo:** [savage-news.vercel.app](https://savage-news.vercel.app)

Pulse AI is an autonomous AI newsroom that researches, writes, fact-checks, and publishes original journalism — with no human in the editorial path. Built for the vibecoding competition.

## What It Does

Every day, Pulse AI runs a fully autonomous editorial pipeline:

1. **Source Aggregation** — Scans 14 RSS feeds (MIT Technology Review, Nature, TechCrunch, The Verge, Ars Technica, Wired, Hacker News, IEEE Spectrum, and more) plus Virlo social trends
2. **Topic Discovery** — Claude analyzes all sources and selects the 3-5 most newsworthy topics, cross-referencing traditional media with social media trends
3. **Deep Research** — Scrapes full source articles (up to 5,000 chars each) and extracts structured analysis: key facts, expert quotes, data points, timelines, perspectives
4. **Article Writing** — Claude writes original 800-1,500 word articles from the research dossier, following strict editorial guidelines
5. **Editorial Review** — A separate Claude call fact-checks every claim against source material, tightens prose, and rates quality 1-10. Only articles scoring **7/10 or higher** are published
6. **Publishing** — Approved articles are saved to Supabase with metadata, images, reading time, and source attribution

### Additional Features

- **AI Article Chat** — Streaming Q&A on every article, grounded in article content and sources
- **Full-Text Search** — PostgreSQL tsvector with weighted ranking (title > subtitle/summary > content)
- **Daily Digest** — Automated briefing of the day's top stories at `/digest`
- **Social Trending** — Virlo API integration showing trending hashtags with view counts
- **Admin Dashboard** — Manual pipeline trigger + run history with step-by-step logs at `/admin`
- **Automated Cron** — Vercel cron fires daily at 6 AM UTC
- **Dark Mode** — System-aware with manual toggle
- **SEO** — Full Open Graph and meta tags on every page

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), Tailwind CSS v4, TypeScript |
| AI | Anthropic Claude Sonnet 4.6 (4 distinct pipeline roles + chat) |
| Database | Supabase (PostgreSQL + RLS + full-text search) |
| Social Data | Virlo API (trending hashtags + trend digest) |
| Scraping | Cheerio (source article extraction) |
| RSS | rss-parser (14 publication feeds) |
| UI | shadcn/ui, Lucide React, react-markdown |
| Deploy | Vercel (cron, serverless functions, HTTPS) |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- [Supabase](https://supabase.com) account
- [Anthropic](https://console.anthropic.com) API key

### 1. Clone & install

```bash
git clone https://github.com/Savage27z/savage-news.git
cd savage-news
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run these migrations in order:
   - `supabase/migrations/001_schema.sql` — Categories + articles tables with RLS
   - `supabase/migrations/002_seed.sql` — 5 categories + 8 seed articles
   - `supabase/migrations/003_pipeline_runs.sql` — Pipeline tracking table
   - `supabase/migrations/004_search.sql` — Full-text search index

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
PIPELINE_API_KEY=any-random-secret
CRON_SECRET=any-random-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
VIRLO_API_KEY=optional-virlo-key
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Trigger the AI pipeline at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── article/[slug]/            # Article pages with AI chat
│   ├── category/[slug]/           # Category listings
│   ├── search/                    # Full-text search
│   ├── digest/                    # Daily digest
│   ├── admin/                     # Pipeline control dashboard
│   ├── about/                     # About page
│   └── api/
│       ├── pipeline/run/          # Pipeline trigger endpoint
│       ├── pipeline/status/[runId]/ # Pipeline status polling
│       ├── chat/                  # Streaming AI chat
│       ├── search/                # Search endpoint
│       ├── cron/pipeline/         # Daily cron trigger
│       ├── virlo/trends/          # Virlo trending data
│       └── admin/                 # Admin endpoints
├── components/
│   ├── layout/                    # Header, Footer, ThemeProvider
│   ├── articles/                  # HeroArticle, ArticleCard, ArticleGrid
│   ├── home/                      # TrendingBar, DigestSidebar, SocialTrending
│   └── chat/                      # ArticleChat streaming component
├── lib/
│   ├── ai/claude.ts               # Anthropic SDK wrapper
│   ├── pipeline/                  # 5-stage editorial pipeline
│   │   ├── index.ts               # Pipeline orchestrator
│   │   ├── sources.ts             # RSS feed aggregation (14 sources)
│   │   ├── virlo.ts               # Virlo social trend fetching
│   │   ├── discover.ts            # AI topic discovery
│   │   ├── research.ts            # Deep research + scraping
│   │   ├── write.ts               # AI article writing
│   │   ├── editorial.ts           # AI editorial review + fact-check
│   │   └── publish.ts             # Supabase publishing
│   ├── supabase/                  # Client + admin SDK setup
│   └── utils.ts                   # Helpers (slugify, reading time, dates)
└── styles/globals.css             # Design system
```

## Deployment

1. Import the repo on [Vercel](https://vercel.com/new)
2. Set all environment variables from `.env.local.example`
3. Deploy — Vercel handles HTTPS, cron, and serverless functions automatically

## What Makes It Different

Most AI news tools summarize existing articles. Pulse AI **produces original reporting** — each article synthesizes multiple sources, is fact-checked against original material, and passes a quality gate that rejects subpar output. The pipeline mirrors how a real newsroom operates (editor assigns → reporter researches → writer drafts → editor reviews) but runs end-to-end in under 3 minutes with zero human involvement.

## License

MIT
