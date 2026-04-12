import type { EventCategory } from "@/types/events";

export const EVENT_CATEGORIES: {
  value: EventCategory | "all";
  label: string;
  color: string;
}[] = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { value: "concert", label: "Concerts", color: "bg-purple-100 text-purple-800" },
  { value: "outdoor", label: "Outdoor", color: "bg-green-100 text-green-800" },
  { value: "parade", label: "Parades", color: "bg-yellow-100 text-yellow-800" },
  { value: "festival", label: "Festivals", color: "bg-pink-100 text-pink-800" },
  { value: "family", label: "Family", color: "bg-blue-100 text-blue-800" },
  { value: "market", label: "Markets", color: "bg-orange-100 text-orange-800" },
  { value: "sports", label: "Sports", color: "bg-red-100 text-red-800" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
];

export const BC_CITIES = [
  "Vancouver",
  "Burnaby",
  "Surrey",
  "Richmond",
  "North Vancouver",
  "West Vancouver",
  "Coquitlam",
  "New Westminster",
  "Victoria",
  "Whistler",
  "Squamish",
  "Kelowna",
  "Kamloops",
  "Nanaimo",
  "Abbotsford",
  "Langley",
] as const;

export function getCategoryConfig(category: string) {
  return (
    EVENT_CATEGORIES.find((c) => c.value === category) ??
    EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1]
  );
}
