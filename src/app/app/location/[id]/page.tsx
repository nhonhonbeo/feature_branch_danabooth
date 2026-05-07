"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, QrCode, Star, Share2, Heart, Clock } from "lucide-react";
import { swrFetcher } from "@/services/api";
import type { Location } from "@/types";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/features/passport/store";
import { CATEGORIES } from "@/mocks/locations";
import { TopBar } from "@/components/layout/TopBar";
import { FadeIn } from "@/components/ui/motion-primitives";



export default function LocationDetail() {
  const { id  } = useParams() as any;
  const nav = useRouter();
  const { data: loc, isLoading } = useSWR<Location | undefined>(
    ["location", id],
    swrFetcher,
  );
  const { tr, locale } = useLocale();
  const stamps = usePassportStore((s) => s.stamps);
  const [expand, setExpand] = useState(false);

  if (isLoading || !loc) {
    return (
      <div className="min-h-[100dvh] bg-canvas">
        <TopBar back />
        <div className="px-4 mt-4 space-y-3">
          <div className="aspect-[5/4] rounded-3xl animate-shimmer bg-parchment" />
          <div className="h-8 rounded-full animate-shimmer bg-parchment w-2/3" />
          <div className="h-4 rounded-full animate-shimmer bg-parchment w-1/2" />
        </div>
      </div>
    );
  }

  const collected = stamps.find((s) => s.locationId === loc.id);
  const cat = CATEGORIES.find((c) => c.id === loc.category);

  return (
    <div className="min-h-[100dvh] bg-canvas pb-32">
      {/* Hero image */}
      <div className="relative h-[55dvh] overflow-hidden">
        <motion.img
          src={loc.image}
          alt={tr(loc.name)}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-canvas" />
        <div className="absolute top-0 inset-x-0">
          <TopBar back transparent right={
            <button className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </button>
          } />
        </div>
      </div>

      <FadeIn className="-mt-16 relative z-10 px-5 max-w-md mx-auto">
        <div className="bg-canvas rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-2">
            <div className="text-caption font-semibold text-ink-muted bg-parchment px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>{cat?.emoji}</span>
              {cat?.label[locale]}
            </div>
            {collected && (
              <div className="text-caption font-semibold text-ink bg-stamp-amber px-2.5 py-1 rounded-full">
                ✓ {locale === "vi" ? "Đã đến" : "Visited"}
              </div>
            )}
          </div>

          <h1 className="text-display-lg mt-3">{tr(loc.name)}</h1>

          <div className="flex items-center gap-3 mt-2 text-caption text-ink-soft">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-stamp-gold text-stamp-gold" />
              {loc.rating}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{tr(loc.address)}</span>
            </span>
          </div>

          {loc.openHours && (
            <div className="mt-3 text-caption text-ink-soft flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {loc.openHours}
            </div>
          )}

          <p
            className={
              "text-body text-ink-muted mt-4 " +
              (expand ? "" : "line-clamp-2")
            }
          >
            {tr(loc.description)}
          </p>
          <button
            onClick={() => setExpand((e) => !e)}
            className="text-caption text-primary font-semibold mt-1"
          >
            {expand
              ? locale === "vi"
                ? "Thu gọn"
                : "Show less"
              : locale === "vi"
                ? "Xem thêm"
                : "Read more"}
          </button>

          <div className="mt-5 rounded-2xl bg-stamp-amber/40 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stamp-gold flex items-center justify-center text-lg">
              ✦
            </div>
            <div>
              <div className="text-tagline leading-tight">
                +{loc.stampPoints} {locale === "vi" ? "điểm" : "points"}
              </div>
              <div className="text-caption text-ink-muted">
                {locale === "vi"
                  ? "1 dấu mộc khi check-in"
                  : "1 stamp on check-in"}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Floating sticky CTA */}
      <div
        className="fixed inset-x-0 z-30 px-4"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <div className="max-w-md mx-auto flex gap-2">
          <button
            className="w-14 h-14 rounded-full glass border border-hairline flex items-center justify-center shadow-float"
            aria-label="Save"
          >
            <Heart className="w-5 h-5" />
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav.push(`/app/scan?loc=${loc.id}`)}
            className="flex-1 bg-primary text-primary-foreground rounded-full px-6 py-4 flex items-center justify-center gap-2 shadow-float"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-tagline">
              {locale === "vi" ? "Đóng dấu tại đây" : "Check in here"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}


