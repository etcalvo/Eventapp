"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Event, EventCategory } from "@/types/events";
import { supabase } from "@/lib/supabase";
import {
  toDateString,
  getDatesWithEvents,
  getEventsForDate,
} from "@/lib/date-utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventList from "@/components/event-list";
import CategoryFilter from "@/components/category-filter";
import MonthCalendar from "@/components/month-calendar";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    toDateString(new Date()),
  );

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
          .eq("family_friendly", true)
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
        }
      } catch {
        setError("Could not connect to the database. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const categoryFilteredEvents = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const todayString = useMemo(() => toDateString(new Date()), []);

  const categoryCounts = useMemo(() => {
    const base = showTodayOnly ? getEventsForDate(events, todayString) : events;
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
  }, [events, showTodayOnly, todayString]);

  const todayEventCount = useMemo(
    () => getEventsForDate(events, todayString).length,
    [events, todayString],
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const datesWithEvents = useMemo(
    () => getDatesWithEvents(categoryFilteredEvents, year, month),
    [categoryFilteredEvents, year, month],
  );

  const displayedEvents = useMemo(() => {
    if (showTodayOnly) {
      return getEventsForDate(categoryFilteredEvents, todayString);
    }
    if (viewMode === "list") return categoryFilteredEvents;
    return getEventsForDate(categoryFilteredEvents, selectedDate);
  }, [
    viewMode,
    categoryFilteredEvents,
    selectedDate,
    showTodayOnly,
    todayString,
  ]);

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => (prev === "list" ? "calendar" : "list"));
  }, []);

  const handleToggleToday = useCallback(() => {
    setShowTodayOnly((prev) => {
      if (!prev) {
        const now = new Date();
        setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
        setSelectedDate(todayString);
      }
      return !prev;
    });
  }, [todayString]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      const today = new Date();
      if (
        newMonth.getFullYear() === today.getFullYear() &&
        newMonth.getMonth() === today.getMonth()
      ) {
        setSelectedDate(toDateString(today));
      } else {
        setSelectedDate(toDateString(newMonth));
      }
      return newMonth;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      const today = new Date();
      if (
        newMonth.getFullYear() === today.getFullYear() &&
        newMonth.getMonth() === today.getMonth()
      ) {
        setSelectedDate(toDateString(today));
      } else {
        setSelectedDate(toDateString(newMonth));
      }
      return newMonth;
    });
  }, []);

  const handleSelectDate = useCallback((dateString: string) => {
    setSelectedDate(dateString);
  }, []);

  const lastUpdated =
    events.length > 0
      ? events.reduce((latest, e) =>
          e.updated_at > latest.updated_at ? e : latest,
        ).updated_at
      : null;

  return (
    <>
      <Header viewMode={viewMode} onToggleView={handleToggleView} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          showTodayOnly={showTodayOnly}
          onToggleToday={handleToggleToday}
          todayEventCount={todayEventCount}
          categoryCounts={categoryCounts}
        />

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {viewMode === "calendar" && (
          <>
            <div className="mt-4">
              <MonthCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                datesWithEvents={datesWithEvents}
                onSelectDate={handleSelectDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>
            <h2 className="mt-4 text-sm font-medium text-gray-700">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "en-CA",
                { weekday: "long", month: "long", day: "numeric" },
              )}
            </h2>
          </>
        )}

        <div className="mt-3">
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
            <EventList events={displayedEvents} />
          )}
        </div>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </>
  );
}
