import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Resolves an icon name string from site-data (e.g. "Waves") into its Lucide component. */
export function getIcon(name: string): LucideIcon {
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  if (!icon) throw new Error(`Unknown lucide icon: ${name}`);
  return icon;
}
