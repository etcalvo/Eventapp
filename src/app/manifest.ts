import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BC Family Events",
    short_name: "BC Events",
    description:
      "Upcoming family-friendly events in British Columbia, Canada. Concerts, outdoor activities, festivals, parades, and more.",
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#ffffff",
    icons: [
      {
        src: `${BASE_PATH}/icons/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${BASE_PATH}/icons/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${BASE_PATH}/icons/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
