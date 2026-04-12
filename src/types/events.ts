export interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  location: string;
  city: string;
  address: string | null;
  url: string | null;
  image_url: string | null;
  is_free: boolean;
  price_info: string | null;
  family_friendly: boolean;
  source_note: string | null;
  created_at: string;
  updated_at: string;
}

export type EventCategory =
  | "concert"
  | "outdoor"
  | "parade"
  | "festival"
  | "family"
  | "market"
  | "sports"
  | "other";
