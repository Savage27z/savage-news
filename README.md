# Pulse AI

**AI-native journalism covering Technology, AI & Science.**

Pulse AI is a premium news platform where every article is researched, written, and editorially reviewed through a multi-step AI pipeline. Built with Next.js, Supabase, and Tailwind CSS.

## Tech Stack

- **Next.js 14+** — App Router, React Server Components, TypeScript
- **Tailwind CSS** — Custom design system with Playfair Display, Inter, JetBrains Mono
- **Supabase** — PostgreSQL database with Row Level Security
- **shadcn/ui** — Base UI components (Button, Badge, Card, Sheet)
- **react-markdown** + **remark-gfm** — Article content rendering
- **next-themes** — Dark/light mode support
- **Lucide React** — Icons

## Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) — `npm install -g pnpm`
- **Supabase** account — [supabase.com](https://supabase.com)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Savage27z/savage-news.git
cd savage-news
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Note your **Project URL** and **anon (public) key** from Settings → API
3. Note your **service_role key** from the same page (keep this secret)

### 4. Run database migrations

In your Supabase dashboard, go to **SQL Editor** and run the following files in order:

1. `supabase/migrations/001_schema.sql` — Creates the `categories` and `articles` tables with indexes and RLS policies
2. `supabase/migrations/002_seed.sql` — Seeds 5 categories and 8 articles with full content

### 5. Set environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see Pulse AI.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (fonts, theme, header/footer)
│   ├── page.tsx              # Homepage
│   ├── article/[slug]/       # Individual article pages
│   ├── category/[slug]/      # Category listing pages
│   ├── about/                # About page
│   └── not-found.tsx         # 404 page
├── components/
│   ├── layout/               # Header, Footer, MobileNav, ThemeProvider
│   ├── articles/             # HeroArticle, ArticleCard, ArticleGrid, etc.
│   └── home/                 # TrendingBar, DigestSidebar, CategorySection
├── lib/
│   ├── supabase/             # Client, server, and type definitions
│   └── utils.ts              # Date formatting, reading time, slug helpers
└── styles/
    └── globals.css           # Design system (CSS custom properties)
```

## Design System

- **Fonts**: Playfair Display (headlines), Inter (body), JetBrains Mono (labels)
- **Accent**: Rose (#E11D48 light / #FB7185 dark)
- **Dark mode**: System preference with manual toggle
- **Typography**: `@tailwindcss/typography` prose classes for article content

## Deployment

Deploy to [Vercel](https://vercel.com) with one click — set the environment variables in the Vercel dashboard.

## License

MIT
