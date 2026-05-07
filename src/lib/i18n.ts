import type { Bilingual, Locale } from "@/types";

export const tr = (b: Bilingual | undefined, locale: Locale): string => {
  if (!b) return "";
  return b[locale] ?? b.vi ?? b.en ?? "";
};

export const dict = {
  appName: { vi: "DanangBooth", en: "DanangBooth" },
  // Landing
  landingTagline: {
    vi: "Hộ chiếu số khám phá Đà Nẵng",
    en: "Your digital passport to Da Nang",
  },
  landingDesc: {
    vi: "Quét mã trên thẻ Booth của bạn để bắt đầu hành trình.",
    en: "Scan your Booth card to begin the journey.",
  },
  scanCard: { vi: "Quét thẻ Booth", en: "Scan Booth Card" },
  enterCode: { vi: "Nhập mã thủ công", en: "Enter code manually" },
  // Activation
  activateTitle: { vi: "Kích hoạt hộ chiếu", en: "Activate your passport" },
  yourName: { vi: "Tên của bạn", en: "Your name" },
  continue: { vi: "Tiếp tục", en: "Continue" },
  back: { vi: "Quay lại", en: "Back" },
  done: { vi: "Hoàn tất", en: "Done" },
  skip: { vi: "Bỏ qua", en: "Skip" },
  // Onboarding
  pickInterests: { vi: "Chọn sở thích", en: "Pick your interests" },
  pickInterestsDesc: {
    vi: "Chúng tôi sẽ gợi ý điểm đến phù hợp với bạn.",
    en: "We'll personalize recommendations for you.",
  },
  // Nav
  navHome: { vi: "Bản đồ", en: "Map" },
  navStamps: { vi: "Sưu tập", en: "Stamps" },
  navScan: { vi: "Quét", en: "Scan" },
  navVouchers: { vi: "Ưu đãi", en: "Offers" },
  navProfile: { vi: "Hộ chiếu", en: "Passport" },
  // Common
  near: { vi: "Gần bạn", en: "Near you" },
  recommended: { vi: "Đề xuất", en: "Recommended" },
  collectStamp: { vi: "Đóng dấu tại đây", en: "Check in here" },
  points: { vi: "điểm", en: "points" },
  stamp: { vi: "dấu mộc", en: "stamp" },
  collected: { vi: "Đã thu thập", en: "Collected" },
  locked: { vi: "Chưa mở", en: "Locked" },
  vouchers: { vi: "Ưu đãi", en: "Vouchers" },
  notifications: { vi: "Thông báo", en: "Notifications" },
  settings: { vi: "Cài đặt", en: "Settings" },
  language: { vi: "Ngôn ngữ", en: "Language" },
  signOut: { vi: "Đăng xuất", en: "Sign out" },
  importItinerary: { vi: "Nhập lộ trình", en: "Import itinerary" },
  share: { vi: "Chia sẻ", en: "Share" },
  download: { vi: "Tải xuống", en: "Download" },
  searchPlaceholder: { vi: "Tìm địa điểm…", en: "Search places…" },
} as const;

export type DictKey = keyof typeof dict;

export const t = (key: DictKey, locale: Locale) => tr(dict[key], locale);
