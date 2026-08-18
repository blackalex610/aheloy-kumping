import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { CAMPING } from "@/lib/site-data";

export function Camping() {
  const images = CAMPING.imageSlugs.map((slug) => getImage(slug));

  return (
    <section id="camping" className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="text-sm font-semibold tracking-[0.2em] text-olive uppercase">Къмпинг</span>
              <h2 className="mt-2 font-heading text-3xl text-sea-deep sm:text-4xl">{CAMPING.title}</h2>
              <div className="mt-3 h-px w-20 bg-gradient-to-r from-olive to-transparent" aria-hidden />
            </div>
            <div className="flex items-center gap-8 text-sm text-sea-deep/70 hidden sm:flex">
              <div className="flex items-center gap-2">
                <Counter to={CAMPING.imageSlugs.length} suffix="+" className="font-heading text-xl" />
                <span>реални снимки</span>
              </div>
              <span className="w-px h-6 bg-sea-deep/20" aria-hidden />
              <p>Натисни за голямо</p>
            </div>
          </div>
          <p className="text-driftwood max-w-2xl">{CAMPING.description}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <CinematicImage
              image={images[0]}
              className="h-full w-full"
              hoverZoom
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img) => (
                <div key={img.slug} className="relative rounded-2xl overflow-hidden group">
                  <CinematicImage
                    image={img}
                    className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-sea-deep/10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-sea-deep/60">
                <span className="flex items-center gap-1.5 font-medium text-sea-deep">
                  Всички снимки са реални снимки на местата и територията
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
