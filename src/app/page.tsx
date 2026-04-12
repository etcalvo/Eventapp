"use client";

import { useState, useEffect, useMemo } from "react";
import type { Event, EventCategory } from "@/types/events";
import { supabase } from "@/lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventList from "@/components/event-list";
import CategoryFilter from "@/components/category-filter";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!supabase) {
        setError("Supabase is not configured. Check environment variables.");
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error: dbError } = await supabase
          .from("events")
          .select("*")
          .gte("start_date", today)
          .eq("family_friendly", true)
          .order("start_date", { ascending: true });

        if (dbError) {
          setError(`Failed to load events: ${dbError.message}`);
        } else {
          setEvents(data as Event[]);
        }
      } catch {
        setError("Could not connect to the database. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const lastUpdated =
    events.length > 0
      ? events.reduce((latest, e) =>
          e.updated_at > latest.updated_at ? e : latest
        ).updated_at
      : null;

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <EventList events={filteredEvents} />
          )}
        </div>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </>
  );
}
