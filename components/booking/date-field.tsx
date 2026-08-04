"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  id: string;
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  error?: string;
}

const today = new Date(new Date().setHours(0, 0, 0, 0));

export function DateField({ id, label, value, onChange, minDate, error }: DateFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-sea-deep">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={!!error}
            className={cn(
              "h-10 w-full justify-start gap-2 border-input font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-olive" />
            {value ? format(value, "d MMMM yyyy", { locale: bg }) : "Изберете дата"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={{ before: minDate ?? today }}
            locale={bg}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
