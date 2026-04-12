import type { Event } from "@/types/events";
import { getCategoryConfig } from "@/lib/constants";
import ExpandableText from "./expandable-text";
import AddToCalendarButton from "./add-to-calendar-button";

interface EventCardProps {
  event: Event;
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (!endDate || endDate === startDate) {
    return start.toLocaleDateString("en-CA", {
      ...options,
      weekday: "short",
    });
  }

  const end = new Date(endDate + "T00:00:00");
  return `${start.toLocaleDateString("en-CA", options)} – ${end.toLocaleDateString("en-CA", options)}`;
}

export default function EventCard({ event }: EventCardProps) {
  const category = getCategoryConfig(event.category);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${category.color}`}
          >
            {category.label}
          </span>
          {event.is_free && (
            <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Free
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-gray-900 leading-tight">
          {event.title}
        </h3>

        <ExpandableText text={event.description} />

        <div className="mt-auto flex flex-col gap-1 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>
              {formatDateRange(event.start_date, event.end_date)}
              {event.start_time && ` at ${event.start_time}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>
              {event.location}, {event.city}
            </span>
          </div>
          {event.price_info && (
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>{event.price_info}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <AddToCalendarButton event={event} />
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              More info →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
