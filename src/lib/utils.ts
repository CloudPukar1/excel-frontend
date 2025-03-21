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

export const generateMatrix = (
  rows: number,
  cols: number,
  startRow: number = 1,
  startCol: number = 1
) => {
  const data: string[][] = [];
  range(startRow, rows * 1000).forEach(() => {
    const innerData: string[] = [];
    range(startCol, cols * 26).forEach(() => {
      innerData.push("");
    });
    data.push(innerData);
  });
  return data;
};
