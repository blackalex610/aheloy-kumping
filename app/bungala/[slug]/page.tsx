import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Phone } from "lucide-react";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { UnitPhotoGrid } from "@/components/accommodation/unit-photo-grid";
import { getImage, getUnitGallery } from "@/lib/images";
import { ACCOMMODATION, BUSINESS, CTA } from "@/lib/site-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ACCOMMODATION.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const unit = ACCOMMODATION.find((u) => u.slug === slug);
  if (!unit) return {};
  return {
    title: `${unit.name} | ${BUSINESS.name}`,
    description: unit.description,
  };
}

export default async function UnitPage({ params }: PageProps) {
  const { slug } = await params;
  const unit = ACCOMMODATION.find((u) => u.slug === slug);
  if (!unit) notFound();

  const gallery = getUnitGallery(unit.slug);
  const heroImage = gallery[0] ?? getImage(unit.imageSlug);
  const bookingHref = `${CTA.bookingFormHref}?unit=${encodeURIComponent(unit.name)}`;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl items-center gap-2 px-6 pt-28 text-sm text-driftwood lg:px-8"
      >
        <Link href="/" className="hover:text-sea-deep">
          Начало
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/#accommodation" className="hover:text-sea-deep">
          Настаняване
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-sea-deep">{unit.name}</span>
      </nav>

      <section className="relative mt-6 h-[50vh] min-h-[360px] overflow-hidden">
        <Parallax strength={10} className="absolute inset-[-8%]">
          <CinematicImage image={heroImage} className="h-full w-full" priority sizes="100vw" />
        </Parallax>
        <div className="absolute inset-0 bg-sea-deep/35" aria-hidden />
        <div className="absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 lg:px-8">
          <h1 className="font-heading text-3xl text-warm-white italic drop-shadow-[0_2px_16px_rgba(7,30,44,0.5)] sm:text-4xl md:text-5xl">
            {unit.name}
          </h1>
          <div className="flex gap-2">
            <span className="rounded-full bg-warm-white/90 px-4 py-2 text-sm font-semibold text-sea-deep backdrop-blur-sm">
              {unit.capacity}
            </span>
            <span className="rounded-full bg-olive px-4 py-2 text-sm font-semibold text-warm-white backdrop-blur-sm">
              {unit.priceLabel}
            </span>
          </div>
        </div>
        {unit.isPlaceholderImage && (
          <span className="absolute top-6 right-6 rounded-full bg-driftwood/80 px-3 py-1 text-xs font-medium text-warm-white backdrop-blur-sm">
            Илюстративна снимка
          </span>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Reveal>
          <p className="text-lg text-driftwood">{unit.description}</p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {unit.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-sea-deep">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
          <Reveal>
            <UnitPhotoGrid images={gallery} />
          </Reveal>
        </section>
      )}

      <section className="bg-sand/25 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 text-center lg:px-8">
          <h2 className="font-heading text-2xl text-sea-deep sm:text-3xl">Готови ли сте да резервирате?</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-sea-deep px-8 text-base text-warm-white hover:bg-sea-deep/90">
              <a href={bookingHref}>{CTA.primary}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-driftwood px-8 text-base">
              <a href={BUSINESS.phoneHref} className="gap-2">
                <Phone className="h-4 w-4" />
                {CTA.phone}
              </a>
            </Button>
          </div>
          <Link
            href="/#accommodation"
            className="text-sm font-medium text-sea-deep underline underline-offset-4 hover:text-olive"
          >
            ← Обратно към всички настанявания
          </Link>
        </div>
      </section>
    </>
  );
}
