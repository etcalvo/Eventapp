"use client";

import { getCalendarDays, toDateString } from "@/lib/date-utils";

interface MonthCalendarProps {
  currentMonth: Date;
  selectedDate: string;
  datesWithEvents: Set<string>;
  onSelectDate: (dateString: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MonthCalendar({
  currentMonth,
  selectedDate,
  datesWithEvents,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const weeks = getCalendarDays(year, month);
  const todayString = toDateString(new Date());

  const monthLabel = currentMonth.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <span className="text-sm font-semibold text-gray-900">
          {monthLabel}
        </span>

        <button
          onClick={onNextMonth}
          className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="py-1 text-center text-xs font-medium text-gray-400"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const isToday = day.dateString === todayString;
            const isSelected = day.dateString === selectedDate;
            const hasEvents = datesWithEvents.has(day.dateString);

            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => onSelectDate(day.dateString)}
                className={`flex flex-col items-center justify-center py-1.5 text-sm transition-colors ${
                  !day.isCurrentMonth
                    ? "text-gray-300"
                    : isSelected
                      ? "font-semibold text-white"
                      : isToday
                        ? "font-semibold text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-gray-900"
                      : isToday
                        ? "ring-2 ring-gray-900"
                        : ""
                  }`}
                >
                  {day.date.getDate()}
                </span>
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    hasEvents && day.isCurrentMonth
                      ? isSelected
                        ? "bg-white"
                        : "bg-blue-500"
                      : "bg-transparent"
                  }`}
                />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
