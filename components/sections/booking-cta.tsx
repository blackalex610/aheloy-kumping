import { Suspense } from "react";
import Link from "next/link";
import { Phone, Leaf, CalendarRange } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/booking/inquiry-form";
import { InquiryFormContainer } from "@/components/booking/inquiry-form-container";
import { getImage } from "@/lib/images";
import { BOOKING_CTA, SEASON, CTA, BUSINESS } from "@/lib/site-data";

export function BookingCta() {
  const image = getImage(BOOKING_CTA.imageSlug);

  return (
    <section id="booking" className="relative">
      <div className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden">
        <Parallax strength={10} className="absolute inset-[-8%]">
          <CinematicImage image={image} className="h-full w-full" sizes="100vw" />
        </Parallax>
        <div className="absolute inset-0 bg-sea-deep/45" aria-hidden />

        <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-heading text-3xl text-warm-white italic drop-shadow-[0_2px_16px_rgba(7,30,44,0.5)] sm:text-4xl md:text-5xl">
            {BOOKING_CTA.headline}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-warm-white px-8 text-base text-sea-deep hover:bg-warm-white/90">
              <a href={BUSINESS.phoneHref} className="gap-2">
                <Phone className="h-4 w-4" />
                {CTA.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-warm-white/50 bg-warm-white/10 px-8 text-base text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
            >
              <Link href="/#booking-form">Изпрати запитване</Link>
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="bg-sand/25 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[320px_1fr] lg:px-8">
          <Reveal className="flex flex-col justify-center gap-5 rounded-3xl bg-olive/10 p-8 ring-1 ring-olive/20">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-warm-white">
              <Leaf className="h-5 w-5" />
            </span>
            <h3 className="font-heading text-xl text-sea-deep">Сезон</h3>
            <div className="flex flex-col gap-3 text-sm text-driftwood">
              <div>
                <span className="font-semibold text-sea-deep">{SEASON.working.label}</span>{" "}
                {SEASON.working.value}
              </div>
              <div>
                <span className="font-semibold text-sea-deep">{SEASON.peak.label}</span> {SEASON.peak.value}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} id="booking-form" className="scroll-mt-24 rounded-3xl bg-card p-8 shadow-sm ring-1 ring-driftwood/10 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              <CalendarRange className="h-5 w-5 text-olive" />
              <h3 className="font-heading text-xl text-sea-deep">Изпрати запитване</h3>
            </div>
            <Suspense fallback={<InquiryForm />}>
              <InquiryFormContainer />
            </Suspense>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
