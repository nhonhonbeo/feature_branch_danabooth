import { Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Locale } from "@/types";
import type { VoucherUnlockState } from "./missionRules";

interface MissionProgressCardProps {
  completedMissionCount: number;
  totalMissionCount: number;
  progressPercent: number;
  nextReward?: VoucherUnlockState;
  locale: Locale;
}

export function MissionProgressCard({
  completedMissionCount,
  totalMissionCount,
  progressPercent,
  nextReward,
  locale,
}: MissionProgressCardProps) {
  const nextRewardText = nextReward
    ? locale === "vi"
      ? `Còn ${nextReward.remainingMissions} nhiệm vụ để mở ${nextReward.voucher?.title.vi}.`
      : `${nextReward.remainingMissions} more missions to unlock ${nextReward.voucher?.title.en}.`
    : locale === "vi"
      ? "Bạn đã mở toàn bộ phần thưởng nhiệm vụ."
      : "You have unlocked every mission reward.";

  return (
    <section className="rounded-3xl bg-ink p-5 text-canvas shadow-product">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-fine uppercase tracking-[0.18em] text-canvas/60">
            {locale === "vi" ? "Tiến độ nhiệm vụ" : "Mission progress"}
          </div>
          <h2 className="mt-2 text-display-md !text-canvas">
            {locale === "vi"
              ? `Bạn đã hoàn thành ${completedMissionCount}/${totalMissionCount} nhiệm vụ`
              : `${completedMissionCount}/${totalMissionCount} missions completed`}
          </h2>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas/12">
          <Gift className="h-5 w-5 text-primary-on-dark" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Progress value={progressPercent} className="h-2 bg-canvas/15 [&>div]:bg-primary-on-dark" />
        <span className="min-w-10 text-right text-caption text-canvas/70">{progressPercent}%</span>
      </div>

      <p className="mt-4 text-caption text-canvas/72">{nextRewardText}</p>
    </section>
  );
}
