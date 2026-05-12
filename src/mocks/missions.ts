import type { Bilingual } from "@/types";

export type MissionStatus = "locked" | "available" | "completed";

export type MissionCategory =
  | "Check-in"
  | "Food"
  | "Culture"
  | "Photo"
  | "Voucher"
  | "Journey";

export type MissionAutoCheckType =
  | "passportActivated"
  | "firstPhotoboothPhoto"
  | "firstPassportPhoto"
  | "firstStamp"
  | "hanRiverCheckin"
  | "beachVisit"
  | "cultureVisit"
  | "localFood"
  | "threeStamps"
  | "redeemedVoucher"
  | "journeyRecapExported"
  | "demoManual";

export interface MissionDefinition {
  id: string;
  title: Bilingual;
  description: Bilingual;
  category: MissionCategory;
  rewardPoints: number;
  status: MissionStatus;
  autoCheckType: MissionAutoCheckType;
}

export const MISSIONS: MissionDefinition[] = [
  {
    id: "activate-passport",
    title: { vi: "Kích hoạt QR Passport", en: "Activate QR Passport" },
    description: {
      vi: "Quét hoặc nhập mã QR để bắt đầu hành trình.",
      en: "Scan or enter the QR code to start the trip.",
    },
    category: "Journey",
    rewardPoints: 10,
    status: "available",
    autoCheckType: "passportActivated",
  },
  {
    id: "first-photobooth-photo",
    title: { vi: "Chụp ảnh đầu tiên tại photobooth", en: "Take your first photobooth photo" },
    description: {
      vi: "Demo: đánh dấu thủ công khi chưa có dữ liệu ảnh thật.",
      en: "Demo: mark manually until real photo data is connected.",
    },
    category: "Photo",
    rewardPoints: 10,
    status: "available",
    autoCheckType: "firstPhotoboothPhoto",
  },
  {
    id: "first-passport-photo",
    title: { vi: "Dán ảnh đầu tiên vào passport", en: "Place your first photo in the passport" },
    description: {
      vi: "Demo: dùng toggle tạm thời cho flow dán ảnh.",
      en: "Demo: temporary toggle for the passport photo flow.",
    },
    category: "Photo",
    rewardPoints: 10,
    status: "available",
    autoCheckType: "firstPassportPhoto",
  },
  {
    id: "first-stamp",
    title: { vi: "Đóng dấu địa danh đầu tiên", en: "Collect the first place stamp" },
    description: {
      vi: "Tự hoàn thành khi bạn có ít nhất 1 dấu mộc.",
      en: "Auto-completes once you collect at least 1 stamp.",
    },
    category: "Check-in",
    rewardPoints: 15,
    status: "available",
    autoCheckType: "firstStamp",
  },
  {
    id: "han-river-checkin",
    title: { vi: "Check-in một điểm gần sông Hàn", en: "Check in near the Han River" },
    description: {
      vi: "Gợi ý: Cầu Rồng, APEC Park hoặc Bảo tàng Chăm.",
      en: "Try Dragon Bridge, APEC Park, or Cham Museum.",
    },
    category: "Check-in",
    rewardPoints: 15,
    status: "available",
    autoCheckType: "hanRiverCheckin",
  },
  {
    id: "beach-visit",
    title: { vi: "Ghé một địa điểm biển", en: "Visit a beach spot" },
    description: {
      vi: "Tự hoàn thành khi bạn có stamp thuộc nhóm biển.",
      en: "Auto-completes when you stamp a beach location.",
    },
    category: "Check-in",
    rewardPoints: 15,
    status: "available",
    autoCheckType: "beachVisit",
  },
  {
    id: "culture-visit",
    title: { vi: "Ghé một điểm văn hóa / tâm linh", en: "Visit a culture or spiritual place" },
    description: {
      vi: "Bảo tàng, chùa hoặc điểm văn hóa đều được tính.",
      en: "Museums, pagodas, and culture spots count.",
    },
    category: "Culture",
    rewardPoints: 15,
    status: "available",
    autoCheckType: "cultureVisit",
  },
  {
    id: "local-food",
    title: { vi: "Thử một món ăn địa phương", en: "Try a local dish" },
    description: {
      vi: "Hoàn thành khi bạn check-in một địa điểm ẩm thực.",
      en: "Completes when you check in at a food location.",
    },
    category: "Food",
    rewardPoints: 15,
    status: "available",
    autoCheckType: "localFood",
  },
  {
    id: "three-stamps",
    title: { vi: "Nhận ít nhất 3 dấu mộc", en: "Collect at least 3 stamps" },
    description: {
      vi: "Tích lũy thêm dấu để mở phần thưởng tốt hơn.",
      en: "Collect more stamps to unlock better rewards.",
    },
    category: "Check-in",
    rewardPoints: 20,
    status: "available",
    autoCheckType: "threeStamps",
  },
  {
    id: "redeem-partner-voucher",
    title: { vi: "Đổi voucher tại một đối tác", en: "Redeem a voucher with a partner" },
    description: {
      vi: "Tự hoàn thành sau lần đổi voucher đầu tiên.",
      en: "Auto-completes after your first voucher redemption.",
    },
    category: "Voucher",
    rewardPoints: 20,
    status: "available",
    autoCheckType: "redeemedVoucher",
  },
  {
    id: "export-recap",
    title: { vi: "Xuất ảnh recap hành trình", en: "Export a journey recap image" },
    description: {
      vi: "Tự hoàn thành khi bạn tạo hoặc tải story recap.",
      en: "Auto-completes when you generate or download a recap story.",
    },
    category: "Journey",
    rewardPoints: 20,
    status: "available",
    autoCheckType: "journeyRecapExported",
  },
  {
    id: "final-journal-page",
    title: { vi: "Viết một trang nhật ký cuối chuyến", en: "Write a final trip journal page" },
    description: {
      vi: "Demo: đánh dấu thủ công cho đến khi có journal thật.",
      en: "Demo: mark manually until the real journal flow exists.",
    },
    category: "Journey",
    rewardPoints: 25,
    status: "available",
    autoCheckType: "demoManual",
  },
];
