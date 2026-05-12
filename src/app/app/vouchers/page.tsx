"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { TopBar } from "@/components/layout/TopBar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Stagger, StaggerItem } from "@/components/ui/motion-primitives";
import { usePassportStore } from "@/features/passport/store";
import { useUserStamps } from "@/features/passport/hooks/useUserStamps";
import { VoucherCard } from "@/features/stamps/components/VoucherCard";
import { MissionList } from "@/features/vouchers/MissionList";
import { MissionProgressCard } from "@/features/vouchers/MissionProgressCard";
import { RewardUnlockCard } from "@/features/vouchers/RewardUnlockCard";
import {
  evaluateMissions,
  getCompletedMissionCount,
  getMissionProgressPercent,
  getNextReward,
  getVoucherUnlockStates,
} from "@/features/vouchers/missionRules";
import { useLocale } from "@/hooks/useLocale";
import { swrFetcher } from "@/services/api";
import type { Location, Voucher } from "@/types";

type VoucherTab = "available" | "missions" | "used";

export default function Vouchers() {
  const { data: vouchers = [] } = useSWR<Voucher[]>(["vouchers"], swrFetcher);
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const passport = usePassportStore((s) => s.passport);
  const stamps = useUserStamps();
  const redeemed = usePassportStore((s) => s.redeemedVoucherIds);
  const redeem = usePassportStore((s) => s.redeemVoucher);
  const completedMissionIds = usePassportStore((s) => s.completedMissionIds);
  const hasExportedJourneyRecap = usePassportStore((s) => s.hasExportedJourneyRecap);
  const toggleDemoMission = usePassportStore((s) => s.toggleDemoMission);
  const { locale } = useLocale();
  const [open, setOpen] = useState<Voucher | null>(null);
  const [tab, setTab] = useState<VoucherTab>("available");

  const missions = useMemo(
    () =>
      evaluateMissions({
        passport,
        stamps,
        redeemedVoucherIds: redeemed,
        completedMissionIds,
        hasExportedJourneyRecap,
        locations,
      }),
    [passport, stamps, redeemed, completedMissionIds, hasExportedJourneyRecap, locations],
  );

  const completedMissionCount = getCompletedMissionCount(missions);
  const totalMissionCount = missions.length;
  const progressPercent = getMissionProgressPercent(completedMissionCount, totalMissionCount);
  const rewardStates = getVoucherUnlockStates(vouchers, completedMissionCount);
  const nextReward = getNextReward(vouchers, completedMissionCount);
  const unlockedVoucherIds = new Set(
    rewardStates.filter((reward) => reward.isUnlocked).map((reward) => reward.rule.voucherId),
  );
  const list = vouchers.filter((voucher) =>
    tab === "available"
      ? unlockedVoucherIds.has(voucher.id) && !redeemed.includes(voucher.id)
      : redeemed.includes(voucher.id),
  );

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar title={locale === "vi" ? "Ưu đãi" : "Vouchers"} />

      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 rounded-full bg-parchment p-1 text-caption font-semibold">
          {(["available", "missions", "used"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={
                "rounded-full py-2 transition " +
                (tab === item ? "bg-canvas text-ink shadow-card" : "text-ink-soft")
              }
            >
              {item === "available"
                ? locale === "vi"
                  ? "Có thể dùng"
                  : "Available"
                : item === "missions"
                  ? locale === "vi"
                    ? "Nhiệm vụ"
                    : "Missions"
                  : locale === "vi"
                    ? "Đã dùng"
                    : "Used"}
            </button>
          ))}
        </div>
      </div>

      {tab === "missions" ? (
        <div className="space-y-6 px-4 pt-4 pb-28">
          <MissionProgressCard
            completedMissionCount={completedMissionCount}
            totalMissionCount={totalMissionCount}
            progressPercent={progressPercent}
            nextReward={nextReward}
            locale={locale}
          />

          <section className="space-y-3">
            <div>
              <h2 className="text-display-md">
                {locale === "vi" ? "Phần thưởng có thể nhận" : "Rewards"}
              </h2>
              <p className="mt-1 text-caption text-ink-soft">
                {locale === "vi"
                  ? "Voucher khóa sẽ tự mở khi bạn đủ số nhiệm vụ."
                  : "Locked vouchers open automatically when you complete enough missions."}
              </p>
            </div>
            <div className="space-y-2">
              {rewardStates.map((reward) => (
                <RewardUnlockCard
                  key={reward.rule.voucherId}
                  reward={reward}
                  locale={locale}
                  redeemed={redeemed.includes(reward.rule.voucherId)}
                  onOpen={() => reward.voucher && setOpen(reward.voucher)}
                />
              ))}
            </div>
          </section>

          <MissionList
            missions={missions}
            locale={locale}
            onToggleDemoMission={toggleDemoMission}
          />
        </div>
      ) : (
        <Stagger className="space-y-3 px-4 pt-4 pb-28">
          {list.length === 0 && (
            <div className="py-20 text-center text-body text-ink-soft">
              {tab === "available"
                ? locale === "vi"
                  ? "Chưa có voucher đã mở khóa. Hãy hoàn thành thêm nhiệm vụ."
                  : "No unlocked vouchers yet. Complete more missions."
                : locale === "vi"
                  ? "Chưa có ưu đãi nào."
                  : "No vouchers yet."}
            </div>
          )}
          {list.map((voucher) => (
            <StaggerItem key={voucher.id}>
              <VoucherCard
                voucher={voucher}
                redeemed={redeemed.includes(voucher.id)}
                onClick={() => setOpen(voucher)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <BottomSheet open={!!open} onClose={() => setOpen(null)} snap={0.78}>
        {open && (
          <div className="px-6 pt-2 pb-8 text-center">
            <div className="text-fine uppercase tracking-widest text-ink-soft">
              {open.brand}
            </div>
            <h2 className="mt-2 text-display-md">{open.title[locale]}</h2>
            <div
              className="mx-auto mt-6 flex h-56 w-56 items-center justify-center rounded-3xl shadow-product"
              style={{ background: open.color }}
            >
              <div className="rounded-2xl bg-white p-4">
                <div className="grid h-40 w-40 grid-cols-12 gap-px">
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
            <p className="mt-3 text-body text-ink-muted">{open.description[locale]}</p>
            <AnimatePresence>
              {redeemed.includes(open.id) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-caption text-ink-soft"
                >
                  {locale === "vi" ? "Đã sử dụng" : "Already redeemed"}
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    redeem(open.id);
                    setOpen(null);
                  }}
                  className="mt-6 w-full rounded-full bg-ink py-4 text-tagline text-canvas"
                >
                  {locale === "vi" ? "Xuất trình tại quầy" : "Show at counter"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
