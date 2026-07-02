import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCena(cena: number): string {
  return new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cena)
}

export function formatDatum(datum: string): string {
  return new Intl.DateTimeFormat('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(datum))
}
