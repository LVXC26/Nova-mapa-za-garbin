'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, CheckCircle, Phone, Mail, MessageCircle, Calendar, Award, Globe, Ship, Users, Building2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockSkiperji, unsplashSkipperji } from '@/data/mock'
import { useAuth } from '@/components/providers/AuthProvider'
import FeedObjave from '@/components/social/FeedObjave'
import PovprasevanjeForma from '@/components/shared/PovprasevanjeForma'

const tipIkone: Record<string, string> = {
  jadrnica: '⛵',
  motorni: '🚤',
  gumenjak: '🛟',
  katamaran: '⛵',
  jahta: '🛥️',
  gumenjak2: '🛟',
}

export default function SkipperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const skipper = mockSkiperji.find(s => s.id === id)
  const [tab, setTab] = useState<'objave' | 'o_meni' | 'ocene' | 'ekipa'>('o_meni')

  if (!skipper) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">🧭</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Skipper ni najden</h1>
            <p className="text-gray-500 mb-8">Ta profil ne obstaja ali je bil odstranjen.</p>
            <Link href="/skiperji" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Nazaj na skiperje
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const zvezdice = Array.from({ length: 5 }, (_, i) => i < Math.round(skipper.ocena))

  // Placeholder galerija — ko bo Supabase: skipper.slike[]
  const galerijaPlaceholder = [1, 2, 3, 4, 5]

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[#1e3a5f]/60 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/skiperji" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Vsi skiperji
            </Link>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-[#c9a84c]/20 border-2 border-[#c9a84c]/40 flex items-center justify-center overflow-hidden shrink-0">
                {unsplashSkipperji[skipper.id] && skipper.tip_skiper !== 'agencija' ? (
                  <img src={unsplashSkipperji[skipper.id]} alt={skipper.ime} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{skipper.tip_skiper === 'agencija' ? '🏢' : '👨‍✈️'}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    skipper.tip_skiper === 'agencija' ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-white/10 text-white/80'
                  }`}>
                    {skipper.tip_skiper === 'agencija' ? '🏢 Skipper agencija' : '👤 Samostojni skipper'}
                  </span>
                  {skipper.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Preverjeno
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{skipper.ime}</h1>

                <div className="flex flex-wrap items-center gap-5 text-white/70 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {skipper.lokacija}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {skipper.izkusnje_let} let izkušenj
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="flex">
                      {zvezdice.map((poln, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${poln ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-white/20 fill-white/20'}`} />
                      ))}
                    </div>
                    <span className="font-medium text-white">{skipper.ocena.toFixed(1)}</span>
                    <span className="text-white/50">({skipper.st_ocen} ocen)</span>
                  </span>
                </div>
              </div>

              {/* Cena — desktop */}
              <div className="hidden sm:block text-right shrink-0">
                <p className="text-3xl font-display font-bold text-[#c9a84c]">{skipper.cena_dan} €</p>
                <p className="text-white/50 text-sm">/ dan</p>
              </div>
            </div>
          </div>
        </section>

        {/* VSEBINA */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEVA — tabs */}
              <div className="lg:col-span-2 space-y-5">

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
                  {(skipper.tip_skiper === 'agencija'
                    ? [
                        { id: 'ekipa', label: `Ekipa (${skipper.ekipa?.length ?? 0})` },
                        { id: 'objave', label: 'Objave' },
                        { id: 'o_meni', label: 'O nas' },
                        { id: 'ocene', label: 'Ocene' },
                      ]
                    : [
                        { id: 'o_meni', label: 'O meni' },
                        { id: 'objave', label: 'Objave' },
                        { id: 'ocene', label: 'Ocene' },
                      ]
                  ).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                      className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                        tab === t.id ? 'bg-white text-[#0c2340] shadow-sm' : 'text-gray-500 hover:text-[#0c2340]'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Ekipa (agencija) */}
                {tab === 'ekipa' && skipper.tip_skiper === 'agencija' && skipper.ekipa && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skipper.ekipa.map(e => (
                      <div key={e.ime} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-xl shrink-0">👨‍✈️</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0c2340] text-sm">{e.ime}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{e.specializacija}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({length: 5}).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.round(e.ocena) ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                            <span className="text-xs text-gray-500 ml-0.5">{e.ocena.toFixed(1)}</span>
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: O meni */}
                {tab === 'o_meni' && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-3">
                        {skipper.tip_skiper === 'agencija' ? 'O agenciji' : 'O skipperju'}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">{skipper.opis}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#c9a84c]" /> Certifikati & licence
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {skipper.certifikati.map(c => (
                          <div key={c} className="flex items-center gap-2 px-4 py-2.5 bg-[#0c2340]/5 border border-[#0c2340]/10 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-sm font-semibold text-[#0c2340]">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="font-display text-base font-semibold text-[#0c2340] mb-3 flex items-center gap-2">
                          <Ship className="w-4 h-4 text-[#c9a84c]" /> Plovila
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {skipper.tip_plovila.map(t => (
                            <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c]/10 rounded-xl text-sm font-medium text-[#0c2340] capitalize">
                              <span>{tipIkone[t] ?? '⚓'}</span>{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="font-display text-base font-semibold text-[#0c2340] mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#c9a84c]" /> Jeziki
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {skipper.jeziki.map(j => (
                            <span key={j} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 capitalize font-medium">{j}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Objave */}
                {tab === 'objave' && (
                  <FeedObjave
                    title="Objave"
                    showAddPost={!!user}
                    avtor={skipper.ime}
                    vloga={skipper.tip_skiper === 'agencija' ? 'agencija' : 'skipper'}
                  />
                )}

                {/* Tab: Ocene */}
                {tab === 'ocene' && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-lg font-semibold text-[#0c2340]">Ocene strank</h2>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {zvezdice.map((poln, i) => (
                            <Star key={i} className={`w-4 h-4 ${poln ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-[#0c2340]">{skipper.ocena.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">({skipper.st_ocen})</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { ime: 'Janez K.', ocena: 5, datum: 'Junij 2024', komentar: 'Odličen skipper! Izjemno poznavanje Jadrana, varen in profesionalen.' },
                        { ime: 'Maria S.', ocena: 5, datum: 'Maj 2024', komentar: 'Fantastična izkušnja. Izkušen in prijazen, naučil nas je osnov jadralnega plovna.' },
                        { ime: 'Peter N.', ocena: 4, datum: 'Avgust 2023', komentar: 'Zelo zadovoljen z izletom. Dobro poznavanje lokalnih otokov.' },
                      ].map((o, i) => (
                        <div key={i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-sm font-bold text-[#0c2340]">{o.ime[0]}</div>
                              <span className="font-medium text-[#0c2340] text-sm">{o.ime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({length: 5}).map((_, j) => (
                                  <Star key={j} className={`w-3 h-3 ${j < o.ocena ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400">{o.datum}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed ml-10">{o.komentar}</p>
                        </div>
                      ))}
                    </div>
                    {user && (
                      <button className="mt-5 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors font-medium">
                        + Dodaj oceno
                      </button>
                    )}
                  </div>
                )}

              </div>

              {/* DESNA — kontakt sticky */}
              <div className="space-y-4">

                {/* Kontakt kartica */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                  {/* Cena mobile */}
                  <div className="sm:hidden mb-4">
                    <p className="text-3xl font-display font-bold text-[#0c2340]">{skipper.cena_dan} €</p>
                    <p className="text-gray-400 text-sm">/ dan</p>
                  </div>

                  <div className="hidden sm:block mb-5">
                    <p className="text-3xl font-display font-bold text-[#0c2340]">{skipper.cena_dan} €</p>
                    <p className="text-gray-400 text-sm">/ dan</p>
                  </div>

                  {/* Pokliči zdaj — na mobilnih odpre klicalnik */}
                  <a
                    href={`tel:+38641000000`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-bold rounded-full transition-all hover:scale-[1.02] mb-3 text-sm shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Pokliči zdaj
                  </a>
                  {user && (
                    <Link
                      href="/chat"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-full transition-all hover:scale-[1.02] mb-4 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pošlji sporočilo
                    </Link>
                  )}
                  <p className="text-xs font-semibold text-[#0c2340] mb-3">Pošlji povpraševanje</p>
                  <PovprasevanjeForma tip="skipper" targetId={String(skipper.id)} />
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] text-sm mb-4">Statistike</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Izkušnje
                      </span>
                      <span className="font-semibold text-[#0c2340]">{skipper.izkusnje_let} let</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" /> Ocena
                      </span>
                      <span className="font-semibold text-[#0c2340]">{skipper.ocena.toFixed(1)} / 5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" /> Ocene
                      </span>
                      <span className="font-semibold text-[#0c2340]">{skipper.st_ocen}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" /> Jeziki
                      </span>
                      <span className="font-semibold text-[#0c2340]">{skipper.jeziki.length}</span>
                    </div>
                  </div>
                </div>

                {/* Certifikati mini */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] text-sm mb-3">Certifikati</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skipper.certifikati.map(c => (
                      <span key={c} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-100">
                        ✓ {c}
                      </span>
                    ))}
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
