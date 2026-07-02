'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Upload, AlertCircle, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import type { TipPlovila } from '@/types/database'

const tipiPlovila = [
  { vrednost: 'jadrnica', label: 'Jadrnica', ikona: '⛵' },
  { vrednost: 'motorni', label: 'Motorni čoln', ikona: '🚤' },
  { vrednost: 'gumenjak', label: 'Gumenjak', ikona: '🛟' },
  { vrednost: 'katamaran', label: 'Katamaran', ikona: '⛵' },
  { vrednost: 'jet', label: 'Jet ski', ikona: '💨' },
  { vrednost: 'drugo', label: 'Drugo', ikona: '⚓' },
]

const stanjeOpcije = ['odlično', 'dobro', 'potrebuje popravilo']

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
  const tipOglasa = searchParams.get('tip') === 'najem' ? 'najem' : 'prodaja'

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
  const [urgentno, setUrgentno] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [uspesno, setUspesno] = useState(false)

  function posodobiFormo(polje: string, vrednost: string) {
    setForma((f) => ({ ...f, [polje]: vrednost }))
  }

  function toggleOprema(kljuc: string) {
    setOprema((o) => ({ ...o, [kljuc]: !o[kljuc] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cenaZahtevo && !forma.cena) { setNapaka('Vpišite ceno ali izberite "Cena na zahtevo".'); return }
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('plovila').insert({
      naziv: forma.naziv,
      opis: forma.opis || null,
      tip: forma.tip as TipPlovila,
      tip_oglasa: tipOglasa,
      cena: cenaZahtevo ? 0 : Number(forma.cena),
      cena_na_zahtevo: cenaZahtevo,
      urgentno,
      letnik: forma.letnik ? Number(forma.letnik) : null,
      dolzina_m: forma.dolzina_m ? Number(forma.dolzina_m) : null,
      lokacija: forma.lokacija || null,
      stanje: forma.stanje,
      kontakt_email: forma.kontakt_email || null,
      kontakt_tel: forma.kontakt_tel || null,
      oprema,
      potrjeno: false,
      promoted: false,
      prodano: false,
      user_id: user?.id ?? null,
      slike: [],
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
          <h2 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Plovilo dodano!</h2>
          <p className="text-gray-500 mb-6">Vaš oglas je v pregledu. Ko bo potrjen, bo viden vsem obiskovalcem.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setUspesno(false); setForma(f => ({ ...f, naziv: '', opis: '', cena: '', letnik: '', dolzina_m: '' })); setCenaZahtevo(false); setUrgentno(false) }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium text-sm rounded-full hover:bg-gray-50"
            >
              Dodaj še eno
            </button>
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

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
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
          <h1 className="font-display text-2xl font-bold text-[#0c2340]">
            {tipOglasa === 'prodaja' ? 'Dodaj plovilo za prodajo' : 'Dodaj plovilo za najem'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Izpolnite podatke o plovilu. Oglas bo aktiven po pregledu.</p>
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

          {/* Urgentna prodaja */}
          {tipOglasa === 'prodaja' && (
            <button
              type="button"
              onClick={() => setUrgentno(v => !v)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                urgentno ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${urgentno ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className={`font-semibold text-sm ${urgentno ? 'text-red-700' : 'text-gray-700'}`}>Urgentna prodaja</p>
                <p className="text-xs text-gray-400 mt-0.5">Oglas dobi rdeč "Nujno" badge in prioriteto v prikazu</p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                urgentno ? 'bg-red-600 border-red-600' : 'border-gray-300'
              }`}>
                {urgentno && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
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
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-400">Dodajanje slik kmalu na voljo</p>
            <p className="text-xs text-gray-300 mt-1">Upload fotografij plovila</p>
          </div>

          <button
            type="submit"
            disabled={nalaga}
            className="w-full py-4 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-bold rounded-2xl transition-all hover:scale-[1.01] shadow-sm text-base"
          >
            {nalaga ? 'Shranjujem...' : '✓ Objavi oglas'}
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
