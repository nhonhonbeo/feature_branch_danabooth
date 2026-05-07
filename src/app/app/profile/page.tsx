"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Settings, Bell, Globe, Download, Share2, ChevronRight } from "lucide-react";
import { swrFetcher } from "@/services/api";
import type { Location } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { usePassportStore } from "@/store/passport.store";
import { useLocale } from "@/hooks/useLocale";
import { CountUp } from "@/components/ui/count-up";
import { FadeIn } from "@/components/ui/motion-primitives";



export default function Profile() {
  const passport = usePassportStore((s) => s.passport);
  const stamps = usePassportStore((s) => s.stamps);
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const { locale, setLocale } = useLocale();

  const points = stamps.reduce((s, x) => s + x.points, 0);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar
        title={locale === "vi" ? "Hộ chiếu" : "Passport"}
        right={
          <Link href="/app/settings" className="w-10 h-10 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </Link>
        }
      />

      <FadeIn className="px-5 pt-4">
        {/* Passport card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative rounded-3xl overflow-hidden shadow-product bg-gradient-to-br from-ink to-tile-1 text-canvas p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-fine uppercase tracking-[0.2em] opacity-70">
                DanangBooth
              </div>
              <div className="text-fine opacity-60 mt-1">
                {locale === "vi" ? "Hộ chiếu kỹ thuật số" : "Digital passport"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-stamp-gold flex items-center justify-center text-ink font-bold text-lg">
              {passport?.ownerName?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-display-lg !text-canvas">
              {passport?.ownerName ?? (locale === "vi" ? "Khách" : "Guest")}
            </div>
            <div className="text-caption opacity-70 mt-1 tracking-widest">
              {passport?.code}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label={locale === "vi" ? "Điểm" : "Points"} value={points} />
            <Stat label={locale === "vi" ? "Dấu" : "Stamps"} value={stamps.length} />
            <Stat
              label={locale === "vi" ? "Vị trí #" : "Pioneer #"}
              value={passport?.position ?? 0}
            />
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link href="/app/journey"
            className="bg-parchment rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-tagline">
                {locale === "vi" ? "Hành trình" : "Journey"}
              </div>
              <div className="text-caption text-ink-soft">
                {locale === "vi" ? "Xem & chia sẻ" : "View & share"}
              </div>
            </div>
            <Share2 className="w-5 h-5 text-ink-soft" />
          </Link>
          <Link href="/app/journey/import"
            className="bg-parchment rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-tagline">
                {locale === "vi" ? "Nhập lộ trình" : "Import"}
              </div>
              <div className="text-caption text-ink-soft">
                {locale === "vi" ? "Từ ảnh hoặc text" : "From photo or text"}
              </div>
            </div>
            <Download className="w-5 h-5 text-ink-soft" />
          </Link>
        </div>
      </FadeIn>

      <div className="px-5 mt-8">
        <h3 className="text-display-md mb-3">
          {locale === "vi" ? "Tùy chỉnh" : "Preferences"}
        </h3>
        <div className="bg-parchment rounded-2xl divide-y divide-hairline overflow-hidden">
          <Row
            icon={<Globe className="w-4 h-4" />}
            label={locale === "vi" ? "Ngôn ngữ" : "Language"}
            value={locale === "vi" ? "Tiếng Việt" : "English"}
            onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
          />
          <RowLink
            to="/app/notifications"
            icon={<Bell className="w-4 h-4" />}
            label={locale === "vi" ? "Thông báo" : "Notifications"}
          />
          <RowLink
            to="/app/settings"
            icon={<Settings className="w-4 h-4" />}
            label={locale === "vi" ? "Cài đặt" : "Settings"}
          />
        </div>
      </div>

      <div className="px-5 mt-8">
        <h3 className="text-display-md mb-3">
          {locale === "vi" ? "Đã đến gần đây" : "Recently visited"}
        </h3>
        {stamps.length === 0 ? (
          <div className="bg-parchment rounded-2xl p-6 text-center text-ink-soft text-body">
            {locale === "vi"
              ? "Hành trình của bạn sẽ xuất hiện ở đây."
              : "Your journey will appear here."}
          </div>
        ) : (
          <div className="space-y-2">
            {stamps
              .slice()
              .reverse()
              .slice(0, 5)
              .map((s) => {
                const l = locations.find((x) => x.id === s.locationId);
                if (!l) return null;
                return (
                  <Link
                    key={s.id}
                    href={`/app/location/${l.id}`}
                    className="flex items-center gap-3 bg-parchment rounded-2xl p-3"
                  >
                    <img
                      src={l.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-tagline truncate">{l.name[locale]}</div>
                      <div className="text-caption text-ink-soft">
                        +{s.points} pts ·{" "}
                        {new Date(s.collectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-display-md !text-canvas font-semibold">
        <CountUp value={value} />
      </div>
      <div className="text-fine opacity-60">{label}</div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-pearl"
    >
      <span className="flex items-center gap-3 text-body">
        <span className="text-ink-soft">{icon}</span>
        {label}
      </span>
      <span className="flex items-center gap-1 text-caption text-ink-soft">
        {value} <ChevronRight className="w-4 h-4" />
      </span>
    </button>
  );
}
function RowLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={to}
      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-pearl"
    >
      <span className="flex items-center gap-3 text-body">
        <span className="text-ink-soft">{icon}</span>
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-ink-soft" />
    </Link>
  );
}


