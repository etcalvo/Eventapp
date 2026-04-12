export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <span className="text-2xl" role="img" aria-label="maple leaf">
          🍁
        </span>
        <div>
          <h1 className="text-lg font-bold text-gray-900">BC Family Events</h1>
          <p className="text-xs text-gray-500">
            British Columbia, Canada
          </p>
        </div>
      </div>
    </header>
  );
}
