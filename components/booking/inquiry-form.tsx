"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateField } from "@/components/booking/date-field";
import { ACCOMMODATION_TYPES_FOR_FORM, BUSINESS } from "@/lib/site-data";

const schema = z
  .object({
    checkIn: z.date().optional(),
    checkOut: z.date().optional(),
    guests: z.string().min(1, "Моля въведете брой гости"),
    accommodationType: z.string().min(1, "Моля изберете тип настаняване"),
    name: z.string().min(2, "Моля въведете вашето име"),
    phone: z.string().min(6, "Моля въведете валиден телефон"),
    email: z.union([z.literal(""), z.string().email("Моля въведете валиден имейл")]).optional(),
    message: z.string().optional(),
    honeypot: z.string().optional(),
  })
  .refine((d) => !!d.checkIn, { message: "Моля изберете дата на пристигане", path: ["checkIn"] })
  .refine((d) => !!d.checkOut, { message: "Моля изберете дата на отпътуване", path: ["checkOut"] })
  .refine((d) => !d.checkIn || !d.checkOut || d.checkOut > d.checkIn, {
    message: "Датата на отпътуване трябва да е след датата на пристигане",
    path: ["checkOut"],
  });

type FormValues = z.infer<typeof schema>;

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function buildSummaryLines(data: FormValues) {
  return [
    `Дата на пристигане: ${data.checkIn ? format(data.checkIn, "dd.MM.yyyy") : "-"}`,
    `Дата на отпътуване: ${data.checkOut ? format(data.checkOut, "dd.MM.yyyy") : "-"}`,
    `Брой гости: ${data.guests}`,
    `Тип настаняване: ${data.accommodationType}`,
    `Име: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email || "-"}`,
    `Съобщение: ${data.message || "-"}`,
  ];
}

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

  const checkIn = watch("checkIn");

  async function onSubmit(data: FormValues) {
    if (data.honeypot) return; // bot trap — silently drop

    if (!WEB3FORMS_KEY) {
      const lines = buildSummaryLines(data);
      const subject = encodeURIComponent(`Запитване за резервация — ${data.name}`);
      const body = encodeURIComponent(lines.join("\n"));
      toast.info(
        `Формата все още не е свързана към имейл. Отваряме вашия имейл клиент — или ни се обадете направо на ${BUSINESS.phoneDisplay}.`,
        { duration: 7000 }
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Запитване за резервация — ${data.name}`,
          "Дата на пристигане": data.checkIn ? format(data.checkIn, "dd.MM.yyyy") : "-",
          "Дата на отпътуване": data.checkOut ? format(data.checkOut, "dd.MM.yyyy") : "-",
          "Брой гости": data.guests,
          "Тип настаняване": data.accommodationType,
          Име: data.name,
          Телефон: data.phone,
          Email: data.email || "-",
          Съобщение: data.message || "-",
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Запитването е изпратено успешно! Ще се свържем с вас скоро.");
        reset();
      } else {
        throw new Error(result.message ?? "Web3Forms error");
      }
    } catch {
      toast.error(`Възникна грешка при изпращането. Моля обадете се на ${BUSINESS.phoneDisplay}.`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      {/* honeypot — hidden from real visitors, bots tend to fill every field */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("honeypot")}
      />

      <Controller
        control={control}
        name="checkIn"
        render={({ field }) => (
          <DateField
            id="checkIn"
            label="Дата на пристигане"
            value={field.value}
            onChange={field.onChange}
            error={errors.checkIn?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="checkOut"
        render={({ field }) => (
          <DateField
            id="checkOut"
            label="Дата на отпътуване"
            value={field.value}
            onChange={field.onChange}
            minDate={checkIn}
            error={errors.checkOut?.message}
          />
        )}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guests">Брой гости</Label>
        <Input
          id="guests"
          type="number"
          min={1}
          max={20}
          placeholder="напр. 4"
          className="h-10"
          aria-invalid={!!errors.guests}
          {...register("guests")}
        />
        {errors.guests && <p className="text-xs text-destructive">{errors.guests.message}</p>}
      </div>

      <Controller
        control={control}
        name="accommodationType"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="accommodationType">Тип настаняване</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="accommodationType" className="h-10 w-full" aria-invalid={!!errors.accommodationType}>
                <SelectValue placeholder="Изберете тип" />
              </SelectTrigger>
              <SelectContent>
                {ACCOMMODATION_TYPES_FOR_FORM.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accommodationType && (
              <p className="text-xs text-destructive">{errors.accommodationType.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Име</Label>
        <Input id="name" placeholder="Вашето име" className="h-10" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+359 88 000 0000"
          className="h-10"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-10"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="message">Съобщение</Label>
        <Textarea id="message" rows={4} placeholder="Разкажете ни повече за вашето пребиваване..." {...register("message")} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="h-12 gap-2 bg-sea-deep text-base text-warm-white hover:bg-sea-deep/90 sm:col-span-2"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Изпращане..." : "Изпрати запитване"}
      </Button>
    </form>
  );
}
