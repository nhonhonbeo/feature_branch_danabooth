import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DemoMode,
  DemoPassportSeed,
  Passport,
  Stamp,
  Locale,
} from "@/types";

interface PassportState {
  passport: Passport | null;
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
  setInterests: (i: string[]) => void;
  completeOnboarding: () => void;
  collectStamp: (locationId: string, points: number) => Stamp | null;
  redeemVoucher: (voucherId: string) => void;
  reset: () => void;
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      passport: null,
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
        set({
          passport: {
            id: `pp_${Date.now()}`,
            code,
            ownerName: name,
            activatedAt: new Date().toISOString(),
            position: 1247 + Math.floor(Math.random() * 200),
            isActivated: true,
          },
          pendingSeed: null,
        }),

      loadSeedPassport: (seed) =>
        set({
          passport: seed.passport,
          stamps: seed.stamps,
          redeemedVoucherIds: seed.redeemedVoucherIds,
          hasOnboarded: seed.hasOnboarded,
          interests: [],
          pendingSeed: null,
        }),

      beginSeedActivation: (seed) =>
        set({
          passport: null,
          stamps: [],
          redeemedVoucherIds: [],
          interests: [],
          hasOnboarded: false,
          pendingSeed: seed,
        }),

      completeSeedActivation: (name) =>
        set((state) => {
          if (!state.pendingSeed) return state;
          return {
            passport: {
              ...state.pendingSeed.passport,
              ownerName: name,
              activatedAt: new Date().toISOString(),
              isActivated: true,
            },
            stamps: state.pendingSeed.stamps,
            redeemedVoucherIds: state.pendingSeed.redeemedVoucherIds,
            hasOnboarded: state.pendingSeed.hasOnboarded,
            pendingSeed: null,
          };
        }),

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
        })),

      reset: () =>
        set({
          passport: null,
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
