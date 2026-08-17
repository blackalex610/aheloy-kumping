import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Counter } from "@/components/motion/counter";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { ABOUT } from "@/lib/site-data";

export function About() {
  const image = getImage(ABOUT.imageSlug);
  const secondaryImage = getImage(ABOUT.secondaryImageSlug);

  return (
    <section id="about" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <span className="text-sm font-semibold tracking-[0.2em] text-olive uppercase">За нас</span>
          <h2 className="mt-3 font-heading text-3xl text-sea-deep sm:text-4xl">{ABOUT.title}</h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-olive to-transparent" aria-hidden />
          <div className="mt-6 flex flex-col gap-4 text-driftwood">
            {ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -top-6 -left-6 z-10 hidden h-[220px] w-[180px] -rotate-6 overflow-hidden rounded-3xl shadow-lg ring-4 ring-warm-white sm:block">
            <CinematicImage image={secondaryImage} className="h-full w-full" sizes="180px" />
          </div>
          <div className="relative ml-0 h-[420px] overflow-hidden rounded-3xl sm:ml-16 sm:h-[480px]">
            <Parallax strength={10} className="absolute inset-[-8%]">
              <CinematicImage image={image} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Parallax>
          </div>
          <div className="absolute -bottom-6 right-6 z-10 flex flex-col items-center rounded-2xl bg-sea-deep px-5 py-4 text-warm-white shadow-lg sm:right-0">
            <p className="font-heading text-2xl">
              <Counter to={50} suffix=" м" />
            </p>
            <p className="text-xs text-warm-white/80">от плажа</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
