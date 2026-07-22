/**
 * utils.ts - tiny helper to merge Tailwind classes conditionally.
 * (Same pattern shadcn/ui uses: clsx + tailwind-merge.)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
