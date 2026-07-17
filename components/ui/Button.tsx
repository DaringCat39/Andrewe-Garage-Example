import Link from "next/link";
import { type MouseEventHandler, type ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const variants = {
  primary:
    "bg-accent text-white shadow-[0_8px_24px_rgba(232,93,40,0.2)] hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_12px_30px_rgba(232,93,40,0.28)] active:translate-y-0 active:scale-[0.98] focus-visible:ring-accent/40",
  secondary:
    "border border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-surface-muted active:translate-y-0 active:scale-[0.98] focus-visible:ring-accent/30",
  ghost:
    "text-foreground hover:text-accent focus-visible:ring-accent/30",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
