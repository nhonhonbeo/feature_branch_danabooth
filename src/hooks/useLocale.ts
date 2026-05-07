import { usePassportStore } from "@/features/passport/store";
import { dict, t as translate, type DictKey } from "@/lib/i18n";
import type { Bilingual } from "@/types";

export const useLocale = () => {
  const locale = usePassportStore((s) => s.locale);
  const setLocale = usePassportStore((s) => s.setLocale);
  return {
    locale,
    setLocale,
    t: (k: DictKey) => translate(k, locale),
    tr: (b: Bilingual | undefined) => (b ? b[locale] : ""),
    dict,
  };
};
