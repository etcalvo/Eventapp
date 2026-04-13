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
      if (!isExpanded) {
        checkTruncation();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkTruncation, isExpanded]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm text-gray-600 ${isExpanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800">
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
