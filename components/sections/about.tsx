import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { ABOUT } from "@/lib/site-data";

export function About() {
  const image = getImage(ABOUT.imageSlug);

  return (
    <section id="about" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{ABOUT.title}</h2>
          <div className="mt-6 flex flex-col gap-4 text-driftwood">
            {ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative h-[420px] overflow-hidden rounded-3xl sm:h-[480px]">
          <Parallax strength={10} className="absolute inset-[-8%]">
            <CinematicImage image={image} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
