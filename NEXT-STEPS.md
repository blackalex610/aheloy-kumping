# Next steps — 2026-08-18

Handoff notes for the remaining polish work on this Next.js 16 campground site (Къмпинг Ахелойска Битка). The big redesign pass (per-unit detail pages, real reviews, Camping/Amenities/Nearby/About redesigns) is done and pushed to `origin/master`. This file covers what's left, requested directly by the site owner.

No test framework exists in this repo — verify everything with `npm run build` + `npm run lint` + manual checks in `npm run dev`, same pattern used throughout this project.

## 1. Gallery pagination

**File:** `components/sections/gallery.tsx`

Currently renders every image matching the active `GALLERY_CATEGORIES` tab in one long grid (`getGalleryImages(active)` from `lib/images.ts`, ~5-54 images depending on tab). Owner wants Google-search-results-style pagination: "page 1, page 2" controls at the bottom instead of one long infinite grid.

- Keep the existing tab-filter behavior (`GALLERY_CATEGORIES`, `getGalleryImages`) — do not touch `lib/images.ts`'s filtering logic.
- Add client-side pagination on top of the filtered `images` array: pick a page size that reads well in the existing `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` layout (e.g. 12 per page = 3 full rows at desktop width — owner hasn't specified an exact number, use judgment).
- Switching tabs must reset to page 1.
- Pagination control style: numbered pages like a search results footer, not "load more" / infinite scroll.
- Keep the existing `AnimatePresence`/`motion.div` grid transition if reasonable when the page changes.

## 2. FamilyStory section redesign

**File:** `components/sections/family-story.tsx`, data in `lib/site-data.ts` → `FAMILY_STORY`

Owner's own words: *"Повече от 8 години създаваме летни спомени / Къмпингът не е просто място за спане... this section is extremely basic."* Currently just a heading + one paragraph + one flat photo (`hammock-golden-hour`), same shape the About section had before its redesign.

- Bring it up to the same visual bar as the already-redesigned About section (`components/sections/about.tsx`): eyebrow label, layered/offset second photo, a stat chip (the old spec suggested "8+ години" reusing the `Counter` component — `FAMILY_STORY.title` already states "Повече от 8 години", so this fact already exists in copy, just needs visual surfacing), gradient divider.
- No new copy/facts — same "nothing invented" rule as the rest of this project (see `lib/site-data.ts`'s file-header comment).
- Pick a different secondary photo than About used (`bungalow-mint-curtains`) so the two sections don't look identical — check `lib/images.ts`'s `SITE_IMAGES` for an unused general/atmosphere photo.

## 3. Camping section — further redesign

**File:** `components/sections/camping.tsx`, data in `lib/site-data.ts` → `CAMPING`

Already has a real 6-photo mosaic (as of the last redesign pass) but owner still calls it "very basic." Current shape: heading + description + a plain 2-column feature checklist + photo mosaic, in a 2-column layout matching About/FamilyStory's original flat pattern.

- Needs a genuinely different composition, not just another photo grid — consider borrowing from the About redesign's toolkit (stat chip, eyebrow label) but land on something visually distinct from About/FamilyStory so the page doesn't feel repetitive.
- The spec that drove the photo-mosaic work (`docs/superpowers/specs/2026-08-17-full-site-redesign-polish-design.md`, "Camping redesign" section) called for "a small caption noting these are real photos of the pitches/grounds" — this was never implemented; fold it in here if it fits the new design.
- No new copy/facts — same rule as above.

## 4. Booking form — hide dates, keep the logic for later

**File:** `components/booking/inquiry-form.tsx`

Owner wants the check-in/check-out date pickers removed from the visible form *for now*, but the underlying code (the `DateField` component usage, the zod schema fields, the validation logic, the styling) kept intact so it can be flipped back on later — not deleted.

Current relevant code:
- `schema` (line ~17) has `checkIn`/`checkOut` as `z.date().optional()` plus three `.refine()` calls that currently make them de-facto required and cross-validate `checkOut > checkIn`.
- The JSX (line ~136) renders two `<Controller>` blocks driving `<DateField>` for `checkIn`/`checkOut`.
- `watch("checkIn")` (line 78) feeds `minDate` into the checkOut field.
- Both dates are included in `buildSummaryLines()` and the Web3Forms payload — these already fall back to `"-"` when the date is `undefined`, so no change needed there.

Approach: add a single `const DATES_ENABLED = false;` constant at the top of the file. Gate:
- The two `.refine()` calls that require `checkIn`/`checkOut` to be set, and the cross-validation, so they become no-ops when `DATES_ENABLED` is `false` (e.g. `.refine((d) => !DATES_ENABLED || !!d.checkIn, {...})`) — otherwise the form can never validate/submit once the fields are hidden.
- The two `<Controller>` JSX blocks, wrapped in `{DATES_ENABLED && (...)}`.
- Leave `DateField` itself (`components/booking/date-field.tsx`), the schema shape, and all summary/payload code untouched — flipping the constant back to `true` should fully restore the original behavior with no other changes needed.
- Check the grid layout still looks right with two fewer fields at the top (`grid grid-cols-1 sm:grid-cols-2`) — "Брой гости" will move up to fill the first slot.

## Reference

- Full spec from the redesign pass: `docs/superpowers/specs/2026-08-17-full-site-redesign-polish-design.md`
- Full implementation plan: `docs/superpowers/plans/2026-08-17-full-site-redesign-polish.md`
- Image upscale candidates already copied to `Downloads/upscaling needed/` on the owner's machine (15 files: villa7-bathroom/bedroom-amalfi-mural/bedroom-boardwalk-mural/bedroom-palm-mural/kitchen, troika-bathroom, pauza-bathroom/bedroom-double/bedroom-twin, and all 6 camping-*.jpg) — once upscaled, drop the replacements into `public/images/` with the same filenames, no code changes needed.
