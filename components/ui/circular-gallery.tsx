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
  itemWidth?: number;
  itemHeight?: number;
}

const DRAG_CLICK_THRESHOLD = 6;

export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ images, onImageClick, autoRotateSpeed = 0.015, itemWidth = 300, itemHeight = 225, className, ...props }, ref) => {
    const [rotation, setRotation] = React.useState(0);
    const rotationRef = React.useRef(0);
    const draggingRef = React.useRef(false);
    const hoveringRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const startRotationRef = React.useRef(0);
    const dragDistanceRef = React.useRef(0);
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

    const n = images.length;
    const anglePerItem = n > 0 ? 360 / n : 0;
    // Radius grows with item count so neighbors never overlap; perspective scales
    // with it too, so translateZ never approaches the projection plane (which is
    // what makes a card blow up to a distorted, screen-filling size).
    const radius = n > 1 ? Math.max((itemWidth / (2 * Math.tan(Math.PI / n))) * 1.3, itemWidth * 0.9) : 0;
    // A larger multiplier keeps the front card's perspective magnification modest
    // (~1.45x) instead of a fisheye-style blowup, which reads calmer and more premium.
    const perspective = Math.max(1200, radius * 3.2);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      startXRef.current = e.clientX;
      startRotationRef.current = rotationRef.current;
      dragDistanceRef.current = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));
      const next = startRotationRef.current + dx * 0.3;
      rotationRef.current = next;
      setRotation(next);
    };

    const handlePointerUp = () => {
      draggingRef.current = false;
    };

    return (
      <div
        className={cn("w-full overflow-hidden", className)}
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          ref={ref}
          role="region"
          aria-label="Галерия със снимки — плъзни за въртене, задръж за пауза"
          className="relative h-full w-full touch-pan-y select-none"
          style={{ perspective }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={() => {
            hoveringRef.current = true;
          }}
          onMouseLeave={() => {
            hoveringRef.current = false;
          }}
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
              const opacity = Math.max(0.35, 1 - normalizedAngle / 180);

              return (
                <button
                  key={img.slug}
                  type="button"
                  onClick={() => {
                    if (dragDistanceRef.current < DRAG_CLICK_THRESHOLD) onImageClick?.(i);
                  }}
                  aria-label={`View ${img.alt}`}
                  className="group absolute overflow-hidden rounded-3xl shadow-xl ring-4 ring-warm-white transition-shadow hover:ring-sea-deep focus:outline-none focus-visible:ring-sea-deep"
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";
