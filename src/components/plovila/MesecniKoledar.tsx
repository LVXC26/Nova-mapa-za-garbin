'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const DNEVI_V_TEDNU = ['Po', 'To', 'Sr', 'Če', 'Pe', 'So', 'Ne']
const MESECI = [
  'Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij',
  'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December',
]

export function danString(d: Date): string {
  const leto = d.getFullYear()
  const mesec = String(d.getMonth() + 1).padStart(2, '0')
  const dan = String(d.getDate()).padStart(2, '0')
  return `${leto}-${mesec}-${dan}`
}

export function formatDan(dan: string): string {
  const [l, m, d] = dan.split('-')
  return `${parseInt(d)}. ${parseInt(m)}. ${l}`
}

export default function MesecniKoledar({
  mesec,
  onMesecChange,
  zasedeniDnevi,
  izbraniDnevi,
  onDanKlik,
}: {
  mesec: Date
  onMesecChange: (m: Date) => void
  zasedeniDnevi: Set<string>
  izbraniDnevi: Set<string>
  onDanKlik: (dan: string) => void
}) {
  const leto = mesec.getFullYear()
  const mesecIdx = mesec.getMonth()
  const prviDan = new Date(leto, mesecIdx, 1)
  const steviloDni = new Date(leto, mesecIdx + 1, 0).getDate()
  // ponedeljek = 0 ... nedelja = 6
  const offset = (prviDan.getDay() + 6) % 7
  const danes = danString(new Date())

  const celice: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: steviloDni }, (_, i) => danString(new Date(leto, mesecIdx, i + 1))),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onMesecChange(new Date(leto, mesecIdx - 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-semibold text-[#0c2340]">{MESECI[mesecIdx]} {leto}</p>
        <button
          type="button"
          onClick={() => onMesecChange(new Date(leto, mesecIdx + 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DNEVI_V_TEDNU.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celice.map((dan, i) => {
          if (!dan) return <div key={`prazno-${i}`} />
          const zaseden = zasedeniDnevi.has(dan)
          const izbran = izbraniDnevi.has(dan)
          const pretekel = dan < danes
          const onemogocen = zaseden || pretekel

          return (
            <button
              key={dan}
              type="button"
              disabled={onemogocen}
              onClick={() => onDanKlik(dan)}
              title={zaseden ? 'Zasedeno' : undefined}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                zaseden
                  ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                  : pretekel
                  ? 'text-gray-300 cursor-not-allowed'
                  : izbran
                  ? 'bg-[#c9a84c] text-[#0c2340] font-bold'
                  : 'text-[#0c2340] hover:bg-gray-100'
              }`}
            >
              {parseInt(dan.split('-')[2])}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#c9a84c]" /> Izbrano</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200" /> Zasedeno</span>
      </div>
    </div>
  )
}
