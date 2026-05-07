import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import { useRef, useEffect, type ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  children?: ReactNode;
  interactive?: boolean;
  className?: string;
  /** Imperatively focus a coordinate */
  focus?: { lat: number; lng: number; zoom?: number } | null;
}

const STYLE_URL =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export function MapView({
  initialCenter = { lat: 16.0606, lng: 108.2238 },
  initialZoom = 12.5,
  children,
  interactive = true,
  className,
  focus,
}: MapViewProps) {
  const ref = useRef<MapRef | null>(null);

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
        mapStyle={STYLE_URL}
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
