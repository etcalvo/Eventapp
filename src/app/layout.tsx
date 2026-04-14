import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/service-worker-register";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0e1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BC Events",
  description:
    "Upcoming events in British Columbia, Canada. Concerts, outdoor activities, festivals, parades, and more.",
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
    <html lang="en" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerRegister />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
