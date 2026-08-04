import { Reveal } from "@/components/motion/reveal";
import { getIcon } from "@/lib/icon-map";
import { WHY_CHOOSE_US } from "@/lib/site-data";

export function WhyChooseUs() {
  return (
    <section className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl text-sea-deep sm:text-4xl">
            {WHY_CHOOSE_US.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.cards.map((card, i) => {
            const Icon = getIcon(card.icon);
            return (
              <Reveal
                key={card.title}
                delay={i * 0.1}
                className="flex flex-col gap-4 rounded-3xl bg-card p-8 shadow-sm ring-1 ring-driftwood/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-deep text-warm-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-olive uppercase">{card.title}</span>
                <h3 className="font-heading text-xl text-sea-deep">{card.headline}</h3>
                <p className="text-sm text-driftwood">{card.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
