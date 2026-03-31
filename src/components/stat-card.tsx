import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}

export function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <Card className="rounded-[28px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,241,0.92))]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">{value}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{helper}</p>
        </div>
        <div className="rounded-[20px] bg-[color:rgba(44,110,96,0.1)] px-4 py-3 text-xl shadow-sm">{icon}</div>
      </div>
    </Card>
  );
}
