import { Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NAV_LINKS, BUSINESS, FOOTER } from "@/lib/site-data";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.35c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4V10.4H7.7v3h2.7V21h3.1Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact-footer" className="bg-sea-deep text-warm-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo light />
          <p className="text-sm text-warm-white/70">{FOOTER.tagline}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-sand uppercase">Навигация</h3>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-warm-white/80 transition-colors hover:text-warm-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-sand uppercase">Контакти</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-warm-white/80">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-sand" />
              {BUSINESS.locality}, {BUSINESS.country}
            </li>
            <li>
              <a href={BUSINESS.phoneHref} className="flex items-center gap-2 transition-colors hover:text-warm-white">
                <Phone className="h-4 w-4 shrink-0 text-sand" />
                {BUSINESS.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-sand uppercase">Последвайте ни</h3>
          <a
            href={BUSINESS.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warm-white/10 text-warm-white transition-colors hover:bg-warm-white/20"
            aria-label="Facebook на Къмпинг Ахелойска Битка"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-warm-white/10 px-6 py-5 text-center text-xs text-warm-white/60 lg:px-8">
        © {year} {BUSINESS.name}. Всички права запазени.
      </div>
    </footer>
  );
}
