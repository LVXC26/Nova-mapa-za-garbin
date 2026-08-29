'use client'

import { Check, Anchor } from 'lucide-react'
import {
  IkonaVsaPlovila, IkonaJadrnica, IkonaMotorni, IkonaJetSki, IkonaGumenjak, IkonaKatamaran,
} from './TipPlovilaIkone'
import type { TipPlovila } from '@/types/database'

const tipi: { vrednost: TipPlovila | 'vse'; label: string; Ikona: typeof IkonaVsaPlovila }[] = [
  { vrednost: 'vse', label: 'Vsa plovila', Ikona: IkonaVsaPlovila },
  { vrednost: 'jadrnica', label: 'Jadrnice', Ikona: IkonaJadrnica },
  { vrednost: 'motorni', label: 'Motorni', Ikona: IkonaMotorni },
  { vrednost: 'jet', label: 'Jet ski', Ikona: IkonaJetSki },
  { vrednost: 'gumenjak', label: 'Gumenjaki', Ikona: IkonaGumenjak },
  { vrednost: 'katamaran', label: 'Katamarani', Ikona: IkonaKatamaran },
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

      <div className="grid grid-cols-3 gap-3">
        {tipi.map(({ vrednost: v, label, Ikona }) => {
          const izbrano = vrednost === v
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
              <Ikona className="w-9 h-9 sm:w-10 sm:h-10" />
              <span className="text-xs sm:text-sm font-semibold text-center leading-tight">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
