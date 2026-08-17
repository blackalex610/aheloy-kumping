import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { CAMPING } from "@/lib/site-data";

export function Camping() {
  const [featured, ...rest] = CAMPING.imageSlugs.map((slug) => getImage(slug));

  return (
    <section id="camping" className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{CAMPING.title}</h2>
          <p className="mt-4 text-driftwood">{CAMPING.description}</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-sea-deep">
            {CAMPING.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-olive" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-3">
          <CinematicImage
            image={featured}
            className="aspect-[16/10] rounded-2xl"
            hoverZoom
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {rest.map((img) => (
              <CinematicImage
                key={img.slug}
                image={img}
                className="aspect-square rounded-2xl"
                hoverZoom
                sizes="(max-width: 640px) 33vw, 12vw"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
