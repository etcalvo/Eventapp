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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={onToggleToday}
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          showTodayOnly
            ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600 ring-offset-1"
            : "border border-teal-300 bg-white text-teal-700 hover:bg-teal-50"
        }`}
      >
        {showTodayOnly && (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        )}
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

      {EVENT_CATEGORIES.map((cat) => {
        const count = categoryCounts[cat.value];
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selected === cat.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
            {count > 0 && (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                  selected === cat.value
                    ? "bg-white text-gray-900"
                    : "bg-gray-900 text-white"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
