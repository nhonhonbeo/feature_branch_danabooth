import type { Voucher } from "@/types";

const inDays = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toISOString();

export const VOUCHERS: Voucher[] = [
  {
    id: "v_1",
    brand: "Highlands Coffee",
    title: { vi: "Giảm 20% mọi đồ uống", en: "20% off any drink" },
    description: {
      vi: "Áp dụng tại các cửa hàng Highlands tại Đà Nẵng.",
      en: "Valid at Highlands stores in Da Nang.",
    },
    discount: "20%",
    validUntil: inDays(30),
    code: "DN-HIGH-2024",
    color: "oklch(0.55 0.18 30)",
    used: false,
  },
  {
    id: "v_2",
    brand: "Bà Nà Hills",
    title: { vi: "Vé cáp treo giảm 15%", en: "15% off cable car ticket" },
    description: {
      vi: "Áp dụng cho khách quốc tế và nội địa.",
      en: "For international and local visitors.",
    },
    discount: "15%",
    validUntil: inDays(60),
    code: "DN-BANA-15",
    color: "oklch(0.6 0.16 250)",
    used: false,
    partnerLocationId: "loc_ba_na_hills",
  },
  {
    id: "v_3",
    brand: "Mì Quảng 1A",
    title: { vi: "Tặng 1 ly trà tắc", en: "Free kumquat tea" },
    description: {
      vi: "Khi gọi bất kỳ tô mì nào.",
      en: "With any noodle bowl order.",
    },
    discount: "FREE",
    validUntil: inDays(14),
    code: "DN-MQ1A-FREE",
    color: "oklch(0.7 0.16 80)",
    used: false,
    partnerLocationId: "loc_mi_quang",
  },
  {
    id: "v_4",
    brand: "Helio Center",
    title: { vi: "Voucher 50K mua sắm", en: "50K shopping voucher" },
    description: {
      vi: "Cho hóa đơn từ 200K.",
      en: "Min. spend 200K VND.",
    },
    discount: "50K",
    validUntil: inDays(45),
    code: "DN-HELIO-50",
    color: "oklch(0.5 0.2 320)",
    used: false,
  },
];
