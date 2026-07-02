'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Ship, Anchor, Compass, BookOpen, MessageSquare, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockPlovila, mockCharterji, mockSkiperji, mockNovice } from '@/data/mock'
import { forumNiti } from '@/data/forum'
import { formatCena } from '@/lib/utils'

function IskanjeContent() {
  const params = useSearchParams()
  const router = useRouter()
  const initQ = params.get('q') ?? ''
  const [q, setQ] = useState(initQ)
  const [tab, setTab] = useState<'vse' | 'plovila' | 'charterji' | 'skiperji' | 'novice' | 'forum'>('vse')

  useEffect(() => {
    setQ(params.get('q') ?? '')
  }, [params])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/iskanje?q=${encodeURIComponent(q.trim())}`)
  }

  const qL = initQ.toLowerCase()

  const results = useMemo(() => {
    if (!qL) return { plovila: [], charterji: [], skiperji: [], novice: [], forum: [] }
    return {
      plovila: mockPlovila.filter(p => p.naziv.toLowerCase().includes(qL) || p.opis?.toLowerCase().includes(qL) || p.lokacija?.toLowerCase().includes(qL)),
      charterji: mockCharterji.filter(c => c.naziv.toLowerCase().includes(qL) || c.opis.toLowerCase().includes(qL) || c.lokacija.toLowerCase().includes(qL)),
      skiperji: mockSkiperji.filter(s => s.ime.toLowerCase().includes(qL) || s.opis.toLowerCase().includes(qL) || s.lokacija.toLowerCase().includes(qL)),
      novice: mockNovice.filter(n => n.naslov.toLowerCase().includes(qL) || n.povzetek?.toLowerCase().includes(qL)),
      forum: forumNiti.filter(f => f.naslov.toLowerCase().includes(qL) || f.vsebina.toLowerCase().includes(qL)),
    }
  }, [qL])

  const skupaj = results.plovila.length + results.charterji.length + results.skiperji.length + results.novice.length + results.forum.length

  const tabs = [
    { id: 'vse', label: 'Vse', count: skupaj, ikona: Search },
    { id: 'plovila', label: 'Plovila', count: results.plovila.length, ikona: Ship },
    { id: 'charterji', label: 'Charterji', count: results.charterji.length, ikona: Anchor },
    { id: 'skiperji', label: 'Skiperji', count: results.skiperji.length, ikona: Compass },
    { id: 'novice', label: 'Novice', count: results.novice.length, ikona: BookOpen },
    { id: 'forum', label: 'Forum', count: results.forum.length, ikona: MessageSquare },
  ]

  const prikaziPlovila = tab === 'vse' || tab === 'plovila'
  const prikaziCharterje = tab === 'vse' || tab === 'charterji'
  const prikaziSkiperje = tab === 'vse' || tab === 'skiperji'
  const prikaziNovice = tab === 'vse' || tab === 'novice'
  const prikaziForum = tab === 'vse' || tab === 'forum'

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        <section className="bg-[#0c2340] py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold text-white mb-5">
              {initQ ? `Rezultati za "${initQ}"` : 'Iskanje'}
            </h1>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Iščite plovila, charterje, skiperje, novice..."
                className="w-full pl-14 pr-32 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 text-base focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-xl transition-all">
                Išči
              </button>
            </form>
            {initQ && (
              <p className="text-white/60 text-sm mt-3">
                {skupaj === 0 ? 'Ni zadetkov' : `${skupaj} ${skupaj === 1 ? 'zadetek' : skupaj < 5 ? 'zadetki' : 'zadetkov'}`}
              </p>
            )}
          </div>
        </section>

        {initQ && (
          <section className="py-8 bg-[#f8fafc]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-white border border-gray-100 rounded-2xl p-1 mb-7 shadow-sm">
                {tabs.map(({ id, label, count, ikona: Ikona }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id as typeof tab)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      tab === id ? 'bg-[#0c2340] text-white shadow-sm' : 'text-gray-500 hover:text-[#0c2340] hover:bg-gray-50'
                    }`}
                  >
                    <Ikona className="w-3.5 h-3.5" />
                    {label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-0.5 ${tab === id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {skupaj === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                  <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="font-medium text-gray-400 mb-1">Ni zadetkov za "{initQ}"</p>
                  <p className="text-sm text-gray-300">Poskusite z drugačnimi ključnimi besedami.</p>
                </div>
              ) : (
                <div className="space-y-8">

                  {/* Plovila */}
                  {prikaziPlovila && results.plovila.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-lg font-bold text-[#0c2340] flex items-center gap-2">
                          <Ship className="w-5 h-5 text-[#c9a84c]" /> Plovila ({results.plovila.length})
                        </h2>
                        {results.plovila.length > 3 && (
                          <Link href={`/plovila?q=${encodeURIComponent(initQ)}`} className="text-sm text-[#c9a84c] hover:underline flex items-center gap-1">
                            Vsa <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                      <div className="space-y-3">
                        {results.plovila.slice(0, tab === 'plovila' ? 20 : 3).map(p => (
                          <Link key={p.id} href={`/plovila/${p.id}`}
                            className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center text-xl shrink-0">
                              {p.tip === 'jadrnica' ? '⛵' : p.tip === 'motorni' ? '🚤' : '🛟'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors truncate">{p.naziv}</p>
                              <p className="text-xs text-gray-500">{p.lokacija} · {p.letnik} · {p.tip_oglasa === 'najem' ? 'Najem' : 'Prodaja'}</p>
                            </div>
                            <p className="font-bold text-[#0c2340] shrink-0">{formatCena(p.cena)}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Charterji */}
                  {prikaziCharterje && results.charterji.length > 0 && (
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0c2340] flex items-center gap-2 mb-4">
                        <Anchor className="w-5 h-5 text-[#c9a84c]" /> Charterji ({results.charterji.length})
                      </h2>
                      <div className="space-y-3">
                        {results.charterji.slice(0, tab === 'charterji' ? 20 : 3).map(c => (
                          <Link key={c.id} href={`/charterji/${c.id}`}
                            className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">
                              {c.tip === 'podjetje' ? '🏢' : '👤'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors truncate">{c.naziv}</p>
                              <p className="text-xs text-gray-500">{c.lokacija} · {c.ocena.toFixed(1)} ★ · {c.st_plovil} plovil</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skiperji */}
                  {prikaziSkiperje && results.skiperji.length > 0 && (
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0c2340] flex items-center gap-2 mb-4">
                        <Compass className="w-5 h-5 text-[#c9a84c]" /> Skiperji ({results.skiperji.length})
                      </h2>
                      <div className="space-y-3">
                        {results.skiperji.slice(0, tab === 'skiperji' ? 20 : 3).map(s => (
                          <Link key={s.id} href={`/skiperji/${s.id}`}
                            className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">
                              {s.tip_skiper === 'agencija' ? '🏢' : '👨‍✈️'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors truncate">{s.ime}</p>
                              <p className="text-xs text-gray-500">{s.lokacija} · {s.izkusnje_let} let · {s.ocena.toFixed(1)} ★</p>
                            </div>
                            <p className="font-bold text-[#0c2340] shrink-0 text-sm">{s.cena_dan} € / dan</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Novice */}
                  {prikaziNovice && results.novice.length > 0 && (
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0c2340] flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-[#c9a84c]" /> Novice ({results.novice.length})
                      </h2>
                      <div className="space-y-3">
                        {results.novice.slice(0, tab === 'novice' ? 20 : 3).map(n => (
                          <Link key={n.id} href={`/novice/${n.slug}`}
                            className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">📰</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-1">{n.naslov}</p>
                              {n.povzetek && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{n.povzetek}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Forum */}
                  {prikaziForum && results.forum.length > 0 && (
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0c2340] flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-[#c9a84c]" /> Forum ({results.forum.length})
                      </h2>
                      <div className="space-y-3">
                        {results.forum.slice(0, tab === 'forum' ? 20 : 3).map(f => (
                          <Link key={f.id} href={`/forum/${f.kategorija}/${f.id}`}
                            className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">💬</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-1">{f.naslov}</p>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{f.vsebina}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}

export default function IskanjaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" /></div>}>
      <IskanjeContent />
    </Suspense>
  )
}
