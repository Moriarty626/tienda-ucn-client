import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | undefined | null): string {
  if (price === undefined || price === null || price === "") return "$0";

  let num: number;
  if (typeof price === "number") {
    num = price;
  } else {
    const clean = String(price)
      .replace(/[^\d,.-]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "");
    const normalized = clean.replace(",", ".");
    num = Number.parseFloat(normalized);
  }

  if (isNaN(num)) return String(price);

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(num));
}
