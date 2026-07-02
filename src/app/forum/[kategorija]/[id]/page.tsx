'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageSquare, CheckCircle, Share2, Pin, Send, Eye, Award } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { forumKategorije, forumNiti, forumOdgovori, type ForumOdgovor } from '@/data/forum'
import { useAuth } from '@/components/providers/AuthProvider'

function LikeBtn({ initial }: { initial: number }) {
  const [n, setN] = useState(initial)
  const [liked, setLiked] = useState(false)
  return (
    <button onClick={() => { setLiked(!liked); setN(c => liked ? c - 1 : c + 1) }}
      className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
      <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} /> {n}
    </button>
  )
}

export default function ForumNitPage({ params }: { params: Promise<{ kategorija: string; id: string }> }) {
  const { kategorija, id } = use(params)
  const { user } = useAuth()

  const nit = forumNiti.find(n => n.id === id && n.kategorija === kategorija)
  const kat = forumKategorije.find(k => k.slug === kategorija)
  const [odgovori, setOdgovori] = useState<ForumOdgovor[]>(forumOdgovori.filter(o => o.nit_id === id))
  const [novOdgovor, setNovOdgovor] = useState('')
  const [poslano, setPoslano] = useState(false)

  function handleOdgovor(e: React.FormEvent) {
    e.preventDefault()
    if (!novOdgovor.trim()) return
    const nov: ForumOdgovor = {
      id: `od${Date.now()}`,
      nit_id: id,
      vsebina: novOdgovor,
      avtor: user?.user_metadata?.ime ?? 'Anonimni',
      avatar: '👤',
      vloga: user?.user_metadata?.vloga ?? 'Kupec',
      cas: 'Ravnokar',
      likes: 0,
    }
    setOdgovori([...odgovori, nov])
    setNovOdgovor('')
    setPoslano(true)
    setTimeout(() => setPoslano(false), 3000)
  }

  if (!nit || !kat) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">💬</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Nit ni najdena</h1>
            <Link href="/forum" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white rounded-full text-sm">
              <ArrowLeft className="w-4 h-4" /> Forum
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
        <section className="bg-[#0c2340] py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/forum" className="hover:text-white transition-colors">Forum</Link>
              <span>/</span>
              <Link href={`/forum/${kat.slug}`} className="hover:text-white transition-colors">{kat.naziv}</Link>
            </div>
            <div className="flex items-start gap-3 mb-3">
              {nit.pinned && <Pin className="w-5 h-5 text-[#c9a84c] shrink-0 mt-1" />}
              {nit.reseno && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />}
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">{nit.naslov}</h1>
            </div>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="font-medium text-white">{nit.avtor}</span>
              <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full capitalize">{nit.vloga}</span>
              <span>{nit.cas}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{nit.ogledi}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{odgovori.length}</span>
            </div>
          </div>
        </section>

        <section className="py-8 bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Original post */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-2xl shrink-0">{nit.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-[#0c2340]">{nit.avtor}</span>
                    <span className="text-xs px-2 py-0.5 bg-[#0c2340]/8 text-[#0c2340] rounded-full capitalize">{nit.vloga}</span>
                    <span className="text-xs text-gray-400">{nit.cas}</span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-4">
                    {nit.vsebina}
                  </div>
                  {nit.tagi && nit.tagi.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {nit.tagi.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 bg-[#0c2340]/5 text-[#0c2340] rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                    <LikeBtn initial={nit.likes} />
                    <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">
                      <Share2 className="w-4 h-4" /> Deli
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Odgovori */}
            {odgovori.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#c9a84c]" />
                  {odgovori.length} {odgovori.length === 1 ? 'odgovor' : odgovori.length < 5 ? 'odgovori' : 'odgovorov'}
                </h2>
                <div className="space-y-4">
                  {odgovori.map((o, i) => (
                    <div key={o.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${o.resitev ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-100'}`}>
                      {o.resitev && (
                        <div className="flex items-center gap-2 mb-3 text-emerald-600 text-xs font-semibold">
                          <CheckCircle className="w-4 h-4" /> Označeno kot rešitev
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">{o.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold text-[#0c2340] text-sm">{o.avtor}</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{o.vloga}</span>
                            <span className="text-xs text-gray-400">{o.cas}</span>
                            <span className="text-xs font-medium text-gray-400">#{i + 1}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-3">{o.vsebina}</p>
                          <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                            <LikeBtn initial={o.likes} />
                            <button className="text-xs text-gray-400 hover:text-[#0c2340] transition-colors">Citiraj</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Odgovori forma */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display text-lg font-bold text-[#0c2340] mb-4">Dodajte odgovor</h2>
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-4">Za odgovarjanje se morate prijaviti.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/prijava" className="px-5 py-2.5 bg-[#0c2340] text-white text-sm font-semibold rounded-full hover:bg-[#1e3a5f] transition-all">
                      Prijava
                    </Link>
                    <Link href="/registracija" className="px-5 py-2.5 bg-[#c9a84c] text-[#0c2340] text-sm font-semibold rounded-full hover:bg-[#e8c76d] transition-all">
                      Registracija
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOdgovor} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] font-bold text-sm shrink-0">
                      {(user.user_metadata?.ime ?? 'J')[0]}
                    </div>
                    <textarea
                      required
                      value={novOdgovor}
                      onChange={e => setNovOdgovor(e.target.value)}
                      rows={4}
                      placeholder="Napišite odgovor, delite izkušnjo ali dodajte nasvet..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors"
                    />
                  </div>
                  {poslano && (
                    <p className="text-emerald-600 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Odgovor objavljen!
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
                      <Send className="w-4 h-4" /> Objavi odgovor
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
