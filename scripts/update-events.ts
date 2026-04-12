import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

interface DiscoveredEvent {
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  location: string;
  city: string;
  address: string | null;
  url: string | null;
  is_free: boolean;
  price_info: string | null;
}

const VALID_CATEGORIES = [
  "concert",
  "outdoor",
  "parade",
  "festival",
  "family",
  "market",
  "sports",
  "other",
];

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, " ");
}

async function discoverEvents(): Promise<DiscoveredEvent[]> {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const today = new Date().toISOString().split("T")[0];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20250501",
    max_tokens: 4096,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 10,
      },
    ],
    messages: [
      {
        role: "user",
        content: `Today is ${today}. Search for upcoming family-friendly events in British Columbia, Canada for the next 60 days.

Focus on these areas (prioritize Metro Vancouver):
- Vancouver, Burnaby, Surrey, Richmond, North Vancouver, West Vancouver, Coquitlam, New Westminster
- Victoria, Whistler, Squamish, Kelowna, Kamloops, Nanaimo, Abbotsford, Langley

Event types to find: concerts, outdoor activities, parades, festivals, family events, farmers markets, holiday celebrations, kid-friendly shows, sports events.

Target audience: families with young children (toddlers/preschoolers, ages 2-5).

For each event found, provide ALL of these fields:
- title: Event name
- description: 1-2 sentence description
- category: One of: concert, outdoor, parade, festival, family, market, sports, other
- start_date: YYYY-MM-DD format
- end_date: YYYY-MM-DD or null for single-day events
- start_time: HH:MM (24h) or null if all-day
- location: Venue name
- city: City name
- address: Street address or null
- url: Official event URL or null
- is_free: true/false
- price_info: Price details or null if free

IMPORTANT: Return your final answer as a JSON array of event objects. Only include the JSON array, no other text. Example:
[{"title": "Example Event", "description": "...", "category": "family", "start_date": "2026-05-01", ...}]`,
      },
    ],
  });

  // Extract JSON from the response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("No text response from Claude");
    return [];
  }

  // Try to parse JSON from the response
  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("No JSON array found in response");
    console.error("Response:", textBlock.text.substring(0, 500));
    return [];
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as DiscoveredEvent[];
    return parsed.map((event) => ({
      ...event,
      category: VALID_CATEGORIES.includes(event.category)
        ? event.category
        : "other",
    }));
  } catch (err) {
    console.error("Failed to parse events JSON:", err);
    return [];
  }
}

async function upsertEvents(events: DiscoveredEvent[]): Promise<{
  inserted: number;
  updated: number;
}> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  let inserted = 0;
  let updated = 0;
  const now = new Date().toISOString();

  for (const event of events) {
    const titleNorm = normalizeTitle(event.title);

    // Check for existing event with same title, date, and city
    const { data: existing } = await supabase
      .from("events")
      .select("id")
      .ilike("title", titleNorm)
      .eq("start_date", event.start_date)
      .eq("city", event.city)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing event
      await supabase
        .from("events")
        .update({
          description: event.description,
          category: event.category,
          end_date: event.end_date,
          start_time: event.start_time,
          location: event.location,
          address: event.address,
          url: event.url,
          is_free: event.is_free,
          price_info: event.price_info,
          family_friendly: true,
          source_note: "Claude Haiku web search",
          updated_at: now,
        })
        .eq("id", existing[0].id);
      updated++;
    } else {
      // Insert new event
      await supabase.from("events").insert({
        title: event.title,
        description: event.description,
        category: event.category,
        start_date: event.start_date,
        end_date: event.end_date,
        start_time: event.start_time,
        location: event.location,
        city: event.city,
        address: event.address,
        url: event.url,
        is_free: event.is_free,
        price_info: event.price_info,
        family_friendly: true,
        source_note: "Claude Haiku web search",
        created_at: now,
        updated_at: now,
      });
      inserted++;
    }
  }

  return { inserted, updated };
}

async function pruneOldEvents(): Promise<number> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffDate = cutoff.toISOString().split("T")[0];

  const { data } = await supabase
    .from("events")
    .delete()
    .lt("start_date", cutoffDate)
    .select("id");

  return data?.length ?? 0;
}

async function main() {
  console.log("🍁 BC Family Events - Update Script");
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log("");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
    console.error("❌ Missing required environment variables:");
    if (!SUPABASE_URL) console.error("  - SUPABASE_URL");
    if (!SUPABASE_SERVICE_KEY) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
    if (!ANTHROPIC_API_KEY) console.error("  - ANTHROPIC_API_KEY");
    process.exit(1);
  }

  console.log("🔍 Discovering events with Claude Haiku...");
  const events = await discoverEvents();
  console.log(`   Found ${events.length} events`);

  if (events.length > 0) {
    console.log("💾 Upserting events into Supabase...");
    const { inserted, updated } = await upsertEvents(events);
    console.log(`   Inserted: ${inserted}, Updated: ${updated}`);
  }

  console.log("🧹 Pruning old events...");
  const pruned = await pruneOldEvents();
  console.log(`   Removed ${pruned} past events`);

  console.log("");
  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
