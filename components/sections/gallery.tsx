"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Lightbox } from "@/components/media/lightbox";
import { getGalleryImages, GALLERY_CATEGORIES, type ImageCategory } from "@/lib/images";
import { BUSINESS, CTA } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Gallery pagination" className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "w-10 h-10 rounded-lg text-sm font-medium transition-all",
              page === currentPage
                ? "bg-sea-deep text-warm-white shadow-sm"
                : "bg-warm-white text-sea-deep hover:bg-sand/60 hover:text-sea-deep/80"
            )}
          >
            {page}
          </button>
        ))}
      </div>
      <p className="text-xs text-sea-deep/60 text-center">
        Страница {currentPage} от {totalPages}
      </p>
    </nav>
  );
}

export function Gallery() {
  const [active, setActive] = useState<"all" | ImageCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const allImages = useMemo(
    () => (active === "all" ? getGalleryImages() : getGalleryImages(active)),
    [active]
  );
  const totalPages = Math.ceil(allImages.length / PAGE_SIZE);
  const images = useMemo(
    () => allImages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [allImages, currentPage]
  );

  const handleTabChange = (value: "all" | ImageCategory) => {
    setActive(value);
    setCurrentPage(1);
  };

  const handleImageClick = (index: number) => {
    setOpenIndex(index);
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

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-6"
        />

        <motion.div layout className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {images.map((img, i) => (
              <motion.div
                key={img.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  type="button"
                  onClick={() => handleImageClick(i)}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-sea-deep focus:ring-offset-2"
                  aria-label={`View ${img.alt}`}
                >
                  <CinematicImage
                    image={img}
                    className="h-full w-full"
                    hoverZoom
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
