"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { CircularGallery } from "@/components/ui/circular-gallery";
import { Lightbox } from "@/components/media/lightbox";
import { getGalleryImages, GALLERY_CATEGORIES, type ImageCategory } from "@/lib/images";
import { BUSINESS, CTA } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Gallery() {
  const [active, setActive] = useState<"all" | ImageCategory>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = useMemo(
    () => (active === "all" ? getGalleryImages() : getGalleryImages(active)),
    [active]
  );

  return (
    <section id="gallery" className="bg-sand/25 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">Галерия</h2>
          <p className="mt-2 text-sm text-sea-deep/60">Плъзни, за да завъртиш — натисни снимка за цял екран</p>
        </Reveal>

        <div role="tablist" aria-label="Категории снимки" className="mt-6 flex flex-wrap justify-center gap-2">
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

        <CircularGallery
          key={active}
          images={images}
          onImageClick={setOpenIndex}
          className="mt-10 h-[360px] sm:h-[420px]"
        />

        <AnimatePresence>
          {openIndex !== null && (
            <Lightbox
              images={images}
              index={openIndex}
              onIndexChange={setOpenIndex}
              onClose={() => setOpenIndex(null)}
            />
          )}
        </AnimatePresence>

        <Reveal className="mt-10 flex flex-col items-center gap-4">
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
