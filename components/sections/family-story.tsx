import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Counter } from "@/components/motion/counter";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { FAMILY_STORY } from "@/lib/site-data";

export function FamilyStory() {
  const image = getImage(FAMILY_STORY.imageSlug);
  const secondaryImage = getImage("terrace-gazebo-bbq");

  return (
    <section className="bg-olive/8 py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal className="relative">
          <span className="text-sm font-semibold tracking-[0.2em] text-sea-deep uppercase">Семейна история</span>
          <h2 className="mt-3 font-heading text-3xl text-sea-deep italic sm:text-4xl">{FAMILY_STORY.title}</h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-sea-deep to-transparent" aria-hidden />
          <div className="mt-6 flex flex-col gap-4 text-driftwood">
            {FAMILY_STORY.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col items-start">
              <p className="font-heading text-2xl text-sea-deep">
                <Counter to={8} suffix="+" />
              </p>
              <p className="text-sm text-sea-deep/70">години опит</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-sea-deep/30 to-transparent" aria-hidden />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -top-6 -left-6 z-10 hidden h-[220px] w-[180px] -rotate-6 overflow-hidden rounded-3xl shadow-lg ring-4 ring-warm-white sm:block lg:right-6 lg:-left-auto">
            <CinematicImage image={secondaryImage} className="h-full w-full" sizes="180px" />
          </div>
          <div className="relative ml-0 h-[420px] overflow-hidden rounded-3xl sm:ml-16 sm:h-[480px] lg:mr-16 lg:ml-0">
            <Parallax strength={10} className="absolute inset-[-8%]">
              <CinematicImage image={image} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Parallax>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
