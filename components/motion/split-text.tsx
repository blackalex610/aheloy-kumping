"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Hand-rolled word-level reveal (no GSAP SplitText plugin dependency).
 * Splits on spaces rather than characters so it never breaks Cyrillic word
 * boundaries; each word masks up from its own overflow-hidden wrapper.
 *
 * inView is tracked on the untransformed outer span, not on the animated
 * word spans themselves — a word masked via transform+overflow:hidden has
 * zero effective intersection area, so it can never observe itself into view.
 */
export function SplitText({ text, className, wordClassName, delay = 0, stagger = 0.05 }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "110%" }}
            animate={isInView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.8, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
