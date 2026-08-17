import { Reveal } from "@/components/motion/reveal";
import { getIcon } from "@/lib/icon-map";
import { AMENITIES } from "@/lib/site-data";

export function Amenities() {
  const highlighted = AMENITIES.filter((a) => a.highlight);
  const rest = AMENITIES.filter((a) => !a.highlight);

  return (
    <section id="amenities" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl text-sea-deep sm:text-4xl">
            Удобства
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {highlighted.map((amenity, i) => {
            const Icon = getIcon(amenity.icon);
            return (
              <Reveal
                key={amenity.label}
                delay={i * 0.06}
                className="flex flex-col items-center gap-3 rounded-2xl bg-sand/25 px-4 py-8 text-center ring-1 ring-driftwood/10"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sea-deep text-warm-white">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="font-heading text-base text-sea-deep">{amenity.label}</span>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-10 text-center text-sm leading-loose text-driftwood">
          {rest.map((a) => a.label).join(" · ")}
        </Reveal>
      </div>
    </section>
  );
}
