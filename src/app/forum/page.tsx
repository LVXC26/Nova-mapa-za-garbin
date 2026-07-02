import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Eye, Heart, Pin, CheckCircle, TrendingUp, Clock, Users, Plus, Search } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { forumKategorije, forumNiti } from '@/data/forum'

export const metadata: Metadata = {
  title: 'Forum | Garbin',
  description: 'Skupnostni forum za jadralce, kupce plovil, charterje in skiperje na Jadranu.',
}

export default function ForumPage() {
  const novejse = [...forumNiti].sort((a, b) => new Date(b.casISO).getTime() - new Date(a.casISO).getTime()).slice(0, 5)
  const popularne = [...forumNiti].sort((a, b) => b.ogledi - a.ogledi).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-3">
                  <Users className="w-4 h-4" /> Skupnost Garbin
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Forum</h1>
                <p className="text-white/70 text-lg">Vprašajte, odgovorite, delite izkušnje z jadralci.</p>
              </div>
              <Link href="/forum/splosno?nova=1"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-105 shrink-0">
                <Plus className="w-4 h-4" /> Nova objava
              </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-xl mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="search"
                placeholder="Iščite po forumu..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEVA — kategorije */}
              <div className="lg:col-span-2 space-y-8">

                {/* Kategorije */}
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0c2340] mb-4">Kategorije</h2>
                  <div className="space-y-3">
                    {forumKategorije.map(kat => (
                      <Link key={kat.slug} href={`/forum/${kat.slug}`}
                        className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className={`w-12 h-12 rounded-2xl ${kat.barva} flex items-center justify-center text-2xl shrink-0`}>
                          {kat.ikona}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors">{kat.naziv}</p>
                          <p className="text-sm text-gray-500 truncate">{kat.opis}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#0c2340] text-sm">{kat.steviloNiti}</p>
                          <p className="text-xs text-gray-400">niti</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Zadnje objave */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-[#c9a84c]" />
                    <h2 className="font-display text-xl font-bold text-[#0c2340]">Najnovejše niti</h2>
                  </div>
                  <div className="space-y-3">
                    {novejse.map(nit => {
                      const kat = forumKategorije.find(k => k.slug === nit.kategorija)
                      return (
                        <Link key={nit.id} href={`/forum/${nit.kategorija}/${nit.id}`}
                          className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
                          <div className={`w-10 h-10 rounded-xl ${kat?.barva ?? 'bg-gray-200'} flex items-center justify-center text-xl shrink-0`}>
                            {kat?.ikona}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              {nit.pinned && <Pin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0 mt-0.5" />}
                              {nit.reseno && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                              <p className="font-semibold text-[#0c2340] text-sm group-hover:text-[#c9a84c] transition-colors line-clamp-1">{nit.naslov}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>{nit.avtor}</span>
                              <span>·</span>
                              <span>{nit.cas}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{nit.odgovori}</span>
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{nit.ogledi}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* DESNA — sidebar */}
              <div className="space-y-6">

                {/* Statistike */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] mb-4">Skupnost</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Skupaj niti', vrednost: forumNiti.length },
                      { label: 'Aktivnih članov', vrednost: '284' },
                      { label: 'Objav danes', vrednost: '12' },
                    ].map(({ label, vrednost }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-bold text-[#0c2340]">{vrednost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popularne niti */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-semibold text-[#0c2340]">Popularne niti</h3>
                  </div>
                  <div className="space-y-3">
                    {popularne.map((nit, i) => (
                      <Link key={nit.id} href={`/forum/${nit.kategorija}/${nit.id}`}
                        className="group flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#0c2340]/8 flex items-center justify-center text-xs font-bold text-[#0c2340] shrink-0">{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-2 leading-tight">{nit.naslov}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{nit.ogledi} ogledov</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-[#0c2340] rounded-2xl p-5">
                  <p className="text-white font-semibold mb-1">Postanite del skupnosti</p>
                  <p className="text-white/60 text-sm mb-4">Pridružite se 284 aktivnim članom.</p>
                  <Link href="/registracija"
                    className="block w-full text-center py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105">
                    Registracija
                  </Link>
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
