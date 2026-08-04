import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FAQ } from "@/lib/site-data";

export function Faq() {
  return (
    <section className="bg-warm-white py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl text-sea-deep sm:text-4xl">Често задавани въпроси</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="rounded-2xl bg-card px-6 shadow-sm ring-1 ring-driftwood/10">
            {FAQ.map((item) => (
              <AccordionItem key={item.question} value={item.question} className="border-driftwood/15">
                <AccordionTrigger className="font-heading text-base text-sea-deep hover:no-underline">
                  <span className="flex items-center gap-2">
                    {item.question}
                    {item.isPlaceholder && (
                      <Badge variant="outline" className="border-driftwood/40 text-driftwood">
                        очаква се
                      </Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-driftwood">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
