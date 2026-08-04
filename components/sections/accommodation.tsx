"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Reveal } from "@/components/motion/reveal";
import { getImage } from "@/lib/images";
import { ACCOMMODATION, CTA, type AccommodationUnit } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function AccommodationCard({ unit }: { unit: AccommodationUnit }) {
  const image = getImage(unit.imageSlug);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-driftwood/10 transition-shadow duration-300 hover:shadow-lg">
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
        <Button asChild className="mt-2 bg-sea-deep text-warm-white hover:bg-sea-deep/90">
          <a href={CTA.bookingFormHref}>{CTA.primary}</a>
        </Button>
      </div>
    </div>
  );
}

export function Accommodation() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  // decide once, client-side, whether the pinned horizontal-scroll enhancement applies
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnhanced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // only runs after `enhanced` flips true and the flex-row layout has committed,
  // so scrollWidth/clientWidth measurements below are accurate
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
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">Нашите бунгала</h2>
          <p className="mt-3 text-driftwood">Изберете настаняването, което пасва на вашето семейство.</p>
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
