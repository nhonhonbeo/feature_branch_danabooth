import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Account,
  AuditLog,
  Connection,
  ConsentLog,
  DataExport,
  DemoMode,
  DemoPassportSeed,
  EmergencyContact,
  LocalEmbassyContact,
  LocationReview,
  MedicalAlert,
  ModerationState,
  Passport,
  ProfileSettings,
  Reputation,
  Session,
  ShareLink,
  Stamp,
  Locale,
  TravelDocument,
  Trip,
  UserRole,
  VerificationWorkflow,
  VerifiableBadge,
  VoucherWallet,
} from "@/types";

interface PassportState {
  passport: Passport | null;
  account: Account | null;
  profileSettings: ProfileSettings | null;
  travelDocuments: TravelDocument[];
  emergencyContacts: EmergencyContact[];
  medicalAlerts: MedicalAlert[];
  embassyContacts: LocalEmbassyContact[];
  sessions: Session[];
  trips: Trip[];
  shareLinks: ShareLink[];
  connections: Connection[];
  locationReviews: LocationReview[];
  verification: VerificationWorkflow;
  badges: VerifiableBadge[];
  reputation: Reputation;
  moderation: ModerationState;
  auditLogs: AuditLog[];
  consentLogs: ConsentLog[];
  roles: UserRole[];
  dataExport: DataExport;
  voucherWallet: VoucherWallet;
  stamps: Stamp[];
  redeemedVoucherIds: string[];
  locale: Locale;
  interests: string[];
  hasOnboarded: boolean;
  demoMode: DemoMode;
  pendingSeed: DemoPassportSeed | null;
  setLocale: (l: Locale) => void;
  setDemoMode: (mode: DemoMode) => void;
  activate: (code: string, name?: string) => void;
  loadSeedPassport: (seed: DemoPassportSeed) => void;
  beginSeedActivation: (seed: DemoPassportSeed) => void;
  completeSeedActivation: (name: string) => void;
  updateAccount: (account: Account) => void;
  updateProfileSettings: (settings: ProfileSettings) => void;
  saveTravelDocument: (document: TravelDocument) => void;
  saveEmergencyContact: (contact: EmergencyContact) => void;
  logoutOtherSessions: () => void;
  createShareLink: (scope: ShareLink["scope"]) => ShareLink;
  requestDataExport: () => void;
  requestAccountDeletion: () => void;
  setInterests: (i: string[]) => void;
  completeOnboarding: () => void;
  collectStamp: (locationId: string, points: number) => Stamp | null;
  redeemVoucher: (voucherId: string) => void;
  reset: () => void;
}

const nowIso = () => new Date().toISOString();

function slugUsername(name: string | undefined, fallbackCode: string) {
  const normalized = (name || "danang traveler")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
  return `${normalized || "traveler"}.${fallbackCode.slice(-4).toLowerCase()}`;
}

function createProfileBundle(passport: Passport, locale: Locale) {
  const now = nowIso();
  const ownerName = passport.ownerName || "Danang Traveler";
  const [firstName = ownerName, ...lastNameParts] = ownerName.split(" ");
  const userId = `user_${passport.id}`;
  const account: Account = {
    user: {
      id: userId,
      username: slugUsername(ownerName, passport.code),
      displayName: ownerName,
      firstName,
      lastName: lastNameParts.join(" "),
      bio: "Collecting stamps across Da Nang.",
      preferredLanguage: locale,
      timezone: "Asia/Ho_Chi_Minh",
      locale,
      joinedAt: passport.activatedAt || now,
      isVerified: true,
    },
    emails: [
      {
        address: `${slugUsername(ownerName, passport.code).replaceAll(".", "")}@example.com`,
        isPrimary: true,
        isVerified: true,
        verifiedAt: now,
      },
      {
        address: "travel.backup@example.com",
        isPrimary: false,
        isVerified: false,
      },
    ],
    passwordChangedAt: now,
    twoFAEnabled: true,
    twoFAMethod: "totp",
    isProfilePublic: true,
    lastLoginAt: now,
    lastLoginIp: "127.0.0.1",
    createdAt: passport.activatedAt || now,
    updatedAt: now,
  };

  const settings: ProfileSettings = {
    userId,
    fieldVisibility: {
      email: "private",
      bio: "public",
      stamps: "public",
      documents: "private",
      passport: "connections",
      trips: "connections",
      emergency: "private",
    },
    notificationsEmailEnabled: true,
    notificationsPushEnabled: true,
    notificationsSmsEnabled: false,
    accessibilityHighContrast: false,
    accessibilityFontScale: 1,
    mapStyle: "light",
    lastViewedLocationId: "dragon-bridge",
    nearbyAutoCheckinRadiusMeters: 150,
    followPrivacy: "approval_required",
    offlineProfileEnabled: true,
    offlineRecentDocsEnabled: false,
  };

  return { account, settings };
}

function defaultSessions(userId: string): Session[] {
  const now = nowIso();
  return [
    {
      id: "sess_current",
      userId,
      deviceName: "Current iPhone",
      ipAddress: "127.0.0.1",
      userAgent: "DanangBooth Mobile Web",
      createdAt: now,
      lastActivityAt: now,
    },
    {
      id: "sess_tablet",
      userId,
      deviceName: "iPad Safari",
      ipAddress: "10.0.0.12",
      createdAt: now,
      lastActivityAt: now,
    },
  ];
}

function defaultProfileState() {
  return {
    account: null,
    profileSettings: null,
    travelDocuments: [] as TravelDocument[],
    emergencyContacts: [] as EmergencyContact[],
    medicalAlerts: [] as MedicalAlert[],
    embassyContacts: [] as LocalEmbassyContact[],
    sessions: [] as Session[],
    trips: [] as Trip[],
    shareLinks: [] as ShareLink[],
    connections: [] as Connection[],
    locationReviews: [] as LocationReview[],
    verification: {
      identityStatus: "pending",
      documentStatus: "pending",
    } as VerificationWorkflow,
    badges: [] as VerifiableBadge[],
    reputation: {
      rating: 0,
      contributionCount: 0,
      verifiedIdentityBoost: false,
    } as Reputation,
    moderation: {
      blockedUserIds: [],
    } as ModerationState,
    auditLogs: [] as AuditLog[],
    consentLogs: [] as ConsentLog[],
    roles: [] as UserRole[],
    dataExport: {
      jsonReady: false,
      vcardReady: false,
    } as DataExport,
    voucherWallet: {
      redeemedVoucherIds: [],
      savedVoucherIds: [],
      paymentMethods: [],
    } as VoucherWallet,
  };
}

function hydratedProfileState(passport: Passport, locale: Locale, redeemedVoucherIds: string[]) {
  const { account, settings } = createProfileBundle(passport, locale);
  const userId = account.user.id;
  const now = nowIso();
  return {
    account,
    profileSettings: settings,
    travelDocuments: [
      {
        id: "doc_passport_scan",
        userId,
        type: "passport",
        fileUrl: "signed-upload://passport-scan",
        thumbnailUrl: "/images/passport-doc.png",
        metadata: {
          issuedBy: passport.issuingAuthority || "DanangBooth Passport Desk",
          issuedAt: passport.activatedAt,
          expiresAt: "2030-12-31T00:00:00.000Z",
          country: passport.country || "VN",
          documentNumber: passport.code,
        },
        status: "verified",
        uploadedAt: now,
      },
      {
        id: "doc_insurance",
        userId,
        type: "insurance",
        fileUrl: "signed-upload://insurance",
        metadata: {
          issuedBy: "TravelCare",
          expiresAt: "2027-05-01T00:00:00.000Z",
          country: "VN",
        },
        status: "pending",
        uploadedAt: now,
      },
    ] as TravelDocument[],
    emergencyContacts: [
      {
        id: "emergency_primary",
        userId,
        name: "Family contact",
        relation: "Family",
        phone: "+84 900 000 000",
        isPrimary: true,
      },
    ] as EmergencyContact[],
    medicalAlerts: [
      {
        id: "medical_allergy",
        userId,
        type: "allergy",
        title: "Shellfish",
        description: "Show alert before food tours.",
        severity: "medium",
      },
    ] as MedicalAlert[],
    embassyContacts: [
      {
        country: "VN",
        name: "Local visitor assistance",
        phone: "+84 236 000 000",
        address: "Da Nang visitor support desk",
      },
    ] as LocalEmbassyContact[],
    sessions: defaultSessions(userId),
    trips: [
      {
        id: "trip_da_nang_weekend",
        userId,
        title: "Da Nang weekend",
        startDate: "2026-05-15",
        endDate: "2026-05-18",
        destinationIds: ["dragon-bridge", "my-khe-beach"],
        notes: "Food, beach, and night market route.",
        itinerary: [
          {
            id: "it_dragon_bridge",
            locationId: "dragon-bridge",
            title: "Dragon Bridge evening check-in",
            startsAt: "2026-05-15T19:00:00.000Z",
          },
        ],
        isShared: true,
      },
    ] as Trip[],
    shareLinks: [
      {
        id: "share_public_profile",
        scope: ["bio", "stamps", "badges"],
        qrValue: `/qr/profile-${userId}`,
        createdAt: now,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
    ] as ShareLink[],
    connections: [
      {
        id: "conn_minh",
        userId: "user_minh",
        displayName: "Minh Tran",
        username: "minh.travels",
        status: "connected",
      },
    ] as Connection[],
    locationReviews: [
      {
        id: "review_dragon_bridge",
        userId,
        locationId: "dragon-bridge",
        note: "Best after sunset when the bridge lights turn on.",
        rating: 5,
        isPublic: true,
        createdAt: now,
      },
    ] as LocationReview[],
    verification: {
      identityStatus: "verified",
      documentStatus: "pending",
      manualReviewNotes: "Insurance document awaiting review.",
      ocrMetadata: {
        ownerName: account.user.displayName,
        passportCode: passport.code,
      },
    } as VerificationWorkflow,
    badges: [
      {
        id: "badge_verified",
        label: "Verified traveler",
        kind: "verified_traveler",
        issuedAt: now,
      },
      {
        id: "badge_leader",
        label: "Travel leader",
        kind: "travel_leader",
        issuedAt: now,
      },
    ] as VerifiableBadge[],
    reputation: {
      rating: 4.8,
      contributionCount: 12,
      verifiedIdentityBoost: true,
    } as Reputation,
    moderation: {
      blockedUserIds: [],
    } as ModerationState,
    auditLogs: [
      {
        id: "audit_profile_created",
        action: "profile.created",
        actorRole: "user",
        createdAt: now,
        summary: "Profile initialized from passport activation.",
      },
    ] as AuditLog[],
    consentLogs: [
      {
        id: "consent_share_profile",
        action: "share",
        scope: "bio, stamps, badges",
        createdAt: now,
      },
    ] as ConsentLog[],
    roles: [
      {
        id: "role_user",
        userId,
        role: "user",
        grantedAt: now,
      },
    ] as UserRole[],
    dataExport: {
      jsonReady: true,
      vcardReady: true,
    } as DataExport,
    voucherWallet: {
      redeemedVoucherIds,
      savedVoucherIds: ["voucher_cafe", "voucher_museum"],
      paymentMethods: [
        {
          id: "pm_visa",
          brand: "Visa",
          last4: "4242",
          expiresAt: "2028-08",
        },
      ],
    } as VoucherWallet,
  };
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      passport: null,
      ...defaultProfileState(),
      stamps: [],
      redeemedVoucherIds: [],
      locale: "vi",
      interests: [],
      hasOnboarded: false,
      demoMode: "auto",
      pendingSeed: null,

      setLocale: (l) => set({ locale: l }),

      setDemoMode: (demoMode) => set({ demoMode }),

      activate: (code, name) =>
        set((state) => {
          const passport: Passport = {
            id: `pp_${Date.now()}`,
            code,
            ownerName: name,
            activatedAt: new Date().toISOString(),
            position: 1247 + Math.floor(Math.random() * 200),
            isActivated: true,
            issuingAuthority: "DanangBooth Passport Desk",
            country: "VN",
          };
          return {
            passport,
            ...hydratedProfileState(passport, state.locale, state.redeemedVoucherIds),
            pendingSeed: null,
          };
        }),

      loadSeedPassport: (seed) =>
        set((state) => ({
          passport: {
            issuingAuthority: "DanangBooth Passport Desk",
            country: "VN",
            ...seed.passport,
          },
          stamps: seed.stamps,
          redeemedVoucherIds: seed.redeemedVoucherIds,
          ...hydratedProfileState(
            {
              issuingAuthority: "DanangBooth Passport Desk",
              country: "VN",
              ...seed.passport,
            },
            state.locale,
            seed.redeemedVoucherIds,
          ),
          hasOnboarded: seed.hasOnboarded,
          interests: [],
          pendingSeed: null,
        })),

      beginSeedActivation: (seed) =>
        set({
          passport: null,
          ...defaultProfileState(),
          stamps: [],
          redeemedVoucherIds: [],
          interests: [],
          hasOnboarded: false,
          pendingSeed: seed,
        }),

      completeSeedActivation: (name) =>
        set((state) => {
          if (!state.pendingSeed) return state;
          const passport: Passport = {
              ...state.pendingSeed.passport,
              ownerName: name,
              activatedAt: new Date().toISOString(),
              isActivated: true,
              issuingAuthority:
                state.pendingSeed.passport.issuingAuthority || "DanangBooth Passport Desk",
              country: state.pendingSeed.passport.country || "VN",
            };
          return {
            passport,
            ...hydratedProfileState(passport, state.locale, state.pendingSeed.redeemedVoucherIds),
            stamps: state.pendingSeed.stamps,
            redeemedVoucherIds: state.pendingSeed.redeemedVoucherIds,
            hasOnboarded: state.pendingSeed.hasOnboarded,
            pendingSeed: null,
          };
        }),

      updateAccount: (account) =>
        set((state) => ({
          account: {
            ...account,
            updatedAt: nowIso(),
          },
          passport: state.passport
            ? {
                ...state.passport,
                ownerName: account.user.displayName,
              }
            : state.passport,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "profile.pii.updated",
              actorRole: state.roles[0]?.role || "user",
              createdAt: nowIso(),
              summary: "Basic identity or account contact data changed.",
            },
            ...state.auditLogs,
          ],
        })),

      updateProfileSettings: (profileSettings) =>
        set((state) => ({
          profileSettings,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "profile.settings.updated",
              actorRole: state.roles[0]?.role || "user",
              createdAt: nowIso(),
              summary: "Privacy, notification, map, or accessibility settings changed.",
            },
            ...state.auditLogs,
          ],
        })),

      saveTravelDocument: (document) =>
        set((state) => ({
          travelDocuments: [
            document,
            ...state.travelDocuments.filter((existing) => existing.id !== document.id),
          ],
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "document.saved",
              actorRole: state.roles[0]?.role || "user",
              createdAt: nowIso(),
              summary: `${document.type} metadata saved with ${document.status} status.`,
            },
            ...state.auditLogs,
          ],
        })),

      saveEmergencyContact: (contact) =>
        set((state) => ({
          emergencyContacts: [
            contact,
            ...state.emergencyContacts.filter((existing) => existing.id !== contact.id),
          ],
        })),

      logoutOtherSessions: () =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id === "sess_current"),
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "security.sessions.revoked",
              actorRole: state.roles[0]?.role || "user",
              createdAt: nowIso(),
              summary: "Other active sessions were logged out.",
            },
            ...state.auditLogs,
          ],
        })),

      createShareLink: (scope) => {
        const state = get();
        const link: ShareLink = {
          id: `share_${Date.now()}`,
          scope,
          qrValue: `/qr/profile-${state.account?.user.id || "guest"}-${Date.now()}`,
          createdAt: nowIso(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        };
        set((current) => ({
          shareLinks: [link, ...current.shareLinks],
          consentLogs: [
            {
              id: `consent_${Date.now()}`,
              action: "share",
              scope: scope.join(", "),
              createdAt: nowIso(),
            },
            ...current.consentLogs,
          ],
        }));
        return link;
      },

      requestDataExport: () =>
        set((state) => ({
          dataExport: {
            jsonReady: true,
            vcardReady: true,
            requestedAt: nowIso(),
          },
          consentLogs: [
            {
              id: `consent_${Date.now()}`,
              action: "export",
              scope: "profile json, vCard",
              createdAt: nowIso(),
            },
            ...state.consentLogs,
          ],
        })),

      requestAccountDeletion: () =>
        set((state) => ({
          consentLogs: [
            {
              id: `consent_${Date.now()}`,
              action: "delete_request",
              scope: "soft-delete requested; purge queued by retention policy",
              createdAt: nowIso(),
            },
            ...state.consentLogs,
          ],
        })),

      setInterests: (interests) => set({ interests }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      collectStamp: (locationId, points) => {
        const exists = get().stamps.find((s) => s.locationId === locationId);
        if (exists) return null;
        const stamp: Stamp = {
          id: `st_${Date.now()}`,
          locationId,
          collectedAt: new Date().toISOString(),
          points,
        };
        set((s) => ({ stamps: [...s.stamps, stamp] }));
        return stamp;
      },

      redeemVoucher: (voucherId) =>
        set((s) => ({
          redeemedVoucherIds: Array.from(
            new Set([...s.redeemedVoucherIds, voucherId]),
          ),
          voucherWallet: {
            ...s.voucherWallet,
            redeemedVoucherIds: Array.from(
              new Set([...s.voucherWallet.redeemedVoucherIds, voucherId]),
            ),
          },
        })),

      reset: () =>
        set({
          passport: null,
          ...defaultProfileState(),
          stamps: [],
          redeemedVoucherIds: [],
          interests: [],
          hasOnboarded: false,
          pendingSeed: null,
        }),
    }),
    { name: "danangbooth-passport-v1" },
  ),
);
