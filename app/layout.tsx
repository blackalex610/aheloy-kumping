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
