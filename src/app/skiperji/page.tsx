'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Star, MapPin, CheckCircle, Send, Compass, Search, X, ChevronDown } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockSkiperji, unsplashSkipperji } from '@/data/mock'

const lokacije = ['Vse', 'Portorož', 'Izola', 'Koper', 'Piran', 'Split']
const tipiPlovil = ['Vse', 'jadrnica', 'motorni', 'katamaran', 'gumenjak', 'jahta']
const jezikiOpcije = ['slovenščina', 'angleščina', 'nemščina', 'hrvaščina', 'italijanščina']
type TipSkiper = 'vse' | 'samostojni' | 'agencija'

export default function SkiperjiPage() {
  const [lokacija, setLokacija] = useState('Vse')
  const [tipPlovila, setTipPlovila] = useState('Vse')
  const [jeziki, setJeziki] = useState<string[]>([])
  const [minIzkusnje, setMinIzkusnje] = useState(0)
  const [tipSkiper, setTipSkiper] = useState<TipSkiper>('vse')
  const [prikaziFiltre, setPrikaziFiltre] = useState(false)

  // Registracijski obrazec
  const [poslano, setPoslano] = useState(false)
  const [forma, setForma] = useState({
    ime: '', email: '', tel: '', lokacija: '',
    izkusnje: '', certifikati: '', plovila: '', cena: '', opis: '',
  })

  const filtrirani = useMemo(() => {
    return mockSkiperji.filter((s) => {
      if (lokacija !== 'Vse' && s.lokacija !== lokacija) return false
      if (tipPlovila !== 'Vse' && !s.tip_plovila.includes(tipPlovila)) return false
      if (jeziki.length > 0 && !jeziki.some(j => s.jeziki.includes(j))) return false
      if (s.izkusnje_let < minIzkusnje) return false
      if (tipSkiper !== 'vse' && s.tip_skiper !== tipSkiper) return false
      return true
    })
  }, [lokacija, tipPlovila, jeziki, minIzkusnje, tipSkiper])

  function toggleJezik(j: string) {
    setJeziki(prev => prev.includes(j) ? prev.filter(x => x !== j) : [...prev, j])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPoslano(true)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] pt-14 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-3">
              <Compass className="w-4 h-4" /> Profesionalni skiperji
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Skiperji</h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">
              Preverjeni skipperji za varno in udobno plovbo. Izberite izkušenega vodnika po Jadranu.
            </p>

            {/* Filtri */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-t-3xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Lokacija */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Lokacija</label>
                  <div className="relative">
                    <select
                      value={lokacija}
                      onChange={(e) => setLokacija(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] appearance-none"
                    >
                      {lokacije.map(l => <option key={l} value={l} className="text-gray-800">{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Tip plovila */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Tip plovila</label>
                  <div className="relative">
                    <select
                      value={tipPlovila}
                      onChange={(e) => setTipPlovila(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] appearance-none capitalize"
                    >
                      {tipiPlovil.map(t => <option key={t} value={t} className="text-gray-800 capitalize">{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Min izkušnje */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Min. izkušnje</label>
                  <div className="relative">
                    <select
                      value={minIzkusnje}
                      onChange={(e) => setMinIzkusnje(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#c9a84c] appearance-none"
                    >
                      <option value={0} className="text-gray-800">Brez omejitve</option>
                      <option value={5} className="text-gray-800">5+ let</option>
                      <option value={10} className="text-gray-800">10+ let</option>
                      <option value={15} className="text-gray-800">15+ let</option>
                      <option value={20} className="text-gray-800">20+ let</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Jeziki */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Jeziki</label>
                <div className="flex flex-wrap gap-2">
                  {jezikiOpcije.map(j => (
                    <button
                      key={j}
                      onClick={() => toggleJezik(j)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                        jeziki.includes(j)
                          ? 'bg-[#c9a84c] text-[#0c2340]'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                  {jeziki.length > 0 && (
                    <button onClick={() => setJeziki([])} className="px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY BAR */}
        <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1 shrink-0">
              {([
                { v: 'vse', label: '⚓ Vsi', },
                { v: 'samostojni', label: '👤 Samostojni' },
                { v: 'agencija', label: '🏢 Agencija' },
              ] as { v: TipSkiper; label: string }[]).map(({ v, label }) => (
                <button key={v} onClick={() => setTipSkiper(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                    tipSkiper === v ? 'bg-[#0c2340] text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 shrink-0">
              <span className="font-semibold text-[#0c2340]">{filtrirani.length}</span> skiperjev
            </span>
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
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtrirani.map((skipper) => (
                  <Link key={skipper.id} href={`/skiperji/${skipper.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden block">
                    <div className={`h-2 w-full ${skipper.tip_skiper === 'agencija' ? 'bg-[#0c2340]' : skipper.verified ? 'bg-[#c9a84c]' : 'bg-gray-200'}`} />
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-[#0c2340]/10 flex items-center justify-center overflow-hidden shrink-0">
                          {unsplashSkipperji[skipper.id] && skipper.tip_skiper !== 'agencija' ? (
                            <img src={unsplashSkipperji[skipper.id]} alt={skipper.ime} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{skipper.tip_skiper === 'agencija' ? '🏢' : '👨‍✈️'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display text-base font-semibold text-[#0c2340] leading-tight group-hover:text-[#1e3a5f] line-clamp-1">{skipper.ime}</h3>
                            {skipper.verified && (
                              <span title="Preverjeno"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /></span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              skipper.tip_skiper === 'agencija' ? 'bg-[#0c2340]/10 text-[#0c2340]' : 'bg-[#c9a84c]/15 text-[#9a7a2e]'
                            }`}>
                              {skipper.tip_skiper === 'agencija' ? '🏢 Agencija' : '👤 Samostojni'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {skipper.lokacija}
                            <span className="text-gray-300">·</span>
                            {skipper.tip_skiper === 'agencija' ? `${skipper.ekipa?.length ?? 0} skiperjev` : `${skipper.izkusnje_let} let`}
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(skipper.ocena) ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                            <span className="text-sm font-medium text-gray-700 ml-1">{skipper.ocena.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({skipper.st_ocen})</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{skipper.opis}</p>

                      {/* Certifikati */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {skipper.certifikati.slice(0, 3).map(c => (
                          <span key={c} className="text-xs px-2 py-0.5 bg-[#0c2340]/5 text-[#0c2340] rounded-full font-medium">{c}</span>
                        ))}
                      </div>

                      {/* Jeziki */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {skipper.jeziki.map(j => (
                          <span key={j} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full capitalize border border-gray-100">{j}</span>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#0c2340] text-lg">{skipper.cena_dan} €</span>
                          <span className="text-xs text-gray-400"> / dan</span>
                        </div>
                        <span className="px-4 py-2 bg-[#0c2340] group-hover:bg-[#1e3a5f] text-white text-sm font-semibold rounded-full transition-colors">
                          Poglej profil
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* REGISTRACIJSKI CTA + FORMA */}
        <section className="py-20 bg-white" id="registracija">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0c2340]/10 text-[#0c2340] text-sm font-medium mb-4">
                <Compass className="w-4 h-4" /> Postanite skipper
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-3">
                Ustvarite skipper profil
              </h2>
              <p className="text-gray-500 text-lg">
                Povežite se s strankami, ki iščejo izkušenega vodnika za plovbo po Jadranu.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { ikona: '👤', besedilo: 'Brezplačen profil' },
                { ikona: '⭐', besedilo: 'Rating sistem' },
                { ikona: '💬', besedilo: 'Direkten chat' },
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
                <h3 className="font-display text-2xl font-semibold text-[#0c2340]">Vloga poslana!</h3>
                <p className="text-gray-500">Kontaktirali vas bomo v 1–2 delovnih dneh.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ime in priimek</label>
                    <input required value={forma.ime} onChange={e => setForma(f => ({...f, ime: e.target.value}))}
                      placeholder="Janez Novak"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
                    <input required type="email" value={forma.email} onChange={e => setForma(f => ({...f, email: e.target.value}))}
                      placeholder="janez@primer.si"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Telefon</label>
                    <input required type="tel" value={forma.tel} onChange={e => setForma(f => ({...f, tel: e.target.value}))}
                      placeholder="+386 41 ..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Lokacija</label>
                    <input required value={forma.lokacija} onChange={e => setForma(f => ({...f, lokacija: e.target.value}))}
                      placeholder="Portorož"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Leta izkušenj</label>
                    <input required type="number" min="1" value={forma.izkusnje} onChange={e => setForma(f => ({...f, izkusnje: e.target.value}))}
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Cena / dan (€)</label>
                    <input required type="number" min="0" value={forma.cena} onChange={e => setForma(f => ({...f, cena: e.target.value}))}
                      placeholder="150"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Certifikati</label>
                  <input required value={forma.certifikati} onChange={e => setForma(f => ({...f, certifikati: e.target.value}))}
                    placeholder="ICC, VHF SRC, RYA Day Skipper..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Plovila ki jih vodite</label>
                  <input required value={forma.plovila} onChange={e => setForma(f => ({...f, plovila: e.target.value}))}
                    placeholder="jadrnica, motorni čoln, katamaran..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Kratka predstavitev</label>
                  <textarea required rows={3} value={forma.opis} onChange={e => setForma(f => ({...f, opis: e.target.value}))}
                    placeholder="Opišite vaše izkušnje, specializacijo in območje plovbe..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] bg-white resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-[1.01]">
                  <Send className="w-4 h-4" /> Pošlji vlogo
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
