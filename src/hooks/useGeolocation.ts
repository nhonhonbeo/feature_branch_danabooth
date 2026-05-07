import { useEffect, useState } from "react";

export interface Geo {
  lat: number;
  lng: number;
}

const DA_NANG_FALLBACK: Geo = { lat: 16.0606, lng: 108.2238 };

export const useGeolocation = (auto = true) => {
  const [coords, setCoords] = useState<Geo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported");
      setCoords(DA_NANG_FALLBACK);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setCoords(DA_NANG_FALLBACK);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    if (auto) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return { coords: coords ?? DA_NANG_FALLBACK, error, loading, request };
};
