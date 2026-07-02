import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Mail, Phone, Tag, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockRezervniDeli } from '@/data/mock'
import { formatCena } from '@/lib/utils'

const kategorijaIkone: Record<string, string> = {
  motor: '⚙️', elektronika: '📡', jadra: '⛵', trup: '🚢',
  'sidrna oprema': '⚓', drugo: '📦',
}

const stanjeKlasa: Record<string, string> = {
  novo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rabljeno: 'bg-amber-100 text-amber-800 border-amber-200',
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const del = mockRezervniDeli.find(d => d.id === id)
  if (!del) return { title: 'Del ni najden | Garbin' }
  return {
    title: `${del.naziv} | Rezervni deli | Garbin`,
    description: del.opis,
  }
}

export default async function RezervniDelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const del = mockRezervniDeli.find(d => d.id === id)
  const podobni = mockRezervniDeli.filter(d => d.id !== id && d.kategorija === del?.kategorija).slice(0, 3)

  if (!del) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">🔧</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Del ni najden</h1>
            <p className="text-gray-500 mb-8">Ta oglas ne obstaja ali je bil odstranjen.</p>
            <Link href="/rezervni-deli" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Vsi rezervni deli
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Domov</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link href="/rezervni-deli" className="hover:text-white transition-colors">Rezervni deli</Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-white/40 truncate max-w-xs">{del.naziv}</span>
            </div>

            {/* Slika */}
            <div className="h-64 bg-gradient-to-br from-[#1e3a5f] to-[#2e6b9e] rounded-2xl flex items-center justify-center text-7xl opacity-40 mb-6">
              {kategorijaIkone[del.kategorija] ?? '📦'}
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEVA */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stanjeKlasa[del.stanje]}`}>
                          {del.stanje === 'novo' ? 'Novo' : 'Rabljeno'}
                        </span>
                        <span className="text-xs px-2.5 py-1 bg-[#0c2340]/8 text-[#0c2340] rounded-full font-medium capitalize flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {del.kategorija}
                        </span>
                        {del.tip_plovila && (
                          <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                            {del.tip_plovila}
                          </span>
                        )}
                      </div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2340]">{del.naziv}</h1>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-3xl font-bold text-[#0c2340]">{formatCena(del.cena)}</p>
                    </div>
                  </div>

                  {del.lokacija && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                      <MapPin className="w-4 h-4 text-[#c9a84c]" /> {del.lokacija}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-3">Opis</h2>
                  <p className="text-gray-600 leading-relaxed">{del.opis}</p>
                </div>

                {/* Podobni deli */}
                {podobni.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0c2340] mb-4">Podobni deli</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {podobni.map(d => (
                        <Link key={d.id} href={`/rezervni-deli/${d.id}`}
                          className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4">
                          <div className="text-3xl mb-2">{kategorijaIkone[d.kategorija] ?? '📦'}</div>
                          <p className="font-semibold text-[#0c2340] text-sm group-hover:text-[#c9a84c] transition-colors line-clamp-2">{d.naziv}</p>
                          <p className="text-[#c9a84c] font-bold text-sm mt-1">{formatCena(d.cena)}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESNA — kontakt */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                  <h3 className="font-semibold text-[#0c2340] mb-4">Kontakt prodajalca</h3>
                  <div className="space-y-3">
                    {del.kontakt_tel && (
                      <a href={`tel:${del.kontakt_tel}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#0c2340] text-white hover:bg-[#1e3a5f] transition-colors group">
                        <Phone className="w-4 h-4 text-[#c9a84c] shrink-0" />
                        <span className="text-sm font-medium">{del.kontakt_tel}</span>
                      </a>
                    )}
                    {del.kontakt_email && (
                      <a href={`mailto:${del.kontakt_email}?subject=${encodeURIComponent(`Povpraševanje: ${del.naziv}`)}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                        <Mail className="w-4 h-4 text-[#c9a84c] shrink-0" />
                        <span className="text-sm text-gray-700 group-hover:text-[#0c2340] truncate">{del.kontakt_email}</span>
                      </a>
                    )}
                  </div>
                  {del.lokacija && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0" /> {del.lokacija}
                    </div>
                  )}
                </div>

                <Link href="/rezervni-deli"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Vsi rezervni deli
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
