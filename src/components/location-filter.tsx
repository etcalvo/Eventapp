"use client";

const LOCATION_ACCENT = "#64b5ac";

interface LocationFilterProps {
  selected: string | "all";
  onChange: (city: string | "all") => void;
  cities: string[];
  cityCounts: Record<string, number>;
}

export default function LocationFilter({
  selected,
  onChange,
  cities,
  cityCounts,
}: LocationFilterProps) {
  const renderPill = (value: string | "all", label: string) => {
    const count = cityCounts[value] ?? 0;
    const isSelected = selected === value;
    return (
      <button
        key={value}
        onClick={() => onChange(value)}
        className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
        style={
          isSelected
            ? {
                background: LOCATION_ACCENT,
                color: "#0e1117",
                boxShadow: `0 0 14px ${LOCATION_ACCENT}55`,
              }
            : {
                background: `${LOCATION_ACCENT}12`,
                color: LOCATION_ACCENT,
                border: `1px solid ${LOCATION_ACCENT}30`,
              }
        }
      >
        {label}
        {count > 0 && (
          <span className="font-normal opacity-70">{count}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-0.5 scrollbar-none">
      {renderPill("all", "All cities")}
      {cities.map((city) => renderPill(city, city))}
    </div>
  );
}
