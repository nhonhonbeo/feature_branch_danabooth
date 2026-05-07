import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QrCode, KeyRound, ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/store/passport.store";
import { FadeIn } from "@/components/ui/motion-primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DanangBooth — Your digital passport to Da Nang" },
      {
        name: "description",
        content:
          "Scan, collect stamps, unlock vouchers, and explore Da Nang like a local with your DanangBooth digital passport.",
      },
      { property: "og:title", content: "DanangBooth — Digital Passport for Da Nang" },
      {
        property: "og:description",
        content: "Scan your Booth card. Begin the journey.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, locale, setLocale } = useLocale();
  const passport = usePassportStore((s) => s.passport);

  if (passport?.isActivated) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-canvas text-ink">
      {/* Atmospheric hero photo */}
      <div className="absolute inset-x-0 top-0 h-[58dvh] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=80"
          alt="Da Nang at twilight"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-canvas" />
      </div>

      {/* Top language switch */}
      <div className="relative z-10 pt-safe">
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="text-tagline font-semibold text-white">DanangBooth</div>
          <button
            onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
            className="glass text-ink text-caption font-semibold px-3 py-1.5 rounded-full"
          >
            {locale === "vi" ? "EN" : "VI"}
          </button>
        </div>
      </div>

      <div className="relative z-10 px-6 pt-[42dvh] pb-12 max-w-md mx-auto">
        <FadeIn>
          <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
            Đà Nẵng · Vietnam
          </div>
          <h1 className="text-hero mt-3 text-ink">
            {locale === "vi" ? (
              <>
                Hộ chiếu <br />
                <span className="text-primary">Đà Nẵng</span> của bạn.
              </>
            ) : (
              <>
                Your <span className="text-primary">Da Nang</span><br />passport.
              </>
            )}
          </h1>
          <p className="text-lead text-ink-muted mt-4">{t("landingDesc")}</p>
        </FadeIn>

        <FadeIn delay={0.25} className="mt-10 space-y-3">
          <Link to="/activate/scan">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="w-full bg-ink text-canvas rounded-full px-6 py-4 flex items-center justify-between"
            >
              <span className="flex items-center gap-3 text-tagline">
                <QrCode className="w-5 h-5" />
                {t("scanCard")}
              </span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>

          <Link to="/activate">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="w-full bg-canvas border border-hairline text-ink rounded-full px-6 py-4 flex items-center justify-between"
            >
              <span className="flex items-center gap-3 text-tagline">
                <KeyRound className="w-5 h-5" />
                {t("enterCode")}
              </span>
              <ArrowRight className="w-5 h-5 text-ink-soft" />
            </motion.div>
          </Link>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-8 text-center text-fine text-ink-soft">
          {locale === "vi"
            ? "Bằng cách tiếp tục, bạn đồng ý với điều khoản dịch vụ."
            : "By continuing, you agree to our terms of service."}
        </FadeIn>
      </div>
    </div>
  );
}
