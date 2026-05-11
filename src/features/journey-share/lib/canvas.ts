import type {
  JourneyCheckinPoint,
  JourneyRouteOverlay,
  ShareCardFormat,
  ShareCardRenderResult,
} from "@/types";

interface RenderShareCardOptions {
  ownerName: string;
  backgroundSrc: string;
  format: ShareCardFormat;
  points: JourneyCheckinPoint[];
  totalPoints: number;
  routeOverlay?: JourneyRouteOverlay | null;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = (width - drawWidth) / 2;
  const dy = (height - drawHeight) / 2;
  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
}

function drawRouteOverlay(
  ctx: CanvasRenderingContext2D,
  routeOverlay: JourneyRouteOverlay,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const coords = routeOverlay.coordinates;
  if (coords.length < 2) return;

  const lngs = coords.map(([lng]) => lng);
  const lats = coords.map(([, lat]) => lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lngSpan = Math.max(maxLng - minLng, 0.0001);
  const latSpan = Math.max(maxLat - minLat, 0.0001);
  const padding = 28;

  const project = ([lng, lat]: number[]) => ({
    px: x + padding + ((lng - minLng) / lngSpan) * (width - padding * 2),
    py: y + height - padding - ((lat - minLat) / latSpan) * (height - padding * 2),
  });

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 36);
  ctx.clip();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 18;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  coords.forEach((coord, index) => {
    const point = project(coord);
    if (index === 0) ctx.moveTo(point.px, point.py);
    else ctx.lineTo(point.px, point.py);
  });
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#ff6b3d";
  ctx.lineWidth = 8;
  coords.forEach((coord, index) => {
    const point = project(coord);
    if (index === 0) ctx.moveTo(point.px, point.py);
    else ctx.lineTo(point.px, point.py);
  });
  ctx.stroke();

  const start = project(coords[0]);
  const end = project(coords[coords.length - 1]);
  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.arc(start.px, start.py, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff6b3d";
  ctx.beginPath();
  ctx.arc(end.px, end.py, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(4, 12, 24, 0.78)";
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 18, 148, 52, 26);
  ctx.fill();
  ctx.fillStyle = "#f8fbff";
  ctx.font = '700 28px "Inter", "SF Pro Text", sans-serif';
  ctx.fillText(`${routeOverlay.distanceKm.toFixed(1)} km`, x + 36, y + 52);

  ctx.restore();
}

export async function generateShareCardCanvas(
  options: RenderShareCardOptions,
): Promise<ShareCardRenderResult> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  const background = await loadImage(options.backgroundSrc);
  drawCoverImage(ctx, background, width, height);

  const gradient = ctx.createLinearGradient(0, height * 0.42, 0, height);
  gradient.addColorStop(0, "rgba(4, 12, 24, 0)");
  gradient.addColorStop(0.42, "rgba(4, 12, 24, 0.42)");
  gradient.addColorStop(1, "rgba(4, 12, 24, 0.92)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (options.routeOverlay) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 24;
    drawRouteOverlay(ctx, options.routeOverlay, 56, 1200, 388, 468);
    ctx.restore();
  }

  ctx.fillStyle = "#f8fbff";
  ctx.font = '600 42px "Inter", "SF Pro Text", sans-serif';
  ctx.fillText("Danang Passport Story", 56, 118);

  ctx.font = '700 96px "Inter", "SF Pro Display", sans-serif';
  ctx.fillText(options.ownerName, 56, 1325);

  ctx.font = '500 34px "Inter", "SF Pro Text", sans-serif';
  ctx.fillStyle = "rgba(248, 251, 255, 0.82)";
  ctx.fillText(
    `${options.points.length} stops • ${options.totalPoints} points`,
    56,
    1384,
  );

  ctx.fillStyle = "#f8fbff";
  ctx.font = '600 36px "Inter", "SF Pro Text", sans-serif';
  options.points.slice(0, 5).forEach((point, index) => {
    ctx.fillText(`• ${point.name}`, 486, 1228 + index * 70);
  });

  ctx.fillStyle = "rgba(248, 251, 255, 0.72)";
  ctx.font = '500 28px "Inter", "SF Pro Text", sans-serif';
  ctx.fillText("Route powered by Mapbox", 56, 1838);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width,
    height,
    fileName: `journey-story-${Date.now()}.png`,
  };
}
