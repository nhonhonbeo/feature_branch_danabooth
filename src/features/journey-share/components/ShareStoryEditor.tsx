"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { ImagePlus, LoaderCircle, MapPinned, Share2, Download } from "lucide-react";
import { usePassportStore } from "@/features/passport/store";
import { useLocale } from "@/hooks/useLocale";
import { swrFetcher } from "@/services/api";
import { getDemoJourneyCheckinPoints, mapStampsToCheckinPoints } from "@/features/journey-share/lib/checkins";
import { fetchDirectionsRoute } from "@/features/journey-share/lib/mapbox";
import { generateShareCardCanvas } from "@/features/journey-share/lib/canvas";
import type {
  JourneyRouteOverlay,
  Location,
  ShareCardDraft,
  ShareCardRenderResult,
} from "@/types";

type EditorStatus =
  | "idle"
  | "image_selected"
  | "route_loading"
  | "preview_ready"
  | "exporting"
  | "error";

export function ShareStoryEditor() {
  const { locale } = useLocale();
  const passport = usePassportStore((s) => s.passport);
  const stamps = usePassportStore((s) => s.stamps);
  const markJourneyRecapExported = usePassportStore((s) => s.markJourneyRecapExported);
  const { data: locations = [] } = useSWR<Location[]>(["locations"], swrFetcher);
  const [status, setStatus] = useState<EditorStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [renderResult, setRenderResult] = useState<ShareCardRenderResult | null>(null);
  const [draft, setDraft] = useState<ShareCardDraft>({
    format: "story-9x16",
    imageDataUrl: null,
    points: [],
    useDemoData: false,
  });

  const livePoints = useMemo(
    () => mapStampsToCheckinPoints(stamps, locations, locale),
    [stamps, locations, locale],
  );
  const demoPoints = useMemo(() => getDemoJourneyCheckinPoints(locale), [locale]);
  const selectedPoints = draft.useDemoData ? demoPoints : livePoints;
  const totalJourneyPoints = stamps.reduce((sum, stamp) => sum + stamp.points, 0);

  const onFileSelected = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setError(locale === "vi" ? "Vui lòng chọn file ảnh." : "Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        imageDataUrl: typeof reader.result === "string" ? reader.result : null,
      }));
      setStatus("image_selected");
      setError(null);
      setRenderResult(null);
    };
    reader.onerror = () => {
      setStatus("error");
      setError(locale === "vi" ? "Không thể đọc ảnh đã chọn." : "Unable to read the selected image.");
    };
    reader.readAsDataURL(file);
  };

  const generatePreview = async () => {
    if (!draft.imageDataUrl) {
      setStatus("error");
      setError(locale === "vi" ? "Hãy tải ảnh lên trước." : "Upload an image first.");
      return;
    }

    const points = selectedPoints;
    setStatus("route_loading");
    setError(null);
    setWarning(null);

    let routeOverlay: JourneyRouteOverlay | null = null;

    if (points.length >= 2) {
      try {
        routeOverlay = await fetchDirectionsRoute(points);
      } catch {
        setWarning(
          locale === "vi"
            ? "Không lấy được overlay Mapbox, ảnh vẫn sẽ được tạo không có route."
            : "Mapbox overlay failed, the card will still be generated without the route.",
        );
      }
    } else {
      setWarning(
        locale === "vi"
          ? "Cần ít nhất 2 điểm để vẽ route. Card sẽ chỉ hiển thị ảnh và địa điểm."
          : "At least 2 points are needed for a route. The card will render without the map overlay.",
      );
    }

    try {
      setStatus("exporting");
      const result = await generateShareCardCanvas({
        ownerName: passport?.ownerName ?? "Explorer",
        backgroundSrc: draft.imageDataUrl,
        format: draft.format,
        points,
        totalPoints: totalJourneyPoints,
        routeOverlay,
      });
      setRenderResult(result);
      markJourneyRecapExported();
      setStatus("preview_ready");
    } catch {
      setStatus("error");
      setError(locale === "vi" ? "Không thể render share card." : "Unable to render the share card.");
    }
  };

  const downloadImage = () => {
    if (!renderResult) return;
    const link = document.createElement("a");
    link.href = renderResult.dataUrl;
    link.download = renderResult.fileName;
    link.click();
  };

  const shareImage = async () => {
    if (!renderResult) return;
    if (!navigator.share) {
      downloadImage();
      return;
    }

    const response = await fetch(renderResult.dataUrl);
    const blob = await response.blob();
    const file = new File([blob], renderResult.fileName, { type: "image/png" });

    try {
      if ("canShare" in navigator && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Danang Passport Story",
          files: [file],
        });
        return;
      }
    } catch {
      // fall back to download
    }

    downloadImage();
  };

  const statusLabel =
    status === "route_loading" || status === "exporting"
      ? locale === "vi"
        ? "Đang tạo story..."
        : "Generating story..."
      : locale === "vi"
        ? "Tạo preview"
        : "Generate preview";

  return (
    <div className="px-5 pt-4 pb-28 max-w-md mx-auto">
      <div className="rounded-3xl bg-parchment p-5 shadow-card">
        <div className="text-fine uppercase tracking-[0.18em] text-ink-soft">
          9:16 Story
        </div>
        <h1 className="text-display-lg mt-2">
          {locale === "vi" ? "Tạo share card từ ảnh của bạn" : "Create a share card from your photo"}
        </h1>
        <p className="text-body text-ink-muted mt-2">
          {locale === "vi"
            ? "Upload ảnh local, ghép route Mapbox và xuất story để demo."
            : "Upload a local photo, blend in your Mapbox route, and export a story mockup."}
        </p>

        <label className="mt-6 block rounded-3xl border border-dashed border-hairline bg-canvas p-5 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onFileSelected(event.target.files?.[0])}
          />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-tagline">
                {draft.imageDataUrl
                  ? locale === "vi"
                    ? "Đổi ảnh local"
                    : "Replace local photo"
                  : locale === "vi"
                    ? "Tải ảnh từ máy"
                    : "Upload a local image"}
              </div>
              <div className="text-caption text-ink-soft">
                {locale === "vi"
                  ? "Dùng ảnh thật để test render và export."
                  : "Use a real local image to test rendering and export."}
              </div>
            </div>
          </div>
        </label>

        {draft.imageDataUrl && (
          <div className="mt-4 rounded-3xl overflow-hidden bg-ink/5">
            <img
              src={draft.imageDataUrl}
              alt=""
              className="w-full aspect-[9/16] object-cover"
            />
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-canvas p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-tagline">
                {locale === "vi" ? "Dữ liệu hành trình" : "Journey data"}
              </div>
              <div className="text-caption text-ink-soft">
                {draft.useDemoData
                  ? locale === "vi"
                    ? "Đang dùng 3 check-ins demo."
                    : "Using 3 demo check-ins."
                  : locale === "vi"
                    ? `Đang dùng ${livePoints.length} check-ins từ hành trình thật.`
                    : `Using ${livePoints.length} live journey check-ins.`}
              </div>
            </div>
            <button
              onClick={() =>
                setDraft((current) => ({ ...current, useDemoData: !current.useDemoData }))
              }
              className="rounded-full bg-parchment px-4 py-2 text-caption font-semibold text-ink"
            >
              {draft.useDemoData
                ? locale === "vi"
                  ? "Dùng dữ liệu thật"
                  : "Use live data"
                : locale === "vi"
                  ? "Dùng dữ liệu demo"
                  : "Use demo data"}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {selectedPoints.map((point) => (
              <div
                key={`${point.name}-${point.lat}-${point.lng}`}
                className="flex items-center gap-3 rounded-2xl bg-parchment px-3 py-2"
              >
                <MapPinned className="w-4 h-4 text-primary" />
                <div className="text-caption">{point.name}</div>
              </div>
            ))}
          </div>
        </div>

        {warning && <div className="mt-4 text-caption text-amber-700">{warning}</div>}
        {error && <div className="mt-4 text-caption text-destructive">{error}</div>}

        <button
          onClick={generatePreview}
          disabled={!draft.imageDataUrl || status === "route_loading" || status === "exporting"}
          className="mt-6 w-full bg-primary text-primary-foreground rounded-full py-4 text-tagline disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {(status === "route_loading" || status === "exporting") && (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          )}
          {statusLabel}
        </button>
      </div>

      {renderResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl bg-ink p-4 text-canvas shadow-product"
        >
          <div className="text-fine uppercase tracking-[0.18em] text-canvas/70">
            {locale === "vi" ? "Preview xuất ảnh" : "Export preview"}
          </div>
          <img
            src={renderResult.dataUrl}
            alt=""
            className="mt-4 w-full rounded-3xl aspect-[9/16] object-cover"
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={shareImage}
              className="flex-1 rounded-full bg-canvas text-ink py-3 text-caption font-semibold flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {locale === "vi" ? "Chia sẻ" : "Share"}
            </button>
            <button
              onClick={downloadImage}
              className="flex-1 rounded-full bg-white/20 text-canvas py-3 text-caption font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {locale === "vi" ? "Tải ảnh" : "Download"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-5 text-center">
        <Link href="/app/journey" className="text-caption text-ink-soft">
          {locale === "vi" ? "← Quay lại hành trình" : "← Back to journey"}
        </Link>
      </div>
    </div>
  );
}
