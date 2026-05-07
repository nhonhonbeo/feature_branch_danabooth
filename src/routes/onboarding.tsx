import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/store/passport.store";
import { CATEGORIES } from "@/mocks/locations";
import { CountUp } from "@/components/ui/count-up";
import { FadeIn } from "@/components/ui/motion-primitives";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { t, locale } = useLocale();
  const nav = useNavigate();
  const passport = usePassportStore((s) => s.passport);
  const completeOnboarding = usePassportStore((s) => s.completeOnboarding);
  const setInterests = usePassportStore((s) => s.setInterests);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [picks, setPicks] = useState<string[]>([]);

  if (!passport) return <Navigate to="/" />;

  const toggle = (id: string) =>
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const finish = () => {
    setInterests(picks);
    completeOnboarding();
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-[100dvh] bg-canvas">
      {step === 0 && (
        <FadeIn className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="w-24 h-24 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-product mb-8"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
          <div className="text-fine uppercase tracking-[0.2em] text-ink-soft">
            {locale === "vi" ? "Người tiên phong" : "Pioneer"}
          </div>
          <h1 className="text-hero mt-3">
            #<CountUp value={passport.position ?? 1247} />
          </h1>
          <p className="text-lead text-ink-muted mt-4 max-w-xs">
            {locale === "vi"
              ? `Chào ${passport.ownerName ?? "bạn"}! Bạn là người thứ ${passport.position} cùng khám phá Đà Nẵng.`
              : `Welcome ${passport.ownerName ?? "explorer"}! You're the ${passport.position}th to begin this journey.`}
          </p>
          <button
            onClick={() => setStep(1)}
            className="mt-12 w-full max-w-sm bg-ink text-canvas rounded-full py-4 text-tagline"
          >
            {t("continue")}
          </button>
        </FadeIn>
      )}

      {step === 1 && (
        <div className="px-6 pt-safe pb-12 max-w-md mx-auto">
          <div className="pt-12">
            <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
              {locale === "vi" ? "Bước 1 / 2" : "Step 1 / 2"}
            </div>
            <h1 className="text-display-lg mt-2">{t("pickInterests")}</h1>
            <p className="text-body text-ink-muted mt-2">
              {t("pickInterestsDesc")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => {
              const sel = picks.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggle(c.id)}
                  className={
                    "relative aspect-[4/3] rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 " +
                    (sel
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-parchment text-ink border-transparent")
                  }
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="text-tagline">
                    {c.label[locale]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 sticky bottom-6">
            <button
              onClick={() => setStep(2)}
              disabled={picks.length === 0}
              className="w-full bg-ink text-canvas rounded-full py-4 text-tagline disabled:opacity-40"
            >
              {t("continue")} ({picks.length})
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <FadeIn className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl"
          >
            🗺️
          </motion.div>
          <h1 className="text-display-lg mt-6">
            {locale === "vi" ? "Sẵn sàng khám phá!" : "Ready to explore!"}
          </h1>
          <p className="text-lead text-ink-muted mt-3 max-w-xs">
            {locale === "vi"
              ? "Mở bản đồ và bắt đầu thu thập dấu mộc đầu tiên của bạn."
              : "Open the map and earn your first stamp."}
          </p>
          <button
            onClick={finish}
            className="mt-10 w-full max-w-sm bg-primary text-primary-foreground rounded-full py-4 text-tagline"
          >
            {locale === "vi" ? "Vào bản đồ" : "Enter the map"}
          </button>
        </FadeIn>
      )}
    </div>
  );
}
