// Non-linear price range: 0–10M by €1,000 steps, 10.5M–50M by €500k steps,
// 51M–500M by €1M steps (super-jahte itd.)

function buildCenaValues(): number[] {
  const vals: number[] = []
  for (let v = 0; v <= 10_000_000; v += 1_000) vals.push(v)
  for (let v = 10_500_000; v <= 50_000_000; v += 500_000) vals.push(v)
  for (let v = 51_000_000; v <= 500_000_000; v += 1_000_000) vals.push(v)
  return vals
}

export const CENA_VALUES = buildCenaValues()
// positions 0 → CENA_VALUES.length - 1

export function cenaValueToIdx(value: number): number {
  // Binarno iskanje prvega indeksa s CENA_VALUES[idx] >= value — neodvisno
  // od stopenj/mej v buildCenaValues, da jih lahko poljubno spreminjamo.
  if (value <= CENA_VALUES[0]) return 0
  const zadnji = CENA_VALUES.length - 1
  if (value >= CENA_VALUES[zadnji]) return zadnji
  let lo = 0
  let hi = zadnji
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (CENA_VALUES[mid] < value) lo = mid + 1
    else hi = mid
  }
  return lo
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
