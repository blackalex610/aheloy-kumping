"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NAV_LINKS, CTA, BUSINESS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-warm-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/#hero" className="shrink-0" aria-label="Начало">
          <Logo light={light} />
        </Link>

        <ul
          className={cn(
            "hidden items-center gap-7 lg:flex",
            light ? "text-warm-white" : "text-sea-deep"
          )}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={BUSINESS.phoneHref}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70",
              light ? "text-warm-white" : "text-sea-deep"
            )}
          >
            <Phone className="h-4 w-4" />
            {BUSINESS.phoneDisplay}
          </a>
          <Button asChild size="lg" className="bg-sea-deep text-warm-white hover:bg-sea-deep/90">
            <a href={CTA.bookingFormHref}>{CTA.primary}</a>
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
            light ? "text-warm-white" : "text-sea-deep"
          )}
          onClick={() => setMobileOpen(true)}
          aria-label="Отвори меню"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
