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
import { Faq } from "@/components/sections/faq";
import { BookingCta } from "@/components/sections/booking-cta";
import { ContactMap } from "@/components/sections/contact-map";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />
      <FamilyStory />
      <QuickFacts />
      <Accommodation />
      <Camping />
      <Amenities />
      <Gallery />
      <Reviews />
      <Faq />
      <BookingCta />
      <ContactMap />
    </>
  );
}
