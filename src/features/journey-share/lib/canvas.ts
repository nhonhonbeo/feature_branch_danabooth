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
  const padding = 36;

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

  const gradient = ctx.createLinearGradient(0, height * 0.35, 0, height);
  gradient.addColorStop(0, "rgba(4, 12, 24, 0)");
  gradient.addColorStop(0.42, "rgba(4, 12, 24, 0.6)");
  gradient.addColorStop(1, "rgba(4, 12, 24, 0.98)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const marginX = 80;

  ctx.fillStyle = "#f8fbff";
  ctx.font = '600 48px "Inter", "SF Pro Text", sans-serif';
  ctx.fillText("Danang Passport Story", marginX, 120);

  ctx.font = '800 120px "Inter", "SF Pro Display", sans-serif';
  ctx.fillText(options.ownerName, marginX, 1250);

  // Mini map
  const mapY = 1350;
  const mapSize = 360;
  if (options.routeOverlay) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 24;
    drawRouteOverlay(ctx, options.routeOverlay, marginX, mapY, mapSize, mapSize);
    ctx.restore();
  }

  // Stops List
  const listCardX = marginX + mapSize + 60; // 500
  ctx.fillStyle = "#f8fbff";
  ctx.font = '600 42px "Inter", "SF Pro Text", sans-serif';
  options.points.slice(0, 5).forEach((point, index) => {
    ctx.fillText(`• ${point.name}`, listCardX, mapY + 60 + index * 72);
  });

  // Bottom Stats Row (Distance, Stops, Pts)
  const statsY = 1780;
  ctx.fillStyle = "rgba(248, 251, 255, 0.9)";
  ctx.font = '500 42px "Inter", "SF Pro Text", sans-serif';
  
  if (options.routeOverlay) {
    ctx.textAlign = "left";
    ctx.fillText(`${options.routeOverlay.distanceKm.toFixed(1)} km`, marginX, statsY);
  }

  ctx.textAlign = "center";
  ctx.fillText(`${options.points.length} stops`, width / 2, statsY);

  ctx.textAlign = "right";
  ctx.fillText(`${options.totalPoints} pts`, width - marginX, statsY);

  // Reset alignment
  ctx.textAlign = "left";

  // Footer text
  ctx.fillStyle = "rgba(248, 251, 255, 0.72)";
  ctx.font = '500 32px "Inter", "SF Pro Text", sans-serif';
  ctx.fillText("Route powered by Mapbox", marginX, 1860);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width,
    height,
    fileName: `journey-story-${Date.now()}.png`,
  };
}
