"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CinematicImage } from "@/components/media/cinematic-image";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/images";
import { getIcon } from "@/lib/icon-map";
import { HERO, CTA } from "@/lib/site-data";

const SLIDE_DURATION = 6000;
const KEN_BURNS_DURATION = 12;

export function Hero() {
  const images = HERO.imageSlugs.map((slug) => getImage(slug));
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [reducedMotion, images.length]);

  const wrapperRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 32]);

  return (
    <section ref={wrapperRef} className="relative h-[140dvh]">
      <motion.div
        id="hero"
        style={reducedMotion ? undefined : { scale, opacity, borderRadius: radius }}
        className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={images[index].slug}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: reducedMotion ? 1 : 1.12 }}
                transition={{ duration: KEN_BURNS_DURATION, ease: "linear" }}
              >
                <CinematicImage
                  image={images[index]}
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="absolute inset-0"
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 46%, rgba(11,58,83,0.55), transparent 70%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl leading-tight text-warm-white italic drop-shadow-[0_2px_16px_rgba(7,30,44,0.5)] sm:text-5xl md:text-6xl">
            <SplitText text={HERO.headline} />
          </h1>

          <Reveal delay={0.6} y={16}>
            <p className="mx-auto max-w-2xl text-base text-warm-white/95 drop-shadow-[0_1px_8px_rgba(7,30,44,0.5)] sm:text-lg">
              {HERO.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.85} y={16} className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-sea-deep px-8 text-base text-warm-white hover:bg-sea-deep/90"
            >
              <a href={CTA.bookingFormHref}>{CTA.primary}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-warm-white/50 bg-warm-white/10 px-8 text-base text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
            >
              <a href={CTA.contactHref}>{CTA.secondary}</a>
            </Button>
          </Reveal>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {HERO.trustBadges.map((badge, i) => {
              const Icon = getIcon(badge.icon);
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-2 text-sm font-medium text-warm-white/95 drop-shadow-[0_1px_6px_rgba(7,30,44,0.5)]"
                >
                  <Icon className="h-4 w-4" />
                  {badge.label}
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-warm-white/80"
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
