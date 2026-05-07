import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import { CATEGORIES } from "@/mocks/locations";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export function CategoryChips() {
  const { locale } = useLocale();
  const selected = useUIStore((s) => s.selectedCategory);
  const setCategory = useUIStore((s) => s.setCategory);

  const all = [{ id: "all" as const, label: { vi: "Tất cả", en: "All" }, emoji: "✨" }, ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 -mx-4 snap-x snap-mandatory">
      {all.map((c) => {
        const active = selected === c.id;
        return (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(c.id)}
            className={cn(
              "snap-start shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold flex items-center gap-1.5 border transition-colors",
              active
                ? "bg-ink text-canvas border-ink"
                : "bg-canvas text-ink border-hairline",
            )}
          >
            <span>{c.emoji}</span>
            <span>{c.label[locale]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
