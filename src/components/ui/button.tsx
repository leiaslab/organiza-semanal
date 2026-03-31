import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-[20px] px-5 py-3 text-sm font-semibold tracking-[0.01em] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[linear-gradient(180deg,var(--primary),var(--primary-strong))] text-white shadow-[0_14px_28px_rgba(44,110,96,0.18)]",
        variant === "secondary" && "bg-[var(--secondary)] text-[var(--text)] shadow-sm",
        variant === "ghost" && "border border-[var(--border)] bg-white/90 text-[var(--text)] shadow-sm",
        variant === "danger" && "bg-[linear-gradient(180deg,#d96a6a,#cf4d4d)] text-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
