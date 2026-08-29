'use client'

import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import MesecniKoledar, { danString, formatDan } from './MesecniKoledar'
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

export default function IzbiraTerminaKoledar({
  zasedenost,
  onSpremembaTermina,
}: {
  zasedenost: PloviloZasedenost[]
  onSpremembaTermina: (opisTermina: string) => void
}) {
  const [mesec, setMesec] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [od, setOd] = useState<string | null>(null)
  const [do_, setDo] = useState<string | null>(null)
  const [napaka, setNapaka] = useState('')

  const zasedeniDnevi = useMemo(() => {
    const set = new Set<string>()
    zasedenost.forEach((z) => dnevniRazpon(z.datum_od, z.datum_do).forEach((d) => set.add(d)))
    return set
  }, [zasedenost])

  const izbraniDnevi = useMemo(() => {
    if (!od) return new Set<string>()
    if (!do_) return new Set([od])
    return new Set(dnevniRazpon(od, do_))
  }, [od, do_])

  function danKlik(dan: string) {
    setNapaka('')
    if (!od || do_) {
      // začni nov izbor
      setOd(dan)
      setDo(null)
      return
    }
    // drugi klik — dopolni razpon
    const [zac, kon] = dan < od ? [dan, od] : [od, dan]
    const razpon = dnevniRazpon(zac, kon)
    if (razpon.some((d) => zasedeniDnevi.has(d))) {
      setNapaka('V izbranem obdobju je plovilo delno zasedeno — izberite drug termin.')
      setOd(dan)
      setDo(null)
      return
    }
    setOd(zac)
    setDo(kon)
    onSpremembaTermina(zac === kon ? formatDan(zac) : `${formatDan(zac)} – ${formatDan(kon)}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-[#0c2340] mb-1 text-sm flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-[#c9a84c]" /> Razpoložljivost
      </h3>
      <p className="text-xs text-gray-400 mb-4">Izberite želen termin najema (klik za začetek, klik za konec).</p>

      <MesecniKoledar
        mesec={mesec}
        onMesecChange={setMesec}
        zasedeniDnevi={zasedeniDnevi}
        izbraniDnevi={izbraniDnevi}
        onDanKlik={danKlik}
      />

      {napaka && <p className="mt-3 text-xs text-red-600">{napaka}</p>}

      {od && do_ && (
        <div className="mt-3 p-3 bg-[#c9a84c]/10 rounded-xl text-xs font-medium text-[#0c2340]">
          Izbran termin: {od === do_ ? formatDan(od) : `${formatDan(od)} – ${formatDan(do_)}`}
        </div>
      )}
    </div>
  )
}
