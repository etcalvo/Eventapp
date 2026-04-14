import type { Event } from "@/types/events";
import { getCategoryConfig } from "@/lib/constants";
import { toDateString } from "@/lib/date-utils";
import ExpandableText from "./expandable-text";
import AddToCalendarButton from "./add-to-calendar-button";

interface EventCardProps {
  event: Event;
  index?: number;
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (!endDate || endDate === startDate) {
    return start.toLocaleDateString("en-CA", { ...options, weekday: "short" });
  }

  const end = new Date(endDate + "T00:00:00");
  return `${start.toLocaleDateString("en-CA", options)} – ${end.toLocaleDateString("en-CA", options)}`;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const category = getCategoryConfig(event.category);
  const today = toDateString(new Date());
  const isToday =
    event.start_date <= today && (event.end_date ?? event.start_date) >= today;

  return (
    <article
      className="card-animate relative flex overflow-hidden rounded-xl"
      style={{
        animationDelay: `${index * 60}ms`,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Left accent bar */}
      <div className="w-1 shrink-0" style={{ background: category.accent }} aria-hidden="true" />

      {/* Card content */}
      <div className="flex flex-1 flex-col p-4 min-w-0 gap-3">

        {/* Row 1: badges + calendar button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: `${category.accent}0f`, color: category.accent }}
            >
              {category.label}
            </span>
            {isToday && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: "var(--today-bg)", color: "var(--today-color)" }}
              >
                <span className="h-1 w-1 rounded-full bg-current today-pulse" aria-hidden="true" />
                Today
              </span>
            )}
            {event.is_free && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: "var(--free-bg)", color: "var(--free-color)" }}
              >
                Free
              </span>
            )}
          </div>
          <AddToCalendarButton event={event} />
        </div>

        {/* Row 2: title */}
        <h3
          className="text-base font-bold leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {event.title}
        </h3>

        {/* Row 3: description */}
        <ExpandableText text={event.description} />

        {/* Row 4: meta — stacked, each on its own line with icon */}
        <div className="mt-auto border-t pt-3 flex flex-col gap-1.5" style={{ borderColor: "var(--divider)" }}>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-second)" }}>
            <svg className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatDateRange(event.start_date, event.end_date)}
            {event.start_time && <span style={{ color: "var(--text-muted)" }}>· {event.start_time}</span>}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-second)" }}>
            <svg className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {event.location}, {event.city}
          </span>
          {event.price_info && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-second)" }}>
              <svg className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.price_info}
            </span>
          )}

          {/* More info — full row, clearly tappable */}
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: category.accent }}
            >
              More info
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
