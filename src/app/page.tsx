"use client";

import { useState, useEffect, useMemo } from "react";
import type { Event, EventCategory } from "@/types/events";
import { supabase } from "@/lib/supabase";
import { SEED_EVENTS } from "@/lib/seed-data";
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
  const [usingSeedData, setUsingSeedData] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      if (!supabase) {
        setEvents(SEED_EVENTS);
        setUsingSeedData(true);
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("start_date", today)
          .eq("family_friendly", true)
          .order("start_date", { ascending: true });

        if (error || !data || data.length === 0) {
          setEvents(SEED_EVENTS);
          setUsingSeedData(true);
        } else {
          setEvents(data as Event[]);
        }
      } catch {
        setEvents(SEED_EVENTS);
        setUsingSeedData(true);
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

        {usingSeedData && (
          <div className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-700">
            Showing sample events — connect Supabase to see real data
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
