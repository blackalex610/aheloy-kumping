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
