"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  id?: string;
}

/**
 * Fade + rise on scroll into view, once. MotionConfig(reducedMotion="user")
 * from SmoothScroll strips the transform (y) for reduced-motion users while
 * keeping the opacity fade.
 */
export function Reveal({ children, delay = 0, y = 24, duration = 0.7, className, id }: RevealProps) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
