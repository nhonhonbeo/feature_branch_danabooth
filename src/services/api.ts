/**
 * Mock API service. Simulates network latency for SWR.
 * Replace these with real fetchers when the backend is ready.
 */
import { LOCATIONS } from "@/mocks/locations";
import { VOUCHERS } from "@/mocks/vouchers";
import { NOTIFICATIONS } from "@/mocks/notifications";
import type { Location, Voucher, Notification } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getLocations(): Promise<Location[]> {
    await delay(180);
    return LOCATIONS;
  },
  async getLocation(id: string): Promise<Location | undefined> {
    await delay(120);
    return LOCATIONS.find((l) => l.id === id || l.slug === id);
  },
  async getVouchers(): Promise<Voucher[]> {
    await delay(180);
    return VOUCHERS;
  },
  async getNotifications(): Promise<Notification[]> {
    await delay(140);
    return NOTIFICATIONS;
  },
  async validateActivationCode(code: string): Promise<{ ok: boolean }> {
    await delay(700);
    return { ok: code.trim().length >= 4 };
  },
};

export const swrFetcher = ((arg: unknown): Promise<unknown> => {
  const [key, ...args] = Array.isArray(arg) ? arg : [arg];
  switch (key) {
    case "locations":
      return api.getLocations();
    case "location":
      return api.getLocation(args[0] as string) as Promise<unknown>;
    case "vouchers":
      return api.getVouchers();
    case "notifications":
      return api.getNotifications();
    default:
      throw new Error(`Unknown SWR key: ${String(key)}`);
  }
}) as <T>(arg: unknown) => Promise<T>;
