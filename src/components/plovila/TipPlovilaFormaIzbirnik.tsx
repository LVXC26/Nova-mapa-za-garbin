'use client'

import { Check, Anchor } from 'lucide-react'
import type { TipPlovila } from '@/types/database'

// Ista ilustrirana slika kot TipPlovilaIzbirnik (glej public/plovila-ikone),
// prilagojeno za obrazec "Dodaj plovilo": izbira je obvezna (brez "Vsa
// plovila"/toggle-off), zato tu namesto tega ponudimo "Drugo" — za to nimamo
// posebne ilustracije, zato uporabimo lucide Anchor ikono.
const tipi: { vrednost: TipPlovila; label: string; slika?: string }[] = [
  { vrednost: 'jadrnica', label: 'Jadrnica', slika: 'jadrnica' },
  { vrednost: 'motorni', label: 'Motorni čoln', slika: 'motorni' },
  { vrednost: 'gumenjak', label: 'Gumenjak', slika: 'gumenjak' },
  { vrednost: 'katamaran', label: 'Katamaran', slika: 'katamaran' },
  { vrednost: 'jet', label: 'Jet ski', slika: 'jet-ski' },
  { vrednost: 'drugo', label: 'Drugo' },
]

export default function TipPlovilaFormaIzbirnik({
  vrednost,
  onChange,
}: {
  vrednost: TipPlovila
  onChange: (v: TipPlovila) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tipi.map(({ vrednost: v, label, slika }) => {
        const izbrano = vrednost === v
        const maskStyle = slika
          ? ({
              backgroundColor: 'currentColor',
              WebkitMaskImage: `url(/plovila-ikone/${slika}.png)`,
              maskImage: `url(/plovila-ikone/${slika}.png)`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            } as React.CSSProperties)
          : undefined
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 transition-all ${
              izbrano
                ? 'bg-[#0c2340] border-[#0c2340] text-white shadow-md'
                : 'bg-white border-gray-100 text-[#0c2340] hover:border-[#c9a84c]/50 hover:shadow-sm'
            }`}
          >
            {izbrano && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#c9a84c] text-[#0c2340] flex items-center justify-center">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
            )}
            {slika ? (
              <span className="w-7 h-7" style={maskStyle} />
            ) : (
              <Anchor className="w-7 h-7" strokeWidth={1.5} />
            )}
            <span className="text-xs font-semibold text-center leading-tight break-words">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
