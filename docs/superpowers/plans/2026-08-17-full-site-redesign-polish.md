# Full Site Redesign Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each accommodation unit a real detail page, rename the accommodation section to reflect bungalows + a caravan, redesign About/Camping/Amenities/Nearby beyond flat text-and-icon layouts, replace the Reviews placeholder with real curated guest reviews, and remove every remaining "coming soon" placeholder — while leaving Gallery, Hero, QuickFacts, WhyChooseUs, Faq, and ContactMap untouched.

**Architecture:** Next.js 16 App Router site. Shared chrome (`Navbar`/`Footer`/`StickyMobileCta`) moves from `app/page.tsx` into `app/layout.tsx` so a new static route family `app/bungala/[slug]/page.tsx` (one page per accommodation unit, `generateStaticParams`) gets it for free. A new reusable `Lightbox` + `UnitPhotoGrid` power each unit's photo grid. All existing same-page anchors become root-relative (`/#section`) so they still work from the new route. `lib/site-data.ts` / `lib/images.ts` remain the single source of truth — every new fact (unit descriptions, review text) is composed only from data that already exists on the site or was verbatim-supplied by the owner.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, `lucide-react` icons, `react-hook-form` + `zod`, `sharp` (already resolvable in `node_modules`, used only by build-time scripts, not runtime).

**Spec:** `docs/superpowers/specs/2026-08-17-full-site-redesign-polish-design.md`

## Global Constraints

- Nothing is invented: unit descriptions are composed only from existing `features`/`capacity`/`priceLabel`; review text is quoted verbatim from the owner-supplied list with real attribution.
- Gallery (`components/sections/gallery.tsx`, `GALLERY_CATEGORIES`, `getGalleryImages`) is **not modified** in any task.
- Hero, QuickFacts, WhyChooseUs, Faq, ContactMap are **not modified** in any task.
- No CMS/backend. All data stays in `lib/site-data.ts` / `lib/images.ts`.
- No changes to the booking form's submission mechanism (Web3Forms/mailto fallback) — only a new optional pre-fill prop.
- This repo has no test runner configured (`package.json` only has `dev`/`build`/`start`/`lint`). Every task's verification step is `npm run build` (TypeScript + static generation must succeed) plus a concrete manual check in the dev server (`npm run dev`) — there is no unit-test framework to add tests to, and adding one is out of scope.
- Follow existing code conventions exactly: Tailwind utility classes matching the existing palette (`sea-deep`, `driftwood`, `olive`, `sand`, `warm-white`, `card`), `Reveal`/`Parallax`/`Counter` for motion, `CinematicImage` for every photo, `cn()` from `@/lib/utils` for conditional classes.

---

## Task 1: Repo hygiene — ignore raw source photo dumps

**Files:**
- Modify: `.gitignore`

**Interfaces:** None (no code consumes this).

- [ ] **Step 1: Add the raw photo folders to `.gitignore`**

Append this block to the end of `.gitignore`:

```gitignore

# raw source photo dumps (kept locally, never committed — processed photos live in public/images)
/bungalo za trima/
/dvustajno bungalo za chetirima лятна пауза/
/karavana morska gledka/
/вила за седем човека/
/двустайно бунгало за четирима морски бриз/
/aheloyska bitka OSHTE SNIMKOV MATERIAL/
```

- [ ] **Step 2: Verify the folders are now ignored**

Run: `git status --short`
Expected: none of the 6 folder names above appear in the output anymore (they should already be untracked `??` entries before this change, and simply disappear from the listing after).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "Ignore raw source photo dump folders"
```

---

## Task 2: Routing foundation — shared layout, root-relative links, booking pre-selection

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `lib/site-data.ts` (`NAV_LINKS`, `CTA`)
- Modify: `components/layout/navbar.tsx`
- Modify: `components/sections/booking-cta.tsx`
- Modify: `components/booking/inquiry-form.tsx`
- Create: `components/booking/inquiry-form-container.tsx`

**Interfaces:**
- Produces: `InquiryForm({ defaultAccommodationType }: { defaultAccommodationType?: string })` — consumed by Task 4 and Task 5 (both link to `/#booking?unit=<name>`, which this task makes functional).
- Produces: `CTA.bookingFormHref === "/#booking"` — every later task that links to booking uses this constant plus `?unit=...`.

- [ ] **Step 1: Move `Navbar`/`Footer`/`StickyMobileCta` into the root layout**

Replace the full contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Къмпинг Ахелойска Битка | Бунгала край морето в Ахелой",
  description:
    "Къмпинг Ахелойска Битка предлага уютни бунгала, места за каравани и палатки само на 50 м от плажа. Спокойна семейна почивка край Ахелой.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bg"
      className={`${playfair.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyMobileCta />
        </SmoothScroll>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Strip the chrome out of `app/page.tsx`, keeping only the section list**

Replace the full contents of `app/page.tsx` with:

```tsx
import { Hero } from "@/components/sections/hero";
import { QuickFacts } from "@/components/sections/quick-facts";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { About } from "@/components/sections/about";
import { FamilyStory } from "@/components/sections/family-story";
import { Accommodation } from "@/components/sections/accommodation";
import { Camping } from "@/components/sections/camping";
import { Amenities } from "@/components/sections/amenities";
import { Gallery } from "@/components/sections/gallery";
import { Reviews } from "@/components/sections/reviews";
import { Nearby } from "@/components/sections/nearby";
import { Faq } from "@/components/sections/faq";
import { BookingCta } from "@/components/sections/booking-cta";
import { ContactMap } from "@/components/sections/contact-map";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickFacts />
      <WhyChooseUs />
      <About />
      <FamilyStory />
      <Accommodation />
      <Camping />
      <Amenities />
      <Gallery />
      <Reviews />
      <Nearby />
      <Faq />
      <BookingCta />
      <ContactMap />
    </>
  );
}
```

- [ ] **Step 3: Make `NAV_LINKS` and `CTA` hrefs root-relative**

In `lib/site-data.ts`, replace:

```ts
export const NAV_LINKS = [
  { label: "Начало", href: "#hero" },
  { label: "За нас", href: "#about" },
  { label: "Бунгала", href: "#accommodation" },
  { label: "Къмпинг", href: "#camping" },
  { label: "Удобства", href: "#amenities" },
  { label: "Галерия", href: "#gallery" },
  { label: "Контакти", href: "#contact" },
] as const;

export const CTA = {
  primary: "Провери свободни дати",
  secondary: "Свържи се с нас",
  phone: "Обади се сега",
  bookingFormHref: "#booking",
  contactHref: "#contact",
} as const;
```

with:

```ts
export const NAV_LINKS = [
  { label: "Начало", href: "/#hero" },
  { label: "За нас", href: "/#about" },
  { label: "Настаняване", href: "/#accommodation" },
  { label: "Къмпинг", href: "/#camping" },
  { label: "Удобства", href: "/#amenities" },
  { label: "Галерия", href: "/#gallery" },
  { label: "Контакти", href: "/#contact" },
] as const;

export const CTA = {
  primary: "Провери свободни дати",
  secondary: "Свържи се с нас",
  phone: "Обади се сега",
  bookingFormHref: "/#booking",
  contactHref: "/#contact",
} as const;
```

(The nav label "Бунгала" → "Настаняване" is the section rename from the spec — the caravan is part of this section too.)

- [ ] **Step 4: Fix the two hardcoded anchors that aren't sourced from `NAV_LINKS`/`CTA`**

In `components/layout/navbar.tsx`, change:

```tsx
        <a href="#hero" className="shrink-0" aria-label="Начало">
```

to:

```tsx
        <a href="/#hero" className="shrink-0" aria-label="Начало">
```

In `components/sections/booking-cta.tsx`, change:

```tsx
              <a href="#booking-form">Изпрати запитване</a>
```

to:

```tsx
              <a href="/#booking-form">Изпрати запитване</a>
```

- [ ] **Step 5: Verify build succeeds with the routing change**

Run: `npm run build`
Expected: build succeeds (no route changes yet, this only moves components and edits strings).

- [ ] **Step 6: Manual check — chrome renders once, links still work**

Run `npm run dev`, open `http://localhost:3000/`. Expected: navbar and footer render exactly once (not doubled), all nav links still scroll to their section, "Настаняване" is the new label for the accommodation nav link.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/page.tsx lib/site-data.ts components/layout/navbar.tsx components/sections/booking-cta.tsx
git commit -m "Move shared chrome into root layout, make internal links root-relative"
```

- [ ] **Step 8: Add `defaultAccommodationType` support to `InquiryForm`**

In `components/booking/inquiry-form.tsx`, change:

```tsx
export function InquiryForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guests: "",
      accommodationType: "",
      name: "",
      phone: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });
```

to:

```tsx
interface InquiryFormProps {
  defaultAccommodationType?: string;
}

export function InquiryForm({ defaultAccommodationType }: InquiryFormProps = {}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guests: "",
      accommodationType: defaultAccommodationType ?? "",
      name: "",
      phone: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });
```

- [ ] **Step 9: Create the client wrapper that reads `?unit=` from the URL**

Create `components/booking/inquiry-form-container.tsx`:

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/booking/inquiry-form";
import { ACCOMMODATION_TYPES_FOR_FORM } from "@/lib/site-data";

/** Reads ?unit=<name> and pre-selects it in the booking form, if it matches a known type. */
export function InquiryFormContainer() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const defaultAccommodationType = ACCOMMODATION_TYPES_FOR_FORM.find((t) => t === unitParam);

  return <InquiryForm defaultAccommodationType={defaultAccommodationType} />;
}
```

- [ ] **Step 10: Wire the container into `BookingCta` behind a `Suspense` boundary**

`useSearchParams()` requires a Suspense boundary in the App Router, or the build fails. In `components/sections/booking-cta.tsx`, add `Suspense` to the imports:

```tsx
import { Suspense } from "react";
import { Phone, Leaf, CalendarRange } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/booking/inquiry-form";
import { InquiryFormContainer } from "@/components/booking/inquiry-form-container";
import { getImage } from "@/lib/images";
import { BOOKING_CTA, SEASON, CTA, BUSINESS } from "@/lib/site-data";
```

and replace:

```tsx
            <InquiryForm />
```

with:

```tsx
            <Suspense fallback={<InquiryForm />}>
              <InquiryFormContainer />
            </Suspense>
```

- [ ] **Step 11: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds; no "useSearchParams() should be wrapped in a suspense boundary" error.

- [ ] **Step 12: Manual check — pre-selection works**

Run `npm run dev`, open `http://localhost:3000/?unit=%D0%92%D0%B8%D0%BB%D0%B0#booking` (URL-encoded "Вила"). Expected: the booking form's "Тип настаняване" select is pre-filled with "Вила" on load. Then open `http://localhost:3000/#booking` with no query param — expected: the select is empty as before.

- [ ] **Step 13: Commit**

```bash
git add components/booking/inquiry-form.tsx components/booking/inquiry-form-container.tsx components/sections/booking-cta.tsx
git commit -m "Add ?unit= booking-form pre-selection"
```

---

## Task 3: Accommodation data model — unit descriptions, section rename, per-unit galleries

**Files:**
- Modify: `lib/site-data.ts` (`AccommodationUnit`, `ACCOMMODATION`, new `ACCOMMODATION_SECTION`)
- Modify: `lib/images.ts` (`SiteImage`, `getUnitGallery`)

**Interfaces:**
- Produces: `AccommodationUnit.description: string` — consumed by Task 4 (`/bungala/[slug]`) and optionally Task 5.
- Produces: `ACCOMMODATION_SECTION: { title: string; subtitle: string }` — consumed by Task 5.
- Produces: `getUnitGallery(unitSlug: string): SiteImage[]` — consumed by Task 4.

- [ ] **Step 1: Add `description` to every unit and a section title/subtitle constant**

In `lib/site-data.ts`, change the `AccommodationUnit` interface:

```ts
export interface AccommodationUnit {
  slug: string;
  name: string;
  capacity: string;
  priceLabel: string;
  imageSlug: string;
  description: string;
  features: string[];
  /** true when imageSlug is a generic camping photo, not a real photo of this exact unit */
  isPlaceholderImage?: boolean;
}
```

Then add `description` as the field right after `imageSlug` in every one of the 7 `ACCOMMODATION` entries:

```ts
export const ACCOMMODATION_SECTION = {
  title: "Нашите предложения за настаняване",
  subtitle: "Изберете настаняването, което пасва на вашето семейство.",
} as const;

export const ACCOMMODATION: AccommodationUnit[] = [
  {
    slug: "vila",
    name: "Вила",
    capacity: "До 7 човека",
    priceLabel: "102.25 €/вечер",
    imageSlug: "villa7-porch-swing",
    description:
      "Просторна вила за до 7 човека с три спални, климатик и голяма тераса с барбекю — идеална за по-голямо семейство или компания приятели.",
    features: [
      "3 спални",
      "Кухня с печка и хладилник",
      "Климатик",
      "Баня и тоалетна",
      "Кабелна телевизия",
      "Голяма тераса",
      "Барбекю",
    ],
  },
  {
    slug: "bungalo-dvustaen-morski-briz",
    name: "Бунгало „Морски бриз“",
    capacity: "До 4 човека",
    priceLabel: "76.69 €/вечер",
    imageSlug: "briz-exterior",
    description:
      "Двустайно бунгало за до 4 човека с климатик и закрита тераса за отдих — уютно място за семейство с деца.",
    features: [
      "Две спални с двойни легла",
      "Оборудвана кухня с печка и хладилник",
      "Климатик",
      "Баня с душ и тоалетна",
      "Закрита тераса за отдих",
    ],
  },
  {
    slug: "bungalo-dvustaen-lyatna-pauza",
    name: "Бунгало „Лятна пауза“",
    capacity: "До 4 човека",
    priceLabel: "76.69 €/вечер",
    imageSlug: "pauza-exterior",
    description:
      "Двустайно бунгало за до 4 човека с отделна спалня с единични легла — практично решение за семейство или компания приятели.",
    features: [
      "Спалня с двойно легло",
      "Спалня с единични легла",
      "Оборудвана кухня с печка и хладилник",
      "Климатик",
      "Баня с душ и тоалетна",
    ],
  },
  {
    slug: "bungalo-chetvorka-ednostaen",
    name: "Бунгало за четирима, едностайно",
    capacity: "До 4 човека",
    priceLabel: "61.35 €/вечер",
    imageSlug: "terrace-blue-curtains",
    description:
      "Едностайно бунгало за до 4 човека с тераса, люлка и барбекю — просто и функционално настаняване на добра цена.",
    features: ["Четири единични легла", "Кухня", "Баня и тоалетна", "Тераса", "Люлка", "Барбекю"],
    isPlaceholderImage: true,
  },
  {
    slug: "bungalo-troika",
    name: "Бунгало за трима",
    capacity: "До 3 човека",
    priceLabel: "51.12 €/вечер",
    imageSlug: "troika-terrace-kitchenette",
    description:
      "Бунгало за до 3 човека със сенчеста тераса и кухненски бокс — компактно и удобно за по-малка компания.",
    features: ["Легла за трима", "Кухненски бокс на терасата", "Баня с душ", "Сенчеста тераса", "Барбекю"],
  },
  {
    slug: "karavana-morska-gledka",
    name: "Каравана „Морска гледка“",
    capacity: "До 2 човека",
    priceLabel: "60 €/вечер",
    imageSlug: "caravan-seaview-hero",
    description:
      "Напълно оборудвана каравана пред морето за до 2 човека, с климатик и покрита тераса за хранене.",
    features: ["Каравана пред морето", "Климатик", "Баня и тоалетна", "Напълно оборудвана кухня", "Покрита тераса с трапезария"],
  },
  {
    slug: "bungalo-dvoika",
    name: "Бунгало за двама",
    capacity: "До 2 човека",
    priceLabel: "40.90 €/вечер",
    imageSlug: "bungalow-tree-deck",
    description:
      "Компактно бунгало за до 2 човека с кухненски кът и навес с маса — най-достъпният вариант за двойка.",
    features: ["Две единични легла", "Баня и тоалетна", "Кухненски кът", "Навес с маса", "Барбекю"],
    isPlaceholderImage: true,
  },
];
```

- [ ] **Step 2: Tag every per-unit image with its unit and add `getUnitGallery`**

In `lib/images.ts`, add `unitSlug` to the interface:

```ts
export interface SiteImage {
  slug: string;
  src: string;
  alt: string;
  blurDataURL: string;
  category: ImageCategory;
  /** CSS object-position, tuned per photo to crop out clutter (cables, drying racks, plastic chairs) */
  objectPosition: string;
  /** matches an AccommodationUnit.slug — set only on photos of a specific unit */
  unitSlug?: string;
}
```

Then add `unitSlug` to each of these existing entries in the `raw` array (do not otherwise change these entries):

- `terrace-blue-curtains` → `unitSlug: "bungalo-chetvorka-ednostaen"`
- `bungalow-tree-deck` → `unitSlug: "bungalo-dvoika"`
- `troika-terrace-kitchenette`, `troika-outdoor-kitchen`, `troika-bedroom-cave-mural`, `troika-bathroom` → `unitSlug: "bungalo-troika"`
- `pauza-exterior`, `pauza-kitchen-dining`, `pauza-bathroom`, `pauza-bedroom-double`, `pauza-bedroom-twin` → `unitSlug: "bungalo-dvustaen-lyatna-pauza"`
- `caravan-seaview-hero`, `caravan-seaview-terrace-view`, `caravan-seaview-lounge`, `caravan-seaview-kitchen`, `caravan-seaview-bedroom` → `unitSlug: "karavana-morska-gledka"`
- `villa7-porch-swing`, `villa7-bedroom-boardwalk-mural`, `villa7-bedroom-amalfi-mural`, `villa7-bedroom-palm-mural`, `villa7-kitchen`, `villa7-bathroom` → `unitSlug: "vila"`
- `briz-exterior`, `briz-terrace-lounge`, `briz-kitchen-dining`, `briz-bedroom-1`, `briz-bedroom-2`, `briz-bathroom` → `unitSlug: "bungalo-dvustaen-morski-briz"`

For example, the `troika-terrace-kitchenette` entry changes from:

```ts
  {
    slug: "troika-terrace-kitchenette",
    alt: "Сенчеста дървена тераса на Бунгало за трима с барбекю и маса",
    category: "bungalow",
    objectPosition: "45% 55%",
  },
```

to:

```ts
  {
    slug: "troika-terrace-kitchenette",
    alt: "Сенчеста дървена тераса на Бунгало за трима с барбекю и маса",
    category: "bungalow",
    objectPosition: "45% 55%",
    unitSlug: "bungalo-troika",
  },
```

Apply the same pattern (add `unitSlug: "..."` as the last field) to all 27 other entries listed above.

- [ ] **Step 3: Add `getUnitGallery`**

At the end of `lib/images.ts`, after `getGalleryImages`, add:

```ts
export function getUnitGallery(unitSlug: string): SiteImage[] {
  return SITE_IMAGES.filter((img) => img.unitSlug === unitSlug);
}
```

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds (TypeScript checks `description` is present on all 7 units, `unitSlug` is a valid optional field).

- [ ] **Step 5: Manual sanity check via a scratch script**

Run: `node -e "const {ACCOMMODATION}=require('./lib/site-data.ts')"` will not work directly (TS), so instead verify counts with:

Run: `npx tsx -e "import('./lib/images.ts').then(m => console.log(m.getUnitGallery('bungalo-troika').map(i => i.slug)))"`
Expected: prints exactly `[ 'troika-terrace-kitchenette', 'troika-outdoor-kitchen', 'troika-bedroom-cave-mural', 'troika-bathroom' ]` (order matches the `raw` array). If `tsx` isn't available, skip this step — Task 4's manual check covers the same thing visually.

- [ ] **Step 6: Commit**

```bash
git add lib/site-data.ts lib/images.ts
git commit -m "Add per-unit descriptions and photo galleries to accommodation data"
```

---

## Task 4: Unit detail pages — Lightbox, photo grid, `/bungala/[slug]` route

**Files:**
- Create: `components/media/lightbox.tsx`
- Create: `components/accommodation/unit-photo-grid.tsx`
- Create: `app/bungala/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getUnitGallery(unitSlug: string): SiteImage[]`, `AccommodationUnit.description` (Task 3); `CTA.bookingFormHref === "/#booking"` (Task 2).
- Produces: `<Lightbox images={SiteImage[]} index={number} onIndexChange={(i:number)=>void} onClose={()=>void} />`, `<UnitPhotoGrid images={SiteImage[]} />` — not consumed elsewhere in this plan, but available for future reuse.

- [ ] **Step 1: Create the reusable Lightbox**

Create `components/media/lightbox.tsx`:

```tsx
"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CinematicImage } from "@/components/media/cinematic-image";
import type { SiteImage } from "@/lib/images";

interface LightboxProps {
  images: SiteImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Fullscreen photo viewer: Esc to close, arrow keys / on-screen buttons to navigate. */
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  const image = images[index];
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-sea-deep/95 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative h-full max-h-[80vh] w-full max-w-4xl"
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CinematicImage
            image={image}
            className="h-full w-full rounded-2xl"
            vignette={false}
            scrim={false}
            sizes="90vw"
          />
        </motion.div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
          aria-label="Затвори"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
          aria-label="Предишна снимка"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur-sm hover:bg-warm-white/20"
          aria-label="Следваща снимка"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-warm-white/80">
          {index + 1} / {images.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create the photo grid that opens the Lightbox**

Create `components/accommodation/unit-photo-grid.tsx`:

```tsx
"use client";

import { useState } from "react";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Lightbox } from "@/components/media/lightbox";
import type { SiteImage } from "@/lib/images";

export function UnitPhotoGrid({ images }: { images: SiteImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((img, i) => (
          <button key={img.slug} type="button" onClick={() => setOpenIndex(i)} className="group">
            <CinematicImage
              image={img}
              className="aspect-[4/3] rounded-2xl"
              hoverZoom
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 3: Create the detail page route**

Create `app/bungala/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify build succeeds and generates all 7 static pages**

Run: `npm run build`
Expected: build succeeds; output lists 7 static routes under `/bungala/[slug]` (one per `ACCOMMODATION` entry — `vila`, `bungalo-dvustaen-morski-briz`, `bungalo-dvustaen-lyatna-pauza`, `bungalo-chetvorka-ednostaen`, `bungalo-troika`, `karavana-morska-gledka`, `bungalo-dvoika`).

- [ ] **Step 5: Manual check — detail page content, lightbox, unknown slug**

Run `npm run dev`. Open `http://localhost:3000/bungala/bungalo-troika`. Expected: breadcrumb, hero photo with capacity/price badges, description, feature checklist, a 4-photo grid. Click a photo — lightbox opens fullscreen; press `→`/`←` to navigate, click outside the image or press `Esc` to close. Then open `http://localhost:3000/bungala/does-not-exist` — expected: Next.js 404 page. Then open `http://localhost:3000/bungala/bungalo-dvoika` — expected: the "Илюстративна снимка" badge shows on the hero (this unit is `isPlaceholderImage: true`).

- [ ] **Step 6: Commit**

```bash
git add components/media/lightbox.tsx components/accommodation/unit-photo-grid.tsx app/bungala
git commit -m "Add per-unit accommodation detail pages with lightbox gallery"
```

---

## Task 5: Homepage Accommodation section — rename, clickable cards

**Files:**
- Modify: `components/sections/accommodation.tsx`

**Interfaces:**
- Consumes: `ACCOMMODATION_SECTION`, `CTA.bookingFormHref` (Task 2/3), `/bungala/[slug]` routes (Task 4).

- [ ] **Step 1: Rename the heading and make each card link to its detail page**

Replace the full contents of `components/sections/accommodation.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinematicImage } from "@/components/media/cinematic-image";
import { Reveal } from "@/components/motion/reveal";
import { getImage } from "@/lib/images";
import { ACCOMMODATION, ACCOMMODATION_SECTION, CTA, type AccommodationUnit } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function AccommodationCard({ unit }: { unit: AccommodationUnit }) {
  const image = getImage(unit.imageSlug);
  const bookingHref = `${CTA.bookingFormHref}?unit=${encodeURIComponent(unit.name)}`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-driftwood/10 transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/bungala/${unit.slug}`} className="absolute inset-0 z-10" aria-label={`Виж повече за ${unit.name}`} />
      <div className="relative">
        <CinematicImage
          image={image}
          className="aspect-[4/3]"
          hoverZoom
          sizes="(max-width: 1024px) 100vw, 380px"
        />
        <span className="absolute top-4 left-4 rounded-full bg-warm-white/90 px-3 py-1 text-xs font-semibold text-sea-deep backdrop-blur-sm">
          {unit.capacity}
        </span>
        {unit.isPlaceholderImage && (
          <span className="absolute right-4 bottom-4 rounded-full bg-driftwood/80 px-3 py-1 text-xs font-medium text-warm-white backdrop-blur-sm">
            Илюстративна снимка
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-heading text-xl text-sea-deep">{unit.name}</h3>
          <p className="mt-1 font-heading text-lg text-olive">{unit.priceLabel}</p>
        </div>
        <ul className="flex flex-1 flex-col gap-1.5 text-sm text-driftwood">
          {unit.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
              {f}
            </li>
          ))}
        </ul>
        <Button asChild className="relative z-20 mt-2 bg-sea-deep text-warm-white hover:bg-sea-deep/90">
          <a href={bookingHref}>{CTA.primary}</a>
        </Button>
      </div>
    </div>
  );
}

export function Accommodation() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnhanced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - pin.clientWidth;
      if (distance <= 40) return;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=88",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, [enhanced]);

  return (
    <section id="accommodation" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{ACCOMMODATION_SECTION.title}</h2>
          <p className="mt-3 text-driftwood">{ACCOMMODATION_SECTION.subtitle}</p>
        </Reveal>
      </div>

      <div ref={pinRef} className="mt-14 overflow-hidden">
        <div
          ref={trackRef}
          className={cn(
            "gap-6 px-6 sm:grid-cols-2 lg:gap-8 lg:px-[6vw]",
            enhanced ? "flex" : "grid grid-cols-1 lg:grid-cols-4"
          )}
        >
          {ACCOMMODATION.map((unit, i) => (
            <Reveal
              key={unit.slug}
              delay={i * 0.06}
              className={enhanced ? "w-[340px] shrink-0 sm:w-[380px]" : ""}
            >
              <AccommodationCard unit={unit} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

(Only changes from the current file: `Link` import, `ACCOMMODATION_SECTION` import/usage, the card's outer `div` gains `relative` + a `Link` overlay at `z-10` covering the whole card, and the booking `Button` gains `relative z-20` plus its href now carries `?unit=<name>` — this "stretched link" pattern keeps the whole card clickable while the inner booking button still works and stays valid HTML, since Next's `Link` and a plain `<a>` can't be nested inside each other.)

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open `http://localhost:3000/#accommodation`. Expected: heading now reads "Нашите предложения за настаняване". Click anywhere on a card except the button — navigates to `/bungala/<slug>`. Click "Провери свободни дати" on a card — navigates to `/#booking` with that unit pre-selected in the form (per Task 2).

- [ ] **Step 4: Commit**

```bash
git add components/sections/accommodation.tsx
git commit -m "Rename accommodation section, make cards link to detail pages"
```

---

## Task 6: Camping section — real photos, mosaic redesign

**Files:**
- Create: `public/images/camping-pitches-overview.jpg`, `public/images/camping-caravan-awning.jpg`, `public/images/camping-tent-motorcycle.jpg`, `public/images/camping-tent-pitch-cars.jpg`, `public/images/camping-entrance-gate.jpg`, `public/images/camping-sunset-motorhome.jpg`
- Create: `scripts/gen-blur-data-camping.mjs`
- Modify: `lib/blur-data.json` (generated by the script, not hand-edited)
- Modify: `lib/images.ts` (`ImageCategory`, new `raw` entries)
- Modify: `lib/site-data.ts` (`CAMPING`)
- Modify: `components/sections/camping.tsx`

**Interfaces:** None consumed by later tasks.

- [ ] **Step 1: Copy the 6 real camping photos from the raw material folder into `public/images`**

```bash
cd "C:/Users/pc/Desktop/SRQDA 05.08.2026/aheloj kumping"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_36_750871078_1590991906147036_7825771281245589770_n.jpg" "public/images/camping-pitches-overview.jpg"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_35_749300564_1590991659480394_8946241906782161611_n.jpg" "public/images/camping-caravan-awning.jpg"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_37_749286551_1590992209480339_4436659708523399895_n.jpg" "public/images/camping-tent-motorcycle.jpg"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_34_747795590_1590991342813759_6042267905834720277_n.jpg" "public/images/camping-tent-pitch-cars.jpg"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_27_751295038_1595084549071105_585725212795792409_n.jpg" "public/images/camping-entrance-gate.jpg"
cp "aheloyska bitka OSHTE SNIMKOV MATERIAL/imgi_2_46087483_1585112361634361_7295122108261072896_n.jpg" "public/images/camping-sunset-motorhome.jpg"
```

- [ ] **Step 2: Declare `sharp` as a real dependency**

The new blur-data script (next step) imports `sharp` directly. It currently only resolves as an undeclared transitive dependency (confirmed resolvable via `node -e "require('sharp')"`), which is fragile — a future `npm install` could drop it. Declare it explicitly:

Run: `npm install --save-dev sharp`
Expected: `package.json`'s `devDependencies` now includes a `"sharp"` entry; `package-lock.json` updates.

- [ ] **Step 3: Generate blur placeholders for the 6 new photos**

Create `scripts/gen-blur-data-camping.mjs`:

```js
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// six real Camping-section photos added from the Facebook photo dump;
// unlike gen-blur-data.mjs (which reuses pre-shrunk panel_thumb files),
// these are resized down here directly from the full-size public/images copy.
const slugs = [
  "camping-pitches-overview",
  "camping-caravan-awning",
  "camping-tent-motorcycle",
  "camping-tent-pitch-cars",
  "camping-entrance-gate",
  "camping-sunset-motorhome",
];

const root = path.resolve(import.meta.dirname, "..");
const imagesDir = path.join(root, "public", "images");
const outFile = path.join(root, "lib", "blur-data.json");

const existing = JSON.parse(await readFile(outFile, "utf8"));

for (const slug of slugs) {
  const buf = await sharp(path.join(imagesDir, `${slug}.jpg`))
    .resize(16)
    .jpeg({ quality: 40 })
    .toBuffer();
  existing[slug] = `data:image/jpeg;base64,${buf.toString("base64")}`;
}

await writeFile(outFile, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`Added ${slugs.length} blur placeholders to lib/blur-data.json`);
```

Run: `node scripts/gen-blur-data-camping.mjs`
Expected: prints `Added 6 blur placeholders to lib/blur-data.json`, and `lib/blur-data.json` now has 54 keys (48 existing + 6 new) — verify with:

Run: `node -e "console.log(Object.keys(require('./lib/blur-data.json')).length)"`
Expected: `54`

- [ ] **Step 4: Register the new images in `lib/images.ts`**

Add `"camping"` to the category union:

```ts
export type ImageCategory = "beach" | "bungalow" | "interior" | "kitchen" | "bathroom" | "camping";
```

Append these 6 entries to the end of the `raw` array (before the closing `];`):

```ts

  // Къмпинг — реални снимки от палатковите/каравана места
  {
    slug: "camping-pitches-overview",
    alt: "Общ изглед на местата за палатки и каравани сред дървета",
    category: "camping",
    objectPosition: "50% 50%",
  },
  {
    slug: "camping-caravan-awning",
    alt: "Каравана с тента за сянка на място сред дърветата",
    category: "camping",
    objectPosition: "50% 55%",
  },
  {
    slug: "camping-tent-motorcycle",
    alt: "Палатка на сенчесто място за къмпинг с мотоциклет и автомобил",
    category: "camping",
    objectPosition: "50% 50%",
  },
  {
    slug: "camping-tent-pitch-cars",
    alt: "Място за палатка сред дървета с паркирани автомобили",
    category: "camping",
    objectPosition: "50% 60%",
  },
  {
    slug: "camping-entrance-gate",
    alt: "Входна порта на къмпинга с ретро къмпер бус",
    category: "camping",
    objectPosition: "50% 50%",
  },
  {
    slug: "camping-sunset-motorhome",
    alt: "Кемпер на залез сред полските треви на къмпинга",
    category: "camping",
    objectPosition: "40% 55%",
  },
```

(`"camping"` is deliberately **not** added to `GALLERY_CATEGORIES` — no new Gallery tab. These images will only appear in Gallery's existing "Всички" tab as a side effect of being in `SITE_IMAGES`; Gallery's own code and behavior are untouched.)

- [ ] **Step 5: Update `CAMPING` data — real photos, no more placeholder text**

In `lib/site-data.ts`, replace:

```ts
export const CAMPING = {
  title: "Къмпинг сред природата",
  description:
    "За любителите на къмпингуването предлагаме спокойни места сред природата с удобен достъп до морето.",
  features: ["Палатки", "Каравани", "Кемпери", "Електричество", "Санитарни помещения", "Зелени площи"],
  imageSlugs: ["terrace-gazebo-bbq"],
  placeholder: "Очакваме снимки от къмпинг зоната",
} as const;
```

with:

```ts
export const CAMPING = {
  title: "Къмпинг сред природата",
  description:
    "За любителите на къмпингуването предлагаме спокойни места сред природата с удобен достъп до морето.",
  features: ["Палатки", "Каравани", "Кемпери", "Електричество", "Санитарни помещения", "Зелени площи"],
  imageSlugs: [
    "camping-pitches-overview",
    "terrace-gazebo-bbq",
    "camping-caravan-awning",
    "camping-tent-motorcycle",
    "camping-tent-pitch-cars",
    "camping-entrance-gate",
    "camping-sunset-motorhome",
  ],
} as const;
```

- [ ] **Step 6: Redesign the Camping component as a photo mosaic**

Replace the full contents of `components/sections/camping.tsx` with:

```tsx
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { CAMPING } from "@/lib/site-data";

export function Camping() {
  const [featured, ...rest] = CAMPING.imageSlugs.map((slug) => getImage(slug));

  return (
    <section id="camping" className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{CAMPING.title}</h2>
          <p className="mt-4 text-driftwood">{CAMPING.description}</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-sea-deep">
            {CAMPING.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-olive" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-3">
          <CinematicImage
            image={featured}
            className="aspect-[16/10] rounded-2xl"
            hoverZoom
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {rest.map((img) => (
              <CinematicImage
                key={img.slug}
                image={img}
                className="aspect-square rounded-2xl"
                hoverZoom
                sizes="(max-width: 640px) 33vw, 12vw"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds (no more `ImageOff`/`placeholder` reference anywhere — grep to confirm: `grep -r "CAMPING.placeholder" components/` returns nothing).

- [ ] **Step 8: Manual check**

Run `npm run dev`, open `http://localhost:3000/#camping`. Expected: one larger featured photo (overview of pitches) plus a row of 5 smaller real photos — no dashed box, no "ImageOff" icon anywhere.

- [ ] **Step 9: Commit**

```bash
git add public/images/camping-*.jpg scripts/gen-blur-data-camping.mjs lib/blur-data.json lib/images.ts lib/site-data.ts components/sections/camping.tsx package.json package-lock.json
git commit -m "Replace Camping placeholder box with real photo mosaic"
```

---

## Task 7: About section redesign

**Files:**
- Modify: `lib/site-data.ts` (`ABOUT`)
- Modify: `components/sections/about.tsx`

**Interfaces:** None consumed elsewhere.

- [ ] **Step 1: Add a secondary photo slug to `ABOUT`**

In `lib/site-data.ts`, replace:

```ts
export const ABOUT = {
  title: "Място за истинска почивка",
  paragraphs: [
    "Къмпинг Ахелойска Битка е спокойно семейно място на Южното Черноморие. Разположен само на няколко крачки от морето, къмпингът предлага уютни бунгала, зелени площи и атмосфера далеч от шума на големите курорти.",
    "Благодарение на близостта до плажа, естествената сянка и спокойната атмосфера, мястото е предпочитано от семейства и гости, които искат да избягат от шума на големите курорти.",
  ],
  imageSlug: "terrace-dappled-shade",
} as const;
```

with:

```ts
export const ABOUT = {
  title: "Място за истинска почивка",
  paragraphs: [
    "Къмпинг Ахелойска Битка е спокойно семейно място на Южното Черноморие. Разположен само на няколко крачки от морето, къмпингът предлага уютни бунгала, зелени площи и атмосфера далеч от шума на големите курорти.",
    "Благодарение на близостта до плажа, естествената сянка и спокойната атмосфера, мястото е предпочитано от семейства и гости, които искат да избягат от шума на големите курорти.",
  ],
  imageSlug: "terrace-dappled-shade",
  secondaryImageSlug: "bungalow-mint-curtains",
} as const;
```

- [ ] **Step 2: Redesign the section**

Replace the full contents of `components/sections/about.tsx` with:

```tsx
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Counter } from "@/components/motion/counter";
import { CinematicImage } from "@/components/media/cinematic-image";
import { getImage } from "@/lib/images";
import { ABOUT } from "@/lib/site-data";

export function About() {
  const image = getImage(ABOUT.imageSlug);
  const secondaryImage = getImage(ABOUT.secondaryImageSlug);

  return (
    <section id="about" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal>
          <span className="text-sm font-semibold tracking-[0.2em] text-olive uppercase">За нас</span>
          <h2 className="mt-3 font-heading text-3xl text-sea-deep sm:text-4xl">{ABOUT.title}</h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-olive to-transparent" aria-hidden />
          <div className="mt-6 flex flex-col gap-4 text-driftwood">
            {ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -top-6 -left-6 z-10 hidden h-[220px] w-[180px] -rotate-6 overflow-hidden rounded-3xl shadow-lg ring-4 ring-warm-white sm:block">
            <CinematicImage image={secondaryImage} className="h-full w-full" sizes="180px" />
          </div>
          <div className="relative ml-0 h-[420px] overflow-hidden rounded-3xl sm:ml-16 sm:h-[480px]">
            <Parallax strength={10} className="absolute inset-[-8%]">
              <CinematicImage image={image} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
            </Parallax>
          </div>
          <div className="absolute -bottom-6 right-6 z-10 flex flex-col items-center rounded-2xl bg-sea-deep px-5 py-4 text-warm-white shadow-lg sm:right-0">
            <p className="font-heading text-2xl">
              <Counter to={50} suffix=" м" />
            </p>
            <p className="text-xs text-warm-white/80">от плажа</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual check**

Run `npm run dev`, open `http://localhost:3000/#about`. Expected: eyebrow label "ЗА НАС" above the heading, a small offset second photo peeking from behind the main photo (desktop widths only — hidden below `sm`), a "50 м / от плажа" stat chip overlapping the bottom-right corner of the photo.

- [ ] **Step 5: Commit**

```bash
git add lib/site-data.ts components/sections/about.tsx
git commit -m "Redesign About section with layered photos and stat chip"
```

---

## Task 8: Amenities redesign — fewer icons

**Files:**
- Modify: `lib/site-data.ts` (`Amenity`, `AMENITIES`)
- Modify: `components/sections/amenities.tsx`

**Interfaces:** None consumed elsewhere.

- [ ] **Step 1: Add a `highlight` flag and mark 5 amenities as highlighted**

In `lib/site-data.ts`, replace:

```ts
export interface Amenity {
  icon: string;
  label: string;
}

export const AMENITIES: Amenity[] = [
  { icon: "Car", label: "Паркинг" },
  { icon: "Wifi", label: "Wi-Fi" },
  { icon: "Snowflake", label: "Климатик" },
  { icon: "Tv", label: "Телевизор" },
  { icon: "ChefHat", label: "Кухня" },
  { icon: "Refrigerator", label: "Хладилник" },
  { icon: "Microwave", label: "Микровълнова" },
  { icon: "Coffee", label: "Кафе машина" },
  { icon: "Flame", label: "Барбекю" },
  { icon: "Baby", label: "Детски кът" },
  { icon: "CircleDot", label: "Тенис на маса" },
  { icon: "WashingMachine", label: "Пералня" },
  { icon: "PawPrint", label: "Домашни любимци" },
];
```

with:

```ts
export interface Amenity {
  icon: string;
  label: string;
  highlight?: boolean;
}

export const AMENITIES: Amenity[] = [
  { icon: "Car", label: "Паркинг", highlight: true },
  { icon: "Wifi", label: "Wi-Fi", highlight: true },
  { icon: "Snowflake", label: "Климатик", highlight: true },
  { icon: "Flame", label: "Барбекю", highlight: true },
  { icon: "Baby", label: "Детски кът", highlight: true },
  { icon: "Tv", label: "Телевизор" },
  { icon: "ChefHat", label: "Кухня" },
  { icon: "Refrigerator", label: "Хладилник" },
  { icon: "Microwave", label: "Микровълнова" },
  { icon: "Coffee", label: "Кафе машина" },
  { icon: "CircleDot", label: "Тенис на маса" },
  { icon: "WashingMachine", label: "Пералня" },
  { icon: "PawPrint", label: "Домашни любимци" },
];
```

- [ ] **Step 2: Redesign the component — 5 icon cards + a plain text line for the rest**

Replace the full contents of `components/sections/amenities.tsx` with:

```tsx
import { Reveal } from "@/components/motion/reveal";
import { getIcon } from "@/lib/icon-map";
import { AMENITIES } from "@/lib/site-data";

export function Amenities() {
  const highlighted = AMENITIES.filter((a) => a.highlight);
  const rest = AMENITIES.filter((a) => !a.highlight);

  return (
    <section id="amenities" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-heading text-3xl text-sea-deep sm:text-4xl">
            Удобства
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {highlighted.map((amenity, i) => {
            const Icon = getIcon(amenity.icon);
            return (
              <Reveal
                key={amenity.label}
                delay={i * 0.06}
                className="flex flex-col items-center gap-3 rounded-2xl bg-sand/25 px-4 py-8 text-center ring-1 ring-driftwood/10"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sea-deep text-warm-white">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="font-heading text-base text-sea-deep">{amenity.label}</span>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-10 text-center text-sm leading-loose text-driftwood">
          {rest.map((a) => a.label).join(" · ")}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual check**

Run `npm run dev`, open `http://localhost:3000/#amenities`. Expected: 5 larger icon cards (Паркинг, Wi-Fi, Климатик, Барбекю, Детски кът), followed by a single line of plain text listing the remaining 8 amenities separated by "·" — no icon on any of those 8.

- [ ] **Step 5: Commit**

```bash
git add lib/site-data.ts components/sections/amenities.tsx
git commit -m "Reduce Amenities to 5 highlighted icons plus a plain list"
```

---

## Task 9: Nearby ("Перфектна локация") redesign — fewer icons

**Files:**
- Modify: `components/sections/nearby.tsx`

**Interfaces:** None. No data model change (per spec) — component-only.

- [ ] **Step 1: Show the icon only on the first (beach) entry, enlarge the distance numbers**

Replace the full contents of `components/sections/nearby.tsx` with:

```tsx
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { getIcon } from "@/lib/icon-map";
import { NEARBY } from "@/lib/site-data";

export function Nearby() {
  return (
    <section className="bg-sand/25 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">{NEARBY.title}</h2>
          <p className="mt-3 text-driftwood">{NEARBY.text}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {NEARBY.distances.map((d, i) => {
            const Icon = getIcon(d.icon);
            return (
              <Reveal key={d.label} delay={i * 0.06} className="flex flex-col items-center gap-2 text-center">
                {i === 0 && <Icon className="h-6 w-6 text-olive" />}
                <p className="font-heading text-3xl text-sea-deep sm:text-4xl">
                  <Counter to={d.distance} suffix={` ${d.unit}`} />
                </p>
                <p className="text-sm text-driftwood">{d.label}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual check**

Run `npm run dev`, scroll to the "Перфектна локация" section. Expected: only the first item ("Плаж") has an icon above its number; the other 5 (Ахелой, Несебър, Поморие, Слънчев бряг, Бургас) show just the large number and label, no icon.

- [ ] **Step 4: Commit**

```bash
git add components/sections/nearby.tsx
git commit -m "Reduce Nearby section to a single accent icon"
```

---

## Task 10: Reviews — real curated guest reviews

**Files:**
- Modify: `lib/site-data.ts` (`ReviewItem`, `REVIEWS`)
- Modify: `components/sections/reviews.tsx`

**Interfaces:** None consumed elsewhere.

- [ ] **Step 1: Replace the empty-state fields with a curated, verbatim review list**

In `lib/site-data.ts`, replace:

```ts
export const REVIEWS = {
  rating: 4.3,
  reviewCount: 205,
  countLabel: "205+ мнения",
  ctaLabel: "Виж всички мнения",
  emptyStateTitle: "Отзиви от нашите гости",
  emptyStateText:
    "Тук предстои да добавим реални отзиви от гости. Не публикуваме измислени мнения — очаквайте истински впечатления скоро.",
  /** TODO: replace with the real Google Business profile URL once available */
  googleMapsSearchQuery: "Къмпинг Ахелойска Битка, Ахелой",
} as const;
```

with:

```ts
export interface ReviewItem {
  author: string;
  rating: number;
  source: "Google";
  timeLabel: string;
  text: string;
}

export const REVIEWS = {
  rating: 4.3,
  reviewCount: 205,
  countLabel: "205+ мнения",
  ctaLabel: "Виж всички мнения",
  list: [
    {
      author: "Skyi connick",
      rating: 4,
      source: "Google",
      timeLabel: "2 years ago",
      text: "Great if you're looking for a campsite next to the beach, basic facilities but very clean everyday. The owners are lovely and very welcoming. The campsite has a lot of shade from there trees which gives a pleasant stay.",
    },
    {
      author: "Aleksandra",
      rating: 4,
      source: "Google",
      timeLabel: "4 years ago",
      text: "The place is really quiet and nice. The buildings are old but toilets and showers are cleaned every day. The owners are really kind. We stayed only for one night with a van and a tent and had a really good night.",
    },
    {
      author: "Fikret Sefiloğlu",
      rating: 4,
      source: "Google",
      timeLabel: "9 years ago",
      text: "By the sea. Among the fruit trees. Caravan parking places are good. The price is very reasonable. Family business. The family are good people.",
    },
    {
      author: "Valentin Radev",
      rating: 4,
      source: "Google",
      timeLabel: "10 years ago",
      text: "If you like cozy place away from the city noise just on the sea shore - this is the right place for you.",
    },
    {
      author: "Dawid",
      rating: 4,
      source: "Google",
      timeLabel: "10 years ago",
      text: "Everything is old but it do its thing. Staff speaks english. You have a lot of shadow for tent and a lot of space for yourself which is nice.",
    },
    {
      author: "Sassa T",
      rating: 5,
      source: "Google",
      timeLabel: "9 years ago",
      text: "We were in bungalow. Basic accommodation, but very cheap and very kind hosts.",
    },
    {
      author: "Korina Pallikaraki",
      rating: 5,
      source: "Google",
      timeLabel: "a week ago",
      text: "Cute camping with good shadows. Clean showers and toilets. Very friendly owners.",
    },
    {
      author: "Sinem Öğretmen",
      rating: 5,
      source: "Google",
      timeLabel: "4 weeks ago",
      text: "We didn't expect it to be this beautiful. If it had fit into our schedule, we would have liked to stay a few more days.",
    },
  ] as ReviewItem[],
  /** TODO: replace with the real Google Business profile URL once available */
  googleMapsSearchQuery: "Къмпинг Ахелойска Битка, Ахелой",
};
```

(Note: the outer `as const` is dropped from `REVIEWS` — it conflicts with `list`'s `ReviewItem[]` cast. Nothing downstream needs `REVIEWS` itself to be a literal type.)

- [ ] **Step 2: Redesign the Reviews component as a review-card grid**

Replace the full contents of `components/sections/reviews.tsx` with:

```tsx
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Button } from "@/components/ui/button";
import { REVIEWS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Reviews() {
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    REVIEWS.googleMapsSearchQuery
  )}`;

  return (
    <section id="reviews" className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <Reveal>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-6 w-6",
                  i <= Math.round(REVIEWS.rating) ? "fill-olive text-olive" : "text-driftwood/25"
                )}
              />
            ))}
          </div>
          <p className="mt-4 font-heading text-4xl text-sea-deep sm:text-5xl">
            <Counter to={REVIEWS.rating} decimals={1} />
          </p>
          <p className="mt-1 text-driftwood">
            Google рейтинг · <Counter to={REVIEWS.reviewCount} suffix="+ мнения" />
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.list.map((review, i) => (
            <Reveal
              key={review.author}
              delay={(i % 4) * 0.06}
              className="flex flex-col gap-3 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-driftwood/10"
            >
              <Quote className="h-5 w-5 text-olive/50" aria-hidden />
              <p className="flex-1 text-sm text-driftwood">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between border-t border-driftwood/10 pt-3">
                <div>
                  <p className="text-sm font-semibold text-sea-deep">{review.author}</p>
                  <p className="text-xs text-driftwood/70">
                    {review.source} · {review.timeLabel}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn("h-3.5 w-3.5", i <= review.rating ? "fill-olive text-olive" : "text-driftwood/25")}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="mt-10">
          <Button
            asChild
            variant="outline"
            className="border-sea-deep text-sea-deep hover:bg-sea-deep hover:text-warm-white"
          >
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              {REVIEWS.ctaLabel}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual check**

Run `npm run dev`, open `http://localhost:3000/#reviews`. Expected: aggregate 4.3★/205+ block unchanged at top, followed by a grid of 8 real review cards (author, source, relative time, star rating, quoted text) — no dashed empty-state box anywhere.

- [ ] **Step 5: Commit**

```bash
git add lib/site-data.ts components/sections/reviews.tsx
git commit -m "Replace Reviews placeholder with curated real guest reviews"
```

---

## Task 11: Full-site verification pass

**Files:** None (verification only).

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: succeeds, 0 TypeScript errors, static routes include `/`, and all 7 `/bungala/[slug]` pages.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Confirm no placeholder treatments remain anywhere**

Run: `grep -rn "ImageOff\|border-dashed\|coming soon\|Очакваме снимки" components/ lib/`
Expected: no matches (the old `Camping` `ImageOff` box and `Reviews` dashed empty-state are both gone; `CAMPING.placeholder` field no longer exists).

- [ ] **Step 4: Full manual walkthrough**

Run `npm run dev` and check, in order, on `http://localhost:3000/`:
1. Navbar/footer render once; "Настаняване" nav label; all nav links scroll correctly.
2. About section shows the layered-photo treatment and "50 м / от плажа" chip.
3. Accommodation section heading reads "Нашите предложения за настаняване"; every card navigates to its `/bungala/[slug]` page on click; the booking button still works and pre-selects the right unit.
4. Camping section shows the real photo mosaic, no placeholder box.
5. Amenities section shows 5 icon cards + one plain-text line for the rest.
6. Gallery section is unchanged (tag filters, flat grid) — spot-check that the "Всички" tab now also includes the 6 new camping photos (acceptable per spec), and no other tab or behavior changed.
7. Reviews section shows the 8 real review cards.
8. Nearby section shows only one icon (on "Плаж").
9. From a `/bungala/[slug]` page: breadcrumb links, footer links, sticky mobile CTA, and navbar links all correctly go back to `/` and scroll to the right section.
10. With OS-level "reduce motion" enabled, all of the above remain functional (no broken layout, just fewer animations).

- [ ] **Step 5: Report the final image-upscale audit list to the user**

No code changes — just confirm this list (already in the spec) is still accurate given the new camping photos, and share it as the plan's deliverable:

| File | Size |
|---|---|
| villa7-bathroom.jpg | 736×1000 |
| villa7-bedroom-amalfi-mural.jpg | 768×1024 |
| villa7-bedroom-boardwalk-mural.jpg | 1000×750 |
| villa7-bedroom-palm-mural.jpg | 736×1000 |
| villa7-kitchen.jpg | 736×1000 |
| troika-bathroom.jpg | 738×985 |
| pauza-bathroom.jpg | 747×1600 (narrow width) |
| pauza-bedroom-double.jpg | 747×1600 (narrow width) |
| pauza-bedroom-twin.jpg | 747×1600 (narrow width) |
| camping-tent-pitch-cars.jpg | 590×294 |
| camping-caravan-awning.jpg | 590×443 |
| camping-pitches-overview.jpg | 590×443 |
| camping-tent-motorcycle.jpg | 590×443 |
| camping-entrance-gate.jpg | 720×540 |
| camping-sunset-motorhome.jpg | 960×640 (least urgent) |

No further commit for this task (it's a verification/report-only task).
