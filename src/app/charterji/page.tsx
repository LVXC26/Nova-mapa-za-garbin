'use client'

import { useState, useMemo } from 'react'
import { Building2, User, CheckCircle, Send, Ship, Search, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CharterKartica from '@/components/charterji/CharterKartica'
import RangeSlider from '@/components/plovila/RangeSlider'
import { mockCharterji } from '@/data/mock'
import type { TipCharterja, TipCharterPlovila } from '@/types/database'

const OSEBE_MIN = 1
const OSEBE_MAX = 50
const DOLZINA_MIN = 5
const DOLZINA_MAX = 80

const tipovPlovil: { vrednost: TipCharterPlovila; label: string; ikona: string }[] = [
  { vrednost: 'jahta', label: 'Jahta', ikona: '🛥️' },
  { vrednost: 'jadrnica', label: 'Jadrnica', ikona: '⛵' },
  { vrednost: 'motorni', label: 'Motorni čoln', ikona: '🚤' },
  { vrednost: 'gumenjak', label: 'Gumenjak', ikona: '🛟' },
]

export default function CharterjiPage() {
  // Iskalni filtri
  const [tipPlovila, setTipPlovila] = useState<TipCharterPlovila | ''>('')
  const [osebe, setOsebe] = useState<[number, number]>([OSEBE_MIN, OSEBE_MAX])
  const [dolzina, setDolzina] = useState<[number, number]>([DOLZINA_MIN, DOLZINA_MAX])

  // Sekundarni filter (podjetje/zasebnik) — ločen
  const [filter, setFilter] = useState<TipCharterja | 'vse'>('vse')

  // Obrazec
  const [poslano, setPoslano] = useState(false)
  const [form, setForm] = useState({
    naziv: '',
    tip: 'podjetje' as TipCharterja,
    email: '',
    tel: '',
    opis: '',
  })

  const filtrirani = useMemo(() => {
    return mockCharterji.filter((c) => {
      if (filter !== 'vse' && c.tip !== filter) return false
      if (tipPlovila && !c.tip_plovila.includes(tipPlovila)) return false
      if (c.max_oseb < osebe[0]) return false
      if (c.max_dolzina_m < dolzina[0] || c.max_dolzina_m > dolzina[1]) return false
      return true
    })
  }, [filter, tipPlovila, osebe, dolzina])

  const aktivniFilter =
    tipPlovila !== '' ||
    osebe[0] > OSEBE_MIN ||
    osebe[1] < OSEBE_MAX ||
    dolzina[0] > DOLZINA_MIN ||
    dolzina[1] < DOLZINA_MAX

  function resetFiltre() {
    setTipPlovila('')
    setOsebe([OSEBE_MIN, OSEBE_MAX])
    setDolzina([DOLZINA_MIN, DOLZINA_MAX])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPoslano(true)
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
              <div className="flex flex-wrap gap-2 mb-6">
                {tipovPlovil.map((t) => (
                  <button
                    key={t.vrednost}
                    onClick={() => setTipPlovila(tipPlovila === t.vrednost ? '' : t.vrednost)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      tipPlovila === t.vrednost
                        ? 'bg-[#c9a84c] text-[#0c2340] scale-105 shadow-lg shadow-[#c9a84c]/25'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span>{t.ikona}</span> {t.label}
                  </button>
                ))}
                {aktivniFilter && (
                  <button
                    onClick={resetFiltre}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Počisti
                  </button>
                )}
              </div>

              {/* Sliderji */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  light
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEKUNDARNI FILTER (podjetje/zasebnik) + REZULTATI */}
        <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex gap-1">
                {([
                  { vrednost: 'vse', label: 'Vsi', ikona: '⚓' },
                  { vrednost: 'podjetje', label: 'Podjetja', ikona: '🏢' },
                  { vrednost: 'zasebnik', label: 'Zasebniki', ikona: '👤' },
                ] as { vrednost: TipCharterja | 'vse'; label: string; ikona: string }[]).map((t) => (
                  <button
                    key={t.vrednost}
                    onClick={() => setFilter(t.vrednost)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

        {/* PRIJAVNI OBRAZEC */}
        <section className="py-20 bg-white" id="prijava">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/15 text-[#9a7a2e] text-sm font-medium mb-4">
                <Ship className="w-4 h-4" /> Postanite ponudnik
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-3">
                Prijavite se kot charter
              </h2>
              <p className="text-gray-500 text-lg">
                Bodisi podjetje ali zasebnik — vaša plovila bodo vidna tisoče potencialnim najemnikom.
              </p>
            </div>

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

            {poslano ? (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#0c2340]">Prijava poslana!</h3>
                <p className="text-gray-500">Kontaktirali vas bomo v 1–2 delovnih dneh.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-8 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-2">Sem</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { vrednost: 'podjetje', label: 'Podjetje / agencija', ikona: Building2 },
                      { vrednost: 'zasebnik', label: 'Zasebnik', ikona: User },
                    ] as { vrednost: TipCharterja; label: string; ikona: React.ElementType }[]).map(({ vrednost, label, ikona: Ikona }) => (
                      <button
                        key={vrednost}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, tip: vrednost }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.tip === vrednost
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#0c2340]'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <Ikona className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                    {form.tip === 'podjetje' ? 'Naziv podjetja' : 'Ime in priimek'}
                  </label>
                  <input
                    required
                    value={form.naziv}
                    onChange={(e) => setForm((f) => ({ ...f, naziv: e.target.value }))}
                    placeholder={form.tip === 'podjetje' ? 'Adriatic Charter d.o.o.' : 'Janez Novak'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="info@primer.si"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Telefon</label>
                    <input
                      required
                      type="tel"
                      value={form.tel}
                      onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
                      placeholder="+386 41 ..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Kratka predstavitev</label>
                  <textarea
                    required
                    rows={4}
                    value={form.opis}
                    onChange={(e) => setForm((f) => ({ ...f, opis: e.target.value }))}
                    placeholder="Opišite svoja plovila, lokacijo in pogoje najema..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-[1.01] shadow-lg shadow-[#c9a84c]/20"
                >
                  <Send className="w-4 h-4" />
                  Pošlji prijavo
                </button>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
