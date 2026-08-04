import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@/lib/images";

interface CinematicImageProps {
  image: SiteImage;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  /** wrapper needs relative positioning + explicit size (aspect-ratio class, fixed height, or `fill` parent) */
  className?: string;
  imgClassName?: string;
  grain?: boolean;
  vignette?: boolean;
  scrim?: boolean;
  /** enable the group-hover zoom; pair with `group` on an ancestor */
  hoverZoom?: boolean;
}

/**
 * Single visual-treatment layer used across every photo on the site: a warm
 * cinematic grade + vignette + film grain, so 22 mismatched phone photos read
 * as one intentional set. See app/globals.css for the overlay utilities.
 */
export function CinematicImage({
  image,
  sizes = "100vw",
  priority,
  fetchPriority,
  className,
  imgClassName,
  grain = true,
  vignette = true,
  scrim = true,
  hoverZoom = false,
}: CinematicImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        style={{
          objectFit: "cover",
          objectPosition: image.objectPosition,
          filter: "saturate(0.88) contrast(1.06) sepia(0.10)",
        }}
        className={cn(
          "duration-[600ms] ease-out",
          hoverZoom && "transition-transform group-hover:scale-[1.04]",
          imgClassName
        )}
      />
      {scrim && <div className="cinematic-scrim" aria-hidden />}
      {vignette && <div className="vignette-overlay" aria-hidden />}
      {grain && <div className="grain-overlay" aria-hidden />}
    </div>
  );
}
