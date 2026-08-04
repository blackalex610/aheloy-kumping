import { Reveal } from "@/components/motion/reveal";
import { getIcon } from "@/lib/icon-map";
import { QUICK_FACTS } from "@/lib/site-data";

export function QuickFacts() {
  return (
    <section className="bg-warm-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-2xl text-sea-deep sm:text-3xl">
            {QUICK_FACTS.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_FACTS.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal key={item.title} delay={i * 0.08} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand/50 text-sea-deep">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-heading text-lg text-sea-deep">{item.title}</h3>
                <p className="text-sm text-driftwood">{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
