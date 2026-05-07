import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/layout/BottomNav";
import { usePassportStore } from "@/store/passport.store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const passport = usePassportStore((s) => s.passport);
  if (!passport?.isActivated) return <Navigate to="/" />;

  return (
    <div className="min-h-[100dvh] bg-background text-ink">
      <main className="pb-[calc(var(--bottom-nav-h)+24px+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
