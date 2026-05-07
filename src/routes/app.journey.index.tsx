import { createFileRoute, Link } from "@tanstack/react-router";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Share2, Download, Plus } from "lucide-react";
import { swrFetcher } from "@/services/api";
import type { Location } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { usePassportStore } from "@/store/passport.store";
import { useLocale } from "@/hooks/useLocale";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion-primitives";

export const Route = createFileRoute("/app/journey/")({
  component: Journey,
});

function Journey() {
  const stamps = usePassportStore((s) => s.stamps);
  const passport = usePassportStore((s) => s.passport);
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const { locale } = useLocale();

  // Group by date
  const byDate = stamps.reduce<Record<string, typeof stamps>>((acc, s) => {
    const d = new Date(s.collectedAt).toISOString().slice(0, 10);
    (acc[d] ??= []).push(s);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar
        back
        title={locale === "vi" ? "Hành trình" : "My Journey"}
        right={
          <button className="w-10 h-10 flex items-center justify-center text-ink">
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      <FadeIn className="px-5 pt-4">
        {/* Shareable card */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-focus text-canvas p-6 shadow-product relative">
          <div className="text-fine uppercase tracking-[0.2em] opacity-80">
            {locale === "vi" ? "Hành trình của" : "Journey of"}
          </div>
          <div className="text-display-lg !text-canvas mt-1">
            {passport?.ownerName ?? "Explorer"}
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-hero !text-canvas font-bold">{stamps.length}</div>
              <div className="text-fine opacity-80">
                {locale === "vi" ? "địa điểm" : "places visited"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-display-md !text-canvas">
                {stamps.reduce((s, x) => s + x.points, 0)}
              </div>
              <div className="text-fine opacity-80">
                {locale === "vi" ? "điểm" : "points"}
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 bg-canvas text-ink rounded-full py-3 text-caption font-semibold flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> {locale === "vi" ? "Chia sẻ" : "Share"}
            </button>
            <button className="flex-1 bg-white/20 text-canvas rounded-full py-3 text-caption font-semibold flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> {locale === "vi" ? "Tải" : "Download"}
            </button>
          </div>
        </div>
      </FadeIn>

      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-display-md">
            {locale === "vi" ? "Dòng thời gian" : "Timeline"}
          </h3>
          <Link
            to="/app/journey/import"
            className="flex items-center gap-1 text-caption text-primary font-semibold"
          >
            <Plus className="w-4 h-4" />
            {locale === "vi" ? "Nhập" : "Import"}
          </Link>
        </div>

        {dates.length === 0 ? (
          <div className="py-16 text-center text-ink-soft">
            <div className="text-5xl mb-3">🗺️</div>
            <div className="text-body">
              {locale === "vi"
                ? "Hành trình của bạn sẽ kể câu chuyện ở đây."
                : "Your journey will tell its story here."}
            </div>
          </div>
        ) : (
          <Stagger className="space-y-6">
            {dates.map((d) => (
              <StaggerItem key={d}>
                <div className="text-fine uppercase tracking-widest text-ink-soft mb-2">
                  {new Date(d).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <div className="space-y-2">
                  {byDate[d].map((s) => {
                    const l = locations.find((x) => x.id === s.locationId);
                    if (!l) return null;
                    return (
                      <motion.div
                        key={s.id}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-parchment rounded-2xl p-3"
                      >
                        <img
                          src={l.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-tagline truncate">
                            {l.name[locale]}
                          </div>
                          <div className="text-caption text-ink-soft">
                            {new Date(s.collectedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · +"}
                            {s.points} pts
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-stamp-gold flex items-center justify-center text-ink font-bold">
                          ✓
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
