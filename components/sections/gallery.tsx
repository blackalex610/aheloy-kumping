"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getGalleryImages, GALLERY_CATEGORIES, type ImageCategory } from "@/lib/images";
import { BUSINESS, CTA } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Gallery() {
  const [active, setActive] = useState<"all" | ImageCategory>("all");
  const images = active === "all" ? getGalleryImages() : getGalleryImages(active);

  return (
    <section id="gallery" className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">Галерия</h2>
        </Reveal>

        <div role="tablist" aria-label="Категории снимки" className="mt-8 flex flex-wrap justify-center gap-2">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={active === cat.value}
              onClick={() => setActive(cat.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active === cat.value
                  ? "bg-sea-deep text-warm-white"
                  : "bg-warm-white text-sea-deep hover:bg-sand/60"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <CinematicImage
                  image={img}
                  className="aspect-[3/4] rounded-2xl"
                  hoverZoom
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-12 flex flex-col items-center gap-4">
          <a
            href={BUSINESS.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sea-deep underline underline-offset-4 hover:text-olive"
          >
            Виж повече снимки във Facebook
          </a>
          <Button asChild className="bg-sea-deep text-warm-white hover:bg-sea-deep/90">
            <a href={CTA.bookingFormHref}>{CTA.primary}</a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
