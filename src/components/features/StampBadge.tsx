import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Location, Stamp } from "@/types";
import { useLocale } from "@/hooks/useLocale";

interface Props {
  location: Location;
  stamp?: Stamp;
}

export function StampBadge({ location, stamp }: Props) {
  const { tr } = useLocale();
  const collected = !!stamp;

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="relative aspect-square rounded-3xl overflow-hidden bg-parchment shadow-card"
    >
      <img
        src={location.image}
        alt={tr(location.name)}
        className={
          "absolute inset-0 w-full h-full object-cover transition " +
          (collected ? "" : "grayscale opacity-40")
        }
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {collected ? (
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-stamp-gold flex items-center justify-center text-ink font-bold shadow-float">
          ✓
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-canvas/90 backdrop-blur flex items-center justify-center">
            <Lock className="w-5 h-5 text-ink-soft" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-3 text-white">
        <div className="text-caption font-semibold leading-tight line-clamp-2">
          {tr(location.name)}
        </div>
        <div className="text-fine text-white/70 mt-0.5">
          {collected ? `+${stamp.points} pts` : "Locked"}
        </div>
      </div>
    </motion.div>
  );
}
