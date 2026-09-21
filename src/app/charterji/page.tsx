'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Ship, Search, X, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CharterKartica from '@/components/charterji/CharterKartica'
import TipCharterjaIzbirnik from '@/components/charterji/TipCharterjaIzbirnik'
import RangeSlider from '@/components/plovila/RangeSlider'
import { createClient } from '@/lib/supabase/client'
import { parsePlainNumber } from '@/lib/parseNumberInput'
import { useAuth } from '@/components/providers/AuthProvider'
import type { TipCharterja, TipCharterPlovila, Charter } from '@/types/database'

const OSEBE_MIN = 1
const OSEBE_MAX = 50
const DOLZINA_MIN = 5
const DOLZINA_MAX = 80
const LEZISCA_MIN = 0
const LEZISCA_MAX = 20

export default function CharterjiPage() {
  const { user, imaCharterProfil } = useAuth()
  // Iskalni filtri
  const [tipPlovila, setTipPlovila] = useState<TipCharterPlovila | ''>('')
  const [osebe, setOsebe] = useState<[number, number]>([OSEBE_MIN, OSEBE_MAX])
  const [dolzina, setDolzina] = useState<[number, number]>([DOLZINA_MIN, DOLZINA_MAX])
  const [lezisca, setLezisca] = useState<[number, number]>([LEZISCA_MIN, LEZISCA_MAX])

  // Sekundarni filter (podjetje/zasebnik) — ločen
  const [filter, setFilter] = useState<TipCharterja | 'vse'>('vse')

  const [realCharterji, setRealCharterji] = useState<Charter[]>([])
  // Charterji sami nimajo podatka o št. ležišč (to je last. posameznega
  // plovila, ne charter podjetja) — zato za ta filter preverimo njihovo
  // floto najem-oglasov (plovila_javno, tip_oglasa='najem') po user_id.
  const [leziscaPoUporabniku, setLeziscaPoUporabniku] = useState<Record<string, number[]>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.from('charterji_javno').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setRealCharterji(data) })
    supabase.from('plovila_javno').select('user_id, postelje').eq('tip_oglasa', 'najem')
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, number[]> = {}
        for (const p of data) {
          if (!p.user_id || p.postelje === null) continue
          map[p.user_id] = map[p.user_id] ? [...map[p.user_id], p.postelje] : [p.postelje]
        }
        setLeziscaPoUporabniku(map)
      })
  }, [])

  const vsiCharterji = realCharterji

  const leziscaAktiven = lezisca[0] > LEZISCA_MIN || lezisca[1] < LEZISCA_MAX

  const filtrirani = useMemo(() => {
    return vsiCharterji.filter((c) => {
      if (filter !== 'vse' && c.tip !== filter) return false
      if (tipPlovila && !c.tip_plovila.includes(tipPlovila)) return false
      // 0 pomeni, da charter tega podatka še ni izpolnil — takega ne
      // izločimo, sicer bi nepopolni (a sicer objavljeni) profili
      // trajno izginili iz iskanja, ne glede na izbrane filtre.
      if (c.max_oseb > 0 && (c.max_oseb < osebe[0] || c.max_oseb > osebe[1])) return false
      if (c.max_dolzina_m > 0 && (c.max_dolzina_m < dolzina[0] || c.max_dolzina_m > dolzina[1])) return false
      if (leziscaAktiven) {
        const flota = c.user_id ? leziscaPoUporabniku[c.user_id] : undefined
        const imaUstrezno = flota?.some((n) => n >= lezisca[0] && n <= lezisca[1])
        if (!imaUstrezno) return false
      }
      return true
    })
  }, [vsiCharterji, filter, tipPlovila, osebe, dolzina, lezisca, leziscaAktiven, leziscaPoUporabniku])

  const aktivniFilter =
    tipPlovila !== '' ||
    osebe[0] > OSEBE_MIN ||
    osebe[1] < OSEBE_MAX ||
    dolzina[0] > DOLZINA_MIN ||
    dolzina[1] < DOLZINA_MAX ||
    leziscaAktiven

  function resetFiltre() {
    setTipPlovila('')
    setOsebe([OSEBE_MIN, OSEBE_MAX])
    setDolzina([DOLZINA_MIN, DOLZINA_MAX])
    setLezisca([LEZISCA_MIN, LEZISCA_MAX])
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HEADER + ISKANJE */}
        <section className="bg-[#0c2340] pt-14 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-[#1e3a5f]/80 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-3">
              <Ship className="w-4 h-4" /> Najem plovil
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Charterji</h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">
              Preverjena podjetja in zasebniki. Izberite tip plovila, kapaciteto in dolžino.
            </p>

            {/* Iskalni widget */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-t-3xl p-6">
              {/* Tip plovila */}
              <div className="mb-6">
                <TipCharterjaIzbirnik vrednost={tipPlovila} onChange={setTipPlovila} />
                {aktivniFilter && (
                  <button
                    onClick={resetFiltre}
                    className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Počisti
                  </button>
                )}
              </div>

              {/* Sliderji */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <RangeSlider
                  label="Število oseb"
                  min={OSEBE_MIN}
                  max={OSEBE_MAX}
                  low={osebe[0]}
                  high={osebe[1]}
                  step={1}
                  onChange={(l, h) => setOsebe([l, h])}
                  format={(v) => `${v} oseb`}
                  light
                />
                <RangeSlider
                  label="Dolžina plovila"
                  min={DOLZINA_MIN}
                  max={DOLZINA_MAX}
                  low={dolzina[0]}
                  high={dolzina[1]}
                  step={1}
                  onChange={(l, h) => setDolzina([l, h])}
                  format={(v) => `${v} m`}
                  parse={parsePlainNumber}
                  light
                />
                <RangeSlider
                  label="Število ležišč"
                  min={LEZISCA_MIN}
                  max={LEZISCA_MAX}
                  low={lezisca[0]}
                  high={lezisca[1]}
                  step={1}
                  onChange={(l, h) => setLezisca([l, h])}
                  format={(v) => `${v}`}
                  parse={parsePlainNumber}
                  light
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEKUNDARNI FILTER (podjetje/zasebnik) + REZULTATI */}
        <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-3">
              {/* Na ozkih zaslonih 3 pilulke ne gredo vedno v 375px — namesto
                  da bi lomile stran (horizontalni scroll cele strani), naj
                  raje ta vrstica sama scrolla vodoravno. */}
              <div className="flex gap-1 overflow-x-auto flex-nowrap scrollbar-hide">
                {([
                  { vrednost: 'vse', label: 'Vsi', ikona: '⚓' },
                  { vrednost: 'podjetje', label: 'Podjetja', ikona: '🏢' },
                  { vrednost: 'zasebnik', label: 'Zasebniki', ikona: '👤' },
                ] as { vrednost: TipCharterja | 'vse'; label: string; ikona: string }[]).map((t) => (
                  <button
                    key={t.vrednost}
                    onClick={() => setFilter(t.vrednost)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                      filter === t.vrednost
                        ? 'bg-[#0c2340] text-white'
                        : 'text-gray-500 hover:text-[#0c2340] hover:bg-gray-50'
                    }`}
                  >
                    <span>{t.ikona}</span> {t.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === t.vrednost ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {t.vrednost === 'vse' ? filtrirani.length : filtrirani.filter(c => c.tip === t.vrednost).length}
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-400 hidden sm:block">
                <span className="font-semibold text-[#0c2340]">{filtrirani.length}</span> ponudnikov
              </span>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtrirani.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search className="w-10 h-10 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-400">Ni zadetkov</p>
                <p className="text-sm text-gray-400 mt-1">Poskusite razširiti iskalne pogoje</p>
                <button
                  onClick={resetFiltre}
                  className="mt-4 px-5 py-2 text-sm font-medium text-[#0c2340] border border-[#0c2340] rounded-full hover:bg-[#0c2340] hover:text-white transition-colors"
                >
                  Počisti filtre
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtrirani.map((charter) => (
                  <CharterKartica key={charter.id} charter={charter} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* REGISTRACIJSKI CTA — prej dolg "prijavni obrazec" (posilje se
            samo povprasevanje, ki ga mora nekdo rocno obdelati brez
            kakrsnegakoli admin orodja za to), ceprav /registracija ze
            ponuja pravo, takojsnjo samopostrezno registracijo (izbira
            vloge "Charter" -> onboarding -> ziv profil brez cakanja).
            Enak popravek kot na /skiperji. */}
        <section className="py-20 bg-white" id="prijava">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/15 text-[#9a7a2e] text-sm font-medium mb-4">
              <Ship className="w-4 h-4" /> Postanite ponudnik
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-3">
              Prijavite se kot charter
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Bodisi podjetje ali zasebnik — vaša plovila bodo vidna tisoče potencialnim najemnikom, registracija traja manj kot minuto.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { ikona: '📋', besedilo: 'Brezplačna prijava' },
                { ikona: '✅', besedilo: 'Preverjeni profil' },
                { ikona: '📈', besedilo: 'Večja vidnost' },
              ].map(({ ikona, besedilo }) => (
                <div key={besedilo} className="flex flex-col items-center gap-2 p-4 bg-[#f8fafc] rounded-2xl text-center">
                  <span className="text-2xl">{ikona}</span>
                  <span className="text-sm font-medium text-[#0c2340]">{besedilo}</span>
                </div>
              ))}
            </div>
            {/* Prijavljen uporabnik z drugo vlogo tukaj DODA charter profil
                na svoj obstojeci racun - glej enako opombo na /skiperji. */}
            <Link
              href={!user ? '/registracija' : imaCharterProfil ? '/dashboard' : '/dashboard/postani-charter'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-[#c9a84c]/20"
            >
              {!user ? 'Ustvari brezplačen profil' : imaCharterProfil ? 'Pojdi na svoj profil' : 'Dodaj charter profil'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
