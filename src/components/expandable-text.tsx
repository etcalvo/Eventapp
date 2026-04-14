"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ExpandableTextProps {
  text: string;
}

export default function ExpandableText({ text }: ExpandableTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      checkTruncation();
    }
    const handleResize = () => {
      if (!isExpanded) checkTruncation();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkTruncation, isExpanded]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm ${isExpanded ? "" : "line-clamp-3"}`}
        style={{ color: "var(--text-second)" }}
      >
        {text}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--text-second)" }}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
