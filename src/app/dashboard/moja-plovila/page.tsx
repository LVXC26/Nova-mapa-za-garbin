'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Ship, MapPin, Calendar, Pencil, Eye, EyeOff, Loader2, CheckCircle, Zap, Eye as EyeIcon } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { mockPlovila } from '@/data/mock'
import type { Plovilo } from '@/types/database'
import { formatCena } from '@/lib/utils'

const tipIkone: Record<string, string> = {
  jadrnica: '⛵', motorni: '🚤', gumenjak: '🛟', katamaran: '⛵', jet: '💨', drugo: '⚓',
}

function mockOglediZaId(id: string): number {
  return (parseInt(id.replace(/\D/g, '') || '7') * 17 + 23) % 191 + 10
}

export default function MojaPlovilaPage() {
  const { user } = useAuth()
  const [plovila, setPlovila] = useState<Plovilo[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [filter, setFilter] = useState<'vse' | 'prodaja' | 'najem'>('vse')
  const [prodana, setProdana] = useState<Record<string, boolean>>({})
  const [urgentna, setUrgentna] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) { setNalaga(false); return }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Demo: pokaži mock plovila
      setPlovila(mockPlovila.slice(0, 3))
      setProdana(Object.fromEntries(mockPlovila.slice(0, 3).map(p => [p.id, p.prodano ?? false])))
      setUrgentna(Object.fromEntries(mockPlovila.slice(0, 3).map(p => [p.id, p.urgentno ?? false])))
      setNalaga(false)
      return
    }

    async function naloziPlovila() {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('plovila')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      const seznam = data ?? []
      setPlovila(seznam)
      setProdana(Object.fromEntries(seznam.map((p: Plovilo) => [p.id, p.prodano ?? false])))
      setUrgentna(Object.fromEntries(seznam.map((p: Plovilo) => [p.id, p.urgentno ?? false])))
      setNalaga(false)
    }

    naloziPlovila()
  }, [user])

  const filtirana = plovila
    .filter((p) => filter === 'vse' || p.tip_oglasa === filter)
    .sort((a, b) => {
      const aProdano = prodana[a.id] ?? false
      const bProdano = prodana[b.id] ?? false
      if (aProdano && !bProdano) return 1
      if (!aProdano && bProdano) return -1
      return 0
    })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2340]">Moja plovila</h1>
          <p className="text-gray-500 text-sm mt-1">Vsi vaši aktivni in nepotrjeni oglasi</p>
        </div>
        <Link
          href="/dashboard/dodaj-plovilo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Dodaj plovilo
        </Link>
      </div>

      {nalaga ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
        </div>
      ) : plovila.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Ship className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-gray-400 mb-1">Nimate še nobenih oglasov</p>
          <p className="text-sm text-gray-300 mb-6">Dodajte svoje prvo plovilo na trg.</p>
          <Link
            href="/dashboard/dodaj-plovilo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white font-medium text-sm rounded-full hover:bg-[#1e3a5f] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Dodaj prvo plovilo
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-full w-fit">
            {([
              { vrednost: 'vse', label: 'Vse' },
              { vrednost: 'prodaja', label: 'Za prodajo' },
              { vrednost: 'najem', label: 'Za najem' },
            ] as { vrednost: typeof filter; label: string }[]).map(({ vrednost, label }) => (
              <button
                key={vrednost}
                onClick={() => setFilter(vrednost)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === vrednost ? 'bg-white text-[#0c2340] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === vrednost ? 'bg-[#0c2340]/10 text-[#0c2340]' : 'bg-gray-200 text-gray-500'
                }`}>
                  {vrednost === 'vse' ? plovila.length : plovila.filter(p => p.tip_oglasa === vrednost).length}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtirana.map((plovilo) => {
              const jeProdano = prodana[plovilo.id] ?? false
              const jeUrgentno = urgentna[plovilo.id] ?? false
              const ogledi = mockOglediZaId(plovilo.id)

              return (
                <div
                  key={plovilo.id}
                  className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-5 transition-all ${
                    jeProdano ? 'border-gray-200 opacity-60' : 'border-gray-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0c2340]/5 flex items-center justify-center text-2xl shrink-0 relative">
                    {tipIkone[plovilo.tip] ?? '⚓'}
                    {jeProdano && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0c2340] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className={`font-semibold truncate ${jeProdano ? 'text-gray-400 line-through' : 'text-[#0c2340]'}`}>
                        {plovilo.naziv}
                      </h3>
                      {jeProdano && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#0c2340] text-white shrink-0">PRODANO</span>
                      )}
                      {jeUrgentno && !jeProdano && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600 text-white shrink-0 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Nujno
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        plovilo.tip_oglasa === 'najem' ? 'bg-[#c9a84c]/15 text-[#9a7a2e]' : 'bg-[#0c2340]/10 text-[#0c2340]'
                      }`}>
                        {plovilo.tip_oglasa === 'najem' ? 'Najem' : 'Prodaja'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        plovilo.potrjeno ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {plovilo.potrjeno ? 'Aktivno' : 'V pregledu'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                      {plovilo.lokacija && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {plovilo.lokacija}</span>
                      )}
                      {plovilo.letnik && (
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {plovilo.letnik}</span>
                      )}
                      {/* Ogledi — samo za prodajalca, nikoli javno */}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <EyeIcon className="w-3 h-3" /> {ogledi} ogledov
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {plovilo.cena_na_zahtevo ? (
                      <p className="text-sm font-semibold text-gray-500 italic">Cena na zahtevo</p>
                    ) : (
                      <p className="font-bold text-[#0c2340]">{formatCena(plovilo.cena)}</p>
                    )}
                    {plovilo.tip_oglasa === 'najem' && <p className="text-xs text-gray-400">/ teden</p>}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Urgentna prodaja */}
                    {!jeProdano && (
                      <button
                        onClick={() => setUrgentna(prev => ({ ...prev, [plovilo.id]: !jeUrgentno }))}
                        title={jeUrgentno ? 'Odstrani urgentno' : 'Označi kot urgentno'}
                        className={`p-2 rounded-xl transition-colors ${
                          jeUrgentno ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                    {/* Prodano */}
                    <button
                      onClick={() => setProdana(prev => ({ ...prev, [plovilo.id]: !jeProdano }))}
                      title={jeProdano ? 'Označi kot aktivno' : 'Označi kot prodano'}
                      className={`p-2 rounded-xl transition-colors ${
                        jeProdano ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    {/* Pregled */}
                    <button
                      className="p-2 rounded-xl text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
                      title="Pregled"
                    >
                      {plovilo.potrjeno ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    {/* Uredi */}
                    <button
                      className="p-2 rounded-xl text-gray-400 hover:text-[#c9a84c] hover:bg-gray-100 transition-colors"
                      title="Uredi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
