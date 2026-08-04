import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { getIcon } from "@/lib/icon-map";
import { NEARBY } from "@/lib/site-data";

export function Nearby() {
  return (
    <section className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{NEARBY.title}</h2>
          <p className="mt-3 text-driftwood">{NEARBY.text}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {NEARBY.distances.map((d, i) => {
            const Icon = getIcon(d.icon);
            return (
              <Reveal key={d.label} delay={i * 0.06} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-6 w-6 text-olive" />
                <p className="font-heading text-2xl text-sea-deep">
                  <Counter to={d.distance} suffix={` ${d.unit}`} />
                </p>
                <p className="text-sm text-driftwood">{d.label}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
