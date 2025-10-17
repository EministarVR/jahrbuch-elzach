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
    if (mq.matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${Math.min(y * 0.15, 80)}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={clsx(
        "relative min-h-[75vh] flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3]",
        "dark:bg-gradient-to-br dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714]",
        className
      )}
    >
      {/* Subtile Hintergrundeffekte */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={layerRef} className="parallax-layer h-full w-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d97757]/8 dark:bg-[#e89a7a]/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-[#7a9b88]/6 dark:bg-[#8faf9d]/5 rounded-full blur-3xl" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1] }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20"
      >
        {eyebrow && (
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#d97757]/10 dark:bg-[#e89a7a]/10 border border-[#d97757]/20 dark:border-[#e89a7a]/20">
            <span className="text-xs font-medium tracking-wide uppercase text-[#d97757] dark:text-[#e89a7a]">
              {eyebrow}
            </span>
          </div>
        )}

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6">
          <span className="text-gradient">{title}</span>
        </h1>

        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-[#6b635a] dark:text-[#b8aea5] leading-relaxed max-w-2xl mx-auto mb-10">
            {subtitle}
          </p>
        )}

        {cta && (
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {cta}
          </div>
        )}
      </motion.div>
    </section>
  );
}
