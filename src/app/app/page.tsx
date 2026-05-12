"use client";

import Link from "next/link";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Locate, Layers } from "lucide-react";
import { MapView, Marker } from "@/features/map/components/MapView";
import { MapMarker } from "@/features/map/components/MapMarker";
import { CategoryChips } from "@/features/map/components/CategoryChips";
import { LocationCard } from "@/features/map/components/LocationCard";
import { swrFetcher } from "@/services/api";
import { useUIStore } from "@/store/ui.store";
import { usePassportStore } from "@/features/passport/store";
import { useUserStamps } from "@/features/passport/hooks/useUserStamps";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocale } from "@/hooks/useLocale";
import type { Location } from "@/types";
import { Stagger, StaggerItem } from "@/components/ui/motion-primitives";



export default function HomeMap() {
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const cat = useUIStore((s) => s.selectedCategory);
  const search = useUIStore((s) => s.searchQuery);
  const setSearch = useUIStore((s) => s.setSearch);
  const stamps = useUserStamps();
  const { coords, request } = useGeolocation();
  const { tr, locale } = useLocale();
  const [active, setActive] = useState<Location | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const filtered = useMemo(
    () =>
      locations.filter((l) => {
        const matchCat = cat === "all" || l.category === cat;
        const q = search.trim().toLowerCase();
        const matchQ =
          !q ||
          l.name.vi.toLowerCase().includes(q) ||
          l.name.en.toLowerCase().includes(q);
        return matchCat && matchQ;
      }),
    [locations, cat, search],
  );

  return (
    <div className="relative h-[100dvh] overflow-hidden">
      <MapView initialCenter={coords} focus={focus}>
        {filtered.map((l) => (
          <Marker
            key={l.id}
            longitude={l.coords.lng}
            latitude={l.coords.lat}
            anchor="bottom"
          >
            <MapMarker
              location={l}
              active={active?.id === l.id}
              collected={stamps.some((s) => s.locationId === l.id)}
              onClick={() => {
                setActive(l);
                setFocus({ lat: l.coords.lat, lng: l.coords.lng, zoom: 15 });
              }}
            />
          </Marker>
        ))}
        <Marker longitude={coords.lng} latitude={coords.lat} anchor="center">
          <div className="relative">
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/40 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-canvas" />
          </div>
        </Marker>
      </MapView>

      {/* Top: search + bell */}
      <div className="absolute top-0 inset-x-0 z-20 pt-safe">
        <div className="px-3 pt-3 flex items-center gap-2">
          <div className="flex-1 glass rounded-full pl-4 pr-2 py-1 flex items-center gap-2 shadow-float">
            <Search className="w-4 h-4 text-ink-soft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "vi" ? "Tìm địa điểm…" : "Search places…"}
              className="flex-1 bg-transparent outline-none text-body py-2"
            />
          </div>
          <Link href="/app/notifications"
            className="w-11 h-11 glass rounded-full flex items-center justify-center shadow-float"
          >
            <Bell className="w-5 h-5 text-ink" />
          </Link>
        </div>
        <div className="px-4 pt-3">
          <CategoryChips />
        </div>
      </div>

      {/* Floating action: locate */}
      <div className="absolute right-3 bottom-[calc(var(--bottom-nav-h)+220px)] z-20">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            request();
            setFocus({ lat: coords.lat, lng: coords.lng, zoom: 14 });
          }}
          className="w-12 h-12 rounded-full bg-canvas shadow-float flex items-center justify-center"
        >
          <Locate className="w-5 h-5 text-primary" />
        </motion.button>
        <Link href="/app/journey"
          className="mt-2 w-12 h-12 rounded-full bg-canvas shadow-float flex items-center justify-center"
        >
          <Layers className="w-5 h-5 text-ink" />
        </Link>
      </div>

      {/* Bottom carousel of nearby */}
      <div
        className="absolute inset-x-0 z-20"
        style={{ bottom: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + 18px)" }}
      >
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="px-4"
            >
              <Link href={`/app/location/${active.id}`}
                className="block"
              >
                <div className="glass rounded-3xl p-3 shadow-float flex gap-3">
                  <img
                    src={active.image}
                    alt={tr(active.name)}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-fine text-ink-soft uppercase tracking-wider">
                      {active.category}
                    </div>
                    <div className="text-tagline truncate">
                      {tr(active.name)}
                    </div>
                    <div className="text-caption text-ink-soft truncate">
                      {tr(active.address)}
                    </div>
                  </div>
                  <div className="self-center bg-primary text-primary-foreground rounded-full px-4 py-2 text-caption font-semibold">
                    {locale === "vi" ? "Mở" : "Open"}
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            <Stagger
              stagger={0.05}
              className="flex gap-3 overflow-x-auto scrollbar-none px-4 snap-x snap-mandatory pb-1"
            >
              {filtered.slice(0, 8).map((l) => (
                <StaggerItem key={l.id} className="snap-start shrink-0 w-[68vw] max-w-[280px]">
                  <LocationCard
                    location={l}
                    collected={stamps.some((s) => s.locationId === l.id)}
                    variant="wide"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


