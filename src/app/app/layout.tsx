"use client";


import { BottomNav } from "@/components/layout/BottomNav";
import { usePassportStore } from "@/features/passport/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const passport = usePassportStore((s) => s.passport);
  const router = useRouter();

  useEffect(() => {
    // if (!passport?.isActivated) {
    //   router.push("/");
    // }
  }, [passport, router]);

  // if (!passport?.isActivated) return null;

  return (
    <div className="min-h-[100dvh] bg-background text-ink">
      <main className="pb-[calc(var(--bottom-nav-h)+24px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
