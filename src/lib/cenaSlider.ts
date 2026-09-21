// Non-linear price range: 0–10M by €1,000 steps, then 10.5M–50M by €500k steps

function buildCenaValues(): number[] {
  const vals: number[] = []
  for (let v = 0; v <= 10_000_000; v += 1_000) vals.push(v)
  for (let v = 10_500_000; v <= 50_000_000; v += 500_000) vals.push(v)
  return vals
}

export const CENA_VALUES = buildCenaValues()
// positions 0 → CENA_VALUES.length - 1

export function cenaValueToIdx(value: number): number {
  if (value <= 10_000_000) return Math.round(value / 1_000)
  return 10_000 + Math.round((value - 10_000_000) / 500_000)
}

export function formatCena(v: number): string {
  if (v >= 1_000_000) {
    const m = v / 1_000_000
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M €`
  }
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k €`
  return `${v} €`
}

// Sprejme vnose kot "1M", "1.5m", "500k", "1000000", "500 000 €" ...
export function parseCenaInput(text: string): number | null {
  const t = text.trim().toLowerCase().replace(/€/g, '').replace(/\s/g, '')
  if (!t) return null
  const m = t.match(/^(\d+(?:[.,]\d+)?)(k|m)?$/)
  if (!m) return null
  let num = parseFloat(m[1].replace(',', '.'))
  if (Number.isNaN(num)) return null
  if (m[2] === 'k') num *= 1_000
  if (m[2] === 'm') num *= 1_000_000
  return Math.round(num)
}
