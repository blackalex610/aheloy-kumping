"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Lightbox } from "@/components/media/lightbox";
import { getGalleryImages, GALLERY_CATEGORIES, type ImageCategory } from "@/lib/images";
import { BUSINESS, CTA } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Gallery() {
  const [active, setActive] = useState<"all" | ImageCategory>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const images = useMemo(
    () => (active === "all" ? getGalleryImages() : getGalleryImages(active)),
    [active]
  );

  const handleTabChange = (value: "all" | ImageCategory) => {
    setActive(value);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const scrollByAmount = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

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
              onClick={() => handleTabChange(cat.value)}
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

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Предишни снимки"
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white text-sea-deep shadow-md hover:bg-sand/60 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {images.map((img, i) => (
                <motion.div
                  key={img.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 snap-start"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="group relative block h-[300px] w-[225px] overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-sea-deep focus:ring-offset-2 sm:h-[360px] sm:w-[270px]"
                    aria-label={`View ${img.alt}`}
                  >
                    <CinematicImage
                      image={img}
                      className="h-full w-full"
                      hoverZoom
                      sizes="270px"
                    />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Следващи снимки"
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-warm-white text-sea-deep shadow-md hover:bg-sand/60 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

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
