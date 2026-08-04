import { Phone, MapPin, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site-data";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.35c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4V10.4H7.7v3h2.7V21h3.1Z" />
    </svg>
  );
}

export function ContactMap() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${BUSINESS.name}, ${BUSINESS.locality}`
  )}&output=embed`;

  return (
    <section id="contact" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">Свържете се с нас</h2>
          <p className="mx-auto mt-3 max-w-xl text-driftwood">
            Имате въпроси или искате да направите резервация? Свържете се с нас директно.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[380px_1fr]">
          <Reveal className="flex flex-col gap-6 rounded-3xl bg-sand/25 p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-olive" />
              <div>
                <p className="font-semibold text-sea-deep">Локация</p>
                <p className="text-sm text-driftwood">
                  {BUSINESS.locality}, {BUSINESS.region}, {BUSINESS.country}
                </p>
              </div>
            </div>

            <a href={BUSINESS.phoneHref} className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-olive" />
              <div>
                <p className="font-semibold text-sea-deep">Телефон</p>
                <p className="text-sm text-driftwood">{BUSINESS.phoneDisplay}</p>
              </div>
            </a>

            <a
              href={BUSINESS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <FacebookIcon className="mt-0.5 h-5 w-5 shrink-0 text-olive" />
              <div>
                <p className="font-semibold text-sea-deep">Facebook</p>
                <p className="text-sm text-driftwood">Camping Aheloyska Bitka</p>
              </div>
            </a>

            <div className="mt-2 flex flex-col gap-3">
              <Button asChild className="bg-sea-deep text-warm-white hover:bg-sea-deep/90">
                <a href={BUSINESS.phoneHref}>Обади се сега</a>
              </Button>
              <Button asChild variant="outline" className="border-driftwood gap-2">
                <a href={BUSINESS.externalBookingUrl} target="_blank" rel="noopener noreferrer">
                  Резервирай през Почивка.бг
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="overflow-hidden rounded-3xl ring-1 ring-driftwood/10">
            <iframe
              title="Локация на Къмпинг Ахелойска Битка в Ахелой"
              src={mapSrc}
              className="h-[420px] w-full grayscale-[15%] lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
