'use client'

import { Check, Anchor } from 'lucide-react'
import type { TipPlovila } from '@/types/database'

const tipi: { vrednost: TipPlovila | 'vse'; label: string; slika: string }[] = [
  { vrednost: 'vse', label: 'Vsa plovila', slika: 'vsa-plovila' },
  { vrednost: 'jadrnica', label: 'Jadrnice', slika: 'jadrnica' },
  { vrednost: 'motorni', label: 'Motorni', slika: 'motorni' },
  { vrednost: 'jet', label: 'Jet ski', slika: 'jet-ski' },
  { vrednost: 'gumenjak', label: 'Gumenjaki', slika: 'gumenjak' },
  { vrednost: 'katamaran', label: 'Katamarani', slika: 'katamaran' },
]

export default function TipPlovilaIzbirnik({
  vrednost,
  onChange,
}: {
  vrednost: TipPlovila | 'vse'
  onChange: (v: TipPlovila | 'vse') => void
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/40" />
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#c9a84c] uppercase tracking-widest whitespace-nowrap">
          <Anchor className="w-3.5 h-3.5" /> Izberite tip plovila
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/40" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
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
              onClick={() => onChange(v)}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-4 transition-all ${
                izbrano
                  ? 'bg-[#0c2340] border-[#0c2340] text-white shadow-md'
                  : 'bg-white border-gray-100 text-[#0c2340] hover:border-[#c9a84c]/50 hover:shadow-sm'
              }`}
            >
              {izbrano && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c9a84c] text-[#0c2340] flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
              )}
              <span className="w-10 h-10 sm:w-11 sm:h-11" style={maskStyle} />
              <span className="text-xs sm:text-sm font-semibold text-center leading-tight break-words">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
