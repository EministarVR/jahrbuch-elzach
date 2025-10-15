"use client";

import type { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import MotionFade from "./MotionFade";

type GlassCardProps = PropsWithChildren<{
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  fade?: boolean;
  delay?: number;
}>;

export default function GlassCard({
  className,
  header,
  footer,
  children,
  hover = true,
  fade = true,
  delay = 0,
}: GlassCardProps) {
  const content = (
    <div className={clsx("relative group/card rounded-[var(--radius-xl)]", className)}>
      <div
        className={clsx(
          "relative rounded-[var(--radius-xl)] overflow-hidden md:has-sheen",
          // Mobile: konsequent dunkle Surface als Basis
          "bg-[linear-gradient(145deg,rgba(28,36,52,0.96),rgba(20,27,39,0.9))] border border-slate-700/90",
          // md+: behält das Glass/Light-Design (mit Dark-Variante) für Desktop bei
          "md:bg-[linear-gradient(145deg,rgba(255,255,255,0.87),rgba(255,255,255,0.62))] md:dark:bg-[linear-gradient(145deg,rgba(36,45,63,0.85),rgba(28,36,52,0.72))] md:border-white/40 md:dark:border-white/10",
          "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.45),0_12px_30px_-6px_rgba(0,0,0,0.6)]",
          hover &&
            "transition-all duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[0_10px_26px_-6px_rgba(0,0,0,0.55),0_20px_46px_-8px_rgba(0,0,0,0.65)]"
        )}
      >
        {/* Sheen nur auf Desktop sichtbar */}
        <div className="hidden md:block absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_65%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.2),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.08),transparent_65%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.05),transparent_60%)] mix-blend-overlay" />
        {header ? <div className="px-6 pt-6 relative z-10">{header}</div> : null}
        <div className={clsx("px-6 relative z-10", header ? "pt-3" : "pt-6")}>{children}</div>
        {footer ? <div className="px-6 pb-6 pt-4 relative z-10">{footer}</div> : <div className="pb-6" />}
      </div>
    </div>
  );
  if (fade)
    return (
      <MotionFade delay={delay} className="group">
        {content}
      </MotionFade>
    );
  return <div className="group">{content}</div>;
}
