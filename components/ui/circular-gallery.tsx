"use client";

import * as React from "react";
import { CinematicImage } from "@/components/media/cinematic-image";
import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: SiteImage[];
  /** Receives the index into `images` (not the ring position). */
  onImageClick?: (index: number) => void;
  /** Degrees added per animation frame while idle. */
  autoRotateSpeed?: number;
}

const DRAG_CLICK_THRESHOLD = 6;
const SPACING = 1.12; // gap between neighboring cards, as a multiple of the minimum non-overlap distance
const MIN_ITEM_WIDTH = 132;
const MAX_ITEM_WIDTH = 420;
const MAX_RING_ITEMS = 10; // keeps the ring curated instead of crowded
const STAGE_MARGIN = 24; // breathing room between the widest card and the stage edge
const ASPECT = 0.75; // height / width (4:3)

/** Radius, as a multiple of card width, at which `n` tangent cards sit side by
 * side without their edges touching. */
const radiusFactor = (n: number) => SPACING / (2 * Math.tan(Math.PI / n));

/** Widest card that lets a ring of `n` fit inside `half` (half the stage). */
const fitWidth = (half: number, n: number) => half / (radiusFactor(n) + 0.5);

/** Picks the largest ring that still fits the stage at a legible card size, so
 * narrow screens show fewer, bigger photos instead of a clipped, overlapping pile. */
function bestCount(stageWidth: number, total: number) {
  if (total <= 1) return total;
  const half = stageWidth / 2 - STAGE_MARGIN;
  for (let n = Math.min(total, MAX_RING_ITEMS); n > 1; n--) {
    if (fitWidth(half, n) >= MIN_ITEM_WIDTH) return n;
  }
  return 1;
}

/** Evenly spreads `count` picks across `total` items, so a capped ring still
 * samples the whole category rather than just its first photos. */
function sampleEvenly(total: number, count: number) {
  if (total <= count) return Array.from({ length: total }, (_, i) => i);
  const stride = total / count;
  return Array.from({ length: count }, (_, i) => Math.floor(i * stride));
}

/** Derives a card width and ring radius that exactly fit the stage for the
 * given item count, so neighbors never overlap and the ring never needs to
 * be clipped — bigger stages get bigger cards and more spacing, together. */
function sizeForStage(stageWidth: number, n: number) {
  const half = stageWidth / 2 - STAGE_MARGIN;

  if (n <= 1) {
    const itemWidth = Math.max(MIN_ITEM_WIDTH, Math.min(MAX_ITEM_WIDTH, stageWidth * 0.4));
    return { itemWidth, itemHeight: itemWidth * ASPECT, radius: 0 };
  }

  const itemWidth = Math.max(MIN_ITEM_WIDTH, Math.min(MAX_ITEM_WIDTH, fitWidth(half, n)));
  return { itemWidth, itemHeight: itemWidth * ASPECT, radius: radiusFactor(n) * itemWidth };
}

export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ images, onImageClick, autoRotateSpeed = 0.015, className, ...props }, ref) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [stageWidth, setStageWidth] = React.useState(1200);

    React.useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width) setStageWidth(width);
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const ringIndices = React.useMemo(
      () => sampleEvenly(images.length, bestCount(stageWidth, images.length)),
      [images.length, stageWidth]
    );

    const n = ringIndices.length;
    const { itemWidth, itemHeight, radius } = sizeForStage(stageWidth, n);
    // A larger multiplier keeps the front card's perspective magnification modest
    // (~1.45x) instead of a fisheye-style blowup, which reads calmer and more premium.
    const perspective = Math.max(1200, radius * 3.2);

    const [rotation, setRotation] = React.useState(0);
    const rotationRef = React.useRef(0);
    const draggingRef = React.useRef(false);
    const hoveringRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const startRotationRef = React.useRef(0);
    const dragDistanceRef = React.useRef(0);
    const pointerDownIndexRef = React.useRef<number | null>(null);
    const rafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      const tick = () => {
        if (!draggingRef.current && !hoveringRef.current) {
          rotationRef.current += autoRotateSpeed;
          setRotation(rotationRef.current);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [autoRotateSpeed]);

    const anglePerItem = n > 0 ? 360 / n : 0;

    // Window-level listeners (attached only while a gesture is in progress)
    // instead of setPointerCapture — plays better with trackpads and avoids
    // capture edge cases where subsequent move/up events go missing.
    const cleanupDragRef = React.useRef<(() => void) | null>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      cleanupDragRef.current?.();

      draggingRef.current = true;
      startXRef.current = e.clientX;
      startRotationRef.current = rotationRef.current;
      dragDistanceRef.current = 0;
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-gallery-index]");
      pointerDownIndexRef.current = target ? Number(target.dataset.galleryIndex) : null;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startXRef.current;
        dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));
        const next = startRotationRef.current + dx * 0.3;
        rotationRef.current = next;
        setRotation(next);
      };

      const onUp = () => {
        draggingRef.current = false;
        if (dragDistanceRef.current < DRAG_CLICK_THRESHOLD && pointerDownIndexRef.current !== null) {
          onImageClick?.(pointerDownIndexRef.current);
        }
        pointerDownIndexRef.current = null;
        cleanup();
      };

      function cleanup() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        cleanupDragRef.current = null;
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      cleanupDragRef.current = cleanup;
    };

    React.useEffect(() => () => cleanupDragRef.current?.(), []);

    return (
      <div ref={wrapperRef} className={cn("w-full overflow-hidden", className)}>
        <div
          ref={ref}
          role="region"
          aria-label="Галерия със снимки — плъзни за въртене, задръж снимка за пауза"
          className="relative h-full w-full touch-pan-y select-none"
          style={{ perspective }}
          onPointerDown={handlePointerDown}
          onDragStart={(e) => e.preventDefault()}
          {...props}
        >
          <div
            className="relative mx-auto h-full w-full cursor-grab will-change-transform active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d", transform: `rotateY(${rotation}deg)` }}
          >
            {ringIndices.map((imageIndex, i) => {
              const img = images[imageIndex];
              const itemAngle = i * anglePerItem;
              const relativeAngle = (((itemAngle + rotation) % 360) + 360) % 360;
              const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
              // Cards stay fully opaque; depth reads as light falling off toward the
              // back. Opaque cards also properly hide whatever passes behind them
              // instead of letting the far side of the ring bleed through.
              const brightness = 1 - (normalizedAngle / 180) * 0.5;

              return (
                <div
                  key={img.slug}
                  data-gallery-index={imageIndex}
                  aria-label={`View ${img.alt}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onImageClick?.(imageIndex);
                  }}
                  onMouseEnter={() => {
                    hoveringRef.current = true;
                  }}
                  onMouseLeave={() => {
                    hoveringRef.current = false;
                  }}
                  className="group absolute cursor-pointer overflow-hidden rounded-3xl bg-warm-white shadow-xl ring-4 ring-warm-white transition-shadow hover:ring-sea-deep focus:outline-none focus-visible:ring-sea-deep"
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    left: "50%",
                    top: "50%",
                    marginLeft: -itemWidth / 2,
                    marginTop: -itemHeight / 2,
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    filter: `brightness(${brightness})`,
                  }}
                >
                  <CinematicImage
                    image={img}
                    className="h-full w-full"
                    imgClassName="pointer-events-none"
                    sizes={`${Math.round(itemWidth)}px`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";
