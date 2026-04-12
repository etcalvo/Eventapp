# BC Family Events App

## Project Overview

Mobile-first web app to visualize upcoming family-friendly events in British Columbia, Canada.
Read-only frontend; events are updated by a Claude Haiku cron job every 15 days via GitHub Actions.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with static export
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Data fetching**: @supabase/supabase-js (client-side, read-only via RLS)
- **Styling**: Tailwind CSS
- **AI/Cron**: Claude Haiku 4.5 + web_search via GitHub Actions
- **Hosting**: GitHub Pages (static site)

## Development Rules

### Code Style
- TypeScript strict mode — no `any` types
- Functional components only (no class components)
- Prefer `const` over `let`; never use `var`
- All code, comments, and variable names in English
- UI text in English

### Styling
- Use Tailwind CSS utility classes exclusively
- No inline styles, CSS modules, or styled-components
- Mobile-first: start with mobile layout, add `sm:`, `md:`, `lg:` breakpoints as needed

### Components
- Keep components small and single-responsibility
- One component per file
- Use `@supabase/supabase-js` for all data operations — no other data libraries

### Dependencies
- Do not install new dependencies without explicit user permission
- Current approved dependencies: `@supabase/supabase-js`, `@anthropic-ai/sdk`

### Git & Commits
- Commit messages in English
- Conventional commits format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Never commit `.env` files or secrets
- Test builds with `npm run build` before committing

### Project Commands
- `npm run dev` — Start development server
- `npm run build` — Build static export (generates `out/` directory)
- `npm run lint` — Run ESLint
