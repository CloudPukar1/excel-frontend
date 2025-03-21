import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number = 1, end: number, step: number = 1) => {
  return Array.from(
    Array.from(Array(Math.ceil((end - start + 1) / step)).keys()),
    (x) => start + x * step
  );
};
