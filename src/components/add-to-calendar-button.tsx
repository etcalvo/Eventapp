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
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Add ${event.title} to calendar`}
        className="flex items-center justify-center rounded-lg p-1.5 transition-colors"
        style={{ color: open ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect x="1" y="3" width="16" height="15" rx="2" />
          <path d="M5 1v4M13 1v4M1 9h16" />
          <circle cx="18" cy="18" r="5" fill="var(--bg-card)" stroke="currentColor" strokeWidth={1.5} />
          <path d="M18 15.5v5M15.5 18h5" strokeWidth={1.75} />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl shadow-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <button
            type="button"
            onClick={handleIcsDownload}
            className="flex w-full items-center px-4 py-2.5 text-left text-xs font-medium transition-colors"
            style={{ color: "var(--text-second)" }}
          >
            Apple / Outlook (.ics)
          </button>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center px-4 py-2.5 text-left text-xs font-medium transition-colors"
            style={{ color: "var(--text-second)" }}
          >
            Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}
