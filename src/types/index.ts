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
  stampImageUrl?: string;
  metadata?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  };
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
  issuingAuthority?: string;
  country?: string;
}

export type DemoMode = "auto" | "force_pending" | "force_activated";

export interface DemoPassportSeed {
  seedId: string;
  qrId: string;
  passport: Passport;
  stamps: Stamp[];
  redeemedVoucherIds: string[];
  hasOnboarded: boolean;
}

export interface JourneyDay {
  date: string; // ISO date
  items: Array<{
    locationId: string;
    plannedAt?: string;
    completedAt?: string;
  }>;
}

export interface JourneyCheckinPoint {
  name: string;
  lat: number;
  lng: number;
}

export type ShareCardFormat = "story-9x16";

export interface ShareCardDraft {
  format: ShareCardFormat;
  imageDataUrl: string | null;
  points: JourneyCheckinPoint[];
  useDemoData: boolean;
}

export interface ShareCardRenderResult {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
}

export interface JourneyRouteOverlay {
  coordinates: number[][];
  distanceKm: number;
}

/* ===== Profile & Account ===== */

export type FieldVisibility = "public" | "connections" | "private";

export type DocumentType = "passport" | "visa" | "vaccination" | "insurance" | "travel_permit" | "other";
export type DocumentStatus = "pending" | "verified" | "rejected" | "expired";

export interface User {
  id: string;
  username: string; // unique
  displayName: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  bio?: string;
  preferredLanguage: Locale;
  timezone: string; // "Asia/Ho_Chi_Minh", etc.
  locale: Locale;
  joinedAt: string; // ISO
  isVerified: boolean; // identity verified badge
}

export interface Email {
  address: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: string; // ISO
}

export interface Account {
  user: User;
  emails: Email[]; // primaryEmail is the one with isPrimary: true
  passwordChangedAt: string; // ISO
  passwordHash?: string; // server-side only
  twoFAEnabled: boolean;
  twoFAMethod?: "totp" | "sms"; // if enabled
  isProfilePublic: boolean;
  lastLoginAt: string; // ISO
  lastLoginIp?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface FieldVisibilityMap {
  email: FieldVisibility;
  bio: FieldVisibility;
  stamps: FieldVisibility;
  documents: FieldVisibility;
  [key: string]: FieldVisibility;
}

export interface ProfileSettings {
  userId: string;
  fieldVisibility: FieldVisibilityMap;
  notificationsEmailEnabled: boolean;
  notificationsPushEnabled: boolean;
  notificationsSmsEnabled: boolean;
  accessibilityHighContrast: boolean;
  accessibilityFontScale: number; // 1.0 = normal, 1.2 = 20% larger
  mapStyle?: "streets" | "satellite" | "light";
  lastViewedLocationId?: string;
  nearbyAutoCheckinRadiusMeters?: number;
  followPrivacy?: "open" | "approval_required" | "private";
  offlineProfileEnabled?: boolean;
  offlineRecentDocsEnabled?: boolean;
}

export interface TravelDocument {
  id: string;
  userId: string;
  type: DocumentType;
  fileUrl?: string; // signed S3 URL
  thumbnailUrl?: string;
  metadata: {
    issuedBy?: string;
    issuedAt?: string; // ISO
    expiresAt?: string; // ISO
    country?: string;
    documentNumber?: string;
  };
  status: DocumentStatus;
  verificationNotes?: string; // admin notes if rejected
  uploadedAt: string; // ISO
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface MedicalAlert {
  id: string;
  userId: string;
  type: "allergy" | "medication" | "condition" | "other";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface Session {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  userAgent?: string;
  lastActivityAt: string; // ISO
  createdAt: string; // ISO
}

export interface UserRole {
  id: string;
  userId: string;
  role: "user" | "moderator" | "admin";
  grantedAt: string; // ISO
}

export interface TripItineraryItem {
  id: string;
  locationId?: string;
  title: string;
  startsAt?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  destinationIds: string[];
  notes?: string;
  itinerary: TripItineraryItem[];
  isShared: boolean;
}

export interface LocalEmbassyContact {
  country: string;
  name: string;
  phone: string;
  address?: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiresAt: string;
}

export interface VoucherWallet {
  redeemedVoucherIds: string[];
  savedVoucherIds: string[];
  paymentMethods: PaymentMethod[];
}

export interface ShareLink {
  id: string;
  scope: Array<keyof FieldVisibilityMap | "passport" | "badges" | "trips">;
  qrValue: string;
  expiresAt: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  status: "connected" | "following" | "follower" | "blocked";
}

export interface LocationReview {
  id: string;
  userId: string;
  locationId: string;
  note: string;
  rating: number;
  isPublic: boolean;
  createdAt: string;
}

export interface VerificationWorkflow {
  identityStatus: DocumentStatus;
  documentStatus: DocumentStatus;
  manualReviewNotes?: string;
  ocrMetadata?: Record<string, string>;
}

export interface VerifiableBadge {
  id: string;
  label: string;
  kind: "verified_traveler" | "travel_leader" | "host";
  issuedAt: string;
}

export interface Reputation {
  rating: number;
  contributionCount: number;
  verifiedIdentityBoost: boolean;
}

export interface ModerationState {
  blockedUserIds: string[];
  suspendedAt?: string;
  suspensionReason?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorRole: UserRole["role"];
  createdAt: string;
  summary: string;
}

export interface ConsentLog {
  id: string;
  action: "share" | "export" | "delete_request";
  scope: string;
  createdAt: string;
}

export interface DataExport {
  jsonReady: boolean;
  vcardReady: boolean;
  requestedAt?: string;
}
