interface FooterProps {
  lastUpdated: string | null;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="mt-auto py-5" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl px-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        <p>Events discovered by Claude AI · Updated every 15 days</p>
        {lastUpdated && (
          <p className="mt-1">
            Last updated{" "}
            {new Date(lastUpdated).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </footer>
  );
}
