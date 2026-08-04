"use client";

import { Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { NAV_LINKS, CTA, BUSINESS } from "@/lib/site-data";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-4/5 bg-warm-white sm:max-w-xs">
        <SheetHeader>
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <SheetClose key={link.href} asChild>
              <a
                href={link.href}
                className="rounded-lg px-3 py-3 font-heading text-lg text-sea-deep transition-colors hover:bg-sand/40"
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>

        <SheetFooter>
          <SheetClose asChild>
            <a href={BUSINESS.phoneHref}>
              <Button variant="outline" size="lg" className="w-full gap-2 border-driftwood">
                <Phone className="h-4 w-4" />
                {BUSINESS.phoneDisplay}
              </Button>
            </a>
          </SheetClose>
          <SheetClose asChild>
            <a href={CTA.bookingFormHref}>
              <Button size="lg" className="w-full bg-sea-deep text-warm-white hover:bg-sea-deep/90">
                {CTA.primary}
              </Button>
            </a>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
