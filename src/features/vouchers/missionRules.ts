import { MISSIONS, type MissionDefinition, type MissionStatus } from "@/mocks/missions";
import type { Location, Passport, Stamp, Voucher } from "@/types";

export interface EvaluatedMission extends MissionDefinition {
  status: MissionStatus;
  isDemoManual: boolean;
}

export interface MissionSignals {
  passport: Passport | null;
  stamps: Stamp[];
  redeemedVoucherIds: string[];
  completedMissionIds: string[];
  hasExportedJourneyRecap: boolean;
  locations: Location[];
}

export interface VoucherUnlockRule {
  voucherId: string;
  requiredMissionCount: number;
  rewardLabel: {
    vi: string;
    en: string;
  };
}

export interface VoucherUnlockState {
  rule: VoucherUnlockRule;
  voucher: Voucher | undefined;
  isUnlocked: boolean;
  remainingMissions: number;
}

export const VOUCHER_UNLOCK_RULES: VoucherUnlockRule[] = [
  {
    voucherId: "v_1",
    requiredMissionCount: 3,
    rewardLabel: { vi: "Mở voucher giảm 10%", en: "Unlock a 10% discount voucher" },
  },
  {
    voucherId: "v_3",
    requiredMissionCount: 5,
    rewardLabel: { vi: "Mở voucher đồ uống", en: "Unlock a drink reward" },
  },
  {
    voucherId: "v_4",
    requiredMissionCount: 8,
    rewardLabel: { vi: "Mở voucher quà lưu niệm", en: "Unlock a souvenir reward" },
  },
  {
    voucherId: "v_2",
    requiredMissionCount: MISSIONS.length,
    rewardLabel: { vi: "Mở phần thưởng đặc biệt", en: "Unlock the premium reward" },
  },
];

const HAN_RIVER_LOCATION_IDS = new Set([
  "loc_dragon_bridge",
  "loc_apec_park",
  "loc_cham_museum",
]);

const manualMissionTypes = new Set(["firstPhotoboothPhoto", "firstPassportPhoto", "demoManual"]);

function hasStampedCategory(stamps: Stamp[], locations: Location[], category: Location["category"]) {
  return stamps.some((stamp) => {
    const location = locations.find((item) => item.id === stamp.locationId);
    return location?.category === category;
  });
}

function isMissionAutoCompleted(mission: MissionDefinition, signals: MissionSignals) {
  const { passport, stamps, redeemedVoucherIds, completedMissionIds, hasExportedJourneyRecap, locations } =
    signals;

  if (completedMissionIds.includes(mission.id)) return true;

  switch (mission.autoCheckType) {
    case "passportActivated":
      return Boolean(passport?.isActivated);
    case "firstStamp":
      return stamps.length >= 1;
    case "hanRiverCheckin":
      return stamps.some((stamp) => HAN_RIVER_LOCATION_IDS.has(stamp.locationId));
    case "beachVisit":
      return hasStampedCategory(stamps, locations, "beach");
    case "cultureVisit":
      return hasStampedCategory(stamps, locations, "culture");
    case "localFood":
      return hasStampedCategory(stamps, locations, "food");
    case "threeStamps":
      return stamps.length >= 3;
    case "redeemedVoucher":
      return redeemedVoucherIds.length >= 1;
    case "journeyRecapExported":
      return hasExportedJourneyRecap;
    case "firstPhotoboothPhoto":
    case "firstPassportPhoto":
    case "demoManual":
      return false;
    default:
      return false;
  }
}

export function evaluateMissions(signals: MissionSignals): EvaluatedMission[] {
  const passportActivated = Boolean(signals.passport?.isActivated);

  return MISSIONS.map((mission) => {
    const completed = isMissionAutoCompleted(mission, signals);
    const status: MissionStatus = completed
      ? "completed"
      : passportActivated || mission.autoCheckType === "passportActivated"
        ? "available"
        : "locked";

    return {
      ...mission,
      status,
      isDemoManual: manualMissionTypes.has(mission.autoCheckType),
    };
  });
}

export function getCompletedMissionCount(missions: EvaluatedMission[]) {
  return missions.filter((mission) => mission.status === "completed").length;
}

export function getMissionProgressPercent(completedMissionCount: number, totalMissionCount: number) {
  if (totalMissionCount === 0) return 0;
  return Math.round((completedMissionCount / totalMissionCount) * 100);
}

export function getVoucherUnlockStates(vouchers: Voucher[], completedMissionCount: number) {
  return VOUCHER_UNLOCK_RULES.map<VoucherUnlockState>((rule) => ({
    rule,
    voucher: vouchers.find((voucher) => voucher.id === rule.voucherId),
    isUnlocked: completedMissionCount >= rule.requiredMissionCount,
    remainingMissions: Math.max(rule.requiredMissionCount - completedMissionCount, 0),
  })).filter((state) => state.voucher);
}

export function getUnlockedVouchers(vouchers: Voucher[], completedMissionCount: number) {
  return getVoucherUnlockStates(vouchers, completedMissionCount).filter((state) => state.isUnlocked);
}

export function getLockedVouchers(vouchers: Voucher[], completedMissionCount: number) {
  return getVoucherUnlockStates(vouchers, completedMissionCount).filter((state) => !state.isUnlocked);
}

export function getNextReward(vouchers: Voucher[], completedMissionCount: number) {
  return getLockedVouchers(vouchers, completedMissionCount).sort(
    (a, b) => a.rule.requiredMissionCount - b.rule.requiredMissionCount,
  )[0];
}
