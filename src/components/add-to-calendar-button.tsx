"use client";

import { useState, useRef, useEffect } from "react";
import type { Event } from "@/types/events";
import {
  downloadIcsFile,
  generateGoogleCalendarUrl,
} from "@/lib/calendar-utils";

interface AddToCalendarButtonProps {
  event: Event;
}

export default function AddToCalendarButton({
  event,
}: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Add ${event.title} to calendar`}
        className="text-gray-600 transition-colors hover:text-gray-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true">
          <rect x="1" y="3" width="16" height="15" rx="2" />
          <path d="M5 1v4M13 1v4M1 9h16" />
          <circle
            cx="18"
            cy="18"
            r="5"
            fill="white"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <path d="M18 15.5v5M15.5 18h5" strokeWidth={1.75} />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleIcsDownload}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
            Apple / Outlook (.ics)
          </button>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
            Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}
