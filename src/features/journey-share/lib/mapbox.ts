import type { JourneyCheckinPoint, JourneyRouteOverlay } from "@/types";

interface MapboxDirectionsResponse {
  routes?: Array<{
    distance?: number;
    geometry?: {
      coordinates?: number[][];
    };
  }>;
}

function getMapboxToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ?? "";
}

export function buildDirectionsUrl(points: JourneyCheckinPoint[]) {
  const token = getMapboxToken();
  const coordinates = points.map((point) => `${point.lng},${point.lat}`).join(";");
  const params = new URLSearchParams({
    access_token: token,
    alternatives: "false",
    geometries: "geojson",
    overview: "simplified",
    steps: "false",
  });

  return `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?${params.toString()}`;
}

export async function fetchDirectionsRoute(
  points: JourneyCheckinPoint[],
): Promise<JourneyRouteOverlay | null> {
  const token = getMapboxToken();
  if (!token) throw new Error("Mapbox token missing");
  if (points.length < 2) return null;

  const response = await fetch(buildDirectionsUrl(points));
  if (!response.ok) throw new Error(`Directions API failed: ${response.status}`);

  const data = (await response.json()) as MapboxDirectionsResponse;
  const route = data.routes?.[0];
  const coordinates = route?.geometry?.coordinates;
  if (!coordinates?.length) throw new Error("Directions route missing");

  return {
    coordinates,
    distanceKm: (route?.distance ?? 0) / 1000,
  };
}
