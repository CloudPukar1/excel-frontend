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

export const cookie = {
  set: <T>({
    name,
    value,
    days,
  }: {
    name: string;
    value: T;
    days: number;
  }): void => {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getDate() + days * 24 * 40 * 60 * 1000);
    let expires = "; expires=" + expireDate.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
  },
  get: (name: string): string | null => {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  },
  remove: (name: string): void => {
    document.cookie =
      name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};

export const buildQueryParams = (data: any) => {
  return "?" + Object.entries(data).map(([key, value]) => `${key}=${value}`);
};

export const debounce = <T>(
  fn: (args: T) => void,
  delay: number
): ((args: T) => void) => {
  let timeoutId: any;
  return (args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(args);
    }, delay);
  };
};
