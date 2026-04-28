"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Event, EventCategory } from "@/types/events";
import { supabase } from "@/lib/supabase";
import {
  toDateString,
  getEventsForDate,
  sortEventsByRelevance,
} from "@/lib/date-utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventList from "@/components/event-list";
import CategoryFilter from "@/components/category-filter";
import LocationFilter from "@/components/location-filter";
import BackToTop from "@/components/back-to-top";
import { useVisitedEvents } from "@/lib/use-visited-events";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showVisited, setShowVisited] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { visitedIds, toggleVisited, cleanupVisited } = useVisitedEvents();

  useEffect(() => {
    async function fetchEvents() {
      if (!supabase) {
        setError(
          "Could not fetch the events right now. Please try again later.",
        );
        setLoading(false);
        return;
      }

      try {
        const today = toDateString(new Date());
        const { data, error: dbError } = await supabase
          .from("events")
          .select("*")
          .or(`start_date.gte.${today},end_date.gte.${today}`)
          .order("start_date", { ascending: true });

        if (dbError) {
          setError(`Failed to load events: ${dbError.message}`);
        } else {
          const fetched = data as Event[];
          const upcoming = fetched.filter((e) => {
            const endDate = e.end_date ?? e.start_date;
            return e.start_date >= today || endDate >= today;
          });
          setEvents(upcoming);
          cleanupVisited(new Set(upcoming.map((e) => e.id)));
        }
      } catch {
        setError("Could not connect to the database. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [cleanupVisited]);

  const categoryFilteredEvents = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const cityFilteredEvents = useMemo(() => {
    if (selectedCities.size === 0) return categoryFilteredEvents;
    return categoryFilteredEvents.filter((e) => selectedCities.has(e.city));
  }, [categoryFilteredEvents, selectedCities]);

  const searchFilteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return cityFilteredEvents;
    const lower = searchQuery.toLowerCase();
    return cityFilteredEvents.filter((e) =>
      e.title.toLowerCase().includes(lower),
    );
  }, [cityFilteredEvents, searchQuery]);

  const todayString = useMemo(() => toDateString(new Date()), []);

  const categoryCounts = useMemo(() => {
    let base = showTodayOnly ? getEventsForDate(events, todayString) : events;
    if (selectedCities.size > 0) {
      base = base.filter((e) => selectedCities.has(e.city));
    }
    const counts: Record<EventCategory | "all", number> = {
      all: base.length,
      concert: 0,
      outdoor: 0,
      parade: 0,
      festival: 0,
      family: 0,
      market: 0,
      sports: 0,
      other: 0,
    };
    for (const e of base) {
      counts[e.category]++;
    }
    return counts;
  }, [events, showTodayOnly, todayString, selectedCities]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) if (e.city) set.add(e.city);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const cityCounts = useMemo(() => {
    let base = showTodayOnly ? getEventsForDate(events, todayString) : events;
    if (selectedCategory !== "all") {
      base = base.filter((e) => e.category === selectedCategory);
    }
    const counts: Record<string, number> = { all: base.length };
    for (const e of base) {
      if (!e.city) continue;
      counts[e.city] = (counts[e.city] ?? 0) + 1;
    }
    return counts;
  }, [events, showTodayOnly, todayString, selectedCategory]);

  const todayEventCount = useMemo(
    () => getEventsForDate(events, todayString).length,
    [events, todayString],
  );

  const displayedEvents = useMemo(() => {
    if (showVisited) {
      return events.filter((e) => visitedIds.has(e.id));
    }
    const base = searchFilteredEvents.filter((e) => !visitedIds.has(e.id));
    if (showTodayOnly) return getEventsForDate(base, todayString);
    return sortEventsByRelevance(base, todayString);
  }, [
    searchFilteredEvents,
    showTodayOnly,
    todayString,
    visitedIds,
    showVisited,
    events,
  ]);

  const handleToggleToday = useCallback(() => {
    setShowTodayOnly((prev) => !prev);
  }, []);

  const handleToggleShowVisited = useCallback(() => {
    setShowVisited((prev) => !prev);
  }, []);

  const handleToggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      if (prev) setSearchQuery("");
      return !prev;
    });
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const handleCityChange = useCallback((city: string) => {
    if (city === "all") {
      setSelectedCities(new Set());
    } else {
      setSelectedCities((prev) => {
        const next = new Set(prev);
        if (next.has(city)) next.delete(city);
        else next.add(city);
        return next;
      });
    }
  }, []);

  const lastUpdated =
    events.length > 0
      ? events.reduce((latest, e) =>
          e.updated_at > latest.updated_at ? e : latest,
        ).updated_at
      : null;

  return (
    <>
      <Header
        isSearchOpen={isSearchOpen}
        onToggleSearch={handleToggleSearch}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          showTodayOnly={showTodayOnly}
          onToggleToday={handleToggleToday}
          todayEventCount={todayEventCount}
          categoryCounts={categoryCounts}
          visitedCount={visitedIds.size}
          showVisited={showVisited}
          onToggleShowVisited={handleToggleShowVisited}
        />

        <LocationFilter
          selected={selectedCities}
          onChange={handleCityChange}
          cities={availableCities}
          cityCounts={cityCounts}
        />

        {error && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error-text)", border: "1px solid var(--error-border)" }}>
            {error}
          </div>
        )}

        <div className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl"
                  style={{ background: "var(--skeleton)" }}
                />
              ))}
            </div>
          ) : (
            <EventList
              events={displayedEvents}
              visitedIds={visitedIds}
              onToggleVisited={toggleVisited}
            />
          )}
        </div>
      </main>

      <Footer lastUpdated={lastUpdated} />
      <BackToTop />
    </>
  );
}
