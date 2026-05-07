import type { Notification } from "@/types";

const ago = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n_1",
    title: { vi: "Hộ chiếu đã kích hoạt", en: "Passport activated" },
    body: {
      vi: "Bạn là người thứ 1,247 cùng khám phá Đà Nẵng. Bắt đầu hành trình nào!",
      en: "You're the 1,247th explorer. Let the journey begin!",
    },
    createdAt: ago(2),
    read: false,
    kind: "system",
  },
  {
    id: "n_2",
    title: { vi: "Ưu đãi mới gần bạn", en: "New offer nearby" },
    body: {
      vi: "Highlands Coffee đang giảm 20% — chỉ 200m từ đây.",
      en: "Highlands Coffee 20% off — 200m away.",
    },
    createdAt: ago(45),
    read: false,
    kind: "voucher",
  },
  {
    id: "n_3",
    title: { vi: "Gợi ý hôm nay", en: "Today's suggestion" },
    body: {
      vi: "Bãi biển Mỹ Khê đang đẹp tuyệt — sẵn sàng đóng dấu chứ?",
      en: "My Khe Beach is stunning today — ready for a stamp?",
    },
    createdAt: ago(180),
    read: true,
    kind: "journey",
  },
];
