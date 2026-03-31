import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "glass rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,247,242,0.9))] p-5 md:p-7",
        className,
      )}
    >
      {children}
    </section>
  );
}
