import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";
import { useRef, useEffect, type ReactNode } from "react";

interface MapViewProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  children?: ReactNode;
  interactive?: boolean;
  className?: string;
  /** Imperatively focus a coordinate */
  focus?: { lat: number; lng: number; zoom?: number } | null;
}

const DEFAULT_STYLE_URL =
  "https://api.mapbox.com/styles/v1/mapbox/standard?optimize=true";

function resolveMapStyleUrl() {
  const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

  const resolvedStyleUrl = styleUrl || DEFAULT_STYLE_URL;
  if (!mapboxToken || resolvedStyleUrl.includes("access_token=")) return resolvedStyleUrl;

  const separator = resolvedStyleUrl.includes("?") ? "&" : "?";
  return `${resolvedStyleUrl}${separator}access_token=${encodeURIComponent(mapboxToken)}`;
}

export function MapView({
  initialCenter = { lat: 16.0606, lng: 108.2238 },
  initialZoom = 12.5,
  children,
  interactive = true,
  className,
  focus,
}: MapViewProps) {
  const ref = useRef<MapRef | null>(null);
  const mapStyle = resolveMapStyleUrl();
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

  useEffect(() => {
    if (!focus || !ref.current) return;
    ref.current.flyTo({
      center: [focus.lng, focus.lat],
      zoom: focus.zoom ?? 15,
      duration: 1200,
      essential: true,
    });
  }, [focus]);

  return (
    <div className={"absolute inset-0 " + (className ?? "")}>
      <Map
        ref={ref}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={{
          longitude: initialCenter.lng,
          latitude: initialCenter.lat,
          zoom: initialZoom,
        }}
        attributionControl={false}
        interactive={interactive}
        cooperativeGestures={false}
        style={{ width: "100%", height: "100%" }}
      >
        {interactive && <NavigationControl position="top-right" />}
        {children}
      </Map>
    </div>
  );
}

export { Marker };
