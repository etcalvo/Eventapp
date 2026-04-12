interface FooterProps {
  lastUpdated: string | null;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-4">
      <div className="mx-auto max-w-5xl px-4 text-center text-xs text-gray-500">
        <p>Events discovered by Claude AI</p>
        {lastUpdated && (
          <p className="mt-1">
            Last updated:{" "}
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
