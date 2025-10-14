'use client';

import { useRef } from 'react';
import clsx from 'clsx';

type Props = React.PropsWithChildren<{ className?: string }>;

export default function TiltCard({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -10; // tilt X
    const ry = (px - 0.5) * 10;  // tilt Y
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={clsx('transition-transform duration-200 will-change-transform', className)}
    >
      {children}
    </div>
  );
}



