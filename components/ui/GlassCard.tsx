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
    <div className={clsx("relative group/card rounded-3xl", className)}>
      <div
        className={clsx(
          "relative rounded-3xl overflow-hidden backdrop-blur-xl",
          // Elegantes Design mit warmen Farben
          "bg-[#fffcf8]/80 dark:bg-[#2a2520]/80",
          "border border-[#d97757]/15 dark:border-[#e89a7a]/15",
          "shadow-lg shadow-[#2a2520]/5 dark:shadow-[#e89a7a]/5",
          // Hover-Effekte
          hover &&
            "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d97757]/10 dark:hover:shadow-[#e89a7a]/10 hover:border-[#d97757]/25 dark:hover:border-[#e89a7a]/25"
        )}
      >
        {/* Subtiler Glanz-Effekt */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d97757]/5 via-transparent to-[#7a9b88]/5" />

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
  return content;
}
