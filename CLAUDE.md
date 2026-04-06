# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run astro check  # Type-check .astro files
```

## Architecture

This is an **Astro blog** with server-side rendering deployed on **Cloudflare** (`output: 'server'`, `@astrojs/cloudflare` adapter). MDX and sitemap integrations are enabled.

### Content Collections (`src/content.config.ts`)

Two collections, both loaded with `glob()`:
- **`blog`** — `src/content/blog/*.{md,mdx}`, frontmatter: `title?`, `description?`, `pubDate` (required), `updatedDate?`, `heroImage?`
- **`journal`** — `src/content/journal/*.{md,mdx}`, frontmatter: `title?`, `pubDate` (required). Protected by password via middleware.

File names follow date convention (e.g. `2026-04-06.md`).

### Journal Access Control (`src/middleware.ts`)

All `/journal` routes are gated by a password stored in a cookie. The middleware checks the cookie on every request and shows an inline HTML login form (no separate page) when unauthenticated. The password and cookie name are hardcoded constants in that file.

### Supabase Backend (`src/lib/supabase.ts`)

Supabase client uses `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` env vars. All interactive features talk directly to Supabase from client-side `<script>` blocks (no server API routes except email subscribe). Tables used:

| Table | Used by |
|---|---|
| `comments` | `Comments.astro` |
| `article_reactions` | `ArticleReactions.astro` |
| `suggestions` + `suggestion_votes` | `Suggestions.astro` |
| `inline_annotations` | `InlineHighlights.astro` |
| `email_subscribers` | `src/pages/api/subscribe.ts` |

### Blog Post Layout (`src/layouts/BlogPost.astro`)

Each blog post renders: `ArticleReactions` (emoji reactions, stored per-user in `localStorage`) → article content → a two-column bottom panel with `Comments` (left) and `Suggestions` with voting (right) → `InlineHighlights` (select text to react/comment on specific passages, rendered as `<mark>` elements).

The `slug` prop is threaded through all interactive components to scope Supabase queries.

### Environment Variables

Create a `.env` file with:
```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```
