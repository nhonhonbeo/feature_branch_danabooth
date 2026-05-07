"use client";


import useSWR from "swr";
import { swrFetcher } from "@/services/api";
import { TopBar } from "@/components/layout/TopBar";
import { StampBadge } from "@/features/stamps/components/StampBadge";
import { usePassportStore } from "@/features/passport/store";
import { useLocale } from "@/hooks/useLocale";
import type { Location } from "@/types";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion-primitives";
import { CountUp } from "@/components/ui/count-up";



export default function Stamps() {
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const stamps = usePassportStore((s) => s.stamps);
  const { locale } = useLocale();
  const totalPoints = stamps.reduce((s, x) => s + x.points, 0);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar title={locale === "vi" ? "Sưu tập" : "Collection"} />

      <FadeIn className="px-5 pt-4">
        <div className="rounded-3xl bg-ink text-canvas p-6 shadow-product">
          <div className="text-fine uppercase tracking-widest opacity-60">
            {locale === "vi" ? "Tổng điểm" : "Total points"}
          </div>
          <div className="text-hero !text-canvas mt-1">
            <CountUp value={totalPoints} />
          </div>
          <div className="mt-3 flex items-center justify-between text-caption text-canvas/70">
            <span>
              {stamps.length} / {locations.length}{" "}
              {locale === "vi" ? "địa điểm" : "places"}
            </span>
            <span>
              {Math.round((stamps.length / Math.max(locations.length, 1)) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-canvas/15 overflow-hidden">
            <div
              className="h-full bg-stamp-gold transition-all duration-700"
              style={{
                width: `${(stamps.length / Math.max(locations.length, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </FadeIn>

      <div className="px-5 pt-6">
        <h2 className="text-display-md mb-4">
          {locale === "vi" ? "Dấu mộc của bạn" : "Your stamps"}
        </h2>
        <Stagger className="grid grid-cols-2 gap-3">
          {locations.map((l) => {
            const st = stamps.find((s) => s.locationId === l.id);
            return (
              <StaggerItem key={l.id}>
                <StampBadge location={l} stamp={st} />
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </div>
  );
}


