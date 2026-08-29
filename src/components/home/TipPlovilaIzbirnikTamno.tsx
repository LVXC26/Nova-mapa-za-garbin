'use client'

import { Check } from 'lucide-react'
import type { TipPlovila } from '@/types/database'

// Temna varianta TipPlovilaIzbirnik-a (glej src/components/plovila) za rabo
// na temnem hero ozadju — iste ilustracije, samo barvna shema kot pri
// TipCharterjaIzbirnik (zlato = izbrano).
const tipi: { vrednost: TipPlovila; label: string; slika: string }[] = [
  { vrednost: 'jadrnica', label: 'Jadrnica', slika: 'jadrnica' },
  { vrednost: 'motorni', label: 'Motorni čoln', slika: 'motorni' },
  { vrednost: 'jet', label: 'Jet ski', slika: 'jet-ski' },
  { vrednost: 'gumenjak', label: 'Gumenjak', slika: 'gumenjak' },
  { vrednost: 'katamaran', label: 'Katamaran', slika: 'katamaran' },
]

export default function TipPlovilaIzbirnikTamno({
  vrednost,
  onChange,
}: {
  vrednost: TipPlovila | ''
  onChange: (v: TipPlovila | '') => void
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
            <span className="text-xs sm:text-sm font-medium text-center leading-tight break-words">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
