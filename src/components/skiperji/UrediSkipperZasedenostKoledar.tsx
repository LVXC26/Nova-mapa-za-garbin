'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { Loader2, Trash2, CalendarPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MesecniKoledar, { danString, formatDan } from '@/components/plovila/MesecniKoledar'
import type { SkipperZasedenost } from '@/types/database'

function dnevniRazpon(od: string, do_: string): string[] {
  const rezultat: string[] = []
  const zac = new Date(od)
  const kon = new Date(do_)
  for (let d = zac; d <= kon; d.setDate(d.getDate() + 1)) {
    rezultat.push(danString(d))
  }
  return rezultat
}

// Enak vzorec kot UrediZasedenostKoledar.tsx (za plovila), samo da je tu
// skipper vezan neposredno na svoj skiperji.id, ne na plovilo_id.
export default function UrediSkipperZasedenostKoledar({ skipperId }: { skipperId: string }) {
  const [zasedenost, setZasedenost] = useState<SkipperZasedenost[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [mesec, setMesec] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [izbor, setIzbor] = useState<{ od: string; do_: string } | null>(null)
  const [koledarKey, setKoledarKey] = useState(0)
  const [shranjujem, setShranjujem] = useState(false)

  const nalozi = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('skipper_zasedenost')
      .select('*')
      .eq('skipper_id', skipperId)
      .order('datum_od', { ascending: true })
    setZasedenost(data ?? [])
    setNalaga(false)
  }, [skipperId])

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [nalozi])

  const zasedeniDnevi = useMemo(() => {
    const set = new Set<string>()
    zasedenost.forEach((z) => dnevniRazpon(z.datum_od, z.datum_do).forEach((d) => set.add(d)))
    return set
  }, [zasedenost])

  async function dodajZasedeno() {
    if (!izbor) return
    setShranjujem(true)
    const supabase = createClient()
    const { error } = await supabase.from('skipper_zasedenost').insert({ skipper_id: skipperId, datum_od: izbor.od, datum_do: izbor.do_ })
    setShranjujem(false)
    if (!error) {
      setIzbor(null)
      setKoledarKey((k) => k + 1)
      nalozi()
    }
  }

  async function odstraniZasedeno(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('skipper_zasedenost').delete().eq('id', id)
    if (!error) setZasedenost((prev) => prev.filter((z) => z.id !== id))
  }

  if (nalaga) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-[#c9a84c] animate-spin" /></div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <p className="text-[11px] text-gray-400 mb-2">Kliknite začetek in konec, ali povlecite čez želene dni.</p>
        <MesecniKoledar
          key={koledarKey}
          mesec={mesec}
          onMesecChange={setMesec}
          zasedeniDnevi={zasedeniDnevi}
          onIzbira={(od, do_) => setIzbor({ od, do_ })}
        />
        {izbor && (
          <button
            type="button"
            onClick={dodajZasedeno}
            disabled={shranjujem}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold text-xs rounded-full transition-all disabled:opacity-60"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            {shranjujem ? 'Shranjujem...' : `Označi zasedeno: ${izbor.od === izbor.do_ ? formatDan(izbor.od) : `${formatDan(izbor.od)} – ${formatDan(izbor.do_)}`}`}
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Zasedeni termini</p>
        {zasedenost.length === 0 ? (
          <p className="text-xs text-gray-400">Ni označenih zasedenih terminov — prikazani ste kot prosti ves čas.</p>
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
