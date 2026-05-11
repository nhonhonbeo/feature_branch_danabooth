"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { usePassportStore } from "@/features/passport/store";
import {
  buildSeedForActivationState,
  getPassportSeedByQrId,
  resolveSeedActivationState,
} from "@/mocks/passport-seeds";
import { useLocale } from "@/hooks/useLocale";

export default function QrResolverPage() {
  const params = useParams<{ qrId: string }>();
  const router = useRouter();
  const { locale } = useLocale();
  const demoMode = usePassportStore((s) => s.demoMode);
  const loadSeedPassport = usePassportStore((s) => s.loadSeedPassport);
  const beginSeedActivation = usePassportStore((s) => s.beginSeedActivation);
  const qrId = Array.isArray(params.qrId) ? params.qrId[0] : params.qrId;
  const seed = qrId ? getPassportSeedByQrId(decodeURIComponent(qrId)) : undefined;

  useEffect(() => {
    if (!seed) return;

    const activationState = resolveSeedActivationState(seed, demoMode);
    const resolvedSeed = buildSeedForActivationState(seed, activationState);

    if (activationState === "activated") {
      loadSeedPassport(resolvedSeed);
      router.replace("/app/profile");
      return;
    }

    beginSeedActivation(resolvedSeed);
    router.replace("/activate");
  }, [beginSeedActivation, demoMode, loadSeedPassport, router, seed]);

  if (!seed) {
    return (
      <div className="min-h-[100dvh] bg-canvas">
        <TopBar back title="QR" />
        <div className="px-6 pt-12 max-w-md mx-auto text-center">
          <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
            QR demo
          </div>
          <h1 className="text-display-lg mt-2">
            {locale === "vi" ? "Không tìm thấy passport" : "Passport not found"}
          </h1>
          <p className="text-body text-ink-muted mt-3">
            {locale === "vi"
              ? "QR này chưa được seed trong bản demo hiện tại."
              : "This QR is not seeded in the current demo build."}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-ink text-canvas px-6 py-3 text-tagline"
          >
            {locale === "vi" ? "Về trang chủ" : "Back home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title="QR" />
      <div className="px-6 pt-12 max-w-md mx-auto text-center">
        <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
          QR demo
        </div>
        <h1 className="text-display-lg mt-2">
          {locale === "vi" ? "Đang mở passport..." : "Opening passport..."}
        </h1>
        <p className="text-body text-ink-muted mt-3">
          {locale === "vi"
            ? "Đang resolve dữ liệu seed và điều hướng đúng flow demo."
            : "Resolving seeded data and sending you to the right demo flow."}
        </p>
      </div>
    </div>
  );
}
