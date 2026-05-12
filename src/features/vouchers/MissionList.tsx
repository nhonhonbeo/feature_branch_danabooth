import { Check, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import type { EvaluatedMission } from "./missionRules";

interface MissionListProps {
  missions: EvaluatedMission[];
  locale: Locale;
  onToggleDemoMission: (missionId: string) => void;
}

const categoryTone: Record<EvaluatedMission["category"], string> = {
  "Check-in": "bg-primary/10 text-primary",
  Food: "bg-stamp-gold/18 text-ink",
  Culture: "bg-ink/8 text-ink-muted",
  Photo: "bg-primary/10 text-primary",
  Voucher: "bg-ink text-canvas",
  Journey: "bg-parchment text-ink-muted",
};

export function MissionList({ missions, locale, onToggleDemoMission }: MissionListProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-display-md">
            {locale === "vi" ? "Nhiệm vụ nhận ưu đãi" : "Missions"}
          </h2>
          <p className="mt-1 text-caption text-ink-soft">
            {locale === "vi"
              ? "Một vài nhiệm vụ demo có thể đánh dấu thủ công."
              : "Some demo missions can be marked manually."}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {missions.map((mission) => {
          const completed = mission.status === "completed";
          const locked = mission.status === "locked";
          const canToggle = mission.isDemoManual && !locked;

          return (
            <motion.button
              key={mission.id}
              type="button"
              whileTap={canToggle ? { scale: 0.99 } : undefined}
              onClick={() => {
                if (canToggle) onToggleDemoMission(mission.id);
              }}
              disabled={!canToggle}
              className={cn(
                "w-full rounded-3xl border border-hairline bg-canvas p-4 text-left transition",
                completed && "bg-parchment",
                locked && "opacity-55",
                canToggle && "tap-highlight-none active:scale-[0.99]",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                    completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : locked
                        ? "border-hairline bg-parchment text-ink-soft"
                        : "border-ink/25 bg-canvas text-transparent",
                  )}
                  aria-hidden="true"
                >
                  {locked ? <Lock className="h-3.5 w-3.5 text-ink-soft" /> : <Check className="h-4 w-4" />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-tagline", completed && "text-ink-soft line-through")}>
                      {mission.title[locale]}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-fine font-semibold",
                        categoryTone[mission.category],
                      )}
                    >
                      {mission.category}
                    </span>
                  </span>
                  <span className="mt-1 block text-caption text-ink-soft">
                    {mission.description[locale]}
                  </span>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
