'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Phone, Mail, Tag, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockRezervniDeli } from '@/data/mock'
import { formatCena } from '@/lib/utils'

type Kategorija = 'vse' | 'motor' | 'trup' | 'elektronika' | 'jadra' | 'sidrna oprema' | 'drugo'
type Stanje = 'vse' | 'novo' | 'rabljeno'

const kategorijeOpcije: { vrednost: Kategorija; label: string; ikona: string }[] = [
  { vrednost: 'vse', label: 'Vse kategorije', ikona: '🔍' },
  { vrednost: 'motor', label: 'Motor', ikona: '⚙️' },
  { vrednost: 'elektronika', label: 'Elektronika', ikona: '📡' },
  { vrednost: 'jadra', label: 'Jadra', ikona: '⛵' },
  { vrednost: 'trup', label: 'Trup', ikona: '🚢' },
  { vrednost: 'sidrna oprema', label: 'Sidrna oprema', ikona: '⚓' },
  { vrednost: 'drugo', label: 'Drugo', ikona: '📦' },
]

const stanjeKlasa = {
  novo: 'bg-emerald-100 text-emerald-800',
  rabljeno: 'bg-amber-100 text-amber-800',
}

export default function RezervniDeliPage() {
  const [kategorija, setKategorija] = useState<Kategorija>('vse')
  const [stanje, setStanje] = useState<Stanje>('vse')
  const [iskanje, setIskanje] = useState('')

  const filtrirani = mockRezervniDeli.filter((del) => {
    if (kategorija !== 'vse' && del.kategorija !== kategorija) return false
    if (stanje !== 'vse' && del.stanje !== stanje) return false
    if (iskanje && !del.naziv.toLowerCase().includes(iskanje.toLowerCase()) && !del.opis.toLowerCase().includes(iskanje.toLowerCase())) return false
    return true
  })

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-3">
              <Link href="/" className="hover:text-white transition-colors">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Rezervni deli</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Rezervni deli & material
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Motorji, elektronika, jadra, sidra in vse kar potrebujete za vaše plovilo. Kupite ali prodajte rabljene in nove dele.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Iščite po nazivu ali opisu..."
                  value={iskanje}
                  onChange={(e) => setIskanje(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c] focus:bg-white/15 transition-all"
                />
              </div>
              <select
                value={stanje}
                onChange={(e) => setStanje(e.target.value as Stanje)}
                className="px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#c9a84c] cursor-pointer"
              >
                <option value="vse" className="text-[#0c2340]">Vse stanje</option>
                <option value="novo" className="text-[#0c2340]">Novo</option>
                <option value="rabljeno" className="text-[#0c2340]">Rabljeno</option>
              </select>
            </div>
          </div>
        </section>

        {/* KATEGORIJE */}
        <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {kategorijeOpcije.map(({ vrednost, label, ikona }) => (
                <button
                  key={vrednost}
                  onClick={() => setKategorija(vrednost)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    kategorija === vrednost
                      ? 'bg-[#0c2340] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{ikona}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* REZULTATI */}
        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#0c2340]">{filtrirani.length}</span> rezultatov
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                {kategorija !== 'vse' && (
                  <span className="px-2.5 py-1 bg-[#0c2340] text-white rounded-full text-xs">
                    {kategorijeOpcije.find(k => k.vrednost === kategorija)?.label}
                  </span>
                )}
                {stanje !== 'vse' && (
                  <span className="px-2.5 py-1 bg-[#0c2340] text-white rounded-full text-xs capitalize">
                    {stanje}
                  </span>
                )}
              </div>
            </div>

            {filtrirani.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-semibold text-[#0c2340] mb-2">Ni rezultatov</h3>
                <p className="text-gray-500">Poskusite z drugimi filtri ali iskanjem.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtrirani.map((del) => (
                  <div
                    key={del.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 group"
                  >
                    <div className="h-40 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center relative">
                      <span className="text-4xl opacity-30">
                        {del.kategorija === 'motor' ? '⚙️' :
                         del.kategorija === 'elektronika' ? '📡' :
                         del.kategorija === 'jadra' ? '⛵' :
                         del.kategorija === 'trup' ? '🚢' :
                         del.kategorija === 'sidrna oprema' ? '⚓' : '📦'}
                      </span>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${stanjeKlasa[del.stanje]}`}>
                          {del.stanje === 'novo' ? 'Novo' : 'Rabljeno'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="text-xl font-display font-bold text-[#c9a84c]">
                          {formatCena(del.cena)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-display text-base font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-2 leading-tight">
                          {del.naziv}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2">
                        <Tag className="w-3.5 h-3.5 text-[#c9a84c]" />
                        <span className="text-xs text-gray-400 capitalize">{del.kategorija}</span>
                        {del.tip_plovila && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400">{del.tip_plovila}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{del.opis}</p>

                      <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5">
                        {del.lokacija && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                            {del.lokacija}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          {del.kontakt_tel && (
                            <a
                              href={`tel:${del.kontakt_tel}`}
                              className="flex items-center gap-1 text-xs text-[#0c2340] hover:text-[#c9a84c] transition-colors font-medium"
                            >
                              <Phone className="w-3.5 h-3.5" /> Pokliči
                            </a>
                          )}
                          {del.kontakt_email && (
                            <a
                              href={`mailto:${del.kontakt_email}`}
                              className="flex items-center gap-1 text-xs text-[#0c2340] hover:text-[#c9a84c] transition-colors font-medium"
                            >
                              <Mail className="w-3.5 h-3.5" /> Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-[#0c2340] mb-3">Prodajate rezervni del?</h2>
            <p className="text-gray-500 mb-6">Objavite oglas in dosežite kupce po vsej Sloveniji.</p>
            <Link
              href="/rezervni-deli/novo"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#0c2340] bg-[#c9a84c] hover:bg-[#e8c76d] rounded-full transition-all duration-200 hover:scale-105"
            >
              Objavi oglas za del
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
