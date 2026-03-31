import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
        tone === "neutral" && "bg-[color:rgba(44,110,96,0.1)] text-[var(--primary-strong)]",
        tone === "success" && "bg-emerald-100 text-emerald-900",
        tone === "warning" && "bg-amber-100 text-amber-900",
      )}
    >
      {children}
    </span>
  );
}
