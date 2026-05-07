"use client";


import useSWR from "swr";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { swrFetcher } from "@/services/api";
import type { Notification } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { useLocale } from "@/hooks/useLocale";
import { Stagger, StaggerItem } from "@/components/ui/motion-primitives";



export default function Notifs() {
  const { data: items = [] } = useSWR<Notification[]>(["notifications"], swrFetcher);
  const { locale } = useLocale();

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title={locale === "vi" ? "Thông báo" : "Notifications"} />

      <div className="px-4 pt-3">
        {items.length === 0 ? (
          <div className="py-24 text-center text-ink-soft">
            <Bell className="w-10 h-10 mx-auto mb-3" />
            {locale === "vi" ? "Chưa có thông báo" : "No notifications yet"}
          </div>
        ) : (
          <Stagger className="space-y-2">
            {items.map((n) => (
              <StaggerItem key={n.id}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className={
                    "rounded-3xl p-4 flex gap-3 " +
                    (n.read ? "bg-parchment" : "bg-canvas border border-primary/20 shadow-card")
                  }
                >
                  <div
                    className={
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg " +
                      (n.kind === "voucher"
                        ? "bg-stamp-amber"
                        : n.kind === "stamp"
                          ? "bg-primary text-canvas"
                          : "bg-ink text-canvas")
                    }
                  >
                    {n.kind === "voucher" ? "🎟" : n.kind === "stamp" ? "✦" : "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-tagline leading-tight">{n.title[locale]}</div>
                    <div className="text-body text-ink-muted mt-1">{n.body[locale]}</div>
                    <div className="text-fine text-ink-soft mt-1">
                      {timeAgo(n.createdAt, locale)}
                    </div>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}

function timeAgo(iso: string, locale: "vi" | "en") {
  const m = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (m < 60) return `${Math.round(m)}${locale === "vi" ? " phút trước" : "m ago"}`;
  if (m < 1440) return `${Math.round(m / 60)}${locale === "vi" ? " giờ trước" : "h ago"}`;
  return `${Math.round(m / 1440)}${locale === "vi" ? " ngày trước" : "d ago"}`;
}


