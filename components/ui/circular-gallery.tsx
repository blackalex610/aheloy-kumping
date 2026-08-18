"use client";

import * as React from "react";
import { CinematicImage } from "@/components/media/cinematic-image";
import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: SiteImage[];
  onImageClick?: (index: number) => void;
  /** Degrees added per animation frame while idle. */
  autoRotateSpeed?: number;
}

const DRAG_CLICK_THRESHOLD = 6;
/** How much a released "throw" slows down each frame — closer to 1 spins longer. */
const FRICTION = 0.985;
const MAX_FLING_SPEED = 14;

/** Card size for a given stage width — bigger stages get bigger cards, so the
 * ring visibly grows to fill wide viewports instead of just spacing out more. */
function sizeForStage(stageWidth: number) {
  if (stageWidth < 480) return { itemWidth: 190, itemHeight: 143 };
  if (stageWidth < 768) return { itemWidth: 250, itemHeight: 188 };
  if (stageWidth < 1200) return { itemWidth: 320, itemHeight: 240 };
  return { itemWidth: 380, itemHeight: 285 };
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

    const { itemWidth, itemHeight } = sizeForStage(stageWidth);

    const [rotation, setRotation] = React.useState(0);
    const rotationRef = React.useRef(0);
    const draggingRef = React.useRef(false);
    const hoveringRef = React.useRef(false);
    const velocityRef = React.useRef(0);
    const startXRef = React.useRef(0);
    const startRotationRef = React.useRef(0);
    const dragDistanceRef = React.useRef(0);
    const lastMoveTimeRef = React.useRef(0);
    const lastMoveRotationRef = React.useRef(0);
    const pointerDownIndexRef = React.useRef<number | null>(null);
    const rafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      const tick = () => {
        if (draggingRef.current || hoveringRef.current) {
          // paused — leave rotation exactly where it is
        } else if (Math.abs(velocityRef.current) > 0.03) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
          setRotation(rotationRef.current);
        } else {
          velocityRef.current = 0;
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

    const n = images.length;
    const anglePerItem = n > 0 ? 360 / n : 0;
    const maxRadius = Math.max(200, stageWidth / 2 - itemWidth / 2 - 24);
    const radius =
      n > 1
        ? Math.min(Math.max((itemWidth / (2 * Math.tan(Math.PI / n))) * 1.3, itemWidth * 0.9), maxRadius)
        : 0;
    // A larger multiplier keeps the front card's perspective magnification modest
    // (~1.45x) instead of a fisheye-style blowup, which reads calmer and more premium.
    const perspective = Math.max(1200, radius * 3.2);

    // Window-level listeners (attached only while a gesture is in progress)
    // instead of setPointerCapture — plays better with trackpads and avoids
    // capture edge cases where subsequent move/up events go missing.
    const cleanupDragRef = React.useRef<(() => void) | null>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      cleanupDragRef.current?.();

      draggingRef.current = true;
      velocityRef.current = 0;
      startXRef.current = e.clientX;
      startRotationRef.current = rotationRef.current;
      dragDistanceRef.current = 0;
      lastMoveTimeRef.current = performance.now();
      lastMoveRotationRef.current = rotationRef.current;
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-gallery-index]");
      pointerDownIndexRef.current = target ? Number(target.dataset.galleryIndex) : null;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startXRef.current;
        dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));
        const next = startRotationRef.current + dx * 0.3;
        rotationRef.current = next;
        setRotation(next);

        const now = performance.now();
        const dt = now - lastMoveTimeRef.current;
        if (dt > 8) {
          const dRot = next - lastMoveRotationRef.current;
          velocityRef.current = Math.max(-MAX_FLING_SPEED, Math.min(MAX_FLING_SPEED, (dRot / dt) * 16.67));
          lastMoveTimeRef.current = now;
          lastMoveRotationRef.current = next;
        }
      };

      const onUp = () => {
        draggingRef.current = false;
        if (dragDistanceRef.current < DRAG_CLICK_THRESHOLD && pointerDownIndexRef.current !== null) {
          onImageClick?.(pointerDownIndexRef.current);
          velocityRef.current = 0;
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
          aria-label="Галерия със снимки — плъзни или замахни за въртене, задръж снимка за пауза"
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
            {images.map((img, i) => {
              const itemAngle = i * anglePerItem;
              const relativeAngle = (((itemAngle + rotation) % 360) + 360) % 360;
              const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
              const opacity = Math.max(0.15, 1 - normalizedAngle / 140);

              return (
                <div
                  key={img.slug}
                  data-gallery-index={i}
                  aria-label={`View ${img.alt}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onImageClick?.(i);
                  }}
                  onMouseEnter={() => {
                    hoveringRef.current = true;
                  }}
                  onMouseLeave={() => {
                    hoveringRef.current = false;
                  }}
                  className="group absolute cursor-pointer overflow-hidden rounded-3xl shadow-xl ring-4 ring-warm-white transition-shadow hover:ring-sea-deep focus:outline-none focus-visible:ring-sea-deep"
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    left: "50%",
                    top: "50%",
                    marginLeft: -itemWidth / 2,
                    marginTop: -itemHeight / 2,
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    opacity,
                  }}
                >
                  <CinematicImage
                    image={img}
                    className="h-full w-full"
                    imgClassName="pointer-events-none"
                    sizes={`${itemWidth}px`}
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
