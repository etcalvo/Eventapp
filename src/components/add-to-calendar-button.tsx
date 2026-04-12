"use client";

import { useState, useRef, useEffect } from "react";
import type { Event } from "@/types/events";
import { downloadIcsFile, generateGoogleCalendarUrl } from "@/lib/calendar-utils";

interface AddToCalendarButtonProps {
  event: Event;
}

export default function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleIcsDownload = () => {
    downloadIcsFile(event);
    setOpen(false);
  };

  const googleUrl = generateGoogleCalendarUrl(event);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Add ${event.title} to calendar`}
        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
            clipRule="evenodd"
          />
          <path d="M10.75 10a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM8 10a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM13 10a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        Add to calendar
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleIcsDownload}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
          >
            Apple / Outlook (.ics)
          </button>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
          >
            Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}
