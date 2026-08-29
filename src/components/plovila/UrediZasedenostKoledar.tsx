'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { Loader2, Trash2, CalendarPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

export default function UrediZasedenostKoledar({ ploviloId }: { ploviloId: string }) {
  const [zasedenost, setZasedenost] = useState<PloviloZasedenost[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [mesec, setMesec] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [od, setOd] = useState<string | null>(null)
  const [do_, setDo] = useState<string | null>(null)
  const [shranjujem, setShranjujem] = useState(false)

  const nalozi = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('plovilo_zasedenost')
      .select('*')
      .eq('plovilo_id', ploviloId)
      .order('datum_od', { ascending: true })
    setZasedenost(data ?? [])
    setNalaga(false)
  }, [ploviloId])

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [nalozi])

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
    if (!od || do_) {
      setOd(dan)
      setDo(null)
      return
    }
    const [zac, kon] = dan < od ? [dan, od] : [od, dan]
    setOd(zac)
    setDo(kon)
  }

  async function dodajZasedeno() {
    if (!od || !do_) return
    setShranjujem(true)
    const supabase = createClient()
    const { error } = await supabase.from('plovilo_zasedenost').insert({ plovilo_id: ploviloId, datum_od: od, datum_do: do_ })
    setShranjujem(false)
    if (!error) {
      setOd(null)
      setDo(null)
      nalozi()
    }
  }

  async function odstraniZasedeno(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('plovilo_zasedenost').delete().eq('id', id)
    if (!error) setZasedenost((prev) => prev.filter((z) => z.id !== id))
  }

  if (nalaga) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-[#c9a84c] animate-spin" /></div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <MesecniKoledar
          mesec={mesec}
          onMesecChange={setMesec}
          zasedeniDnevi={zasedeniDnevi}
          izbraniDnevi={izbraniDnevi}
          onDanKlik={danKlik}
        />
        {od && do_ && (
          <button
            type="button"
            onClick={dodajZasedeno}
            disabled={shranjujem}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold text-xs rounded-full transition-all disabled:opacity-60"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            {shranjujem ? 'Shranjujem...' : `Označi zasedeno: ${od === do_ ? formatDan(od) : `${formatDan(od)} – ${formatDan(do_)}`}`}
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Zasedeni termini</p>
        {zasedenost.length === 0 ? (
          <p className="text-xs text-gray-400">Ni označenih zasedenih terminov — plovilo je prikazano kot prosto ves čas.</p>
        ) : (
          <div className="space-y-2">
            {zasedenost.map((z) => (
              <div key={z.id} className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-xs font-medium text-[#0c2340]">
                  {z.datum_od === z.datum_do ? formatDan(z.datum_od) : `${formatDan(z.datum_od)} – ${formatDan(z.datum_do)}`}
                </span>
                <button
                  type="button"
                  onClick={() => odstraniZasedeno(z.id)}
                  title="Odstrani"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
