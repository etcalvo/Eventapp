"use client";

import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventCategory } from "@/types/events";

interface CategoryFilterProps {
  selected: EventCategory | "all";
  onChange: (category: EventCategory | "all") => void;
  showTodayOnly: boolean;
  onToggleToday: () => void;
  todayEventCount: number;
  categoryCounts: Record<EventCategory | "all", number>;
  visitedCount: number;
  showVisited: boolean;
  onToggleShowVisited: () => void;
}

export default function CategoryFilter({
  selected,
  onChange,
  showTodayOnly,
  onToggleToday,
  todayEventCount,
  categoryCounts,
  visitedCount,
  showVisited,
  onToggleShowVisited,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-0.5 scrollbar-none">
      {/* Today pill */}
      <button
        onClick={onToggleToday}
        className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
        style={
          showTodayOnly
            ? {
                background: "var(--today-color)",
                color: "#fff",
              }
            : {
                background: "var(--today-bg)",
                color: "var(--today-color)",
                border: "1px solid color-mix(in srgb, var(--today-color) 30%, transparent)",
              }
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current today-pulse" aria-hidden="true" />
        Today
        {todayEventCount > 0 && (
          <span className="font-normal opacity-75">{todayEventCount}</span>
        )}
      </button>

      {/* Visited pill — only shown when there are visited events */}
      {visitedCount > 0 && (
        <button
          onClick={onToggleShowVisited}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
          style={
            showVisited
              ? { background: "#6b7280", color: "#fff" }
              : {
                  background: "var(--bg-card)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }
          }
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
          Visited
          <span className="font-normal opacity-75">{visitedCount}</span>
        </button>
      )}

      <div className="shrink-0 self-stretch w-px" style={{ background: "var(--border)" }} />

      {EVENT_CATEGORIES.map((cat) => {
        const count = categoryCounts[cat.value];
        const isSelected = selected === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
            style={
              isSelected
                ? {
                    background: cat.accent,
                    color: "#0e1117",
                    boxShadow: `0 0 14px ${cat.accent}55`,
                  }
                : {
                    background: `${cat.accent}12`,
                    color: cat.accent,
                    border: `1px solid ${cat.accent}30`,
                  }
            }
          >
            {cat.label}
            {count > 0 && (
              <span className="font-normal opacity-70">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
