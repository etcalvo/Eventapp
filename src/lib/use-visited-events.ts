"use client";

import { useState, useCallback } from "react";

export function useVisitedEvents() {
  const [visitedIds, setVisitedIds] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("visited_events");
      return new Set(stored ? (JSON.parse(stored) as number[]) : []);
    } catch {
      return new Set();
    }
  });

  const toggleVisited = useCallback((id: number) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("visited_events", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Removes IDs that no longer exist in the DB (called after events load)
  const cleanupVisited = useCallback((validIds: Set<number>) => {
    setVisitedIds((prev) => {
      const cleaned = new Set([...prev].filter((id) => validIds.has(id)));
      if (cleaned.size !== prev.size) {
        localStorage.setItem("visited_events", JSON.stringify([...cleaned]));
        return cleaned;
      }
      return prev;
    });
  }, []);

  return { visitedIds, toggleVisited, cleanupVisited };
}
