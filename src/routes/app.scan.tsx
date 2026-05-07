import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Check } from "lucide-react";
import { z } from "zod";
import { QrScanner } from "@/components/features/QrScanner";
import { TopBar } from "@/components/layout/TopBar";
import { swrFetcher } from "@/services/api";
import { usePassportStore } from "@/store/passport.store";
import { useLocale } from "@/hooks/useLocale";
import type { Location } from "@/types";
import { LOCATIONS } from "@/mocks/locations";

const searchSchema = z.object({
  loc: z.string().optional(),
});

export const Route = createFileRoute("/app/scan")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ScanPage,
});

function ScanPage() {
  const nav = useNavigate();
  const { loc: targetId } = useSearch({ from: "/app/scan" });
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const collectStamp = usePassportStore((s) => s.collectStamp);
  const { locale, tr } = useLocale();
  const [success, setSuccess] = useState<Location | null>(null);

  const handleResult = (text: string) => {
    // text could be a location id from QR. fallback: pick the targeted or first.
    const matched =
      locations.find((l) => l.id === text || l.slug === text) ??
      LOCATIONS.find((l) => l.id === targetId) ??
      LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    if (!matched) return;
    const stamp = collectStamp(matched.id, matched.stampPoints);
    if (stamp) setSuccess(matched);
    else setSuccess(matched); // already collected — still show
  };

  return (
    <div className="fixed inset-0 bg-black z-40">
      <div className="absolute top-0 inset-x-0 z-30">
        <TopBar back transparent />
      </div>

      {!success && <QrScanner onResult={handleResult} />}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-canvas flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="w-28 h-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-product"
            >
              <Check className="w-14 h-14" strokeWidth={3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="text-fine uppercase tracking-[0.2em] text-ink-soft">
                {locale === "vi" ? "Đã đóng dấu" : "Stamp collected"}
              </div>
              <h1 className="text-display-lg mt-2">{tr(success.name)}</h1>
              <p className="text-lead text-ink-muted mt-3">
                +{success.stampPoints} {locale === "vi" ? "điểm" : "points"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 w-full max-w-sm space-y-3"
            >
              <button
                onClick={() => nav({ to: "/app/stamps" })}
                className="w-full bg-ink text-canvas rounded-full py-4 text-tagline"
              >
                {locale === "vi" ? "Xem bộ sưu tập" : "View collection"}
              </button>
              <button
                onClick={() => nav({ to: "/app" })}
                className="w-full text-ink-soft py-2"
              >
                {locale === "vi" ? "Quay lại bản đồ" : "Back to map"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
