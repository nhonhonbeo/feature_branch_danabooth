import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, FileText, Sparkles, Check } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLocale } from "@/hooks/useLocale";
import { LOCATIONS } from "@/mocks/locations";
import type { Location } from "@/types";

export const Route = createFileRoute("/app/journey/import")({
  component: ImportItinerary,
});

function ImportItinerary() {
  const { locale } = useLocale();
  const nav = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<Location[]>([]);

  const parse = () => {
    const q = text.toLowerCase();
    const matches = LOCATIONS.filter(
      (l) =>
        q.includes(l.name.vi.toLowerCase()) ||
        q.includes(l.name.en.toLowerCase()) ||
        q.includes(l.slug),
    );
    setParsed(matches.length ? matches : LOCATIONS.slice(0, 3));
    setStep(2);
  };

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title={locale === "vi" ? "Nhập lộ trình" : "Import itinerary"} />

      <div className="px-5 pt-4 max-w-md mx-auto">
        {/* Stepper */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={
                "h-1 flex-1 rounded-full transition-colors " +
                (i <= step ? "bg-primary" : "bg-hairline")
              }
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <h1 className="text-display-lg">
                {locale === "vi" ? "Bạn có lộ trình rồi?" : "Got an itinerary?"}
              </h1>
              <p className="text-body text-ink-muted mt-2">
                {locale === "vi"
                  ? "Chọn cách nhập — chúng tôi sẽ ghép vào bản đồ và đánh dấu các địa điểm."
                  : "Pick how to import — we'll match to the map and mark the spots."}
              </p>

              <div className="mt-6 grid gap-3">
                <Choice
                  icon={<ImageIcon className="w-5 h-5" />}
                  title={locale === "vi" ? "Tải ảnh chụp màn hình" : "Upload screenshot"}
                  desc={locale === "vi" ? "Từ TikTok, blog du lịch…" : "From TikTok, travel blog…"}
                  onClick={() => setStep(1)}
                />
                <Choice
                  icon={<FileText className="w-5 h-5" />}
                  title={locale === "vi" ? "Dán văn bản" : "Paste text"}
                  desc={locale === "vi" ? "Gợi ý từ bạn bè, ChatGPT…" : "Tips from friends, ChatGPT…"}
                  onClick={() => setStep(1)}
                />
                <Choice
                  icon={<Sparkles className="w-5 h-5" />}
                  title={locale === "vi" ? "Để AI gợi ý" : "Let AI suggest"}
                  desc={locale === "vi" ? "Dựa vào sở thích của bạn" : "Based on your interests"}
                  onClick={() => {
                    setParsed(LOCATIONS.slice(0, 5));
                    setStep(2);
                  }}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <h1 className="text-display-lg">
                {locale === "vi" ? "Dán nội dung" : "Paste your itinerary"}
              </h1>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder={
                  locale === "vi"
                    ? "Ví dụ: Sáng đi Cầu Rồng, trưa ăn Mì Quảng 1A, chiều ra biển Mỹ Khê…"
                    : "e.g. Morning at Dragon Bridge, lunch at Mi Quang 1A, evening at My Khe Beach…"
                }
                className="mt-4 w-full bg-parchment rounded-2xl p-4 text-body resize-none border border-hairline"
              />
              <button
                onClick={parse}
                disabled={text.length < 4}
                className="mt-4 w-full bg-primary text-primary-foreground rounded-full py-4 text-tagline disabled:opacity-40"
              >
                {locale === "vi" ? "Phân tích" : "Parse"}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <h1 className="text-display-lg">
                {locale === "vi" ? "Tìm thấy" : "Found"} {parsed.length}
              </h1>
              <p className="text-body text-ink-muted mt-2">
                {locale === "vi"
                  ? "Đã thêm vào hành trình của bạn."
                  : "Added to your journey."}
              </p>
              <div className="mt-6 space-y-2">
                {parsed.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 bg-parchment rounded-2xl p-3"
                  >
                    <img src={l.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-tagline truncate">{l.name[locale]}</div>
                      <div className="text-caption text-ink-soft truncate">
                        {l.address[locale]}
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
              <button
                onClick={() => nav({ to: "/app" })}
                className="mt-6 w-full bg-ink text-canvas rounded-full py-4 text-tagline"
              >
                {locale === "vi" ? "Xem trên bản đồ" : "View on map"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Choice({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left bg-parchment rounded-2xl p-4 flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-2xl bg-canvas flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-tagline">{title}</div>
        <div className="text-caption text-ink-soft">{desc}</div>
      </div>
    </motion.button>
  );
}
