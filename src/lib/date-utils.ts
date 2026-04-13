export interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCalendarDays(year: number, month: number): CalendarDay[][] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  // Leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, dateString: toDateString(date), isCurrentMonth: false });
  }

  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({ date, dateString: toDateString(date), isCurrentMonth: true });
  }

  // Trailing days to fill last week
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dateString: toDateString(date),
        isCurrentMonth: false,
      });
    }
  }

  // Split into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export function isEventOnDate(
  event: { start_date: string; end_date: string | null },
  dateString: string,
): boolean {
  const endDate = event.end_date ?? event.start_date;
  return dateString >= event.start_date && dateString <= endDate;
}

export function getDatesWithEvents(
  events: { start_date: string; end_date: string | null }[],
  year: number,
  month: number,
): Set<string> {
  const firstDay = toDateString(new Date(year, month, 1));
  const lastDay = toDateString(new Date(year, month + 1, 0));
  const dates = new Set<string>();

  for (const event of events) {
    const endDate = event.end_date ?? event.start_date;
    if (endDate < firstDay || event.start_date > lastDay) continue;

    const rangeStart =
      event.start_date < firstDay ? firstDay : event.start_date;
    const rangeEnd = endDate > lastDay ? lastDay : endDate;

    const current = new Date(rangeStart + "T00:00:00");
    const end = new Date(rangeEnd + "T00:00:00");
    while (current <= end) {
      dates.add(toDateString(current));
      current.setDate(current.getDate() + 1);
    }
  }

  return dates;
}

export function getEventsForDate<
  T extends { start_date: string; end_date: string | null },
>(events: T[], dateString: string): T[] {
  return events.filter((e) => isEventOnDate(e, dateString));
}
