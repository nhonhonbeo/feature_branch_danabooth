export type Locale = "vi" | "en";

export type Bilingual = { vi: string; en: string };

export type Category =
  | "beach"
  | "landmark"
  | "food"
  | "culture"
  | "nature"
  | "nightlife"
  | "shopping";

export interface Location {
  id: string;
  slug: string;
  name: Bilingual;
  category: Category;
  description: Bilingual;
  address: Bilingual;
  coords: { lat: number; lng: number };
  image: string;
  stampPoints: number;
  rating: number;
  openHours?: string;
  tags?: Bilingual[];
}

export interface Stamp {
  id: string;
  locationId: string;
  collectedAt: string; // ISO
  points: number;
  photoUrl?: string;
}

export interface Voucher {
  id: string;
  brand: string;
  title: Bilingual;
  description: Bilingual;
  discount: string; // "20%" / "50K"
  validUntil: string; // ISO
  code: string;
  color: string;
  used: boolean;
  partnerLocationId?: string;
}

export interface Notification {
  id: string;
  title: Bilingual;
  body: Bilingual;
  createdAt: string;
  read: boolean;
  kind: "stamp" | "voucher" | "system" | "journey";
}

export interface Passport {
  id: string;
  code: string; // QR code id
  ownerName?: string;
  activatedAt?: string;
  position?: number; // user # in line
  isActivated: boolean;
}

export interface JourneyDay {
  date: string; // ISO date
  items: Array<{
    locationId: string;
    plannedAt?: string;
    completedAt?: string;
  }>;
}
