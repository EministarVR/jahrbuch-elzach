'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
};

// Animated aurora gradient background
export default function Aurora({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.0025;
      const x = Math.sin(t) * 20;
      const y = Math.cos(t * 0.8) * 20;
      el.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        'pointer-events-none absolute inset-0 -z-20 opacity-80',
        'bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(99,102,241,0.45),transparent_60%),_radial-gradient(800px_500px_at_90%_20%,rgba(168,85,247,0.35),transparent_60%),_radial-gradient(900px_600px_at_30%_90%,rgba(56,189,248,0.30),transparent_60%)]',
        className,
      )}
      aria-hidden="true"
    />
  );
}



