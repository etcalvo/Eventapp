# BC Family Events

Mobile-first web app to discover upcoming family-friendly events in British Columbia, Canada.

## Tech Stack

- **Frontend**: Next.js 15 (static export) + React + Tailwind CSS
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Event Discovery**: Claude Haiku 4.5 with web search (runs every 15 days)
- **Hosting**: GitHub Pages
- **CI/Cron**: GitHub Actions

## How It Works

1. A GitHub Actions cron job runs on the 1st and 15th of each month
2. It calls Claude Haiku 4.5 with web search to discover upcoming BC events
3. Events are upserted into Supabase (deduplication by title + date + city)
4. The static frontend fetches events directly from Supabase via the JS client
5. Row Level Security ensures read-only access from the browser

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start dev server
npm run dev
```

Without Supabase configured, the app displays sample seed events.

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + Scripts | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Supabase anon key (public, RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions only | Supabase service key (secret) |
| `ANTHROPIC_API_KEY` | GitHub Actions only | Anthropic API key (secret) |

## Supabase Setup

Create the `events` table in your Supabase project:

```sql
CREATE TABLE events (
  id              serial PRIMARY KEY,
  title           text NOT NULL,
  description     text NOT NULL,
  category        text NOT NULL,
  start_date      date NOT NULL,
  end_date        date,
  start_time      text,
  location        text NOT NULL,
  city            text NOT NULL,
  address         text,
  url             text,
  image_url       text,
  is_free         boolean DEFAULT false,
  price_info      text,
  family_friendly boolean DEFAULT true,
  source_note     text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_events" ON events FOR SELECT USING (true);
```

## License

MIT
