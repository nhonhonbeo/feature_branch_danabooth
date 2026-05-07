"use client";

import { useRouter } from "next/navigation";
import { QrScanner } from "@/components/features/QrScanner";
import { TopBar } from "@/components/layout/TopBar";
import { usePassportStore } from "@/store/passport.store";



export default function ActivateScan() {
  const nav = useRouter();
  const activate = usePassportStore((s) => s.activate);

  const onResult = (code: string) => {
    activate(code);
    nav.push("");
  };

  return (
    <div className="fixed inset-0 bg-black z-40">
      <div className="absolute top-0 inset-x-0 z-30">
        <TopBar back transparent right={null} />
      </div>
      <QrScanner onResult={onResult} />
    </div>
  );
}


