import { motion } from "framer-motion";
import type { Location } from "@/types";
import { CATEGORIES } from "@/mocks/locations";

interface Props {
  location: Location;
  active?: boolean;
  collected?: boolean;
  onClick?: () => void;
}

export function MapMarker({ location, active, collected, onClick }: Props) {
  const cat = CATEGORIES.find((c) => c.id === location.category);
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, y: -10 }}
      animate={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="relative -translate-x-1/2 -translate-y-full"
      aria-label={location.name.en}
    >
      <div
        className={
          "w-10 h-10 rounded-full flex items-center justify-center text-base shadow-float ring-2 transition " +
          (active
            ? "bg-primary ring-primary text-white scale-110"
            : collected
              ? "bg-stamp-gold ring-stamp-gold text-ink"
              : "bg-canvas ring-canvas text-ink")
        }
      >
        <span>{cat?.emoji}</span>
      </div>
      <div
        className={
          "absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 rotate-45 " +
          (active ? "bg-primary" : collected ? "bg-stamp-gold" : "bg-canvas")
        }
      />
    </motion.button>
  );
}
