import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-9 w-9 shrink-0", className)} aria-hidden>
      <circle cx="24" cy="24" r="23" fill="#0B3A53" />
      <path
        d="M7 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
        stroke="#DCC7A1"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M7 34c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
        stroke="#3E7C8C"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M24 9c-3.2 4-3.2 8.5 0 12.5"
        stroke="#66734A"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.22em] uppercase",
            light ? "text-sand" : "text-olive"
          )}
        >
          Къмпинг
        </span>
        <span
          className={cn(
            "font-heading text-lg tracking-tight",
            light ? "text-warm-white" : "text-sea-deep"
          )}
        >
          Ахелойска Битка
        </span>
      </span>
    </span>
  );
}
