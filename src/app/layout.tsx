import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/service-worker-register";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BC Family Events",
  description:
    "Upcoming family-friendly events in British Columbia, Canada. Concerts, outdoor activities, festivals, parades, and more.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BC Events",
  },
  icons: {
    icon: "/Eventapp/icons/icon-192x192.png",
    apple: "/Eventapp/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 font-sans text-gray-900">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
