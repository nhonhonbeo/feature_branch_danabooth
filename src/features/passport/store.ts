import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Passport, Stamp, Locale } from "@/types";

interface PassportState {
  passport: Passport | null;
  stamps: Stamp[];
  redeemedVoucherIds: string[];
  locale: Locale;
  interests: string[];
  hasOnboarded: boolean;
  setLocale: (l: Locale) => void;
  activate: (code: string, name?: string) => void;
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

      setLocale: (l) => set({ locale: l }),

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
        }),
    }),
    { name: "danangbooth-passport-v1" },
  ),
);
