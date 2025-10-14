"use client";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, PropsWithChildren, HTMLAttributes } from "react";

type MotionFadeProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

const MotionFade = forwardRef<HTMLDivElement, MotionFadeProps>(
  function MotionFade({ delay = 0, y = 18, children, ...rest }, ref) {
    const reduce = useReducedMotion();
    const initial = reduce ? { opacity: 0 } : { opacity: 0, y };
    const animate = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
    return (
      <motion.div
        ref={ref}
        initial={initial}
        whileInView={animate}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: [0.16, 0.84, 0.44, 1], delay }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

export default MotionFade;
