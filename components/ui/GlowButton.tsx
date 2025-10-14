"use client";

import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type BaseProps = {
  className?: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
};

type ButtonAsButton = BaseProps & {
  as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonAsAnchor = BaseProps & {
  as: "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;
type Props = ButtonAsButton | ButtonAsAnchor;

export default function GlowButton({
  className,
  children,
  as = "button",
  loading,
  variant = "primary",
  iconLeft,
  iconRight,
  ...rest
}: Props) {
  const styles: Record<string, string> = {
    primary: [
      "bg-gradient-to-b from-indigo-600 to-indigo-700",
      "hover:from-indigo-500 hover:to-indigo-600",
      "text-white shadow-md shadow-indigo-700/30 dark:shadow-indigo-500/30",
    ].join(" "),
    secondary: [
      "bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.82))]",
      "hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,255,255,0.9))]",
      "text-slate-900 ring-1 ring-slate-200 dark:bg-[linear-gradient(145deg,rgba(46,56,74,.9),rgba(40,49,66,.85))] dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-[linear-gradient(145deg,rgba(52,63,82,.95),rgba(46,56,74,.9))]",
    ].join(" "),
    ghost:
      "bg-transparent hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-400/15",
    gradient: [
      "relative text-white",
      "bg-[linear-gradient(135deg,#6366f1_0%,#6d5ff5_22%,#7c60f4_45%,#5b8ef5_70%,#3aa6ff_100%)]",
      "shadow-[0_4px_14px_-4px_rgba(79,70,229,0.45),0_10px_28px_-6px_rgba(56,189,248,0.35)]",
      "hover:shadow-[0_6px_18px_-4px_rgba(79,70,229,0.55),0_16px_36px_-8px_rgba(56,189,248,0.45)]",
      "before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
      "before:bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.55),rgba(255,255,255,0)_55%),radial-gradient(circle_at_75%_85%,rgba(255,255,255,0.35),rgba(255,255,255,0)_65%)]",
      "after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-white/30 after:dark:border-white/10",
    ].join(" "),
  };
  const base = clsx(
    "group inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-3 font-medium select-none",
    "transition-all duration-400 ease-[var(--ease-emphasized)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70",
    "active:scale-[.97]",
    styles[variant],
    variant === "primary" && "hover:translate-y-[-2px] active:translate-y-0",
    variant === "gradient" &&
      "hover:translate-y-[-3px] active:translate-y-0 has-sheen",
    className,
    loading && "cursor-not-allowed opacity-80"
  );
  if (as === "a") {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={base} {...anchorProps}>
        {iconLeft}
        <span className="relative flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{children}</span>
        </span>
        {iconRight}
      </a>
    );
  }
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={base}
      {...buttonProps}
      disabled={loading || buttonProps.disabled}
    >
      {iconLeft}
      <span className="relative flex items-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{children}</span>
      </span>
      {iconRight}
    </button>
  );
}
