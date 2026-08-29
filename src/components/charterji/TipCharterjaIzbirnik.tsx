'use client'

import { Check } from 'lucide-react'
import type { TipCharterPlovila } from '@/types/database'

// Iste slike kot na /plovila (glej public/plovila-ikone) — "jahta" si
// deli sliko z eleganto jahto/motorno jahto, "motorni čoln" pa s
// športnim čolnom, ker za ta dva nimamo ločenih ilustracij.
const tipi: { vrednost: TipCharterPlovila; label: string; slika: string }[] = [
  { vrednost: 'jahta', label: 'Jahta', slika: 'motorni' },
  { vrednost: 'jadrnica', label: 'Jadrnica', slika: 'jadrnica' },
  { vrednost: 'motorni', label: 'Motorni čoln', slika: 'vsa-plovila' },
  { vrednost: 'gumenjak', label: 'Gumenjak', slika: 'gumenjak' },
]

export default function TipCharterjaIzbirnik({
  vrednost,
  onChange,
}: {
  vrednost: TipCharterPlovila | ''
  onChange: (v: TipCharterPlovila | '') => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tipi.map(({ vrednost: v, label, slika }) => {
        const izbrano = vrednost === v
        const maskStyle = {
          backgroundColor: 'currentColor',
          WebkitMaskImage: `url(/plovila-ikone/${slika}.png)`,
          maskImage: `url(/plovila-ikone/${slika}.png)`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        } as React.CSSProperties
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(izbrano ? '' : v)}
            className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-3 transition-all duration-200 ${
              izbrano
                ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0c2340] scale-105 shadow-lg shadow-[#c9a84c]/25'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {izbrano && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0c2340] text-[#c9a84c] flex items-center justify-center">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
            )}
            <span className="w-8 h-8 sm:w-9 sm:h-9" style={maskStyle} />
            <span className="text-xs sm:text-sm font-medium text-center leading-tight">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
