import { Lock, TicketCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import type { VoucherUnlockState } from "./missionRules";

interface RewardUnlockCardProps {
  reward: VoucherUnlockState;
  locale: Locale;
  redeemed: boolean;
  onOpen: () => void;
}

export function RewardUnlockCard({ reward, locale, redeemed, onOpen }: RewardUnlockCardProps) {
  const voucher = reward.voucher;
  if (!voucher) return null;

  const lockedText =
    locale === "vi"
      ? `Hoàn thành thêm ${reward.remainingMissions} nhiệm vụ để mở khóa`
      : `Complete ${reward.remainingMissions} more missions to unlock`;

  return (
    <motion.button
      type="button"
      whileTap={reward.isUnlocked ? { scale: 0.98 } : undefined}
      onClick={() => {
        if (reward.isUnlocked) onOpen();
      }}
      disabled={!reward.isUnlocked}
      className={cn(
        "w-full overflow-hidden rounded-3xl border border-hairline bg-canvas text-left transition",
        reward.isUnlocked ? "shadow-card" : "opacity-70",
      )}
    >
      <div
        className={cn("h-2 w-full", !reward.isUnlocked && "grayscale")}
        style={{ background: voucher.color }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
              {reward.rule.requiredMissionCount}{" "}
              {locale === "vi" ? "nhiệm vụ" : "missions"}
            </div>
            <h3 className="mt-1 text-tagline">{voucher.title[locale]}</h3>
            <p className="mt-1 text-caption text-ink-soft">{voucher.brand}</p>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              reward.isUnlocked ? "bg-primary/10 text-primary" : "bg-parchment text-ink-soft",
            )}
          >
            {reward.isUnlocked ? <TicketCheck className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-caption font-semibold text-ink-muted">
            {reward.isUnlocked
              ? redeemed
                ? locale === "vi"
                  ? "Đã đổi"
                  : "Redeemed"
                : locale === "vi"
                  ? "Có thể nhận"
                  : "Ready"
              : lockedText}
          </span>
          {reward.isUnlocked && !redeemed && (
            <span className="rounded-full bg-primary px-3 py-1.5 text-fine font-semibold text-primary-foreground">
              {locale === "vi" ? "Xem" : "View"}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
