'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Wrench, MapPin, Pencil, Eye, EyeOff, Loader2, CheckCircle, Trash2, Tag } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { RezervniDel } from '@/types/database'
import { formatCena } from '@/lib/utils'

const kategorijaIkone: Record<string, string> = {
  motor: '⚙️', elektronika: '📡', jadra: '⛵', trup: '🚢',
  'sidrna oprema': '⚓', drugo: '📦',
}

export default function MojiDeliPage() {
  const { user } = useAuth()
  const [deli, setDeli] = useState<RezervniDel[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [prodani, setProdani] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) { setNalaga(false); return }
    const supabase = createClient()
    supabase
      .from('rezervni_deli')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const seznam = data ?? []
        setDeli(seznam)
        setProdani(Object.fromEntries(seznam.map((d: RezervniDel) => [d.id, d.prodano ?? false])))
        setNalaga(false)
      })
  }, [user])

  async function preklopiProdano(id: string, trenutno: boolean) {
    setProdani(prev => ({ ...prev, [id]: !trenutno }))
    const supabase = createClient()
    const { error } = await supabase.from('rezervni_deli').update({ prodano: !trenutno }).eq('id', id)
    if (error) setProdani(prev => ({ ...prev, [id]: trenutno }))
  }

  async function izbrisiDel(id: string, naziv: string) {
    if (!confirm(`Izbrišete oglas "${naziv}"? Tega ni mogoče razveljaviti.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('rezervni_deli').delete().eq('id', id)
    if (!error) setDeli(prev => prev.filter(d => d.id !== id))
  }

  const razvrsceni = [...deli].sort((a, b) => {
    const aProdan = prodani[a.id] ?? false
    const bProdan = prodani[b.id] ?? false
    if (aProdan && !bProdan) return 1
    if (!aProdan && bProdan) return -1
    return 0
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2340]">Moji deli</h1>
          <p className="text-gray-500 text-sm mt-1">Vsi vaši oglasi za rezervne dele</p>
        </div>
        <Link
          href="/rezervni-deli/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Objavi del
        </Link>
      </div>

      {nalaga ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
        </div>
      ) : deli.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Wrench className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-gray-400 mb-1">Nimate še nobenih oglasov</p>
          <p className="text-sm text-gray-300 mb-6">Objavite svoj prvi rezervni del na trg.</p>
          <Link
            href="/rezervni-deli/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white font-medium text-sm rounded-full hover:bg-[#1e3a5f] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Objavi prvi del
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {razvrsceni.map((del) => {
            const jeProdan = prodani[del.id] ?? false
            return (
              <div
                key={del.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all p-5 flex flex-wrap items-center gap-4 sm:gap-5 ${
                  jeProdan ? 'border-gray-200 opacity-60' : 'border-gray-100'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#0c2340]/5 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {del.slika_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={del.slika_url} alt={del.naziv} className="w-full h-full object-cover" />
                  ) : (kategorijaIkone[del.kategorija] ?? '📦')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className={`font-semibold truncate ${jeProdan ? 'text-gray-400 line-through' : 'text-[#0c2340]'}`}>
                      {del.naziv}
                    </h3>
                    {jeProdan && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#0c2340] text-white shrink-0">PRODANO</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 bg-[#0c2340]/8 text-[#0c2340] capitalize flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {del.kategorija}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                    {del.lokacija && (
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {del.lokacija}</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0c2340]">{formatCena(del.cena)}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => preklopiProdano(del.id, jeProdan)}
                    title={jeProdan ? 'Označi kot aktivno' : 'Označi kot prodano'}
                    className={`p-2 rounded-xl transition-colors ${
                      jeProdan ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/rezervni-deli/${del.id}`}
                    target="_blank"
                    className="p-2 rounded-xl text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
                    title="Pregled"
                  >
                    {del.potrjeno ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Link>
                  <Link
                    href={`/rezervni-deli/novo?edit=${del.id}`}
                    className="p-2 rounded-xl text-gray-400 hover:text-[#c9a84c] hover:bg-gray-100 transition-colors"
                    title="Uredi"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => izbrisiDel(del.id, del.naziv)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Izbriši oglas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
