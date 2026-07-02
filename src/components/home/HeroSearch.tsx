'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, ShoppingBag, Anchor } from 'lucide-react'
import RangeSlider from '@/components/plovila/RangeSlider'
import { CENA_VALUES, cenaValueToIdx, formatCena } from '@/lib/cenaSlider'

const CENA_MAX_IDX = CENA_VALUES.length - 1
const DOLZINA_MIN = 3
const DOLZINA_MAX = 150

const kategorije = [
  { vrednost: 'jadrnica', label: 'Jadrnica', ikona: '⛵' },
  { vrednost: 'motorni', label: 'Motorni čoln', ikona: '🚤' },
  { vrednost: 'jet', label: 'Jet ski', ikona: '💨' },
  { vrednost: 'gumenjak', label: 'Gumenjak', ikona: '🛟' },
  { vrednost: 'katamaran', label: 'Katamaran', ikona: '⛵' },
]

const tipNajem = [
  { vrednost: 'jahta', label: 'Jahta', ikona: '🛥️' },
  { vrednost: 'jadrnica', label: 'Jadrnica', ikona: '⛵' },
  { vrednost: 'motorni', label: 'Motorni čoln', ikona: '🚤' },
  { vrednost: 'gumenjak', label: 'Gumenjak', ikona: '🛟' },
]

const stanja = ['odlično', 'dobro', 'potrebuje popravilo']

export default function HeroSearch() {
  const router = useRouter()
  const [nacin, setNacin] = useState<'kupi' | 'najemi'>('kupi')

  // Kupi
  const [tip, setTip] = useState('')
  const [cenaIdx, setCenaIdx] = useState<[number, number]>([0, CENA_MAX_IDX])
  const [dolzina, setDolzina] = useState<[number, number]>([DOLZINA_MIN, DOLZINA_MAX])
  const [razsirenFiltr, setRazsirenFiltr] = useState(false)
  const [izbranaStanja, setIzbranaStanja] = useState<string[]>([])

  // Najemi
  const [destinacija, setDestinacija] = useState('')
  const [datumOd, setDatumOd] = useState('')
  const [datumDo, setDatumDo] = useState('')
  const [tipNajema, setTipNajema] = useState('')
  const [steviloOseb, setSteviloOseb] = useState('')

  function poisciKupi() {
    const params = new URLSearchParams()
    if (tip) params.set('tip', tip)
    const cenaMin = CENA_VALUES[cenaIdx[0]]
    const cenaMax = CENA_VALUES[cenaIdx[1]]
    if (cenaMin > 0) params.set('cena_min', String(cenaMin))
    if (cenaMax < CENA_VALUES[CENA_MAX_IDX]) params.set('cena_max', String(cenaMax))
    if (dolzina[0] > DOLZINA_MIN) params.set('dolzina_min', String(dolzina[0]))
    if (dolzina[1] < DOLZINA_MAX) params.set('dolzina_max', String(dolzina[1]))
    if (izbranaStanja.length > 0) params.set('stanje', izbranaStanja.join(','))
    router.push(`/plovila${params.toString() ? `?${params}` : ''}`)
  }

  function poisciNajemi() {
    const params = new URLSearchParams()
    if (destinacija) params.set('destinacija', destinacija)
    if (datumOd) params.set('od', datumOd)
    if (datumDo) params.set('do', datumDo)
    if (tipNajema) params.set('tip', tipNajema)
    if (steviloOseb) params.set('oseb', steviloOseb)
    router.push(`/charterji${params.toString() ? `?${params}` : ''}`)
  }

  function toggleStanje(s: string) {
    setIzbranaStanja((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Toggle Kupi / Najemi */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/10 border border-white/20 rounded-full p-1 gap-1">
          <button
            onClick={() => setNacin('kupi')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              nacin === 'kupi'
                ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Kupi plovilo
          </button>
          <button
            onClick={() => setNacin('najemi')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              nacin === 'najemi'
                ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Anchor className="w-4 h-4" />
            Najemi plovilo
          </button>
        </div>
      </div>

      {nacin === 'kupi' ? (
        <>
          {/* Kategorije */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {kategorije.map((k) => (
              <button
                key={k.vrednost}
                onClick={() => setTip(tip === k.vrednost ? '' : k.vrednost)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  tip === k.vrednost
                    ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg shadow-[#c9a84c]/30 scale-105'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                <span className="text-base">{k.ikona}</span>
                {k.label}
              </button>
            ))}
          </div>

          {/* Search card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <RangeSlider
                label="Cena"
                min={0}
                max={CENA_MAX_IDX}
                low={cenaIdx[0]}
                high={cenaIdx[1]}
                step={1}
                onChange={(l, h) => setCenaIdx([l, h])}
                format={(idx) => formatCena(CENA_VALUES[idx])}
                light
              />
              <RangeSlider
                label="Dolžina"
                min={DOLZINA_MIN}
                max={DOLZINA_MAX}
                low={dolzina[0]}
                high={dolzina[1]}
                step={1}
                onChange={(l, h) => setDolzina([l, h])}
                format={(v) => `${v} m`}
                light
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <button
                onClick={() => setRazsirenFiltr(!razsirenFiltr)}
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-3"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Dodatni filtri
                {razsirenFiltr ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {razsirenFiltr && (
                <div className="mb-4">
                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wide font-medium">Stanje plovila</p>
                  <div className="flex flex-wrap gap-2">
                    {stanja.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleStanje(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                          izbranaStanja.includes(s)
                            ? 'bg-[#c9a84c] text-[#0c2340]'
                            : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={poisciKupi}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#c9a84c]/20 text-base"
              >
                <Search className="w-4 h-4" />
                Poišči plovilo
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Tip plovila za najem */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tipNajem.map((k) => (
              <button
                key={k.vrednost}
                onClick={() => setTipNajema(tipNajema === k.vrednost ? '' : k.vrednost)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  tipNajema === k.vrednost
                    ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg shadow-[#c9a84c]/30 scale-105'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                <span className="text-base">{k.ikona}</span>
                {k.label}
              </button>
            ))}
          </div>

          {/* Charter search card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Destinacija */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Destinacija</label>
                <input
                  type="text"
                  value={destinacija}
                  onChange={(e) => setDestinacija(e.target.value)}
                  placeholder="Portorož, Split, Dubrovnik..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>

              {/* Število oseb */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Število oseb</label>
                <select
                  value={steviloOseb}
                  onChange={(e) => setSteviloOseb(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] transition-colors appearance-none"
                >
                  <option value="" className="text-gray-800">Koliko oseb?</option>
                  {[2, 4, 6, 8, 10, 15, 20, 30, 50].map(n => (
                    <option key={n} value={n} className="text-gray-800">{n} oseb</option>
                  ))}
                </select>
              </div>

              {/* Datum od */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Datum od</label>
                <input
                  type="date"
                  value={datumOd}
                  onChange={(e) => setDatumOd(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] transition-colors [color-scheme:dark]"
                />
              </div>

              {/* Datum do */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Datum do</label>
                <input
                  type="date"
                  value={datumDo}
                  onChange={(e) => setDatumDo(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={poisciNajemi}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-[#c9a84c]/20 text-base"
            >
              <Search className="w-4 h-4" />
              Poišči charter
            </button>
          </div>
        </>
      )}
    </div>
  )
}
