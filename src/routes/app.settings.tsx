import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, Bell, Trash2, Shield, Info, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/store/passport.store";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { locale, setLocale } = useLocale();
  const reset = usePassportStore((s) => s.reset);
  const nav = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title={locale === "vi" ? "Cài đặt" : "Settings"} />

      <div className="px-4 pt-3 space-y-4">
        <Section title={locale === "vi" ? "Chung" : "General"}>
          <Row
            icon={<Globe className="w-4 h-4" />}
            label={locale === "vi" ? "Ngôn ngữ" : "Language"}
            right={
              <div className="flex bg-parchment rounded-full p-0.5">
                {(["vi", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={
                      "px-3 py-1 rounded-full text-caption font-semibold " +
                      (locale === l ? "bg-canvas shadow-card" : "text-ink-soft")
                    }
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            }
          />
          <Row
            icon={<Bell className="w-4 h-4" />}
            label={locale === "vi" ? "Thông báo đẩy" : "Push notifications"}
            right={<Toggle defaultChecked />}
          />
        </Section>

        <Section title={locale === "vi" ? "Quyền riêng tư" : "Privacy"}>
          <Row
            icon={<Shield className="w-4 h-4" />}
            label={locale === "vi" ? "Chính sách quyền riêng tư" : "Privacy policy"}
            right={<ChevronRight className="w-4 h-4 text-ink-soft" />}
          />
          <Row
            icon={<Info className="w-4 h-4" />}
            label={locale === "vi" ? "Về DanangBooth" : "About DanangBooth"}
            right={<ChevronRight className="w-4 h-4 text-ink-soft" />}
          />
        </Section>

        <Section title={locale === "vi" ? "Vùng nguy hiểm" : "Danger zone"}>
          <button
            onClick={() => {
              if (confirm(locale === "vi" ? "Xóa toàn bộ dữ liệu hành trình?" : "Erase all journey data?")) {
                reset();
                nav({ to: "/" });
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            {locale === "vi" ? "Xóa dữ liệu hành trình" : "Erase journey data"}
          </button>
        </Section>

        <div className="pt-4 text-center text-fine text-ink-soft">
          DanangBooth · v2.0 · Made with ♡ in Đà Nẵng
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-fine uppercase tracking-widest text-ink-soft px-2 mb-2">
        {title}
      </div>
      <div className="bg-parchment rounded-2xl divide-y divide-hairline overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="flex items-center gap-3 text-body">
        <span className="text-ink-soft">{icon}</span>
        {label}
      </span>
      {right}
    </div>
  );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [on, setOn] = useStateLocal(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={
        "relative w-11 h-6 rounded-full transition-colors " +
        (on ? "bg-primary" : "bg-hairline")
      }
    >
      <span
        className={
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform " +
          (on ? "translate-x-5" : "")
        }
      />
    </button>
  );
}

import { useState } from "react";
function useStateLocal<T>(v: T | undefined) {
  return useState<T>((v ?? false) as unknown as T);
}
