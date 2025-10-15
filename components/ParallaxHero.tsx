"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
  className?: string;
  eyebrow?: string;
};

export default function ParallaxHero({
  title,
  subtitle,
  cta,
  className,
  eyebrow,
}: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // skip parallax
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${Math.min(y * 0.18, 100)}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={clsx(
        "relative h-[60svh] sm:h-[70svh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900",
        className
      )}
    >
      <div className="hidden md:block absolute inset-0 -z-10 overflow-hidden">
        <div ref={layerRef} className="parallax-layer h-full w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(90,104,255,0.14),transparent_65%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-indigo-100/50 via-transparent to-transparent dark:from-indigo-900/25" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 0.84, 0.44, 1] }}
        className="rounded-[2rem] shadow-[0_6px_22px_-8px_rgba(15,23,42,0.35),0_18px_48px_-10px_rgba(15,23,42,0.25)] px-7 sm:px-14 py-10 sm:py-16 text-center max-w-4xl mx-auto relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 md:backdrop-blur-2xl md:bg-[rgba(255,255,255,0.72)] md:dark:bg-[rgba(25,32,46,0.72)] md:border md:border-white/50 md:dark:border-white/10"
      >
        <div className="hidden md:block pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.65),transparent_65%)] dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.09),transparent_65%)] mix-blend-overlay" />
        {eyebrow && (
          <div className="relative z-10 text-xs font-medium tracking-wider uppercase text-indigo-600/80 mb-4">
            {eyebrow}
          </div>
        )}
        <h1 className="relative z-10 font-display text-gradient text-3xl sm:text-5xl font-semibold leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="relative z-10 text-base-muted dark:text-slate-200 mt-5 max-w-2xl mx-auto text-sm sm:text-base tracking-[0.01em]">
            {subtitle}
          </p>
        ) : null}
        {cta ? (
          <div className="relative z-10 mt-8 flex flex-wrap gap-4 justify-center">
            {cta}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}
