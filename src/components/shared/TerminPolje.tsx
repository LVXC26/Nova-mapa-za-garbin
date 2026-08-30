'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import MesecniKoledar, { danString, formatDan } from '@/components/plovila/MesecniKoledar'
import type { PloviloZasedenost } from '@/types/database'

function dnevniRazpon(od: string, do_: string): string[] {
  const rezultat: string[] = []
  const zac = new Date(od)
  const kon = new Date(do_)
  for (let d = zac; d <= kon; d.setDate(d.getDate() + 1)) {
    rezultat.push(danString(d))
  }
  return rezultat
}

// Polje "Želen termin", ki namesto navadnega vnosa besedila ob kliku odpre
// koledar razpoložljivosti (zasedeni dnevi prečrtani/onemogočeni) — uporablja
// se za povpraševanja o najemu, kjer imamo za plovilo znano zasedenost.
export default function TerminPolje({
  zasedenost,
  vrednost,
  onChange,
}: {
  zasedenost: PloviloZasedenost[]
  vrednost: string
  onChange: (opisTermina: string) => void
}) {
  const [odprto, setOdprto] = useState(false)
  const [mesec, setMesec] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOdprto(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const zasedeniDnevi = new Set<string>()
  zasedenost.forEach((z) => dnevniRazpon(z.datum_od, z.datum_do).forEach((d) => zasedeniDnevi.add(d)))

  function izbira(zac: string, kon: string) {
    onChange(zac === kon ? formatDan(zac) : `${formatDan(zac)} – ${formatDan(kon)}`)
    setOdprto(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOdprto((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-left focus:outline-none focus:border-[#c9a84c] bg-white"
      >
        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
        <span className={vrednost ? 'text-[#0c2340]' : 'text-gray-400'}>
          {vrednost || 'Izberite termin najema'}
        </span>
      </button>

      {odprto && (
        <div className="absolute z-30 mt-2 w-[300px] max-w-[90vw] bg-white rounded-2xl border border-gray-100 shadow-xl p-4">
          <p className="text-[11px] text-gray-400 mb-2">Kliknite začetek in konec, ali povlecite čez želene dni.</p>
          <MesecniKoledar
            mesec={mesec}
            onMesecChange={setMesec}
            zasedeniDnevi={zasedeniDnevi}
            onIzbira={izbira}
          />
        </div>
      )}
    </div>
  )
}
