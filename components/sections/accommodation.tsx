"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Reveal } from "@/components/motion/reveal";
import { getImage } from "@/lib/images";
import { ACCOMMODATION, ACCOMMODATION_SECTION, CTA, type AccommodationUnit } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function AccommodationCard({ unit }: { unit: AccommodationUnit }) {
  const image = getImage(unit.imageSlug);
  const bookingHref = `/?unit=${encodeURIComponent(unit.name)}#booking`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-driftwood/10 transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/bungala/${unit.slug}`} className="absolute inset-0 z-10" aria-label={`Виж повече за ${unit.name}`} />
      <div className="relative">
        <CinematicImage
          image={image}
          className="aspect-[4/3]"
          hoverZoom
          sizes="(max-width: 1024px) 100vw, 380px"
        />
        <span className="absolute top-4 left-4 rounded-full bg-warm-white/90 px-3 py-1 text-xs font-semibold text-sea-deep backdrop-blur-sm">
          {unit.capacity}
        </span>
        {unit.isPlaceholderImage && (
          <span className="absolute right-4 bottom-4 rounded-full bg-driftwood/80 px-3 py-1 text-xs font-medium text-warm-white backdrop-blur-sm">
            Илюстративна снимка
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-heading text-xl text-sea-deep">{unit.name}</h3>
          <p className="mt-1 font-heading text-lg text-olive">{unit.priceLabel}</p>
        </div>
        <ul className="flex flex-1 flex-col gap-1.5 text-sm text-driftwood">
          {unit.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
              {f}
            </li>
          ))}
        </ul>
        <Button asChild className="relative z-20 mt-2 bg-sea-deep text-warm-white hover:bg-sea-deep/90">
          <a href={bookingHref}>{CTA.primary}</a>
        </Button>
      </div>
    </div>
  );
}

export function Accommodation() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnhanced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - pin.clientWidth;
      if (distance <= 40) return;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=88",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, [enhanced]);

  return (
    <section id="accommodation" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{ACCOMMODATION_SECTION.title}</h2>
          <p className="mt-3 text-driftwood">{ACCOMMODATION_SECTION.subtitle}</p>
        </Reveal>
      </div>

      <div ref={pinRef} className="mt-14 overflow-hidden">
        <div
          ref={trackRef}
          className={cn(
            "gap-6 px-6 sm:grid-cols-2 lg:gap-8 lg:px-[6vw]",
            enhanced ? "flex" : "grid grid-cols-1 lg:grid-cols-4"
          )}
        >
          {ACCOMMODATION.map((unit, i) => (
            <Reveal
              key={unit.slug}
              delay={i * 0.06}
              className={enhanced ? "w-[340px] shrink-0 sm:w-[380px]" : ""}
            >
              <AccommodationCard unit={unit} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
