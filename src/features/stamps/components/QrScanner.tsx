import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, KeyRound } from "lucide-react";

interface Props {
  onResult: (text: string) => void;
  onClose?: () => void;
}

/** Wraps html5-qrcode. Loads it client-only to keep SSR clean. */
export function QrScanner({ onResult }: Props) {
  const elId = "qr-reader-region";
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [code, setCode] = useState("");
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (manualMode) return;
    let scanner: { stop: () => Promise<void>; clear: () => void } | null = null;
    let mounted = true;

    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (!mounted) return;
        const Html5Qrcode = mod.Html5Qrcode;
        const instance = new Html5Qrcode(elId, { verbose: false });
        // store with our minimal API shape
        scanner = {
          stop: () => instance.stop(),
          clear: () => instance.clear(),
        };
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (stoppedRef.current) return;
            stoppedRef.current = true;
            instance
              .stop()
              .then(() => instance.clear())
              .finally(() => onResult(decoded));
          },
          () => {
            /* per-frame errors ignored */
          },
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Camera unavailable";
        setError(msg);
      }
    })();

    return () => {
      mounted = false;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner?.clear())
          .catch(() => undefined);
      }
    };
  }, [manualMode, onResult]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
      {!manualMode && (
        <>
          <div id={elId} className="absolute inset-0 w-full h-full [&_video]:object-cover [&_video]:!w-full [&_video]:!h-full" />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/80" />
              {/* corners */}
              {["top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl",
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl"].map((c) => (
                <span key={c} className={`absolute w-8 h-8 border-primary ${c}`} />
              ))}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-primary/80 animate-scan-line shadow-[0_0_18px_var(--primary)]" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-32 text-center text-white text-tagline px-6">
            <div className="flex items-center justify-center gap-2 opacity-90">
              <Camera className="w-5 h-5" />
              <span>Đưa mã vào khung</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setManualMode(true)}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full glass text-ink text-caption font-semibold flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Nhập mã thủ công
          </motion.button>
          {error && (
            <div className="absolute top-24 left-4 right-4 glass-dark text-white text-caption rounded-2xl p-4">
              {error}. Hãy nhập mã thủ công.
            </div>
          )}
        </>
      )}
      {manualMode && (
        <div className="relative z-10 w-full max-w-sm px-6">
          <h2 className="text-display-md text-white mb-2">Nhập mã hộ chiếu</h2>
          <p className="text-caption text-white/70 mb-6">
            Mã in trên mặt sau thẻ Booth của bạn.
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DNB-XXXX-XXXX"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-2xl px-5 py-4 text-tagline tracking-widest text-center"
            autoFocus
          />
          <button
            onClick={() => code && onResult(code)}
            disabled={code.length < 4}
            className="mt-4 w-full bg-primary text-primary-foreground rounded-full py-4 text-tagline disabled:opacity-40"
          >
            Tiếp tục
          </button>
          <button
            onClick={() => setManualMode(false)}
            className="mt-3 w-full text-white/70 text-caption py-2"
          >
            ← Quay lại quét
          </button>
        </div>
      )}
    </div>
  );
}
