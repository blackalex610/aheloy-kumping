"use client";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CinematicImage } from "@/components/media/cinematic-image";
import type { SiteImage } from "@/lib/images";

interface LightboxProps {
  images: SiteImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Fullscreen photo viewer: Esc to close, arrow keys / on-screen buttons to navigate. */
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  const image = images[index];
  if (!image) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-sea-deep/95 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative h-full max-h-[80vh] w-full max-w-4xl"
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CinematicImage
          image={image}
          className="h-full w-full rounded-2xl"
          vignette={false}
          scrim={false}
          sizes="90vw"
        />
      </motion.div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
        aria-label="Затвори"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
        aria-label="Предишна снимка"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
        aria-label="Следваща снимка"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-warm-white/80">
        {index + 1} / {images.length}
      </p>
    </motion.div>
  );
}
