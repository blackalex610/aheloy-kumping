import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Button } from "@/components/ui/button";
import { REVIEWS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Reviews() {
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    REVIEWS.googleMapsSearchQuery
  )}`;

  return (
    <section id="reviews" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-6 w-6",
                  i <= Math.round(REVIEWS.rating) ? "fill-olive text-olive" : "text-driftwood/25"
                )}
              />
            ))}
          </div>
          <p className="mt-4 font-heading text-4xl text-sea-deep sm:text-5xl">
            <Counter to={REVIEWS.rating} decimals={1} />
          </p>
          <p className="mt-1 text-driftwood">
            Google рейтинг · <Counter to={REVIEWS.reviewCount} suffix="+ мнения" />
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 rounded-3xl border-2 border-dashed border-driftwood/30 bg-sand/20 p-10">
          <h3 className="font-heading text-xl text-sea-deep">{REVIEWS.emptyStateTitle}</h3>
          <p className="mt-3 text-sm text-driftwood">{REVIEWS.emptyStateText}</p>
        </Reveal>

        <Reveal delay={0.25} className="mt-8">
          <Button
            asChild
            variant="outline"
            className="border-sea-deep text-sea-deep hover:bg-sea-deep hover:text-warm-white"
          >
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              {REVIEWS.ctaLabel}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
