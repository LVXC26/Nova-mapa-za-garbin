'use client'

import { use } from 'react'
import Link from 'next/link'
import { MapPin, Ship, Star, CheckCircle, Phone, Mail, ExternalLink, ArrowLeft, Calendar, Users, Ruler } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockCharterji, mockNajemPlovila } from '@/data/mock'
import FeedObjave from '@/components/social/FeedObjave'
import PovprasevanjeForma from '@/components/shared/PovprasevanjeForma'

const opremaLabele: Record<string, string> = {
  gps: 'GPS / Chartplotter',
  radar: 'Radar',
  vhf: 'VHF radio',
  autopilot: 'Autopilot',
  generator: 'Generator',
  klima: 'Klimatska naprava',
  rib: 'Pnevmatični čoln',
  epirb: 'EPIRB',
}

const tipIkone: Record<string, string> = {
  jadrnica: '⛵',
  motorni: '🚤',
  gumenjak: '🛟',
  katamaran: '⛵',
  jet: '💨',
  drugo: '⚓',
}


export default function CharterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const charter = mockCharterji.find((c) => String(c.id) === id)

  if (!charter) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">⚓</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Charter ni najden</h1>
            <p className="text-gray-500 mb-8">Ta charter ne obstaja ali je bil odstranjen.</p>
            <Link
              href="/charterji"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Nazaj na charterje
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const plovila = mockNajemPlovila.filter((p) => p.user_id === charter.id)
  const zvezdice = Array.from({ length: 5 }, (_, i) => i < Math.round(charter.ocena))

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/charterji"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Vsi charterji
            </Link>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1519789110440-4b90d6f7e65b?auto=format&fit=crop&w=200&q=80"
                  alt={charter.naziv}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                    el.parentElement!.innerHTML = `<div class="w-full h-full ${charter.tip === 'podjetje' ? 'bg-[#c9a84c]' : 'bg-white/10'} flex items-center justify-center text-3xl">${charter.tip === 'podjetje' ? '🏢' : '👤'}</div>`
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    charter.tip === 'podjetje' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/10 text-white/80'
                  }`}>
                    {charter.tip === 'podjetje' ? 'Podjetje' : 'Zasebnik'}
                  </span>
                  {charter.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Preverjeno
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{charter.naziv}</h1>
                <div className="flex flex-wrap items-center gap-5 text-white/70 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {charter.lokacija}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Ship className="w-4 h-4" />
                    {charter.st_plovil} {charter.st_plovil === 1 ? 'plovilo' : charter.st_plovil < 5 ? 'plovila' : 'plovil'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="flex">
                      {zvezdice.map((poln, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${poln ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-white/20 fill-white/20'}`} />
                      ))}
                    </div>
                    <span className="font-medium text-white">{charter.ocena.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VSEBINA */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEVA STRAN — plovila */}
              <div className="lg:col-span-2 space-y-8">

                {/* Opis */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-3">O charterju</h2>
                  <p className="text-gray-600 leading-relaxed">{charter.opis}</p>
                </div>

                {/* Plovila za najem */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-[#0c2340]">
                      Plovila za najem
                    </h2>
                    <span className="text-sm text-gray-500">{plovila.length} {plovila.length === 1 ? 'plovilo' : plovila.length < 5 ? 'plovila' : 'plovil'}</span>
                  </div>

                  {plovila.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                      <Ship className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Še ni objavljenih plovil</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {plovila.map((plovilo) => {
                        const aktivnaOprema = plovilo.oprema
                          ? Object.entries(plovilo.oprema).filter(([, v]) => v).map(([k]) => opremaLabele[k] ?? k)
                          : []

                        return (
                          <div
                            key={plovilo.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5"
                          >
                            {/* Ikona tipa */}
                            <div className="w-14 h-14 rounded-xl bg-[#0c2340]/5 flex items-center justify-center text-2xl shrink-0">
                              {tipIkone[plovilo.tip] ?? '⚓'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="font-display text-lg font-semibold text-[#0c2340] leading-tight">{plovilo.naziv}</h3>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-[#0c2340] text-lg">{plovilo.cena.toLocaleString('sl-SI')} €</p>
                                  <p className="text-xs text-gray-400">/ teden</p>
                                </div>
                              </div>

                              {/* Meta */}
                              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                                {plovilo.dolzina_m && (
                                  <span className="flex items-center gap-1">
                                    <Ruler className="w-3.5 h-3.5" /> {plovilo.dolzina_m} m
                                  </span>
                                )}
                                {plovilo.letnik && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> {plovilo.letnik}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" /> {plovilo.lokacija}
                                </span>
                              </div>

                              {plovilo.opis && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{plovilo.opis}</p>
                              )}

                              {/* Oprema */}
                              {aktivnaOprema.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {aktivnaOprema.map((o) => (
                                    <span key={o} className="text-xs px-2 py-0.5 bg-[#0c2340]/5 text-[#0c2340] rounded-full">
                                      {o}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {/* Social feed */}
                <div className="mt-8">
                  <FeedObjave title="Objave charterja" />
                </div>
              </div>

              {/* DESNA STRAN — kontakt */}
              <div className="space-y-4">
                {/* Kontaktna kartica */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                  <h3 className="font-semibold text-[#0c2340] mb-4">Pošlji povpraševanje</h3>

                  {/* Pokliči zdaj — prominentni gumb */}
                  {charter.kontakt_tel && (
                    <a
                      href={`tel:${charter.kontakt_tel}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 mb-4 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-bold rounded-full transition-all hover:scale-[1.02] shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Pokliči zdaj
                    </a>
                  )}
                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${charter.kontakt_tel}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <Phone className="w-4 h-4 text-[#c9a84c] shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-[#0c2340]">{charter.kontakt_tel}</span>
                    </a>
                    <a
                      href={`mailto:${charter.kontakt_email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <Mail className="w-4 h-4 text-[#c9a84c] shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-[#0c2340] truncate">{charter.kontakt_email}</span>
                    </a>
                    {charter.spletna_stran && (
                      <a
                        href={charter.spletna_stran}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 text-[#c9a84c] shrink-0" />
                        <span className="text-sm text-[#0c2340] font-medium group-hover:text-[#c9a84c]">Spletna stran</span>
                      </a>
                    )}
                  </div>

                  <PovprasevanjeForma tip="charter" targetId={String(charter.id)} />
                </div>

                {/* Tip plovil */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] text-sm mb-3">Tip plovil</h3>
                  <div className="flex flex-wrap gap-2">
                    {charter.tip_plovila.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-[#0c2340]/5 text-[#0c2340] rounded-full capitalize font-medium"
                      >
                        {tipIkone[t] ?? '⚓'} {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistike */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] text-sm mb-3">Kapacitete</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Users className="w-3.5 h-3.5" /> Max. oseb
                      </span>
                      <span className="font-semibold text-[#0c2340]">{charter.max_oseb}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Ruler className="w-3.5 h-3.5" /> Max. dolžina
                      </span>
                      <span className="font-semibold text-[#0c2340]">{charter.max_dolzina_m} m</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Ship className="w-3.5 h-3.5" /> Plovil v floti
                      </span>
                      <span className="font-semibold text-[#0c2340]">{charter.st_plovil}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
