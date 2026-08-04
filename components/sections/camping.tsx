import { ImageOff, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { CAMPING } from "@/lib/site-data";

export function Camping() {
  const image = getImage(CAMPING.imageSlugs[0]);

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

        <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
          <CinematicImage
            image={image}
            className="col-span-2 aspect-square rounded-2xl sm:col-span-1"
            hoverZoom
            sizes="(max-width: 640px) 100vw, 25vw"
          />
          <div className="col-span-2 flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-driftwood/40 bg-warm-white/60 p-6 text-center sm:col-span-1">
            <ImageOff className="h-8 w-8 text-driftwood/60" aria-hidden />
            <p className="text-sm text-driftwood">{CAMPING.placeholder}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
