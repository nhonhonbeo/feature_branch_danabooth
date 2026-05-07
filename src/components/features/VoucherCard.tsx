import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import type { Voucher } from "@/types";
import { useLocale } from "@/hooks/useLocale";

interface Props {
  voucher: Voucher;
  onClick?: () => void;
  redeemed?: boolean;
}

export function VoucherCard({ voucher, onClick, redeemed }: Props) {
  const { tr, locale } = useLocale();
  const expires = new Date(voucher.validUntil).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
    { day: "numeric", month: "short" },
  );

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-3xl overflow-hidden shadow-card group"
      style={{ background: voucher.color }}
    >
      {/* punched hole notches */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-px border-t border-dashed border-white/40 pointer-events-none" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-background" />

      <div className="p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-fine uppercase tracking-widest opacity-80">
              {voucher.brand}
            </div>
            <div className="text-display-md !text-white leading-tight mt-1">
              {tr(voucher.title)}
            </div>
          </div>
          <div className="text-display-lg !text-white font-bold leading-none">
            {voucher.discount}
          </div>
        </div>
      </div>
      <div className="px-5 pt-5 pb-5 text-white/90 flex items-center justify-between">
        <div className="text-caption flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          {locale === "vi" ? "HSD" : "Until"} {expires}
        </div>
        {redeemed ? (
          <span className="text-fine bg-white/20 px-2 py-1 rounded-full">
            {locale === "vi" ? "Đã dùng" : "Redeemed"}
          </span>
        ) : (
          <span className="text-fine bg-white/20 px-2 py-1 rounded-full">
            {voucher.code}
          </span>
        )}
      </div>
    </motion.button>
  );
}
