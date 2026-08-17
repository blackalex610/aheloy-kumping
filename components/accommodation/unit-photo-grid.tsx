"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Lightbox } from "@/components/media/lightbox";
import type { SiteImage } from "@/lib/images";

export function UnitPhotoGrid({ images }: { images: SiteImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((img, i) => (
          <button key={img.slug} type="button" onClick={() => setOpenIndex(i)} className="group">
            <CinematicImage
              image={img}
              className="aspect-[4/3] rounded-2xl"
              hoverZoom
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
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
    </>
  );
}
