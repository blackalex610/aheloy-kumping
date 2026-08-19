import { Quote, Star } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <Reveal>
          <div className="flex items-center justify-center gap-1">
            {/* Visual illustration only — shown as 4.5 stars regardless of the exact
                average below, since a half-empty last star reads as more generous. */}
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-6 w-6 fill-olive text-olive" />
            ))}
            <div className="relative h-6 w-6">
              <Star className="absolute inset-0 h-6 w-6 text-driftwood/25" />
              <div className="absolute inset-0 h-6 w-3 overflow-hidden">
                <Star className="h-6 w-6 fill-olive text-olive" />
              </div>
            </div>
          </div>
          <p className="mt-4 font-heading text-4xl text-sea-deep sm:text-5xl">
            <Counter to={REVIEWS.rating} decimals={1} />
          </p>
          <p className="mt-1 text-driftwood">
            Google рейтинг · <Counter to={REVIEWS.reviewCount} suffix="+ мнения" />
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.list.map((review, i) => (
            <Reveal
              key={review.author}
              delay={(i % 4) * 0.06}
              className="flex flex-col gap-3 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-driftwood/10"
            >
              <Quote className="h-5 w-5 text-olive/50" aria-hidden />
              <p className="flex-1 text-sm text-driftwood">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between border-t border-driftwood/10 pt-3">
                <div>
                  <p className="text-sm font-semibold text-sea-deep">{review.author}</p>
                  <p className="text-xs text-driftwood/70">
                    {review.source} · {review.timeLabel}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn("h-3.5 w-3.5", i <= review.rating ? "fill-olive text-olive" : "text-driftwood/25")}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="mt-10">
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
