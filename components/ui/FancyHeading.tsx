import MotionFade from "./MotionFade";
import { Sparkles } from "lucide-react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface FancyHeadingProps
  extends PropsWithChildren<{
    subtitle?: string;
    icon?: boolean;
    center?: boolean;
    className?: string;
  }> {}

export default function FancyHeading({
  children,
  subtitle,
  icon = true,
  center,
  className,
}: FancyHeadingProps) {
  return (
    <div className={clsx("mb-8", center && "text-center", className)}>
      <MotionFade className="inline-flex items-center gap-2">
        {icon && (
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
            <Sparkles className="h-5 w-5" />
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/30 via-transparent to-transparent animate-pulse opacity-40" />
          </span>
        )}
        <h2 className="font-display text-gradient text-2xl sm:text-3xl font-semibold tracking-tight">
          {children}
        </h2>
      </MotionFade>
      {subtitle && (
        <MotionFade
          delay={0.08}
          className={clsx(
            "mt-2 max-w-prose text-sm sm:text-base text-slate-600 dark:text-slate-300",
            center && "mx-auto"
          )}
        >
          {subtitle}
        </MotionFade>
      )}
      <div className="divider-gradient mt-6" />
    </div>
  );
}
