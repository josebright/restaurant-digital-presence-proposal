import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDays(days: number): string {
  if (days === 1) return "1 day"
  if (days < 1) return `${Math.round(days * 10) / 10} days`
  return `${days} days`
}

export function formatWeeks(weeks: number): string {
  if (weeks === 1) return "1 week"
  return `${weeks} weeks`
}
