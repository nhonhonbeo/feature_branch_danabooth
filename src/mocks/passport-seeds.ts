import type { DemoMode, DemoPassportSeed, Passport } from "@/types";

const pendingPassport: Passport = {
  id: "pp_demo_pending",
  code: "DNB-PEND-2026",
  ownerName: undefined,
  isActivated: false,
  position: 1321,
};

const activatedPassport: Passport = {
  id: "pp_demo_active",
  code: "DNB-ACTI-2026",
  ownerName: "Linh Tran",
  activatedAt: "2026-05-11T08:15:00.000Z",
  isActivated: true,
  position: 1184,
};

export const PASSPORT_SEEDS: DemoPassportSeed[] = [
  {
    seedId: "demo_pending_passport",
    qrId: "demo-pending-passport",
    passport: pendingPassport,
    stamps: [],
    redeemedVoucherIds: [],
    hasOnboarded: false,
  },
  {
    seedId: "demo_activated_passport",
    qrId: "demo-activated-passport",
    passport: activatedPassport,
    stamps: [
      {
        id: "st_demo_001",
        locationId: "loc_dragon_bridge",
        collectedAt: "2026-05-10T09:00:00.000Z",
        points: 20,
      },
      {
        id: "st_demo_002",
        locationId: "loc_my_khe",
        collectedAt: "2026-05-10T13:20:00.000Z",
        points: 15,
      },
      {
        id: "st_demo_003",
        locationId: "loc_son_tra",
        collectedAt: "2026-05-10T17:45:00.000Z",
        points: 25,
      },
    ],
    redeemedVoucherIds: ["v_3"],
    hasOnboarded: true,
  },
];

export function getPassportSeedByQrId(qrId: string) {
  return PASSPORT_SEEDS.find((seed) => seed.qrId === qrId);
}

export function resolveSeedActivationState(
  seed: DemoPassportSeed,
  demoMode: DemoMode,
): "pending" | "activated" {
  if (demoMode === "force_pending") return "pending";
  if (demoMode === "force_activated") return "activated";
  return seed.passport.isActivated ? "activated" : "pending";
}

export function buildSeedForActivationState(
  seed: DemoPassportSeed,
  activationState: "pending" | "activated",
): DemoPassportSeed {
  if (activationState === "pending") {
    return {
      ...seed,
      passport: {
        ...seed.passport,
        ownerName: undefined,
        activatedAt: undefined,
        isActivated: false,
      },
      hasOnboarded: false,
      stamps: [],
      redeemedVoucherIds: [],
    };
  }

  return {
    ...seed,
    passport: {
      ...seed.passport,
      ownerName: seed.passport.ownerName ?? "Demo Explorer",
      activatedAt: seed.passport.activatedAt ?? new Date().toISOString(),
      isActivated: true,
    },
    hasOnboarded: true,
  };
}
