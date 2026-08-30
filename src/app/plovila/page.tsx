'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { X, Search, ArrowUpDown, GitCompare, ArrowRight, Tag, Ruler, ShoppingBag, Anchor } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PloviloKartica from '@/components/plovila/PloviloKartica'
import RangeSlider from '@/components/plovila/RangeSlider'
import TipPlovilaIzbirnik from '@/components/plovila/TipPlovilaIzbirnik'
import { CENA_VALUES, cenaValueToIdx, formatCena } from '@/lib/cenaSlider'
import { usePrimerjava } from '@/context/PrimerjaContext'
import { createClient } from '@/lib/supabase/client'
import type { TipPlovila, Plovilo } from '@/types/database'

const CENA_MAX_IDX = CENA_VALUES.length - 1
const DOLZINA_MIN = 3
const DOLZINA_MAX = 150
const PER_PAGE = 6

type SortKey = 'privzeto' | 'cena_asc' | 'cena_desc' | 'letnik_desc' | 'dolzina_asc'

const sortOpcije: { vrednost: SortKey; label: string }[] = [
  { vrednost: 'privzeto', label: 'Privzeto' },
  { vrednost: 'cena_asc', label: 'Cena ↑' },
  { vrednost: 'cena_desc', label: 'Cena ↓' },
  { vrednost: 'letnik_desc', label: 'Najnovejši' },
  { vrednost: 'dolzina_asc', label: 'Dolžina ↑' },
]

function PlovilaContent() {
  const params = useSearchParams()
  const initTip = (params.get('tip') ?? 'vse') as TipPlovila | 'vse'
  const initCenaMin = cenaValueToIdx(Number(params.get('cena_min') ?? 0))
  const initCenaMax = cenaValueToIdx(Number(params.get('cena_max') ?? CENA_VALUES[CENA_MAX_IDX]))
  const initOglas = params.get('oglas') === 'najem' ? 'najem' : 'prodaja'

  const [oglas, setOglas] = useState<'prodaja' | 'najem'>(initOglas)
  const [tip, setTip] = useState<TipPlovila | 'vse'>(initTip)
  const [cenaIdx, setCenaIdx] = useState<[number, number]>([initCenaMin, initCenaMax])
  const [dolzina, setDolzina] = useState<[number, number]>([DOLZINA_MIN, DOLZINA_MAX])
  const [sortiranje, setSortiranje] = useState<SortKey>('privzeto')
  const [stran, setStran] = useState(1)

  const { primerjava, odstraniIzPrimerjave, pocistiPrimerjavo } = usePrimerjava()

  const [realPlovila, setRealPlovila] = useState<Plovilo[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('plovila_javno')
      .select('*')
      .eq('tip_oglasa', oglas)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setRealPlovila(data) })
  }, [oglas])

  const vsaPlovila = realPlovila

  const cenaMin = CENA_VALUES[cenaIdx[0]]
  const cenaMax = CENA_VALUES[cenaIdx[1]]

  const filtrirano = useMemo(() => {
    let result = vsaPlovila.filter((p) => {
      if (tip !== 'vse' && p.tip !== tip) return false
      if (p.cena < cenaMin || p.cena > cenaMax) return false
      if (p.dolzina_m !== null && (p.dolzina_m < dolzina[0] || p.dolzina_m > dolzina[1])) return false
      return true
    })

    switch (sortiranje) {
      case 'cena_asc': result = [...result].sort((a, b) => a.cena - b.cena); break
      case 'cena_desc': result = [...result].sort((a, b) => b.cena - a.cena); break
      case 'letnik_desc': result = [...result].sort((a, b) => (b.letnik ?? 0) - (a.letnik ?? 0)); break
      case 'dolzina_asc': result = [...result].sort((a, b) => (a.dolzina_m ?? 0) - (b.dolzina_m ?? 0)); break
    }

    // Urgentno > Promoted > Ostali (prodano na konec)
    return [
      ...result.filter(p => p.urgentno && !p.prodano),
      ...result.filter(p => p.promoted && !p.urgentno && !p.prodano),
      ...result.filter(p => !p.promoted && !p.urgentno && !p.prodano),
      ...result.filter(p => p.prodano),
    ]
  }, [vsaPlovila, tip, cenaIdx, dolzina, sortiranje])

  const skupajStrani = Math.ceil(filtrirano.length / PER_PAGE)
  const prikazana = filtrirano.slice((stran - 1) * PER_PAGE, stran * PER_PAGE)

  const aktivniFilter =
    tip !== 'vse' || cenaIdx[0] > 0 || cenaIdx[1] < CENA_MAX_IDX || dolzina[0] > DOLZINA_MIN || dolzina[1] < DOLZINA_MAX

  function resetFiltre() {
    setTip('vse')
    setCenaIdx([0, CENA_MAX_IDX])
    setDolzina([DOLZINA_MIN, DOLZINA_MAX])
    setStran(1)
  }

  const CenaSlider = (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#0c2340] text-[#c9a84c] flex items-center justify-center shrink-0 mt-0.5">
        <Tag className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1">
        <RangeSlider
          label="Cena"
          min={0} max={CENA_MAX_IDX} low={cenaIdx[0]} high={cenaIdx[1]} step={1}
          onChange={(l, h) => { setCenaIdx([l, h]); setStran(1) }}
          format={(idx) => formatCena(CENA_VALUES[idx])}
        />
      </div>
    </div>
  )

  const DolzinaSlider = (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#0c2340] text-[#c9a84c] flex items-center justify-center shrink-0 mt-0.5">
        <Ruler className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1">
        <RangeSlider
          label="Dolžina"
          min={DOLZINA_MIN} max={DOLZINA_MAX} low={dolzina[0]} high={dolzina[1]} step={1}
          onChange={(l, h) => { setDolzina([l, h]); setStran(1) }}
          format={(v) => `${v} m`}
        />
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        {/* HEADER */}
        <section className="bg-[#0c2340] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
              {oglas === 'najem' ? 'Plovila za najem' : 'Plovila'}
            </h1>
            <p className="text-white/70 text-lg mb-6">
              {oglas === 'najem'
                ? 'Jadrnice, motorni čolni, gumenjaki — najemite plovilo za svoj naslednji izlet.'
                : 'Jadrnice, motorni čolni, gumenjaki — najdite idealno plovilo.'}
            </p>
            <div className="inline-flex bg-white/10 border border-white/20 rounded-full p-1 gap-1">
              <button
                onClick={() => { setOglas('prodaja'); setStran(1) }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  oglas === 'prodaja' ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Za prodajo
              </button>
              <button
                onClick={() => { setOglas('najem'); setStran(1) }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  oglas === 'najem' ? 'bg-[#c9a84c] text-[#0c2340] shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                <Anchor className="w-4 h-4" /> Za najem
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* FILTRI — čez celo širino, nad rezultati */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-[#0c2340]">Filtri</h2>
                {aktivniFilter && (
                  <button onClick={resetFiltre} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors">
                    <X className="w-3 h-3" /> Počisti
                  </button>
                )}
              </div>

              <div className="mb-6">
                <TipPlovilaIzbirnik vrednost={tip} onChange={(v) => { setTip(v); setStran(1) }} />
              </div>

              <div className="h-px bg-gray-100 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {CenaSlider}
                {DolzinaSlider}
              </div>
            </div>

            {/* DESNA VSEBINA */}
            <div className="min-w-0">

              {/* Toolbar */}
                <div className="flex items-center justify-between mb-5 gap-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-[#0c2340]">{filtrirano.length}</span> plovil najdenih
                  </p>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    <select
                      value={sortiranje}
                      onChange={e => { setSortiranje(e.target.value as SortKey); setStran(1) }}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#0c2340] focus:outline-none focus:border-[#c9a84c] bg-white"
                    >
                      {sortOpcije.map(o => (
                        <option key={o.vrednost} value={o.vrednost}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filtrirano.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Search className="w-10 h-10 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-400">Ni rezultatov</p>
                    <p className="text-sm text-gray-400 mt-1">Poskusite spremeniti filtre</p>
                    <button
                      onClick={resetFiltre}
                      className="mt-4 px-5 py-2 text-sm font-medium text-[#0c2340] border border-[#0c2340] rounded-full hover:bg-[#0c2340] hover:text-white transition-colors"
                    >
                      Počisti filtre
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                      {prikazana.map((plovilo) => (
                        <PloviloKartica
                          key={plovilo.id}
                          plovilo={plovilo}
                          promoted={plovilo.promoted}
                        />
                      ))}
                    </div>

                    {/* Paginacija */}
                    {skupajStrani > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setStran(s => Math.max(1, s - 1))}
                          disabled={stran === 1}
                          className="px-4 py-2 text-sm font-medium text-[#0c2340] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ← Nazaj
                        </button>
                        {Array.from({ length: skupajStrani }, (_, i) => i + 1).map(n => (
                          <button
                            key={n}
                            onClick={() => setStran(n)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                              stran === n
                                ? 'bg-[#0c2340] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          onClick={() => setStran(s => Math.min(skupajStrani, s + 1))}
                          disabled={stran === skupajStrani}
                          className="px-4 py-2 text-sm font-medium text-[#0c2340] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Naprej →
                        </button>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating primerjava bar */}
      {primerjava.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-[#0c2340] border border-[#c9a84c]/30 rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-white text-sm font-medium">Primerjava ({primerjava.length}/3)</span>
            </div>
            <div className="flex items-center gap-2">
              {primerjava.map(p => (
                <div key={p.id} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-white text-xs font-medium truncate max-w-[80px]">{p.naziv}</span>
                  <button
                    onClick={() => odstraniIzPrimerjave(p.id)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {primerjava.length >= 2 && (
                <Link
                  href="/primerjava"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] text-sm font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Primerjaj <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={pocistiPrimerjavo}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default function PlovilaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" /></div>}>
      <PlovilaContent />
    </Suspense>
  )
}
