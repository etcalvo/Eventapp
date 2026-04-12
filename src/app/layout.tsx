import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BC Family Events",
  description:
    "Upcoming family-friendly events in British Columbia, Canada. Concerts, outdoor activities, festivals, parades, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
