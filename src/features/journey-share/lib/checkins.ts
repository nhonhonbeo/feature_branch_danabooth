import { LOCATIONS } from "@/mocks/locations";
import type { JourneyCheckinPoint, Locale, Location, Stamp } from "@/types";

export function mapStampsToCheckinPoints(
  stamps: Stamp[],
  locations: Location[],
  locale: Locale,
): JourneyCheckinPoint[] {
  return stamps
    .slice()
    .sort((a, b) => a.collectedAt.localeCompare(b.collectedAt))
    .map((stamp) => {
      const location = locations.find((item) => item.id === stamp.locationId);
      if (!location) return null;
      return {
        name: location.name[locale],
        lat: location.coords.lat,
        lng: location.coords.lng,
      } satisfies JourneyCheckinPoint;
    })
    .filter((point): point is JourneyCheckinPoint => Boolean(point));
}

export function getDemoJourneyCheckinPoints(locale: Locale): JourneyCheckinPoint[] {
  const ids = ["loc_dragon_bridge", "loc_my_khe", "loc_son_tra"];

  return ids
    .map((id) => LOCATIONS.find((location) => location.id === id))
    .filter((location): location is Location => Boolean(location))
    .map((location) => ({
      name: location.name[locale],
      lat: location.coords.lat,
      lng: location.coords.lng,
    }));
}
