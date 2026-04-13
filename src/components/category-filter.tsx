"use client";

import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventCategory } from "@/types/events";

interface CategoryFilterProps {
  selected: EventCategory | "all";
  onChange: (category: EventCategory | "all") => void;
  showTodayOnly: boolean;
  onToggleToday: () => void;
  todayEventCount: number;
}

export default function CategoryFilter({
  selected,
  onChange,
  showTodayOnly,
  onToggleToday,
  todayEventCount,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={onToggleToday}
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          showTodayOnly
            ? "bg-teal-600 text-white"
            : "bg-teal-100 text-teal-700 hover:bg-teal-200"
        }`}
      >
        Today
        {todayEventCount > 0 && (
          <span
            className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
              showTodayOnly
                ? "bg-white text-teal-700"
                : "bg-teal-600 text-white"
            }`}
          >
            {todayEventCount}
          </span>
        )}
      </button>

      <div className="shrink-0 self-stretch w-px bg-gray-300" />

      {EVENT_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            selected === cat.value
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
