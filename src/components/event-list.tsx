import type { Event } from "@/types/events";
import EventCard from "./event-card";

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500">No upcoming events found</p>
        <p className="mt-1 text-sm text-gray-400">
          Check back soon — events are updated every 15 days
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
