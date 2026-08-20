'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Tag, Share2, ArrowRight, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { unsplashNovice } from '@/data/mock'
import { formatDatum } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Novica, NovicaKategorija, Komentar } from '@/types/database'

type NovicaZKategorijo = Novica & { kategorija?: NovicaKategorija }

export default function NovicaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [realnaNovica, setRealnaNovica] = useState<NovicaZKategorijo | null>(null)
  const [druge, setDruge] = useState<Novica[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [komentarji, setKomentarji] = useState<Komentar[]>([])
  const [komentarForma, setKomentarForma] = useState({ ime: '', email: '', vsebina: '' })
  const [komentarPoslan, setKomentarPoslan] = useState(false)
  const [komentarNapaka, setKomentarNapaka] = useState('')
  const [posiljaKomentar, setPosiljaKomentar] = useState(false)

  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('novice')
        .select('*, kategorija:novice_kategorije(*)')
        .eq('slug', slug)
        .maybeSingle()
      const trenutnaNovica = data as NovicaZKategorijo | null
      setRealnaNovica(trenutnaNovica)
      setNalaga(false)

      if (trenutnaNovica?.id) {
        const { data: komentarjiData } = await supabase
          .from('komentarji')
          .select('*')
          .eq('novica_id', trenutnaNovica.id)
          .eq('potrjen', true)
          .order('created_at', { ascending: false })
        setKomentarji(komentarjiData ?? [])

        const { data: drugeData } = await supabase
          .from('novice')
          .select('*')
          .not('published_at', 'is', null)
          .neq('slug', slug)
          .order('published_at', { ascending: false })
          .limit(2)
        setDruge(drugeData ?? [])
      }
    })()
  }, [slug])

  const novica = realnaNovica ?? undefined

  async function posljiKomentar(e: React.FormEvent) {
    e.preventDefault()
    if (!novica) return
    setKomentarNapaka('')

    if (!komentarForma.ime || !komentarForma.email || !komentarForma.vsebina) {
      setKomentarNapaka('Izpolnite vsa polja.')
      return
    }

    setPosiljaKomentar(true)
    const supabase = createClient()
    const { error } = await supabase.from('komentarji').insert({
      novica_id: novica.id,
      ime: komentarForma.ime,
      email: komentarForma.email,
      vsebina: komentarForma.vsebina,
      potrjen: false,
    })
    setPosiljaKomentar(false)

    if (error) { setKomentarNapaka('Napaka pri pošiljanju komentarja.'); return }
    setKomentarPoslan(true)
    setKomentarForma({ ime: '', email: '', vsebina: '' })
  }

  if (nalaga) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  if (!novica) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-5xl mb-4">📰</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Novica ni najdena</h1>
            <p className="text-gray-500 mb-8">Ta novica ne obstaja ali je bila odstranjena.</p>
            <Link href="/novice" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Vse novice
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const ikone = ['⛵', '📈', '🔧', '⚓', '🌊']
  const ikonaIndeks = novica.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const ikona = ikone[ikonaIndeks % ikone.length]
  const navadnoBesedilo = novica.vsebina || novica.povzetek || 'Vsebina novice je v pripravi.'
  const berucasMin = Math.ceil(navadnoBesedilo.replace(/<[^>]+>/g, '').split(' ').length / 200)

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] pt-12 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[#1e3a5f]/80 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/novice" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Vse novice
            </Link>

            {novica.kategorija && (
              <div className="mb-4">
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: novica.kategorija.barva ?? '#0c2340' }}>
                  {novica.kategorija.naziv}
                </span>
              </div>
            )}

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {novica.naslov}
            </h1>

            {novica.povzetek && (
              <p className="text-white/70 text-lg max-w-2xl mb-8 leading-relaxed">{novica.povzetek}</p>
            )}

            <div className="flex flex-wrap items-center gap-5 text-white/60 text-sm pb-8">
              {novica.avtor && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {novica.avtor}
                </span>
              )}
              {novica.published_at && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {formatDatum(novica.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> {berucasMin} min branja
              </span>
              <button className="flex items-center gap-1.5 text-white/40 hover:text-[#c9a84c] transition-colors ml-auto">
                <Share2 className="w-4 h-4" /> Deli
              </button>
            </div>
          </div>
        </section>

        {/* Slika */}
        <section className="bg-[#0c2340] pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-64 sm:h-96 rounded-t-3xl overflow-hidden relative bg-gradient-to-br from-[#1e3a5f] to-[#2e6b9e]">
              {novica.slika_url || unsplashNovice[novica.slug] ? (
                <img src={novica.slika_url ?? unsplashNovice[novica.slug]} alt={novica.naslov} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-20">{ikona}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* VSEBINA */}
        <section className="bg-[#f8fafc] py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* CLANEK */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{navadnoBesedilo}</p>
                </div>

                {/* Share section */}
                <div className="mt-6 flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div>
                    <p className="font-semibold text-[#0c2340] text-sm">Všeč vam je ta novica?</p>
                    <p className="text-xs text-gray-500 mt-0.5">Delite jo s prijatelji in znanci</p>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white text-sm font-medium rounded-full transition-all hover:scale-105">
                    <Share2 className="w-4 h-4" /> Deli novico
                  </button>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="space-y-5">
                {/* Avtor */}
                {novica.avtor && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-[#0c2340] text-sm mb-3">Avtor</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-xl font-bold text-[#0c2340]">
                        {novica.avtor[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0c2340] text-sm">{novica.avtor}</p>
                        <p className="text-xs text-gray-500">Pisec na Garbin</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kategorija */}
                {novica.kategorija && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-[#0c2340] text-sm mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Kategorija
                    </h3>
                    <span className="inline-block px-3 py-1.5 text-sm font-medium rounded-full text-white" style={{ backgroundColor: novica.kategorija.barva ?? '#0c2340' }}>
                      {novica.kategorija.naziv}
                    </span>
                  </div>
                )}

                {/* Banner placeholder */}
                <div className="w-full h-[250px] bg-[#0c2340] rounded-2xl flex flex-col items-center justify-center border border-[#1e3a5f]">
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">300 × 250</p>
                  <p className="text-white/50 text-sm">Oglaševalski prostor</p>
                </div>
              </div>
            </div>

            {/* Obstoječi komentarji */}
            {komentarji.length > 0 && (
              <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-display text-xl font-bold text-[#0c2340] mb-6">{komentarji.length} {komentarji.length === 1 ? 'komentar' : 'komentarjev'}</h2>
                <div className="space-y-5">
                  {komentarji.map(k => (
                    <div key={k.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-sm font-bold text-[#0c2340] shrink-0">
                        {k.ime[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#0c2340] text-sm">{k.ime}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{k.vsebina}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Komentar forma */}
            <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="font-display text-xl font-bold text-[#0c2340] mb-6">Pustite komentar</h2>
              {komentarPoslan ? (
                <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Hvala za komentar! Viden bo po moderatorski odobritvi.
                </div>
              ) : (
                <form onSubmit={posljiKomentar} className="space-y-4">
                  {komentarNapaka && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {komentarNapaka}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ime *</label>
                      <input required value={komentarForma.ime} onChange={e => setKomentarForma(f => ({ ...f, ime: e.target.value }))} placeholder="Janez Novak"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail *</label>
                      <input required type="email" value={komentarForma.email} onChange={e => setKomentarForma(f => ({ ...f, email: e.target.value }))} placeholder="ime@primer.si"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Komentar *</label>
                    <textarea required rows={4} value={komentarForma.vsebina} onChange={e => setKomentarForma(f => ({ ...f, vsebina: e.target.value }))} placeholder="Vaše mnenje o prispevku..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400">Komentar bo viden po moderatorski odobritvi.</p>
                  <button type="submit" disabled={posiljaKomentar}
                    className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
                    {posiljaKomentar ? 'Pošiljam...' : 'Pošlji komentar'}
                  </button>
                </form>
              )}
            </div>

            {/* Podobne novice */}
            {druge.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-[#0c2340]">Preberite še</h2>
                  <Link href="/novice" className="flex items-center gap-1 text-sm font-medium text-[#0c2340] hover:text-[#c9a84c] transition-colors">
                    Vse novice <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {druge.map((n, i) => (
                    <Link key={n.id} href={`/novice/${n.slug}`} className="group block">
                      <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                        <div className="h-40 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center relative">
                          <span className="text-4xl opacity-20">{ikone[i % ikone.length]}</span>
                          {n.kategorija && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: n.kategorija.barva ?? '#0c2340' }}>
                                {n.kategorija.naziv}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-base font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-2 mb-2">{n.naslov}</h3>
                          {n.povzetek && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{n.povzetek}</p>}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{n.avtor}</span>
                            {n.published_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {formatDatum(n.published_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
