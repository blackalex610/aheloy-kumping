import { Reveal } from "@/components/motion/reveal";
import { getIcon } from "@/lib/icon-map";
import { AMENITIES } from "@/lib/site-data";

export function Amenities() {
  return (
    <section id="amenities" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl text-sea-deep sm:text-4xl">
            Удобства
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {AMENITIES.map((amenity, i) => {
            const Icon = getIcon(amenity.icon);
            return (
              <Reveal
                key={amenity.label}
                delay={(i % 7) * 0.04}
                className="flex flex-col items-center gap-3 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand/50 text-sea-deep">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-medium text-sea-deep">{amenity.label}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
