'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Ship, MapPin, Calendar, CalendarRange, Pencil, Eye, EyeOff, Loader2, CheckCircle, Zap, Eye as EyeIcon, Star, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import UrediZasedenostKoledar from '@/components/plovila/UrediZasedenostKoledar'
import type { Plovilo } from '@/types/database'
import { formatCena } from '@/lib/utils'

const tipIkone: Record<string, string> = {
  jadrnica: '⛵', motorni: '🚤', gumenjak: '🛟', katamaran: '⛵', jet: '💨', drugo: '⚓',
}

function mockOglediZaId(id: string): number {
  return (parseInt(id.replace(/\D/g, '') || '7') * 17 + 23) % 191 + 10
}

function MojaPlovilaContent() {
  const { user, vloga, demoMode } = useAuth()
  const searchParams = useSearchParams()
  const promocijaStatus = searchParams.get('promocija')
  const urgentnoStatus = searchParams.get('urgentno')
  // Charter posluje izključno z najemom — pri njih naj se obrazec za
  // dodajanje plovila privzeto odpre na "Za najem", ne "Za prodajo".
  const dodajPloviloHref = vloga === 'charter' ? '/dashboard/dodaj-plovilo?tip=najem' : '/dashboard/dodaj-plovilo'
  const [plovila, setPlovila] = useState<Plovilo[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [filter, setFilter] = useState<'vse' | 'prodaja' | 'najem'>('vse')
  const [prodana, setProdana] = useState<Record<string, boolean>>({})
  const [promoviram, setPromoviram] = useState<string | null>(null)
  const [promoNapaka, setPromoNapaka] = useState('')
  const [urgentnoNarocam, setUrgentnoNarocam] = useState<string | null>(null)
  const [urgentnoNapaka, setUrgentnoNapaka] = useState('')
  const [zdaj, setZdaj] = useState<number | null>(null)
  const [koledarOdprtId, setKoledarOdprtId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      setZdaj(Date.now())
      if (!user) { setNalaga(false); return }

      const supabase = createClient()
      const { data } = await supabase
        .from('plovila')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const seznam = data ?? []
      setPlovila(seznam)
      setProdana(Object.fromEntries(seznam.map((p: Plovilo) => [p.id, p.prodano ?? false])))
      setNalaga(false)
    })()
  }, [user])

  async function preklopiProdano(id: string, trenutno: boolean) {
    setProdana(prev => ({ ...prev, [id]: !trenutno }))
    const supabase = createClient()
    const { error } = await supabase.from('plovila').update({ prodano: !trenutno }).eq('id', id)
    if (error) setProdana(prev => ({ ...prev, [id]: trenutno }))
  }

  async function izbrisiPlovilo(id: string, naziv: string) {
    if (!confirm(`Izbrišete oglas "${naziv}"? Tega ni mogoče razveljaviti.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('plovila').delete().eq('id', id)
    if (!error) setPlovila(prev => prev.filter(p => p.id !== id))
  }

  async function promovirajOglas(id: string) {
    if (demoMode) { setPromoNapaka('Promocija v demo načinu ni mogoča. Prijavite se z resničnim računom.'); return }
    setPromoNapaka('')
    setPromoviram(id)
    const res = await fetch('/api/promocije/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plovilo_id: id }),
    })
    const json = await res.json()
    setPromoviram(null)
    if (!res.ok || !json.url) { setPromoNapaka(json.error ?? 'Napaka pri pripravi plačila.'); return }
    window.location.assign(json.url)
  }

  async function naredimUrgentno(id: string) {
    if (demoMode) { setUrgentnoNapaka('Urgentna prodaja v demo načinu ni mogoča. Prijavite se z resničnim računom.'); return }
    setUrgentnoNapaka('')
    setUrgentnoNarocam(id)
    const res = await fetch('/api/urgentno/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plovilo_id: id }),
    })
    const json = await res.json()
    setUrgentnoNarocam(null)
    if (!res.ok || !json.url) { setUrgentnoNapaka(json.error ?? 'Napaka pri pripravi plačila.'); return }
    window.location.assign(json.url)
  }

  function jePromovirano(p: Plovilo): boolean {
    if (zdaj === null) return !!p.promoted
    return !!p.promoted && (!p.promoted_do || new Date(p.promoted_do).getTime() > zdaj)
  }

  function jeUrgentnoAktivno(p: Plovilo): boolean {
    if (zdaj === null) return !!p.urgentno
    return !!p.urgentno && (!p.urgentno_do || new Date(p.urgentno_do).getTime() > zdaj)
  }

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
          href={dodajPloviloHref}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Dodaj plovilo
        </Link>
      </div>

      {promocijaStatus === 'uspesno' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" /> Plačilo je bilo uspešno. Oglas bo promoviran v nekaj trenutkih.
        </div>
      )}
      {promocijaStatus === 'preklicano' && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 mb-6">
          Plačilo je bilo preklicano — oglas ni bil promoviran.
        </div>
      )}
      {promoNapaka && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
          {promoNapaka}
        </div>
      )}
      {urgentnoStatus === 'uspesno' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" /> Plačilo je bilo uspešno. Oglas bo označen kot urgenten v nekaj trenutkih.
        </div>
      )}
      {urgentnoStatus === 'preklicano' && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 mb-6">
          Plačilo je bilo preklicano — oglas ni bil označen kot urgenten.
        </div>
      )}
      {urgentnoNapaka && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
          {urgentnoNapaka}
        </div>
      )}

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
            href={dodajPloviloHref}
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
              const jeUrgentno = jeUrgentnoAktivno(plovilo)
              const ogledi = mockOglediZaId(plovilo.id)

              return (
                <div
                  key={plovilo.id}
                  className={`bg-white rounded-2xl border shadow-sm transition-all ${
                    jeProdano ? 'border-gray-200 opacity-60' : 'border-gray-100'
                  }`}
                >
                <div className="p-5 flex items-center gap-5">
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
                      {jePromovirano(plovilo) && !jeProdano && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#c9a84c] text-[#0c2340] shrink-0 flex items-center gap-1">
                          <Star className="w-3 h-3" /> Promovirano
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
                    {/* Koledar zasedenosti — samo za najem */}
                    {plovilo.tip_oglasa === 'najem' && (
                      <button
                        onClick={() => setKoledarOdprtId((prev) => (prev === plovilo.id ? null : plovilo.id))}
                        title="Koledar zasedenosti"
                        className={`p-2 rounded-xl transition-colors ${
                          koledarOdprtId === plovilo.id
                            ? 'text-[#0c2340] bg-[#c9a84c]/20'
                            : 'text-gray-400 hover:text-[#0c2340] hover:bg-gray-100'
                        }`}
                      >
                        <CalendarRange className="w-4 h-4" />
                      </button>
                    )}
                    {/* Promocija */}
                    {!jeProdano && !jePromovirano(plovilo) && (
                      <button
                        onClick={() => promovirajOglas(plovilo.id)}
                        disabled={promoviram === plovilo.id}
                        title="Promoviraj oglas"
                        className="p-2 rounded-xl text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors disabled:opacity-50"
                      >
                        {promoviram === plovilo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                      </button>
                    )}
                    {/* Urgentna prodaja — plačljivo (30 €/30 dni), samo za oglase "za prodajo" */}
                    {!jeProdano && !jeUrgentno && plovilo.tip_oglasa === 'prodaja' && (
                      <button
                        onClick={() => naredimUrgentno(plovilo.id)}
                        disabled={urgentnoNarocam === plovilo.id}
                        title="Označi kot urgentno — 30 €"
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {urgentnoNarocam === plovilo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      </button>
                    )}
                    {/* Prodano */}
                    <button
                      onClick={() => preklopiProdano(plovilo.id, jeProdano)}
                      title={jeProdano ? 'Označi kot aktivno' : 'Označi kot prodano'}
                      className={`p-2 rounded-xl transition-colors ${
                        jeProdano ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    {/* Pregled */}
                    <Link
                      href={`/plovila/${plovilo.id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
                      title="Pregled"
                    >
                      {plovilo.potrjeno ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Link>
                    {/* Uredi */}
                    <Link
                      href={`/dashboard/dodaj-plovilo?edit=${plovilo.id}`}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#c9a84c] hover:bg-gray-100 transition-colors"
                      title="Uredi"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {/* Izbriši */}
                    <button
                      onClick={() => izbrisiPlovilo(plovilo.id, plovilo.naziv)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Izbriši oglas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {koledarOdprtId === plovilo.id && (
                  <div className="border-t border-gray-100 p-5">
                    <UrediZasedenostKoledar ploviloId={plovilo.id} />
                  </div>
                )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function MojaPlovilaPage() {
  return (
    <Suspense fallback={<div className="p-8 flex items-center justify-center"><Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" /></div>}>
      <MojaPlovilaContent />
    </Suspense>
  )
}
