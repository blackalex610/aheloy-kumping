# Aheloyska Bitka Camping

Website for a client: a family-run campsite with bungalows, villas and caravan pitches near the beach in Aheloy, on the Bulgarian Black Sea coast.

**Live site:** [aheloyskabitka.com](https://aheloyskabitka.com)

---

## Brief

The client needed a website that would take bookings away from third-party listing portals and bring guests to them directly. It had to present each type of accommodation clearly, show prices up front, work well on a phone, and make it easy for a visitor to check dates and send an inquiry. The site is in Bulgarian, for the client's domestic audience.

## What was delivered

- **One-page home site** with sections for accommodation, camping, amenities, gallery, reviews, FAQ, the family's story and a contact map.
- **A dedicated page for each accommodation unit**, statically generated from a single data source, with its own photo grid, amenities, capacity, price and search metadata.
- **Booking inquiry form** with date pickers and validation. Submissions are delivered to the owner by email through Web3Forms, with a honeypot field against spam bots and the phone number shown if delivery fails.
- **Photo gallery** with category filters, a lightbox and an interactive circular carousel with drag momentum.
- **Mobile-first layout** with a sticky call-to-action bar on phones so the call and inquiry buttons are always one tap away.
- **Motion design:** scroll reveals, parallax, split-text headings and smooth scrolling, tuned to stay out of the way of the content.

## Implementation notes

- **Content in one place.** Every string, price, link and fact lives in `lib/site-data.ts`. Anything the client had not supplied yet is marked as a placeholder and rendered visibly as one, so nothing on the live site is invented.
- **Image performance.** All photos are served through `next/image`. A build script uses `sharp` to generate low-resolution blur placeholders for every image, stored in `lib/blur-data.json`, so the page never shows empty boxes while images load.
- **Static by default.** Unit pages use `generateStaticParams` and `generateMetadata`, so every page is prerendered with its own title and description.
- **Accessible components** built on Radix UI primitives through shadcn/ui.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui and Radix UI · Framer Motion · GSAP · Lenis · React Hook Form and Zod · date-fns · sharp · Vercel

## Project structure

```
app/
  page.tsx                  home page, composed from section components
  bungala/[slug]/page.tsx   statically generated page per accommodation unit
components/
  sections/                 hero, accommodation, camping, amenities, gallery, reviews, FAQ, contact
  booking/                  inquiry form and date fields
  motion/                   reveal, parallax, split text, counters, smooth scroll
  layout/                   navbar, mobile navigation, sticky mobile CTA, footer
  ui/                       shadcn/ui components and the circular gallery
lib/
  site-data.ts              all site content
  images.ts                 image catalogue and gallery categories
  blur-data.json            generated blur placeholders
scripts/                    blur placeholder generation
```

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

To send inquiries by email, set `NEXT_PUBLIC_WEB3FORMS_KEY` to a Web3Forms access key. Without it, the form falls back to opening the visitor's email client.

## Author

Designed and developed by **Nikolay Nikolaev**.
