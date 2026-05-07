import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, type ReactNode } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** percentage of viewport height, e.g. 0.5 for half */
  snap?: number;
  fullscreen?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  children,
  snap = 0.6,
  fullscreen,
}: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-canvas rounded-t-[28px] shadow-sheet overflow-hidden"
            style={{
              height: fullscreen ? "100dvh" : `${snap * 100}dvh`,
              maxHeight: "92dvh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-hairline" />
            </div>
            <div className="h-full overflow-y-auto pb-safe">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
