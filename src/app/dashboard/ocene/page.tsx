'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Users } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Rating } from '@/types/database'

interface OcenaZImenom extends Rating {
  ime: string
}

function Stars({ n, size = 'sm' }: { n: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${cls} ${i < n ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

function formatDatum(iso: string): string {
  return new Date(iso).toLocaleDateString('sl-SI', { month: 'long', year: 'numeric' })
}

export default function OcenePage() {
  const { user, vloga, demoMode } = useAuth()
  const [ocene, setOcene] = useState<OcenaZImenom[]>([])
  const [taMesec, setTaMesec] = useState(0)
  const [nalaga, setNalaga] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (!user || demoMode) { setNalaga(false); return }
      const supabase = createClient()
      const tip: 'skipper' | 'charter' = vloga === 'charter' ? 'charter' : 'skipper'
      const tabela = tip === 'charter' ? 'charterji' : 'skiperji'

      const { data: lastniProfil } = await supabase.from(tabela).select('id').eq('user_id', user.id).maybeSingle()
      if (!lastniProfil) { setNalaga(false); return }

      const { data: ratingRows } = await supabase
        .from('ratings')
        .select('*')
        .eq('rated_id', lastniProfil.id)
        .eq('rated_type', tip)
        .order('created_at', { ascending: false })

      const seznam = ratingRows ?? []
      const raterIds = Array.from(new Set(seznam.map(r => r.rater_id)))
      const profileMap = new Map<string, string>()
      if (raterIds.length > 0) {
        const { data: profili } = await supabase.from('public_profiles').select('id, ime').in('id', raterIds)
        profili?.forEach(p => profileMap.set(p.id, p.ime ?? 'Uporabnik'))
      }

      const zObogaten = seznam.map(r => ({ ...r, ime: profileMap.get(r.rater_id) ?? 'Uporabnik' }))
      setOcene(zObogaten)
      const zaMesecDni = 30 * 24 * 60 * 60 * 1000
      const zdaj = Date.now()
      setTaMesec(zObogaten.filter(o => zdaj - new Date(o.created_at).getTime() < zaMesecDni).length)
      setNalaga(false)
    })()
  }, [user, vloga, demoMode])

  const povprecje = ocene.length ? ocene.reduce((acc, o) => acc + o.score, 0) / ocene.length : 0
  const distribucija = [5, 4, 3, 2, 1].map(n => ({
    ocena: n,
    stevilo: ocene.filter(o => o.score === n).length,
    odstotek: ocene.length ? Math.round((ocene.filter(o => o.score === n).length / ocene.length) * 100) : 0,
  }))
  if (nalaga) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Moje ocene</h1>
      <p className="text-gray-500 text-sm mb-8">Ocene in komentarji vaših strank</p>

      {ocene.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-gray-400 mb-1">Nimate še nobene ocene</p>
          <p className="text-sm text-gray-300">Ocene strank se bodo prikazale tukaj, ko jih prejmete.</p>
        </div>
      ) : (
        <>
          {/* Povzetek */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center sm:col-span-1">
              <p className="font-display text-5xl font-bold text-[#0c2340] mb-2">{povprecje.toFixed(1)}</p>
              <Stars n={Math.round(povprecje)} size="lg" />
              <p className="text-sm text-gray-500 mt-2">{ocene.length} ocen skupaj</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:col-span-2">
              <p className="text-sm font-semibold text-[#0c2340] mb-3">Distribucija ocen</p>
              {distribucija.map(({ ocena, stevilo, odstotek }) => (
                <div key={ocena} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500 w-4 shrink-0">{ocena}</span>
                  <Star className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c] shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: `${odstotek}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right shrink-0">{stevilo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Skupaj ocen', vrednost: ocene.length, ikona: Star },
              { label: 'Ta mesec', vrednost: taMesec, ikona: TrendingUp },
              { label: 'Povprečna ocena', vrednost: povprecje.toFixed(1), ikona: Users },
            ].map(({ label, vrednost, ikona: Ikona }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <Ikona className="w-5 h-5 text-[#c9a84c] mb-2" />
                <p className="font-display text-2xl font-bold text-[#0c2340]">{vrednost}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Ocene */}
          <h2 className="font-semibold text-[#0c2340] mb-4">Komentarji strank</h2>
          <div className="space-y-4">
            {ocene.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-sm font-bold text-[#0c2340]">
                      {o.ime[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{o.ime}</p>
                      <p className="text-xs text-gray-400">{formatDatum(o.created_at)}</p>
                    </div>
                  </div>
                  <Stars n={o.score} />
                </div>
                {o.komentar && <p className="text-sm text-gray-600 leading-relaxed">{o.komentar}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
