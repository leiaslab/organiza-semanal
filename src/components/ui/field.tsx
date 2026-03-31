import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2.5 text-sm text-[var(--muted)]">
      <span className="text-sm font-semibold tracking-[0.01em] text-[var(--text)]">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3.5 text-sm text-[var(--text)] shadow-sm outline-none transition placeholder:text-[var(--muted)]/70 focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:rgba(44,110,96,0.12)]",
        props.className,
      )}
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3.5 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:rgba(44,110,96,0.12)]",
        props.className,
      )}
      {...props}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[22px] border border-[var(--border)] bg-white px-4 py-3.5 text-sm text-[var(--text)] shadow-sm outline-none transition placeholder:text-[var(--muted)]/70 focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:rgba(44,110,96,0.12)]",
        props.className,
      )}
      {...props}
    />
  );
}
