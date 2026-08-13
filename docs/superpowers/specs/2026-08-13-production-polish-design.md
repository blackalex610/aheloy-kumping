# Production polish + per-unit detail pages + gallery restructure

Date: 2026-08-13

## Context

The site is a single-page Next.js 16 app (`app/page.tsx`) for Къмпинг Ахелойска Битка, a family campground in Aheloy, Bulgaria, offering 7 accommodation units (villa, 2 two-room bungalows, a one-room bungalow, a 3-person bungalow, a 2-person bungalow, and a caravan) plus tent/caravan camping spots. It already has a real design system: brand palette, a shared `CinematicImage` photo treatment (grain/vignette/scrim), Framer Motion reveals, a GSAP pinned horizontal scroll for the accommodation cards, and Lenis smooth scroll. `lib/site-data.ts` documents an explicit policy: nothing on the site is invented — unverified facts (check-in times, deposit policy, real reviews) are marked `isPlaceholder` and shown honestly rather than faked. This spec must preserve that policy.

Real per-unit photos exist for 5 of 7 units (villa, "Морски бриз", "Лятна пауза", "Бунгало за трима", "Каравана морска гледка" — all already copied into `public/images` and wired into `lib/images.ts`/`lib/site-data.ts` from a previous session). Two units ("Бунгало за четирима, едностайно" and "Бунгало за двама") still only have one generic illustrative photo each, flagged `isPlaceholderImage`. This stays as-is — no new photos will be fabricated.

## Goals

1. Give each accommodation unit its own page with photos, description, pricing, and a booking path.
2. Restructure the homepage Gallery from a flat tag-filtered grid into sections: one clickable card per accommodation object, plus one "misc photos" card for general shots not tied to a unit.
3. Polish the two plain text+image sections (About, FamilyStory) with tasteful microinteractions and better use of space.
4. Replace the three "dashed box / broken image icon" placeholder treatments (Camping, Reviews empty state) with tastefully designed cards — without inventing any content.
5. Produce a list of low-resolution images worth upscaling (research only; no upscaling performed by Claude).
6. General visual/interaction polish pass so the whole site reads as production-ready.

## Non-goals

- No fabricated photos, reviews, or facts. The existing `isPlaceholder*` flags stay, just restyled.
- No CMS / backend — data stays in `lib/site-data.ts` / `lib/images.ts`.
- No changes to the booking form's submission mechanism (Web3Forms / mailto fallback).
- No visual redesign of sections not called out above (Hero, QuickFacts, WhyChooseUs, Amenities, Nearby, Faq, ContactMap) beyond the small shared microinteraction pass in "Sitewide polish" below.

## Architecture

### Routing & shared chrome

Currently `Navbar`, `Footer`, and `StickyMobileCta` are rendered directly inside `app/page.tsx`. With a second route family (`/bungala/[slug]`) being added, these move into `app/layout.tsx` wrapping `{children}`, so every route gets them once. `app/page.tsx` keeps only the section list.

All internal hrefs that currently point at same-page anchors (`#hero`, `#accommodation`, `#booking`, `#contact`, `#booking-form`, etc., defined in `NAV_LINKS`/`CTA`/`Logo` link/footer) become root-relative (`/#hero`, `/#accommodation`, ...). A plain `<a href="/#accommodation">` behaves identically to `<a href="#accommodation">` when already on `/`, and correctly navigates home-then-scrolls from any other route. Section `id`s themselves are untouched.

### Data model additions

`lib/images.ts`:
- Add optional `unitSlug?: string` to `SiteImage`, set on every image that belongs to a specific accommodation unit (all `villa7-*`, `briz-*`, `pauza-*`, `troika-*`, `caravan-seaview-*` images, plus `terrace-blue-curtains` → `bungalo-chetvorka-ednostaen` and `bungalow-tree-deck` → `bungalo-dvoika`, matching the current `imageSlug`/`isPlaceholderImage` wiring in `ACCOMMODATION`).
- Add `getUnitGallery(unitSlug: string): SiteImage[]` and `getMiscImages(): SiteImage[]` (images with no `unitSlug`).

`lib/site-data.ts`:
- Add `description: string[]` (1–2 sentences) to each `AccommodationUnit`, composed only from existing facts already present in `features`/`capacity`/`priceLabel` — no new claims.

### New route: `app/bungala/[slug]/page.tsx`

- `generateStaticParams()` returns all 7 `ACCOMMODATION` slugs (fully static, no runtime params).
- `generateMetadata()` sets title/description per unit for SEO.
- Unknown slug → `notFound()`.
- Layout, top to bottom:
  1. Breadcrumb: Начало / Бунгала / *[unit name]*.
  2. Full-bleed parallax hero (`CinematicImage` + existing `Parallax`) using the unit's first gallery image; capacity + price badges overlaid, same visual language as the homepage hero.
  3. Description paragraphs + feature checklist (reusing the `Check` list pattern already used on the homepage cards).
  4. Photo grid of the unit's full gallery (`getUnitGallery`); clicking any photo opens the shared Lightbox at that index. For the 2 units with only one illustrative photo, the existing "Илюстративна снимка" badge is shown here too, honestly carrying the caveat onto the detail page.
  5. Booking panel: "Провери свободни дати" button linking to `/#booking?unit=<encoded unit name>` (unit name already matches an `ACCOMMODATION_TYPES_FOR_FORM` entry 1:1 for all 7 units), plus a call button.
  6. Back link to the homepage gallery/accommodation section.
- Shares `Navbar`/`Footer`/`StickyMobileCta` via the new root layout.

### Booking form pre-selection

`components/sections/booking-cta.tsx` (client) reads `?unit=` via `useSearchParams()` on mount and, if it matches an `ACCOMMODATION_TYPES_FOR_FORM` value, passes it down as a `defaultAccommodationType` prop to `InquiryForm`, which seeds `accommodationType` in its `defaultValues`/via `setValue`. No other booking-flow changes.

### Reusable Lightbox

New `components/media/lightbox.tsx` (client): fullscreen overlay, Framer Motion fade/scale in/out, `Esc` to close, `←/→` to navigate, click-outside to close, image counter ("3 / 12"), rendered via the existing `CinematicImage` with `vignette={false} scrim={false}` (full clarity for viewing) but `grain` kept for texture continuity. Used by:
- The Gallery section's "Разни снимки" card (opens with all misc images).
- Each unit detail page's photo grid (opens with that unit's gallery).

### Gallery section rewrite (`components/sections/gallery.tsx`)

Replaces the category-tab + flat grid with a grid of cards:
- One card per `ACCOMMODATION` unit: cover photo (`unit.imageSlug`), unit name, photo-count badge, hover lift + arrow affordance; links to `/bungala/${unit.slug}`.
- One final "Разни снимки" card (cover photo e.g. `beach-01`, count = misc image count); on click opens the Lightbox in place instead of navigating.
- Facebook link + booking CTA below stay as-is.
- `GALLERY_CATEGORIES` tab UI is removed from this component. It (and `ImageCategory`/`getGalleryImages`) are used nowhere else in the codebase, so they are deleted from `lib/images.ts` rather than left as dead exports; the per-image `category` field itself stays (still useful metadata) but the category-filtering API goes.

### About / FamilyStory polish

Both sections get, within their existing 2-column `Reveal`-based layout:
- A small uppercase "eyebrow" label above the heading (e.g. "ЗА НАС", "НАШАТА ИСТОРИЯ") for hierarchy.
- A layered secondary photo peeking behind/beside the main image (a second real image already in `lib/images.ts`, offset + rotated slightly, subtle shadow) for visual depth instead of a single flat rectangle.
- A small stat chip overlapping the image corner, reusing the existing `Counter` component (About: "50 м от плажа"; FamilyStory: "8+ години"), both facts already stated elsewhere on the site.
- A thin gradient divider between heading and paragraphs.
- Slightly stronger hover/parallax response on the image block.

No new copy is invented — only existing facts are re-surfaced visually.

### Placeholder redesign (no fabricated content)

- **Camping** (`components/sections/camping.tsx`): remove the dashed `ImageOff` box. New layout: the one real photo (`terrace-gazebo-bbq`) shown larger/featured, paired with a designed "info card" (rounded, `bg-card`/`ring-driftwood/10` matching the rest of the site's card system, tent icon in a colored circle) carrying the same honest "more photos coming soon" copy — styled as an intentional feature, not a broken image.
- **Reviews** (`components/sections/reviews.tsx`): swap the `border-dashed` empty-state box for a solid designed card (same card system, small quote-icon accent), same honest copy.
- **Accommodation** placeholder badge: kept as-is (already a tasteful small pill), now also surfaced on the corresponding unit's detail page hero.

### Sitewide microinteraction pass (small, targeted)

- Nav links: animated underline on hover instead of only an opacity fade.
- Gallery/unit cards: hover lift (translateY + shadow), consistent with the existing `AccommodationCard` hover treatment.
- No unrelated redesign of Hero/QuickFacts/WhyChooseUs/Amenities/Nearby/Faq/ContactMap.

### Repo hygiene

- `.gitignore` gets entries for the 4 untracked raw-photo folders (Viber export dumps already processed into `public/images`), so they stay on disk but are never committed.

### Image upscale audit (deliverable, not implemented)

Full-resolution audit of all 48 images in `public/images` was already run. Candidates for upscaling (long edge under ~1000–1100px, noticeably soft if shown large on a detail-page hero or full-width grid tile):

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

This list is handed to the user at the end of the write-up; no upscaling action is taken as part of this work.

## Testing / verification

- `npm run build` must succeed (validates the new static routes, `generateStaticParams`, and TypeScript).
- Manual pass in a running dev server: homepage sections render, gallery cards navigate to the right detail pages, lightbox opens/closes/navigates with mouse and keyboard, misc card opens lightbox in place, booking form pre-selects the right unit when arriving via `?unit=`, all nav/footer/sticky-CTA links work identically from `/` and from a `/bungala/[slug]` page, reduced-motion users still get functional (non-animated) interactions.
- Visual check of About/FamilyStory/Camping/Reviews against the rest of the site's spacing/card language.
