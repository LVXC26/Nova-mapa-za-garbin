'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { MapPin, Plus, X, Loader2, Camera } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { stisniSliko } from '@/lib/stisniSliko'
import type { ZemljevidTocka, ZemljevidPosebnost } from '@/types/database'

type TipTocke = ZemljevidTocka['tip']
type TipPosebnosti = ZemljevidPosebnost['tip']

interface PosebnostPrikaz extends ZemljevidPosebnost {
  avtorIme: string
  moreIzbrisati: boolean
}

const tipConfig: Record<TipTocke, { label: string; barva: string; emoji: string }> = {
  marina: { label: 'Marine', barva: 'bg-[#0c2340]', emoji: '⚓' },
  otok: { label: 'Otoki', barva: 'bg-emerald-600', emoji: '🏝️' },
  restavracija: { label: 'Restavracije', barva: 'bg-amber-500', emoji: '🍽️' },
  nevarno: { label: 'Nevarno', barva: 'bg-red-500', emoji: '⚠️' },
}

const posebnostConfig: Record<TipPosebnosti, { label: string; emoji: string }> = {
  sidrisce: { label: 'Sidrišče', emoji: '⚓' },
  potapljanje: { label: 'Potapljanje', emoji: '🤿' },
  plaza: { label: 'Plaža/zaliv', emoji: '🏖️' },
  gostilna: { label: 'Gostilna', emoji: '🍽️' },
  nevarnost: { label: 'Nevarnost', emoji: '⚠️' },
  drugo: { label: 'Drugo', emoji: '📍' },
}

const PRAZNA_POSEBNOST_FORMA = { naziv: '', tip: 'sidrisce' as TipPosebnosti, opis: '' }

export default function ZemljevidMap() {
  const { user } = useAuth()
  const [Map, setMap] = useState<typeof import('./LeafletMap').default | null>(null)
  const [aktivniFilter, setAktivniFilter] = useState<Set<TipTocke>>(new Set(['marina', 'otok', 'restavracija', 'nevarno']))
  const [izbranaT, setIzbranaT] = useState<ZemljevidTocka | null>(null)

  const [tocke, setTocke] = useState<ZemljevidTocka[]>([])
  const [posebnosti, setPosebnosti] = useState<PosebnostPrikaz[]>([])
  const [nalaga, setNalaga] = useState(true)

  const [dodajanjeAktivno, setDodajanjeAktivno] = useState(false)
  const [noviKlik, setNoviKlik] = useState<{ lat: number; lng: number } | null>(null)
  const [posebnostForma, setPosebnostForma] = useState(PRAZNA_POSEBNOST_FORMA)
  const [posebnostSlika, setPosebnostSlika] = useState<File | null>(null)
  const [stiskaSliko, setStiskaSliko] = useState(false)
  const [posiljaPosebnost, setPosiljaPosebnost] = useState(false)
  const [posebnostNapaka, setPosebnostNapaka] = useState('')
  const slikaInputRef = useRef<HTMLInputElement>(null)
  const posebnostSlikaPredogled = useMemo(
    () => (posebnostSlika ? URL.createObjectURL(posebnostSlika) : null),
    [posebnostSlika]
  )
  useEffect(() => {
    return () => { if (posebnostSlikaPredogled) URL.revokeObjectURL(posebnostSlikaPredogled) }
  }, [posebnostSlikaPredogled])

  useEffect(() => {
    import('./LeafletMap').then(m => setMap(() => m.default))
  }, [])

  const nalozi = useCallback(async () => {
    setNalaga(true)
    const supabase = createClient()

    const { data: tockeData } = await supabase.from('zemljevid_tocke').select('*').order('naziv')
    setTocke(tockeData ?? [])

    const { data: posebnostiData } = await supabase.from('zemljevid_posebnosti').select('*').order('created_at', { ascending: false })
    const seznam = posebnostiData ?? []

    let isModerator = false
    if (user) {
      const { data: profil } = await supabase.from('profiles').select('is_moderator, is_admin').eq('id', user.id).maybeSingle()
      isModerator = !!profil?.is_moderator || !!profil?.is_admin
    }

    // Navadna Record namesto JS Map objekta — "Map" v tej komponenti že
    // pomeni React komponento zemljevida (useState zgoraj), zato bi new
    // Map() tu trčil z njo.
    const avtorIds = Array.from(new Set(seznam.map(p => p.user_id)))
    const imena: Record<string, string> = {}
    if (avtorIds.length > 0) {
      const { data: profili } = await supabase.from('public_profiles').select('id, ime').in('id', avtorIds)
      profili?.forEach(p => { imena[p.id] = p.ime ?? 'Uporabnik' })
    }

    setPosebnosti(seznam.map(p => ({
      ...p,
      avtorIme: imena[p.user_id] ?? 'Uporabnik',
      moreIzbrisati: !!user && (user.id === p.user_id || isModerator),
    })))

    setNalaga(false)
  }, [user])

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [nalozi])

  function toggleFilter(tip: TipTocke) {
    setAktivniFilter(prev => {
      const next = new Set(prev)
      if (next.has(tip)) next.delete(tip); else next.add(tip)
      return next
    })
  }

  function zacniDodajanje() {
    setDodajanjeAktivno(true)
    setNoviKlik(null)
    setPosebnostNapaka('')
  }

  function preklici() {
    setDodajanjeAktivno(false)
    setNoviKlik(null)
    setPosebnostForma(PRAZNA_POSEBNOST_FORMA)
    setPosebnostSlika(null)
    setPosebnostNapaka('')
  }

  function onKlikZemljevid(lat: number, lng: number) {
    setNoviKlik({ lat, lng })
    setDodajanjeAktivno(false)
  }

  async function izbraniSlika(e: React.ChangeEvent<HTMLInputElement>) {
    const datoteka = e.target.files?.[0]
    e.target.value = ''
    if (!datoteka) return
    if (!datoteka.type.startsWith('image/')) { setPosebnostNapaka('Datoteka ni slika.'); return }
    if (datoteka.size > 30 * 1024 * 1024) { setPosebnostNapaka('Slika presega 30 MB.'); return }
    setPosebnostNapaka('')
    setStiskaSliko(true)
    setPosebnostSlika(await stisniSliko(datoteka))
    setStiskaSliko(false)
  }

  async function shraniPosebnost() {
    if (!user || !noviKlik) return
    if (!posebnostForma.naziv.trim()) { setPosebnostNapaka('Vpišite naziv.'); return }
    setPosebnostNapaka('')
    setPosiljaPosebnost(true)
    const supabase = createClient()

    let slikaUrl: string | null = null
    if (posebnostSlika) {
      const pot = `${user.id}/${crypto.randomUUID()}-${posebnostSlika.name}`
      const { error: uploadError } = await supabase.storage.from('zemljevid-slike').upload(pot, posebnostSlika)
      if (uploadError) {
        setPosiljaPosebnost(false)
        setPosebnostNapaka('Napaka pri nalaganju slike: ' + uploadError.message)
        return
      }
      slikaUrl = supabase.storage.from('zemljevid-slike').getPublicUrl(pot).data.publicUrl
    }

    const { error } = await supabase.from('zemljevid_posebnosti').insert({
      user_id: user.id,
      naziv: posebnostForma.naziv.trim(),
      tip: posebnostForma.tip,
      lat: noviKlik.lat,
      lng: noviKlik.lng,
      opis: posebnostForma.opis.trim() || null,
      slika: slikaUrl,
    })

    setPosiljaPosebnost(false)
    if (error) { setPosebnostNapaka('Napaka pri shranjevanju. Poskusite znova.'); return }
    preklici()
    nalozi()
  }

  async function izbrisiPosebnost(id: string) {
    const supabase = createClient()
    await supabase.from('zemljevid_posebnosti').delete().eq('id', id)
    nalozi()
  }

  const filtrirane = tocke.filter(t => aktivniFilter.has(t.tip))

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-[#0c2340] py-6 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#c9a84c]" /> Interaktivni zemljevid Jadrana
            </h1>
            <p className="text-white/60 text-sm mt-1">Marine, otoki, restavracije, nevarne cone — in posebnosti skupnosti</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtri */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(tipConfig) as TipTocke[]).map((tip) => (
                <button
                  key={tip}
                  onClick={() => toggleFilter(tip)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    aktivniFilter.has(tip)
                      ? `${tipConfig[tip].barva} text-white`
                      : 'bg-white/10 text-white/50 border border-white/20'
                  }`}
                >
                  <span>{tipConfig[tip].emoji}</span>
                  {tipConfig[tip].label}
                  <span className="ml-1 opacity-70">{tocke.filter(t => t.tip === tip).length}</span>
                </button>
              ))}
            </div>

            {user && (
              dodajanjeAktivno ? (
                <button
                  onClick={preklici}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Prekliči dodajanje
                </button>
              ) : (
                <button
                  onClick={zacniDodajanje}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] text-xs font-semibold rounded-full transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Dodaj posebnost
                </button>
              )
            )}
          </div>
        </div>

        {dodajanjeAktivno && (
          <div className="max-w-7xl mx-auto mt-3">
            <p className="text-xs text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl px-3 py-2 inline-block">
              Kliknite na zemljevid, kjer želite dodati posebnost.
            </p>
          </div>
        )}
      </div>

      {/* Mapa + sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-72 shrink-0 bg-white border-r border-gray-100 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <p className="text-sm font-semibold text-[#0c2340]">
              {filtrirane.length} uradnih točk · {posebnosti.length} posebnosti skupnosti
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {filtrirane.map((t) => (
              <button
                key={t.id}
                onClick={() => setIzbranaT(izbranaT?.id === t.id ? null : t)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                  izbranaT?.id === t.id ? 'bg-[#0c2340]/5' : ''
                }`}
              >
                <span className="text-xl shrink-0">{tipConfig[t.tip].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0c2340] text-sm truncate">{t.naziv}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{t.opis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative bg-[#e8f0f5]">
          {Map && !nalaga ? (
            <Map
              tocke={filtrirane}
              posebnosti={posebnosti}
              dodajanjeAktivno={dodajanjeAktivno}
              onKlikZemljevid={onKlikZemljevid}
              onIzbrisiPosebnost={izbrisiPosebnost}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-[#0c2340] font-medium text-sm">Nalagam zemljevid...</p>
              </div>
            </div>
          )}

          {/* Popup za izbrano uradno točko (mobile) */}
          {izbranaT && (
            <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tipConfig[izbranaT.tip].emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0c2340]">{izbranaT.naziv}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{izbranaT.opis}</p>
                  {izbranaT.link && (
                    <a href={izbranaT.link} className="text-xs text-[#c9a84c] font-medium mt-2 inline-block">Več info →</a>
                  )}
                </div>
                <button onClick={() => setIzbranaT(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
            </div>
          )}

          {/* Forma za novo posebnost — odpre se po kliku na zemljevid */}
          {noviKlik && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-[#0c2340]">Nova posebnost</h3>
                  <button onClick={preklici} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                {posebnostNapaka && <p className="text-sm text-red-600 mb-3">{posebnostNapaka}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vrsta</label>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {(Object.keys(posebnostConfig) as TipPosebnosti[]).map(tip => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setPosebnostForma(f => ({ ...f, tip }))}
                      className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-medium transition-all ${
                        posebnostForma.tip === tip ? 'bg-[#0c2340] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base">{posebnostConfig[tip].emoji}</span>
                      {posebnostConfig[tip].label}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Naziv *</label>
                <input
                  value={posebnostForma.naziv}
                  onChange={e => setPosebnostForma(f => ({ ...f, naziv: e.target.value }))}
                  placeholder="npr. Skriti zaliv za sidranje"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Opis</label>
                <textarea
                  value={posebnostForma.opis}
                  onChange={e => setPosebnostForma(f => ({ ...f, opis: e.target.value }))}
                  rows={3}
                  placeholder="Kratek opis, nasvet za druge jadralce..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slika (neobvezno)</label>
                {posebnostSlika ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={posebnostSlikaPredogled ?? undefined} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPosebnostSlika(null)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => slikaInputRef.current?.click()}
                    disabled={stiskaSliko}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-[#c9a84c] hover:text-[#0c2340] transition-colors mb-3 disabled:opacity-50"
                  >
                    {stiskaSliko ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    {stiskaSliko ? 'Optimiziram...' : 'Dodaj sliko'}
                  </button>
                )}
                <input ref={slikaInputRef} type="file" accept="image/*" onChange={izbraniSlika} className="hidden" />

                <div className="flex gap-2">
                  <button
                    onClick={shraniPosebnost}
                    disabled={posiljaPosebnost || stiskaSliko || !posebnostForma.naziv.trim()}
                    className="flex-1 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-50 text-[#0c2340] font-semibold text-sm rounded-full transition-all"
                  >
                    {posiljaPosebnost ? 'Shranjujem...' : 'Objavi'}
                  </button>
                  <button onClick={preklici} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50">
                    Prekliči
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
