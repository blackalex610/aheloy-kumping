import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { FAMILY_STORY } from "@/lib/site-data";

export function FamilyStory() {
  const image = getImage(FAMILY_STORY.imageSlug);

  return (
    <section className="bg-olive/8 py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal className="order-2 relative h-[420px] overflow-hidden rounded-3xl sm:h-[480px] lg:order-1">
          <Parallax strength={10} className="absolute inset-[-8%]">
            <CinematicImage image={image} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
          </Parallax>
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2">
          <h2 className="font-heading text-3xl text-sea-deep italic sm:text-4xl">{FAMILY_STORY.title}</h2>
          <div className="mt-6 flex flex-col gap-4 text-driftwood">
            {FAMILY_STORY.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
