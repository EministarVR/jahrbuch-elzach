import MotionFade from "./MotionFade";
import { BookOpen } from "lucide-react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type FancyHeadingProps = PropsWithChildren<{
  subtitle?: string;
  icon?: boolean;
  center?: boolean;
  className?: string;
}>;

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
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
            <BookOpen className="h-5 w-5" />
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
            "mt-2 max-w-prose text-sm sm:text-base text-[#b8aea5]",
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
