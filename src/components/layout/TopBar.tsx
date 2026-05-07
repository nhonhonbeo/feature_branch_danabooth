import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface TopBarProps {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  transparent?: boolean;
  onBack?: () => void;
}

export function TopBar({ title, back, right, transparent, onBack }: TopBarProps) {
  const router = useRouter();
  return (
    <div
      className={
        "sticky top-0 z-30 pt-safe " +
        (transparent ? "bg-transparent" : "glass border-b border-hairline/60")
      }
    >
      <div className="h-[52px] px-3 flex items-center justify-between">
        <div className="w-10 flex items-center">
          {back ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => (onBack ? onBack() : router.back())}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-ink tap-highlight-none"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.2} />
            </motion.button>
          ) : (
            <Link
              href="/app"
              className="text-tagline font-semibold tracking-tight text-ink"
            >
              D.
            </Link>
          )}
        </div>
        <h1 className="text-tagline truncate">{title}</h1>
        <div className="w-10 flex items-center justify-end">{right}</div>
      </div>
    </div>
  );
}
