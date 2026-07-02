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
