'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Upload, AlertCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import type { TipPlovila, TipOglasa, StanjePlovila } from '@/types/database'

const tipiPlovila = [
  { vrednost: 'jadrnica', label: 'Jadrnica', ikona: '⛵' },
  { vrednost: 'motorni', label: 'Motorni čoln', ikona: '🚤' },
  { vrednost: 'gumenjak', label: 'Gumenjak', ikona: '🛟' },
  { vrednost: 'katamaran', label: 'Katamaran', ikona: '⛵' },
  { vrednost: 'jet', label: 'Jet ski', ikona: '💨' },
  { vrednost: 'drugo', label: 'Drugo', ikona: '⚓' },
]

const stanjeOpcije = ['odlično', 'dobro', 'potrebuje popravilo']

const MAX_SLIK = 8
const MAX_VELIKOST_MB = 8

const opremaKategorije = [
  {
    naziv: 'Navigacija',
    opcije: [
      { kljuc: 'gps', label: 'GPS / Chartplotter' },
      { kljuc: 'radar', label: 'Radar' },
      { kljuc: 'vhf', label: 'VHF radio' },
      { kljuc: 'autopilot', label: 'Autopilot' },
      { kljuc: 'ploter', label: 'Ploter' },
      { kljuc: 'ais', label: 'AIS' },
    ],
  },
  {
    naziv: 'Motor',
    opcije: [
      { kljuc: 'generator', label: 'Generator' },
      { kljuc: 'bow_thruster', label: 'Bow thruster' },
    ],
  },
  {
    naziv: 'Udobje',
    opcije: [
      { kljuc: 'klima', label: 'Klimatska naprava' },
      { kljuc: 'ogrevanje', label: 'Ogrevanje' },
      { kljuc: 'hladilnik', label: 'Hladilnik' },
      { kljuc: 'pecica', label: 'Pečica' },
      { kljuc: 'mikrovalovna', label: 'Mikrovalovna' },
    ],
  },
  {
    naziv: 'Varnost',
    opcije: [
      { kljuc: 'epirb', label: 'EPIRB' },
      { kljuc: 'life_raft', label: 'Life raft' },
      { kljuc: 'jopici', label: 'Rešilni jopiči' },
      { kljuc: 'signalne_luce', label: 'Signalne luči' },
    ],
  },
  {
    naziv: 'Dodatno',
    opcije: [
      { kljuc: 'rib', label: 'RIB / Gumenjak' },
      { kljuc: 'elektricni_vitli', label: 'Električni vitli' },
      { kljuc: 'solarni', label: 'Solarni paneli' },
      { kljuc: 'watermaker', label: 'Watermaker' },
    ],
  },
]

function DodajPloviloContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [tipOglasaUrejanje, setTipOglasaUrejanje] = useState<TipOglasa | null>(null)
  const tipOglasa: TipOglasa = editId
    ? (tipOglasaUrejanje ?? 'prodaja')
    : (searchParams.get('tip') === 'najem' ? 'najem' : 'prodaja')

  const [forma, setForma] = useState({
    naziv: '',
    opis: '',
    tip: 'jadrnica',
    cena: '',
    letnik: '',
    dolzina_m: '',
    lokacija: '',
    stanje: 'odlično',
    kontakt_email: user?.email ?? '',
    kontakt_tel: '',
  })
  const [oprema, setOprema] = useState<Record<string, boolean>>({})
  const [cenaZahtevo, setCenaZahtevo] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [nalagaSlike, setNalagaSlike] = useState(false)
  const [uspesno, setUspesno] = useState(false)
  const [obstojeceSlike, setObstojeceSlike] = useState<string[]>([])
  const [slike, setSlike] = useState<File[]>([])
  const [nalagaObstojece, setNalagaObstojece] = useState(!!editId)
  const novePredogled = useMemo(() => slike.map((datoteka) => URL.createObjectURL(datoteka)), [slike])
  const slikePredogled = useMemo(
    () => [...obstojeceSlike, ...novePredogled],
    [obstojeceSlike, novePredogled]
  )

  useEffect(() => {
    return () => { novePredogled.forEach((url) => URL.revokeObjectURL(url)) }
  }, [novePredogled])

  useEffect(() => {
    if (!editId || !user) return
    const supabase = createClient()
    supabase.from('plovila').select('*').eq('id', editId).maybeSingle().then(({ data }) => {
      if (data && data.user_id === user.id) {
        setForma({
          naziv: data.naziv,
          opis: data.opis ?? '',
          tip: data.tip,
          cena: data.cena_na_zahtevo ? '' : String(data.cena ?? ''),
          letnik: data.letnik ? String(data.letnik) : '',
          dolzina_m: data.dolzina_m ? String(data.dolzina_m) : '',
          lokacija: data.lokacija ?? '',
          stanje: data.stanje ?? 'odlično',
          kontakt_email: data.kontakt_email ?? user.email ?? '',
          kontakt_tel: data.kontakt_tel ?? '',
        })
        setOprema(data.oprema ?? {})
        setCenaZahtevo(data.cena_na_zahtevo ?? false)
        setObstojeceSlike(data.slike ?? [])
        setTipOglasaUrejanje(data.tip_oglasa)
      } else {
        setNapaka('Oglasa ni bilo mogoče najti ali ni vaš.')
      }
      setNalagaObstojece(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, user?.id])

  function posodobiFormo(polje: string, vrednost: string) {
    setForma((f) => ({ ...f, [polje]: vrednost }))
  }

  function toggleOprema(kljuc: string) {
    setOprema((o) => ({ ...o, [kljuc]: !o[kljuc] }))
  }

  function dodajSlike(datoteke: FileList | null) {
    if (!datoteke) return
    const nove: File[] = []
    for (const datoteka of Array.from(datoteke)) {
      if (!datoteka.type.startsWith('image/')) { setNapaka(`"${datoteka.name}" ni slikovna datoteka.`); continue }
      if (datoteka.size > MAX_VELIKOST_MB * 1024 * 1024) { setNapaka(`Slika "${datoteka.name}" presega ${MAX_VELIKOST_MB} MB.`); continue }
      nove.push(datoteka)
    }
    if (!nove.length) return
    setNapaka('')
    setSlike((s) => [...s, ...nove].slice(0, Math.max(0, MAX_SLIK - obstojeceSlike.length)))
  }

  function odstraniSliko(indeks: number) {
    if (indeks < obstojeceSlike.length) {
      setObstojeceSlike((s) => s.filter((_, i) => i !== indeks))
    } else {
      const noviIndeks = indeks - obstojeceSlike.length
      setSlike((s) => s.filter((_, i) => i !== noviIndeks))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cenaZahtevo && !forma.cena) { setNapaka('Vpišite ceno ali izberite "Cena na zahtevo".'); return }
    if (!user) { setNapaka('Za dodajanje plovila se morate prijaviti.'); return }
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()

    const slikeUrls: string[] = [...obstojeceSlike]
    if (slike.length) {
      setNalagaSlike(true)
      for (const datoteka of slike) {
        const pot = `${user.id}/${crypto.randomUUID()}-${datoteka.name}`
        const { error: uploadError } = await supabase.storage.from('plovila-slike').upload(pot, datoteka)
        if (uploadError) {
          setNalagaSlike(false)
          setNalaga(false)
          setNapaka('Napaka pri nalaganju slik: ' + uploadError.message)
          return
        }
        const { data } = supabase.storage.from('plovila-slike').getPublicUrl(pot)
        slikeUrls.push(data.publicUrl)
      }
      setNalagaSlike(false)
    }

    const skupnaPolja = {
      naziv: forma.naziv,
      opis: forma.opis || null,
      tip: forma.tip as TipPlovila,
      tip_oglasa: tipOglasa,
      cena: cenaZahtevo ? 0 : Number(forma.cena),
      cena_na_zahtevo: cenaZahtevo,
      letnik: forma.letnik ? Number(forma.letnik) : null,
      dolzina_m: forma.dolzina_m ? Number(forma.dolzina_m) : null,
      lokacija: forma.lokacija || null,
      stanje: forma.stanje as StanjePlovila,
      kontakt_email: forma.kontakt_email || null,
      kontakt_tel: forma.kontakt_tel || null,
      oprema,
      slike: slikeUrls,
    }

    const { error } = editId
      ? await supabase.from('plovila').update(skupnaPolja).eq('id', editId)
      : await supabase.from('plovila').insert({
          ...skupnaPolja,
          potrjeno: true,
          promoted: false,
          prodano: false,
          user_id: user.id,
          model_3d_url: null,
        })

    setNalaga(false)
    if (error) { setNapaka('Napaka pri shranjevanju. Preverite ali ste prijavljeni.'); return }
    setUspesno(true)
  }

  if (uspesno) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0c2340] mb-2">
            {editId ? 'Oglas posodobljen!' : 'Plovilo dodano!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {editId
              ? 'Vaše spremembe so shranjene in takoj vidne vsem obiskovalcem.'
              : 'Vaš oglas je objavljen in takoj viden vsem obiskovalcem.'}
          </p>
          <div className="flex gap-3 justify-center">
            {!editId && (
              <button
                onClick={() => { setUspesno(false); setForma(f => ({ ...f, naziv: '', opis: '', cena: '', letnik: '', dolzina_m: '' })); setCenaZahtevo(false); setUrgentno(false); setSlike([]); setObstojeceSlike([]) }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium text-sm rounded-full hover:bg-gray-50"
              >
                Dodaj še eno
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard/moja-plovila')}
              className="px-5 py-2.5 bg-[#c9a84c] text-[#0c2340] font-semibold text-sm rounded-full hover:bg-[#e8c76d]"
            >
              Moji oglasi
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (nalagaObstojece) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          {editId ? (
            <div className="flex gap-2 mb-3">
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#0c2340] text-white">
                {tipOglasa === 'prodaja' ? '🏷️ Za prodajo' : '⛵ Za najem'}
              </span>
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              {(['prodaja', 'najem'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => router.push(`/dashboard/dodaj-plovilo${t === 'najem' ? '?tip=najem' : ''}`)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    tipOglasa === t ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {t === 'prodaja' ? '🏷️ Za prodajo' : '⛵ Za najem'}
                </button>
              ))}
            </div>
          )}
          <h1 className="font-display text-2xl font-bold text-[#0c2340]">
            {editId
              ? 'Uredi oglas'
              : tipOglasa === 'prodaja' ? 'Dodaj plovilo za prodajo' : 'Dodaj plovilo za najem'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Izpolnite podatke o plovilu. Oglas bo takoj aktiven po objavi.</p>
        </div>

        {napaka && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" /> {napaka}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tip plovila */}
          <div>
            <label className="block text-sm font-semibold text-[#0c2340] mb-3">Tip plovila</label>
            <div className="grid grid-cols-3 gap-2">
              {tipiPlovila.map(({ vrednost, label, ikona }) => (
                <button
                  key={vrednost}
                  type="button"
                  onClick={() => posodobiFormo('tip', vrednost)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    forma.tip === vrednost
                      ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#0c2340]'
                      : 'border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span>{ikona}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Osnovno */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-[#0c2340]">Osnovni podatki</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Naziv plovila *</label>
              <input
                required
                value={forma.naziv}
                onChange={(e) => posodobiFormo('naziv', e.target.value)}
                placeholder="npr. Bavaria Cruiser 46"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Opis</label>
              <textarea
                rows={3}
                value={forma.opis}
                onChange={(e) => posodobiFormo('opis', e.target.value)}
                placeholder="Opišite plovilo, zgodovino, posebnosti..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white resize-none"
              />
            </div>

            {/* Cena + POA */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {tipOglasa === 'najem' ? 'Cena/teden (€)' : 'Cena (€)'} {!cenaZahtevo && '*'}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <div
                    onClick={() => setCenaZahtevo(v => !v)}
                    className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${cenaZahtevo ? 'bg-[#0c2340]' : 'bg-gray-200'}`}
                    style={{ height: '22px', minWidth: '40px' }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${cenaZahtevo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  Cena na zahtevo
                </label>
              </div>
              {!cenaZahtevo ? (
                <input
                  type="number"
                  min="0"
                  value={forma.cena}
                  onChange={(e) => posodobiFormo('cena', e.target.value)}
                  placeholder="45000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-sm text-[#9a7a2e] font-medium">
                  Cena na zahtevo — kupci vas bodo kontaktirali za ceno
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Letnik</label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={forma.letnik}
                  onChange={(e) => posodobiFormo('letnik', e.target.value)}
                  placeholder="2019"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dolžina (m)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={forma.dolzina_m}
                  onChange={(e) => posodobiFormo('dolzina_m', e.target.value)}
                  placeholder="12.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokacija</label>
              <input
                value={forma.lokacija}
                onChange={(e) => posodobiFormo('lokacija', e.target.value)}
                placeholder="Marina Portorož"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stanje</label>
              <div className="flex gap-2">
                {stanjeOpcije.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => posodobiFormo('stanje', s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                      forma.stanje === s ? 'bg-[#0c2340] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Urgentna prodaja — plačljivo, na voljo šele po objavi prek "Moja plovila" */}
          {tipOglasa === 'prodaja' && (
            <div className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-gray-400">
                ⚡
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">Urgentna prodaja — na voljo po objavi</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Po objavi oglasa lahko v "Moja plovila" doplačate 30 € za rdeč "Nujno" badge in prioriteto v prikazu.
                </p>
              </div>
            </div>
          )}

          {/* Oprema */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#0c2340] mb-4">Oprema</p>
            <div className="space-y-5">
              {opremaKategorije.map(({ naziv, opcije }) => (
                <div key={naziv}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{naziv}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {opcije.map(({ kljuc, label }) => (
                      <button
                        key={kljuc}
                        type="button"
                        onClick={() => toggleOprema(kljuc)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                          oprema[kljuc]
                            ? 'bg-[#0c2340] text-white'
                            : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${
                          oprema[kljuc] ? 'bg-white/20 border-white/30 text-white' : 'border-gray-300'
                        }`}>
                          {oprema[kljuc] && '✓'}
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#0c2340]">Kontaktni podatki</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={forma.kontakt_email}
                  onChange={(e) => posodobiFormo('kontakt_email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                <input
                  type="tel"
                  value={forma.kontakt_tel}
                  onChange={(e) => posodobiFormo('kontakt_tel', e.target.value)}
                  placeholder="+386 41 ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Slike */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6">
            <label
              htmlFor="slike-input"
              className="flex flex-col items-center justify-center text-center py-4 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">Naložite fotografije plovila</p>
              <p className="text-xs text-gray-400 mt-1">
                Do {MAX_SLIK} slik, največ {MAX_VELIKOST_MB} MB na sliko
              </p>
            </label>
            <input
              id="slike-input"
              type="file"
              accept="image/*"
              multiple
              disabled={slikePredogled.length >= MAX_SLIK}
              onChange={(e) => { dodajSlike(e.target.files); e.target.value = '' }}
              className="hidden"
            />

            {slikePredogled.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {slikePredogled.map((url, i) => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                    <img src={url} alt={`Predogled ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => odstraniSliko(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#c9a84c] text-[#0c2340] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Naslovna
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={nalaga}
            className="w-full py-4 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-bold rounded-2xl transition-all hover:scale-[1.01] shadow-sm text-base"
          >
            {nalagaSlike ? 'Nalagam slike...' : nalaga ? 'Shranjujem...' : editId ? '✓ Shrani spremembe' : '✓ Objavi oglas'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function DodajPloviloPage() {
  return (
    <Suspense fallback={<div className="p-8"><div className="w-6 h-6 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" /></div>}>
      <DodajPloviloContent />
    </Suspense>
  )
}
