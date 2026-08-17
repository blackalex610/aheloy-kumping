# Full site redesign polish: detail pages, real reviews, section redesigns

Date: 2026-08-17

## Context

This supersedes `2026-08-13-production-polish-design.md`, which was written and committed but never implemented (no `/bungala` route exists yet, `Accommodation`/`Camping`/`Reviews` are unchanged from the original build). This spec carries forward the parts of that plan that still apply and replaces the parts that don't, based on direct owner feedback:

- **Keep**: routing move to `app/layout.tsx`, `/bungala/[slug]` detail pages, shared lightbox, per-unit `description` field, image upscale audit, repo hygiene.
- **Drop**: the Gallery restructure into per-unit cards. The owner explicitly wants Gallery untouched.
- **Reverse**: the old spec excluded Amenities and Nearby from redesign. The owner explicitly wants both redesigned now (fewer/better icons, less "AI icon grid" feel).
- **New**: rename "Нашите бунгала" (the lineup includes a caravan, not just bungalows), redesign About and Camping beyond light polish (both currently read as "text next to one photo"), and replace the Reviews empty-state with real curated guest reviews.

The owner also supplied a new folder of raw source material, `aheloyska bitka OSHTE SNIMKOV MATERIAL/` — mostly Facebook reaction-icon thumbnails (skip), but six genuine, decent-quality campsite photos worth using for the Camping section, which currently has only one real photo plus a "no image" placeholder box.

`lib/site-data.ts`'s standing policy remains in force: nothing is invented. Prices, distances, and features already on the site stay as the single source of truth; new copy (unit descriptions, review curation) is composed only from facts/quotes that already exist.

## Goals

1. Give each accommodation unit its own page (photos, description, features, booking path) and make every accommodation card on the homepage a real link to it.
2. Rename the accommodation section so it reflects bungalows *and* the caravan.
3. Redesign About ("Място за истинска почивка") and Camping ("Къмпинг сред природата") from flat text+photo/placeholder layouts into composed, production-grade sections — Camping gets real new photos instead of a "coming soon" box.
4. Redesign Amenities and Nearby to use far fewer icons and read as intentional design, not a generic icon grid.
5. Replace the Reviews empty state with a curated set of real guest reviews (verbatim, sourced, attributed) supplied by the owner.
6. Produce a final image-upscale audit list (research only, no upscaling performed).
7. General placeholder removal so the site has no "coming soon" / dashed-box treatments left.

## Non-goals

- No changes to Gallery's design, filtering, or data (`gallery.tsx`, `GALLERY_CATEGORIES`, `getGalleryImages` all stay as-is).
- No redesign of Hero, QuickFacts, WhyChooseUs, Faq, or ContactMap.
- No fabricated photos, reviews, or facts. Review text is quoted verbatim from what the owner supplied, with source/attribution.
- No CMS/backend. Data stays in `lib/site-data.ts` / `lib/images.ts`.
- No changes to the booking form's submission mechanism.
- No upscaling of images — audit only.

## Architecture

### Routing & shared chrome

`Navbar`, `Footer`, `StickyMobileCta` move from `app/page.tsx` into `app/layout.tsx` wrapping `{children}`, so the new route family gets them for free. `app/page.tsx` keeps only the section list. All internal hrefs that currently point at same-page anchors (`NAV_LINKS`, `CTA.bookingFormHref`, `CTA.contactHref`, footer/logo links) become root-relative (`/#hero`, `/#accommodation`, etc.) so they still work correctly from `/bungala/[slug]`. Section `id`s are untouched.

### Data model additions (`lib/images.ts`)

- Add optional `unitSlug?: string` to `SiteImage`, set on every image belonging to a specific accommodation unit (all `villa7-*`, `briz-*`, `pauza-*`, `troika-*`, `caravan-seaview-*`, plus `terrace-blue-curtains` → `bungalo-chetvorka-ednostaen` and `bungalow-tree-deck` → `bungalo-dvoika`).
- Add `getUnitGallery(unitSlug: string): SiteImage[]` for the detail page's photo grid. (`getMiscImages`/gallery restructuring from the old spec is **not** added — out of scope now.)
- Add `"camping"` to the `ImageCategory` union for the six new Camping photos below. It is **not** added to `GALLERY_CATEGORIES` (no new tab), so these photos have no dedicated Gallery filter. They will still appear under Gallery's existing "Всички" tab as an incidental side effect of being in `SITE_IMAGES` — acceptable, since Gallery's design/behavior itself is unchanged.
- Six new `SiteImage` entries, sourced from `aheloyska bitka OSHTE SNIMKOV MATERIAL/`, copied into `public/images/` and re-encoded as consistent `.jpg`:

  | New slug | Source file | Native size | Content |
  |---|---|---|---|
  | `camping-sunset-motorhome` | `imgi_2_46087483_...jpg` | 960×640 | Backlit motorhome at golden hour — atmospheric/featured shot |
  | `camping-entrance-gate` | `imgi_27_751295038_...jpg` | 720×540 | Entrance gate with the VW camper, reception building |
  | `camping-tent-pitch-cars` | `imgi_34_747795590_...jpg` | 590×294 | Tent pitch under trees with cars |
  | `camping-caravan-awning` | `imgi_35_749300564_...jpg` | 590×443 | Caravan with awning under a tree |
  | `camping-pitches-overview` | `imgi_36_750871078_...jpg` | 590×443 | Wide shot of multiple pitches, gazebo, cars |
  | `camping-tent-motorcycle` | `imgi_37_749286551_...jpg` | 590×443 | Tent pitch with motorcycle and car |

  Blur placeholders for these six get added to `lib/blur-data.json` (small base64-encoded thumbnails generated directly from the source files, same pattern already used for the `villa7-*`/`briz-*`/etc. entries already present in that file).

### Data model additions (`lib/site-data.ts`)

- Add `description: string` (1–2 sentences) to each `AccommodationUnit`, composed only from existing `features`/`capacity`/`priceLabel`:

  | Unit | Description |
  |---|---|
  | Вила | Просторна вила за до 7 човека с три спални, климатик и голяма тераса с барбекю — идеална за по-голямо семейство или компания приятели. |
  | Бунгало „Морски бриз“ | Двустайно бунгало за до 4 човека с климатик и закрита тераса за отдих — уютно място за семейство с деца. |
  | Бунгало „Лятна пауза“ | Двустайно бунгало за до 4 човека с отделна спалня с единични легла — практично решение за семейство или компания приятели. |
  | Бунгало за четирима, едностайно | Едностайно бунгало за до 4 човека с тераса, люлка и барбекю — просто и функционално настаняване на добра цена. |
  | Бунгало за трима | Бунгало за до 3 човека със сенчеста тераса и кухненски бокс — компактно и удобно за по-малка компания. |
  | Каравана „Морска гледка“ | Напълно оборудвана каравана пред морето за до 2 човека, с климатик и покрита тераса за хранене. |
  | Бунгало за двама | Компактно бунгало за до 2 човека с кухненски кът и навес с маса — най-достъпният вариант за двойка. |

- Rename the accommodation section copy: `ACCOMMODATION` gets a new `sectionTitle: "Нашите предложения за настаняване"` / `sectionSubtitle` pair (currently hardcoded inline in `accommodation.tsx` as "Нашите бунгала"). `NAV_LINKS`'s "Бунгала" entry becomes "Настаняване". Section `id="accommodation"` unchanged.
- `AMENITIES`: add `highlight?: boolean` to the `Amenity` interface. Mark 5 as highlighted (Паркинг, Wi-Fi, Климатик, Барбекю, Детски кът); the rest keep their icon field (unused by the new highlighted-card rendering) but render in a plain compact text list.
- `CAMPING`: `imageSlugs` grows from `["terrace-gazebo-bbq"]` to include the 6 new slugs above; `placeholder` field is removed (no longer needed — replaced by real photos).
- `REVIEWS`: remove `emptyStateTitle`/`emptyStateText` (no longer used). Add `list: ReviewItem[]` with this new interface and curated content:

  ```ts
  export interface ReviewItem {
    author: string;
    rating: number; // 1-5
    source: "Google";
    timeLabel: string; // as given, e.g. "2 years ago", "a week ago"
    text: string; // verbatim, original language
  }
  ```

  Curated 8, verbatim from the owner-supplied list, spanning ratings/recency for authenticity (includes one modestly-worded "everything is old but it works" quote, consistent with the site's existing honesty policy, alongside recent 2026 reviews):

  1. **Skyi connick**, 4★, "2 years ago" — "Great if you're looking for a campsite next to the beach, basic facilities but very clean everyday. The owners are lovely and very welcoming. The campsite has a lot of shade from there trees which gives a pleasant stay."
  2. **Aleksandra**, 4★, "4 years ago" — "The place is really quiet and nice. The buildings are old but toilets and showers are cleaned every day. The owners are really kind. We stayed only for one night with a van and a tent and had a really good night."
  3. **Fikret Sefiloğlu**, 4★, "9 years ago" — "By the sea. Among the fruit trees. Caravan parking places are good. The price is very reasonable. Family business. The family are good people."
  4. **Valentin Radev**, 4★, "10 years ago" — "If you like cozy place away from the city noise just on the sea shore - this is the right place for you."
  5. **Dawid**, 4★, "10 years ago" — "Everything is old but it do its thing. Staff speaks english. You have a lot of shadow for tent and a lot of space for yourself which is nice."
  6. **Sassa T**, 5★, "9 years ago" — "We were in bungalow. Basic accommodation, but very cheap and very kind hosts."
  7. **Korina Pallikaraki**, 5★, "a week ago" — "Cute camping with good shadows. Clean showers and toilets. Very friendly owners."
  8. **Sinem Öğretmen**, 5★, "4 weeks ago" — "We didn't expect it to be this beautiful. If it had fit into our schedule, we would have liked to stay a few more days."

  `rating`/`reviewCount` aggregate fields (4.3 / 205) stay unchanged — they're the stated Google Business figures, not derived from this list.

### New route: `app/bungala/[slug]/page.tsx`

- `generateStaticParams()` returns all 7 `ACCOMMODATION` slugs.
- `generateMetadata()` sets title/description per unit.
- Unknown slug → `notFound()`.
- Layout: breadcrumb (Начало / Настаняване / *[unit name]*) → full-bleed parallax hero (first gallery image, capacity + price badges) → description + feature checklist → photo grid (`getUnitGallery`, opens shared `Lightbox`) → booking panel linking to `/#booking?unit=<unit name>` + call button → back link.
- Shares `Navbar`/`Footer`/`StickyMobileCta` via the root layout.

### Booking form pre-selection

`components/sections/booking-cta.tsx` reads `?unit=` via `useSearchParams()` and passes a `defaultAccommodationType` prop down to `InquiryForm`, seeding `accommodationType`. No other booking-flow changes.

### Reusable Lightbox

New `components/media/lightbox.tsx`: fullscreen overlay, Framer Motion fade/scale, `Esc` to close, `←/→` to navigate, click-outside to close, image counter. Used only by unit detail pages' photo grids (not by Gallery).

### Accommodation section changes (`components/sections/accommodation.tsx`)

- Heading/subtitle sourced from new `ACCOMMODATION_SECTION` (or inline constants) reading "Нашите предложения за настаняване".
- Each `AccommodationCard` becomes a real link (whole card, not just the button) to `/bungala/${unit.slug}`; the existing "Провери свободни дати" button stays as a secondary in-card action (stops propagation, still jumps straight to the booking form) so both flows work.

### About redesign (`components/sections/about.tsx`)

Replace the flat single-photo layout with: an eyebrow label ("ЗА НАС") above the heading; an asymmetric two-photo composition — the existing photo plus a second real photo (already in `lib/images.ts`) offset/rotated slightly behind it for depth; a large typographic stat treatment surfacing "50 м от плажа" (reusing the existing `Counter` component) instead of leaving that fact buried in a paragraph; a thin gradient divider between heading and paragraphs. No new copy invented.

### Camping redesign (`components/sections/camping.tsx`)

Replace the single photo + dashed `ImageOff` box with a photo mosaic built from the 6 new real photos: `camping-pitches-overview` as the larger "featured" tile (most informative — shows multiple pitches), the other 5 (including `terrace-gazebo-bbq`, already on the site) as smaller supporting tiles, laid out beside the existing feature list. A small caption notes these are real photos of the pitches/grounds (honest, not "coming soon"). `CAMPING.placeholder` field and its `ImageOff` rendering are removed entirely.

### Amenities redesign (`components/sections/amenities.tsx`)

Replace the uniform 13-icon grid with: 5 "highlighted" amenities (`highlight: true`) rendered as larger icon+label cards with more visual weight, followed by the remaining amenities as a compact plain-text list/line (no icons) below. Net icon count on the page drops from 13 to 5.

### Nearby redesign (`components/sections/nearby.tsx`)

Keep the distance data and copy as-is; change rendering so only the first item (Плаж) shows its icon — the rest render as a clean typographic list (large distance number + label, no per-item icon). No data model change required; purely a component-level rendering change (icon shown conditionally on array index 0).

### Reviews redesign (`components/sections/reviews.tsx`)

Replace the dashed empty-state card with a grid/carousel of review cards built from `REVIEWS.list` — each card shows star rating, author, relative time, source, and quoted text, using the existing card system (`bg-card`/`ring-driftwood/10`) with a small quote-icon accent. Aggregate rating/count block above stays as-is.

### Repo hygiene

`.gitignore` gains entries for the raw source-photo folders that should never be committed: `bungalo za trima/`, `dvustajno bungalo za chetirima лятна пауза/`, `karavana morska gledka/`, `вила за седем човека/`, `двустайно бунгало за четирима морски бриз/`, `aheloyska bitka OSHTE SNIMKOV MATERIAL/`.

### Image upscale audit (deliverable, not implemented)

Long edge under ~1000–1100px, or a narrow original — candidates for upscaling once the owner has a higher-res source:

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
| camping-tent-pitch-cars.jpg | 590×294 (new) |
| camping-caravan-awning.jpg | 590×443 (new) |
| camping-pitches-overview.jpg | 590×443 (new) |
| camping-tent-motorcycle.jpg | 590×443 (new) |
| camping-entrance-gate.jpg | 720×540 (new) |
| camping-sunset-motorhome.jpg | 960×640 (new, least urgent) |

## Testing / verification

- `npm run build` succeeds (new static routes, `generateStaticParams`, TypeScript).
- Manual dev-server pass: homepage sections render; accommodation cards navigate to the correct detail pages; lightbox opens/closes/navigates (mouse + keyboard) on detail pages; booking form pre-selects the right unit via `?unit=`; all nav/footer/sticky-CTA links work identically from `/` and from `/bungala/[slug]`; reduced-motion users still get functional non-animated interactions.
- Visual check of About/Camping/Amenities/Nearby/Reviews against the rest of the site's spacing/card language; confirm no dashed-box or "ImageOff" placeholder treatments remain anywhere on the site.
- Confirm Gallery is byte-for-byte unchanged in behavior (still shows the 6 new camping photos under "Всички" only, as an accepted side effect).
