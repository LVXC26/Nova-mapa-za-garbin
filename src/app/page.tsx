'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Anchor, Star, Clock, ChevronRight, Tag, Calendar, TrendingUp, Ship, Compass, CheckCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PloviloKartica from '@/components/plovila/PloviloKartica'
import CharterKartica from '@/components/charterji/CharterKartica'
import HeroSearch from '@/components/home/HeroSearch'
import { mockPlovila, mockPromocije, mockNovice, mockCharterji, mockPromotedIds, unsplashNovice } from '@/data/mock'
import { formatDatum } from '@/lib/utils'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)
  return ok ? (
    <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
      <CheckCircle className="w-5 h-5" /> Hvala za prijavo!
    </div>
  ) : (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={e => { e.preventDefault(); if (email) setOk(true) }}
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Vaš e-mail naslov"
        className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105 shrink-0"
      >
        Prijavi se <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  )
}

export default function HomePage() {
  const plovilaZaProdajo = mockPlovila.filter(p => p.tip_oglasa === 'prodaja').slice(0, 6)
  const novice = mockNovice.slice(0, 3)
  const promocije = mockPromocije.slice(0, 4)
  const charterji = mockCharterji.slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0c2340] overflow-hidden pt-16">
          {/* Hero background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1559839809-3fd6ed4fabe7?auto=format&fit=crop&w=1920&q=80"
              alt=""
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-[#0c2340]/75" />
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#c9a84c]/8 blur-3xl animate-float" />
            <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-[#0c2340]/40 blur-3xl animate-float delay-300" />
            <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,100 C240,160 480,40 720,100 C960,160 1200,40 1440,100 L1440,200 L0,200 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-8 animate-fade-in-up">
              <Anchor className="w-4 h-4 animate-float" />
              Vaš zaupanja vredni pomorski portal
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in-up delay-100">
              Vaše naslednje<br />
              <span className="text-[#c9a84c]">plovilo čaka</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto animate-fade-in-up delay-200">
              Poiščite jadrnico, motorni čoln, jet ski, gumenjak ali katamaran. Kupite ali najemite.
            </p>

            <div className="animate-fade-in-up delay-300">
              <HeroSearch />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
            </svg>
          </div>
        </section>

        {/* STATS */}
        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { vrednost: '240+', opis: 'Aktivnih oglasov', ikona: '⛵' },
                { vrednost: '1.200+', opis: 'Zadovoljnih kupcev', ikona: '👥' },
                { vrednost: '85%', opis: 'Prodanih v 30 dneh', ikona: '📈' },
                { vrednost: '100%', opis: 'Varnih transakcij', ikona: '🔒' },
              ].map(({ vrednost, opis, ikona }) => (
                <div key={opis} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="text-2xl mb-2">{ikona}</div>
                  <div className="font-display text-3xl font-bold text-[#0c2340]">{vrednost}</div>
                  <div className="text-sm text-gray-500 mt-1">{opis}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLOVILA ZA PRODAJO */}
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-2">
                  <Star className="w-4 h-4" /> Izpostavljena plovila
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340]">Plovila za prodajo</h2>
              </div>
              <Link href="/plovila" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0c2340] hover:text-[#c9a84c] transition-colors">
                Vsa plovila <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plovilaZaProdajo.map((plovilo) => (
                <PloviloKartica key={plovilo.id} plovilo={plovilo} promoted={mockPromotedIds.includes(plovilo.id)} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/plovila" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0c2340] border-2 border-[#0c2340] rounded-full hover:bg-[#0c2340] hover:text-white transition-colors">
                Vsa plovila <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CHARTER SEKCIJA */}
        <section className="py-20 bg-[#0c2340] relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1548574505-3ad3b1a69a54?auto=format&fit=crop&w=1920&q=60"
              alt=""
              className="w-full h-full object-cover opacity-10"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/8 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#1e3a5f]/60 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-6">
                  <Ship className="w-4 h-4" /> Za charter podjetja
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                  Ste charter podjetje?
                </h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  Pridružite se platformi z več kot 1.200 strankami mesečno. Vaša plovila so vidna tisočim iskalcem najema.
                </p>
                <div className="flex flex-col gap-4 mb-10">
                  {[
                    { ikona: '📈', naslov: 'Maksimalen exposure', opis: 'Vaša ponudba vidna vsem obiskovalcem platforme' },
                    { ikona: '✅', naslov: 'Verified badge', opis: 'Preverjen profil gradi zaupanje potencialnih strank' },
                    { ikona: '⚙️', naslov: 'Enostavno upravljanje', opis: 'Dodajte in upravljajte plovila v minutah' },
                  ].map(({ ikona, naslov, opis }) => (
                    <div key={naslov} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center text-xl shrink-0">{ikona}</div>
                      <div>
                        <p className="font-semibold text-white text-sm">{naslov}</p>
                        <p className="text-white/60 text-sm mt-0.5">{opis}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/registracija?vloga=charter"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-[#c9a84c]/25"
                >
                  Registriraj svoje podjetje <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {charterji.slice(0, 4).map((c) => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      {c.verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      <span className="text-xs text-[#c9a84c] font-medium capitalize">{c.tip}</span>
                    </div>
                    <p className="font-semibold text-white text-sm mb-1 line-clamp-1">{c.naziv}</p>
                    <p className="text-white/50 text-xs">{c.lokacija} · {c.st_plovil} plovil</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 text-[#c9a84c] fill-[#c9a84c]" />
                      <span className="text-xs text-white/70">{c.ocena.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKIPPER SEKCIJA */}
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="hidden lg:flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-2xl">👨‍✈️</div>
                    <div>
                      <p className="font-semibold text-[#0c2340]">Marko Horvat</p>
                      <p className="text-sm text-gray-500">18 let izkušenj · Portorož</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#c9a84c] fill-[#c9a84c]" />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">4.9 (47 ocen)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['ICC', 'VHF SRC', 'RYA Day Skipper'].map(c => (
                      <span key={c} className="text-xs px-2 py-1 bg-[#0c2340]/5 text-[#0c2340] rounded-full font-medium">{c}</span>
                    ))}
                  </div>
                  <p className="text-right font-bold text-[#0c2340] mt-3">180 € / dan</p>
                </div>
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl p-5 text-center">
                  <Compass className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#0c2340]">6 preverjenih skiperjev</p>
                  <p className="text-xs text-gray-500">na razpolago v slovenskem primorju</p>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0c2340]/10 border border-[#0c2340]/20 text-[#0c2340] text-sm font-medium mb-6">
                  <Compass className="w-4 h-4" /> Za skiperje
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0c2340] mb-4">
                  Ste skipper?
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Ustvarite profesionalni profil in se povežite s tisočimi jedrálci, ki iščejo izkušenega vodnika po Jadranu.
                </p>
                <div className="flex flex-col gap-4 mb-10">
                  {[
                    { ikona: '👤', naslov: 'Profil na platformi', opis: 'Vaši certifikati, izkušnje in plovila v enem profilu' },
                    { ikona: '⭐', naslov: 'Rating sistem', opis: 'Zgradite reputacijo z ocenami strank' },
                    { ikona: '📞', naslov: 'Direkten kontakt', opis: 'Stranke vas kontaktirajo neposredno prek chata' },
                  ].map(({ ikona, naslov, opis }) => (
                    <div key={naslov} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">{ikona}</div>
                      <div>
                        <p className="font-semibold text-[#0c2340] text-sm">{naslov}</p>
                        <p className="text-gray-500 text-sm mt-0.5">{opis}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/registracija?vloga=skipper"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  Ustvari skipper profil <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PROMOCIJE */}
        <section className="py-20 bg-[#0c2340] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-2">
                  <Tag className="w-4 h-4" /> Posebne ponudbe
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Promocije & akcije</h2>
              </div>
              <Link href="/promocije" className="hidden sm:flex items-center gap-1 text-sm font-medium text-white/70 hover:text-[#c9a84c] transition-colors">
                Vse promocije <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {promocije.map((promo) => (
                <div
                  key={promo.id}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#c9a84c]/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-lg" style={{ backgroundColor: `${promo.barva}40` }}>
                    {promo.tip === 'popust' ? '🏷️' : promo.tip === 'featured' ? '⭐' : promo.tip === 'sezonska' ? '🌊' : '📦'}
                  </div>
                  {promo.popust && (
                    <div className="absolute top-4 right-4 bg-[#c9a84c] text-[#0c2340] text-xs font-bold px-2 py-1 rounded-full">
                      -{promo.popust}%
                    </div>
                  )}
                  <h3 className="font-display text-base font-semibold text-white mb-2 group-hover:text-[#c9a84c] transition-colors line-clamp-2">{promo.naziv}</h3>
                  <p className="text-sm text-white/60 line-clamp-3 mb-4">{promo.opis}</p>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar className="w-3.5 h-3.5" />
                    Do {new Date(promo.veljavnost_do).toLocaleDateString('sl-SI', { day: 'numeric', month: 'long' })}
                  </div>
                  <Link href="/promocije" className="mt-4 flex items-center gap-1 text-xs font-medium text-[#c9a84c] hover:gap-2 transition-all">
                    Več info <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OGLAŠEVALSKI BANNER PLACEHOLDER */}
        <section className="py-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full h-[90px] bg-[#0c2340] rounded-2xl flex items-center justify-center border border-[#1e3a5f] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340] via-[#1e3a5f] to-[#0c2340] opacity-50" />
              <div className="relative z-10 text-center">
                <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">728 × 90</p>
                <p className="text-white/50 text-sm font-medium">Oglaševalski prostor · kontakt@garbin.si</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CHARTERJI */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-2">
                  <Ship className="w-4 h-4" /> Najem plovil
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340]">Prevereni charterji</h2>
                <p className="text-gray-500 mt-2 max-w-lg">Podjetja in zasebniki z verificiranimi profili.</p>
              </div>
              <Link href="/charterji" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0c2340] hover:text-[#c9a84c] transition-colors">
                Vsi charterji <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {charterji.map((charter) => (
                <CharterKartica key={charter.id} charter={charter} />
              ))}
            </div>
          </div>
        </section>

        {/* NOVICE */}
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-2">
                  <TrendingUp className="w-4 h-4" /> Blog & novice
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340]">Zadnje novice</h2>
              </div>
              <Link href="/novice" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0c2340] hover:text-[#c9a84c] transition-colors">
                Vse novice <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {novice.map((novica, i) => (
                <Link key={novica.id} href={`/novice/${novica.slug}`} className="group block">
                  <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="h-44 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] relative flex items-center justify-center overflow-hidden">
                      {unsplashNovice[novica.slug] ? (
                        <img src={unsplashNovice[novica.slug]} alt={novica.naslov} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl opacity-20">{i === 0 ? '⛵' : i === 1 ? '📈' : '🔧'}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/50 to-transparent" />
                      {novica.kategorija && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: novica.kategorija.barva ?? '#0c2340' }}>
                            {novica.kategorija.naziv}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-2 mb-2">{novica.naslov}</h3>
                      {novica.povzetek && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{novica.povzetek}</p>}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{novica.avtor}</span>
                        {novica.published_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDatum(novica.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/15 text-[#9a7a2e] text-sm font-medium mb-4">
              📬 Newsletter
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-3">
              Ostanite na tekočem
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
              Novi oglasi, promocije in nasveti za nakup plovila — tedensko v vaš nabiralnik.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-[#0c2340] via-[#1e3a5f] to-[#0c2340] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#c9a84c]/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-5xl mb-6">⚓</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Prodajte svoje plovilo</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Dosežite tisoče potencialnih kupcev. Objava oglasa je hitra, enostavna in dostopna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/dodaj-plovilo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#0c2340] bg-[#c9a84c] hover:bg-[#e8c76d] rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-[#c9a84c]/30"
              >
                Oddaj oglas brezplačno <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/plovila"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 rounded-full transition-all duration-200 hover:bg-white/5"
              >
                Poglej obstoječe oglase
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
