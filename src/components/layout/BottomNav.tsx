import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map, BookmarkCheck, QrCode, Ticket, User } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", icon: Map, key: "navHome" as const },
  { to: "/app/stamps", icon: BookmarkCheck, key: "navStamps" as const },
  { to: "/app/scan", icon: QrCode, key: "navScan" as const, accent: true },
  { to: "/app/vouchers", icon: Ticket, key: "navVouchers" as const },
  { to: "/app/profile", icon: User, key: "navProfile" as const },
];

export function BottomNav() {
  const { t } = useLocale();
  const path = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-safe"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
    >
      <div className="mx-auto max-w-md px-3">
        <div className="glass border border-hairline/60 rounded-[28px] shadow-float flex items-end justify-between px-2 py-2">
          {items.map((it) => {
            const active =
              it.to === "/app"
                ? path === "/app"
                : path.startsWith(it.to);
            const Icon = it.icon;
            if (it.accent) {
              return (
                <Link
                  key={it.to}
                  href={it.to}
                  className="relative -mt-6 flex flex-col items-center justify-center"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-float ring-4 ring-background"
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </motion.div>
                  <span className="text-fine mt-1 text-ink-soft">{t(it.key)}</span>
                </Link>
              );
            }
            return (
              <Link
                key={it.to}
                href={it.to}
                className="flex-1 flex flex-col items-center gap-1 py-2 tap-highlight-none"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "transition-colors",
                    active ? "text-primary" : "text-ink-soft",
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                </motion.div>
                <span
                  className={cn(
                    "text-fine transition-colors",
                    active ? "text-ink font-semibold" : "text-ink-soft",
                  )}
                >
                  {t(it.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
