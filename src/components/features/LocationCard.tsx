import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { Location } from "@/types";
import { useLocale } from "@/hooks/useLocale";
import { CATEGORIES } from "@/mocks/locations";

interface Props {
  location: Location;
  collected?: boolean;
  variant?: "card" | "row" | "wide";
}

export function LocationCard({ location, collected, variant = "card" }: Props) {
  const { tr, locale } = useLocale();
  const cat = CATEGORIES.find((c) => c.id === location.category);

  if (variant === "row") {
    return (
      <Link
        href={`/app/location/${location.id}`}
        className="flex gap-3 p-2 rounded-2xl hover:bg-parchment/60 transition-colors tap-highlight-none"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-parchment shrink-0 relative">
          <img
            src={location.image}
            alt={tr(location.name)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {collected && (
            <div className="absolute inset-0 bg-primary/15 ring-2 ring-inset ring-primary rounded-xl" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-fine">{cat?.emoji}</span>
            <span className="text-fine text-ink-soft">
              {cat?.label[locale]}
            </span>
          </div>
          <div className="text-tagline truncate">{tr(location.name)}</div>
          <div className="flex items-center gap-2 text-fine text-ink-soft">
            <Star className="w-3 h-3 fill-stamp-gold text-stamp-gold" />
            {location.rating}
            <span>·</span>
            <span>+{location.stampPoints} pts</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/app/location/${location.id}`}
      className="block group tap-highlight-none"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={
          "relative overflow-hidden rounded-3xl bg-parchment shadow-card " +
          (variant === "wide" ? "aspect-[5/3]" : "aspect-[4/5]")
        }
      >
        <img
          src={location.image}
          alt={tr(location.name)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 glass-dark text-white text-fine px-2.5 py-1 rounded-full">
          <span>{cat?.emoji}</span>
          <span>{cat?.label[locale]}</span>
        </div>
        {collected && (
          <div className="absolute top-3 right-3 bg-stamp-gold text-ink text-fine font-semibold px-2.5 py-1 rounded-full">
            ✓
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-4 text-white">
          <div className="text-display-md leading-tight !text-white">
            {tr(location.name)}
          </div>
          <div className="flex items-center gap-2 text-caption text-white/80 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{tr(location.address)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
