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
      <button
        onClick={onToggleToday}
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          showTodayOnly
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-teal-600 bg-white text-teal-700 hover:bg-teal-50"
        }`}>
        Today only
        {todayEventCount > 0 && (
          <span className="opacity-80">{todayEventCount}</span>
        )}
      </button>

      <div className="shrink-0 self-stretch w-px bg-gray-300" />

      {EVENT_CATEGORIES.map((cat) => {
        const count = categoryCounts[cat.value];
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selected === cat.value
                ? cat.value === "all"
                  ? "bg-gray-800 text-white"
                  : cat.color
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {cat.label}
            {count > 0 && <span className="opacity-60">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
