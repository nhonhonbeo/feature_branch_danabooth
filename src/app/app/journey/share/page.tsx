"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useLocale } from "@/hooks/useLocale";
import { ShareStoryEditor } from "@/features/journey-share/components/ShareStoryEditor";

export default function JourneySharePage() {
  const { locale } = useLocale();

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar back title={locale === "vi" ? "Tạo story" : "Create story"} />
      <ShareStoryEditor />
    </div>
  );
}
