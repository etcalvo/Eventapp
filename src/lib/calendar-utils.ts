import type { Event } from "@/types/events";

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDateString(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function formatIcsDateTime(dateStr: string, timeStr: string): string {
  const timeParts = timeStr.split(":");
  const hh = timeParts[0].padStart(2, "0");
  const mm = (timeParts[1] ?? "00").padStart(2, "0");
  return `${toIcsDateString(dateStr)}T${hh}${mm}00`;
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addHoursToTime(timeStr: string, hours: number): string {
  const parts = timeStr.split(":");
  let hh = parseInt(parts[0], 10) + hours;
  const mm = parts[1] ?? "00";
  if (hh >= 24) hh = 23;
  return `${String(hh).padStart(2, "0")}:${mm}`;
}

function buildLocation(event: Event): string {
  const parts = [event.location];
  if (event.address) parts.push(event.address);
  parts.push(event.city);
  return parts.join(", ");
}

function buildDescription(event: Event): string {
  const parts = [event.description];
  if (event.price_info) parts.push(`Price: ${event.price_info}`);
  if (event.url) parts.push(event.url);
  return parts.join("\n");
}

function getDtstamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function generateIcsContent(event: Event): string {
  const hasTime = event.start_time !== null;
  const endDate = event.end_date ?? event.start_date;
  const isMultiDay = endDate !== event.start_date;

  let dtstart: string;
  let dtend: string;

  if (hasTime) {
    dtstart = `DTSTART:${formatIcsDateTime(event.start_date, event.start_time as string)}`;
    if (isMultiDay) {
      dtend = `DTEND:${formatIcsDateTime(endDate, event.start_time as string)}`;
    } else {
      const endTime = addHoursToTime(event.start_time as string, 2);
      dtend = `DTEND:${formatIcsDateTime(event.start_date, endTime)}`;
    }
  } else {
    dtstart = `DTSTART;VALUE=DATE:${toIcsDateString(event.start_date)}`;
    dtend = `DTEND;VALUE=DATE:${toIcsDateString(addDays(endDate, 1))}`;
  }

  const location = buildLocation(event);
  const description = buildDescription(event);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BC Family Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:event-${event.id}@bcfamilyevents`,
    `DTSTAMP:${getDtstamp()}`,
    dtstart,
    dtend,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
  ];

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n") + "\r\n";
}

export function generateGoogleCalendarUrl(event: Event): string {
  const hasTime = event.start_time !== null;
  const endDate = event.end_date ?? event.start_date;

  let dates: string;
  if (hasTime) {
    const startDt = formatIcsDateTime(
      event.start_date,
      event.start_time as string,
    );
    const isMultiDay = endDate !== event.start_date;
    const endDt = isMultiDay
      ? formatIcsDateTime(endDate, event.start_time as string)
      : formatIcsDateTime(
          event.start_date,
          addHoursToTime(event.start_time as string, 2),
        );
    dates = `${startDt}/${endDt}`;
  } else {
    const startD = toIcsDateString(event.start_date);
    const endD = toIcsDateString(addDays(endDate, 1));
    dates = `${startD}/${endD}`;
  }

  const location = buildLocation(event);
  const description = buildDescription(event);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: Event): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const filename = event.title
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename || "event"}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
