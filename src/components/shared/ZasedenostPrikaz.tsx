'use client'

import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import MesecniKoledar, { danString, formatDan } from '@/components/plovila/MesecniKoledar'

function dnevniRazpon(od: string, do_: string): string[] {
  const rezultat: string[] = []
  const zac = new Date(od)
  const kon = new Date(do_)
  for (let d = zac; d <= kon; d.setDate(d.getDate() + 1)) {
    rezultat.push(danString(d))
  }
  return rezultat
}

// Vedno-odprt (ne za-klik-odprt-popup) koledar razpoložljivosti — direktor je
// prosil, naj bo zasedenost na strani plovila/charterja/skipperja takoj
// vidna in interaktivna, ne skrita v gumbu znotraj obrazca za povpraševanje
// (glej TerminPolje.tsx, ki je bil prejšnji, za-klik pristop). Izbira tu se
// prek `onChange` prenese v PovprasevanjeForma (glavni state termina je zdaj
// v starševski strani, glej npr. plovila/[id]/page.tsx).
export default function ZasedenostPrikaz({
  naslov = 'Razpoložljivost',
  zasedenost,
  vrednost,
  onChange,
}: {
  naslov?: string
  zasedenost: { datum_od: string; datum_do: string }[]
  vrednost: string
  onChange: (opisTermina: string) => void
}) {
  const [mesec, setMesec] = useState(() => { const d = new Date(); d.setDate(1); return d })

  const zasedeniDnevi = useMemo(() => {
    const set = new Set<string>()
    zasedenost.forEach((z) => dnevniRazpon(z.datum_od, z.datum_do).forEach((d) => set.add(d)))
    return set
  }, [zasedenost])

  function izbira(zac: string, kon: string) {
    onChange(zac === kon ? formatDan(zac) : `${formatDan(zac)} – ${formatDan(kon)}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-1">{naslov}</h2>
      <p className="text-xs text-gray-400 mb-4">Kliknite začetek in konec, ali povlecite čez želene dni — izbira se prenese v povpraševanje.</p>

      <MesecniKoledar
        mesec={mesec}
        onMesecChange={setMesec}
        zasedeniDnevi={zasedeniDnevi}
        onIzbira={izbira}
      />

      {vrednost && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#c9a84c]/10 text-[#0c2340] text-sm font-medium">
          <CalendarDays className="w-4 h-4 text-[#c9a84c] shrink-0" />
          Izbran termin: {vrednost}
        </div>
      )}
    </div>
  )
}
