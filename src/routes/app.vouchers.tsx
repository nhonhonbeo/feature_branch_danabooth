import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { swrFetcher } from "@/services/api";
import type { Voucher } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { VoucherCard } from "@/components/features/VoucherCard";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { usePassportStore } from "@/store/passport.store";
import { useLocale } from "@/hooks/useLocale";
import { Stagger, StaggerItem } from "@/components/ui/motion-primitives";

export const Route = createFileRoute("/app/vouchers")({
  component: Vouchers,
});

function Vouchers() {
  const { data: vouchers = [] } = useSWR<Voucher[]>(["vouchers"], swrFetcher);
  const redeemed = usePassportStore((s) => s.redeemedVoucherIds);
  const redeem = usePassportStore((s) => s.redeemVoucher);
  const { locale } = useLocale();
  const [open, setOpen] = useState<Voucher | null>(null);
  const [tab, setTab] = useState<"available" | "used">("available");

  const list = vouchers.filter((v) =>
    tab === "available" ? !redeemed.includes(v.id) : redeemed.includes(v.id),
  );

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar title={locale === "vi" ? "Ưu đãi" : "Vouchers"} />

      <div className="px-4 pt-3">
        <div className="bg-parchment rounded-full p-1 grid grid-cols-2 text-caption font-semibold">
          {(["available", "used"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "py-2 rounded-full transition " +
                (tab === t
                  ? "bg-canvas text-ink shadow-card"
                  : "text-ink-soft")
              }
            >
              {t === "available"
                ? locale === "vi" ? "Có thể dùng" : "Available"
                : locale === "vi" ? "Đã dùng" : "Used"}
            </button>
          ))}
        </div>
      </div>

      <Stagger className="px-4 pt-4 space-y-3">
        {list.length === 0 && (
          <div className="py-20 text-center text-ink-soft text-body">
            {locale === "vi" ? "Chưa có ưu đãi nào." : "No vouchers yet."}
          </div>
        )}
        {list.map((v) => (
          <StaggerItem key={v.id}>
            <VoucherCard
              voucher={v}
              redeemed={redeemed.includes(v.id)}
              onClick={() => setOpen(v)}
            />
          </StaggerItem>
        ))}
      </Stagger>

      <BottomSheet open={!!open} onClose={() => setOpen(null)} snap={0.78}>
        {open && (
          <div className="px-6 pt-2 pb-8 text-center">
            <div className="text-fine uppercase tracking-widest text-ink-soft">
              {open.brand}
            </div>
            <h2 className="text-display-md mt-2">
              {open[locale === "vi" ? "title" : "title"][locale]}
            </h2>
            <div
              className="mx-auto mt-6 w-56 h-56 rounded-3xl flex items-center justify-center shadow-product"
              style={{ background: open.color }}
            >
              <div className="bg-white p-4 rounded-2xl">
                {/* fake QR pattern */}
                <div className="grid grid-cols-12 gap-px w-40 h-40">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        (Math.sin(i * 12.9898) + Math.cos(i * 78.233)) % 0.6 > 0
                          ? "bg-black"
                          : "bg-white"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-tagline tracking-widest">{open.code}</div>
            <p className="text-body text-ink-muted mt-3">
              {open.description[locale]}
            </p>
            <AnimatePresence>
              {redeemed.includes(open.id) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-caption text-ink-soft"
                >
                  ✓{" "}
                  {locale === "vi" ? "Đã sử dụng" : "Already redeemed"}
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    redeem(open.id);
                    setOpen(null);
                  }}
                  className="mt-6 w-full bg-ink text-canvas rounded-full py-4 text-tagline"
                >
                  {locale === "vi"
                    ? "Xuất trình tại quầy"
                    : "Show at counter"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
