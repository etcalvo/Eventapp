"use client";

import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventCategory } from "@/types/events";

interface CategoryFilterProps {
  selected: EventCategory | "all";
  onChange: (category: EventCategory | "all") => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
