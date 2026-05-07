import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/store/passport.store";
import { TopBar } from "@/components/layout/TopBar";
import { api } from "@/services/api";

export const Route = createFileRoute("/activate/")({
  component: ActivatePage,
});

function ActivatePage() {
  const { t, locale } = useLocale();
  const nav = useNavigate();
  const activate = usePassportStore((s) => s.activate);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submitCode = async () => {
    setLoading(true);
    setErr(null);
    const res = await api.validateActivationCode(code);
    setLoading(false);
    if (!res.ok) {
      setErr(locale === "vi" ? "Mã không hợp lệ" : "Invalid code");
      return;
    }
    setStep(1);
  };

  const finish = () => {
    activate(code, name);
    nav({ to: "/onboarding" });
  };

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title={t("activateTitle")} />

      <div className="px-6 pt-6 pb-24 max-w-md mx-auto">
        {step === 0 ? (
          <motion.div
            key="s0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
              {locale === "vi" ? "Bước 1 / 2" : "Step 1 / 2"}
            </div>
            <h1 className="text-display-lg mt-2">
              {locale === "vi" ? "Nhập mã trên thẻ" : "Enter your card code"}
            </h1>
            <p className="text-body text-ink-muted mt-3">
              {locale === "vi"
                ? "Mã 8 ký tự ở mặt sau thẻ Booth của bạn."
                : "The 8-character code on the back of your Booth card."}
            </p>

            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="DNB-XXXX-XXXX"
              className="mt-8 w-full bg-parchment border border-hairline rounded-2xl px-5 py-5 text-display-md text-center tracking-widest"
            />
            {err && <div className="text-caption text-destructive mt-3">{err}</div>}

            <button
              onClick={submitCode}
              disabled={code.length < 4 || loading}
              className="mt-8 w-full bg-primary text-primary-foreground rounded-full py-4 text-tagline disabled:opacity-40"
            >
              {loading ? "…" : t("continue")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
              {locale === "vi" ? "Bước 2 / 2" : "Step 2 / 2"}
            </div>
            <h1 className="text-display-lg mt-2">
              {locale === "vi" ? "Hành trình của ai?" : "Whose journey is this?"}
            </h1>
            <p className="text-body text-ink-muted mt-3">
              {locale === "vi"
                ? "Tên bạn sẽ xuất hiện trên thẻ kỷ niệm."
                : "Your name will appear on your souvenir card."}
            </p>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className="mt-8 w-full bg-parchment border border-hairline rounded-2xl px-5 py-5 text-tagline"
            />
            <button
              onClick={finish}
              disabled={!name.trim()}
              className="mt-8 w-full bg-primary text-primary-foreground rounded-full py-4 text-tagline disabled:opacity-40"
            >
              {locale === "vi" ? "Kích hoạt" : "Activate"}
            </button>
            <button
              onClick={finish}
              className="mt-3 w-full text-ink-soft text-caption py-2"
            >
              {t("skip")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
