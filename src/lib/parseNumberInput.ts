// Sprejme prost vnos kot "5", "5,5", "10 m", "10m" ... in vrne golo stevilo.
export function parsePlainNumber(text: string): number | null {
  const t = text.trim().toLowerCase().replace(',', '.').replace(/[^0-9.]/g, '')
  if (!t) return null
  const n = parseFloat(t)
  return Number.isNaN(n) ? null : Math.round(n)
}
