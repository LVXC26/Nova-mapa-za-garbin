'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Eye, Heart, Pin, CheckCircle, Plus, Search, Filter } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { forumKategorije, forumNiti } from '@/data/forum'
import { useAuth } from '@/components/providers/AuthProvider'

export default function ForumKategorijaPage({ params }: { params: Promise<{ kategorija: string }> }) {
  const { kategorija: slug } = use(params)
  const { user } = useAuth()
  const [iskanje, setIskanje] = useState('')
  const [showNova, setShowNova] = useState(false)
  const [novaNaslov, setNovaNaslov] = useState('')
  const [novaVsebina, setNovaVsebina] = useState('')
  const [niti, setNiti] = useState(forumNiti.filter(n => n.kategorija === slug))

  const kat = forumKategorije.find(k => k.slug === slug)

  const filtrirane = niti.filter(n =>
    n.naslov.toLowerCase().includes(iskanje.toLowerCase()) ||
    n.vsebina.toLowerCase().includes(iskanje.toLowerCase())
  )

  function handleNova(e: React.FormEvent) {
    e.preventDefault()
    if (!novaNaslov.trim()) return
    const nova = {
      id: `n${Date.now()}`,
      kategorija: slug,
      naslov: novaNaslov,
      vsebina: novaVsebina,
      avtor: user?.user_metadata?.ime ?? 'Anonimni',
      avatar: '👤',
      vloga: user?.user_metadata?.vloga ?? 'Kupec',
      cas: 'Ravnokar',
      casISO: new Date().toISOString(),
      odgovori: 0,
      ogledi: 1,
      likes: 0,
    }
    setNiti([nova, ...niti])
    setNovaNaslov('')
    setNovaVsebina('')
    setShowNova(false)
  }

  if (!kat) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">💬</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Kategorija ni najdena</h1>
            <Link href="/forum" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white rounded-full text-sm">
              <ArrowLeft className="w-4 h-4" /> Nazaj na forum
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/forum" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Forum
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${kat.barva} flex items-center justify-center text-3xl`}>
                  {kat.ikona}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">{kat.naziv}</h1>
                  <p className="text-white/70 text-sm mt-1">{kat.opis}</p>
                </div>
              </div>
              <button
                onClick={() => user ? setShowNova(!showNova) : window.location.href = '/prijava'}
                className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105 shrink-0"
              >
                <Plus className="w-4 h-4" /> Nova nit
              </button>
            </div>
          </div>
        </section>

        <section className="py-8 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Nova nit forma */}
            {showNova && (
              <div className="bg-white rounded-2xl border border-[#c9a84c]/40 shadow-sm p-6 mb-6">
                <h2 className="font-display text-lg font-bold text-[#0c2340] mb-4">Nova nit v kategoriji "{kat.naziv}"</h2>
                <form onSubmit={handleNova} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Naslov *</label>
                    <input required value={novaNaslov} onChange={e => setNovaNaslov(e.target.value)}
                      placeholder="Jasno in opisno vprašanje ali tema..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Vsebina</label>
                    <textarea rows={4} value={novaVsebina} onChange={e => setNovaVsebina(e.target.value)}
                      placeholder="Opišite podrobneje, dodajte kontekst, specifičnosti..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit"
                      className="px-6 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105">
                      Objavi nit
                    </button>
                    <button type="button" onClick={() => setShowNova(false)}
                      className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-all">
                      Prekliči
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={iskanje} onChange={e => setIskanje(e.target.value)}
                placeholder={`Iščite v ${kat.naziv}...`}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#0c2340]">{filtrirane.length}</span> niti
              </p>
            </div>

            {filtrirane.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium text-gray-400">Ni rezultatov</p>
                <button onClick={() => setIskanje('')} className="mt-3 text-sm text-[#c9a84c] hover:underline">Počisti iskanje</button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtrirane.map(nit => (
                  <Link key={nit.id} href={`/forum/${nit.kategorija}/${nit.id}`}
                    className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">{nit.avatar}</div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                        {nit.pinned && <span title="Prilepljeno"><Pin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0 mt-0.5" /></span>}
                        {nit.reseno && <span title="Rešeno"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /></span>}
                        <h3 className="font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-1">{nit.naslov}</h3>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">{nit.vsebina}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span className="font-medium">{nit.avtor}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full capitalize">{nit.vloga}</span>
                        <span>{nit.cas}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{nit.odgovori}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{nit.ogledi}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{nit.likes}</span>
                      </div>
                      {nit.tagi && nit.tagi.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {nit.tagi.map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 bg-[#0c2340]/5 text-[#0c2340] rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Stats (desktop) */}
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-xs text-gray-400">
                      <span className="font-semibold text-[#0c2340]">{nit.odgovori}</span>
                      <span>odgovorov</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
