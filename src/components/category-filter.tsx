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
}

export default function CategoryFilter({
  selected,
  onChange,
  showTodayOnly,
  onToggleToday,
  todayEventCount,
  categoryCounts,
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
