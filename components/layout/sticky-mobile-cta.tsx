"use client";

import { useEffect, useState } from "react";
import { Phone, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, BUSINESS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/** Fixed bottom action bar, mobile only, appears once the visitor scrolls past the hero. */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-driftwood/20 bg-warm-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(11,58,83,0.12)] backdrop-blur-md transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Button asChild variant="outline" size="lg" className="flex-1 gap-1.5 border-driftwood">
        <a href={BUSINESS.phoneHref}>
          <Phone className="h-4 w-4" />
          {CTA.phone}
        </a>
      </Button>
      <Button asChild size="lg" className="flex-1 gap-1.5 bg-sea-deep text-warm-white hover:bg-sea-deep/90">
        <a href={CTA.bookingFormHref}>
          <CalendarCheck className="h-4 w-4" />
          {CTA.primary}
        </a>
      </Button>
    </div>
  );
}
