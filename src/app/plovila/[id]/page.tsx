'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Ruler, Phone, Mail, MessageCircle, CheckCircle, Share2, Copy, X, Printer } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PloviloKartica from '@/components/plovila/PloviloKartica'
import { mockPlovila } from '@/data/mock'
import { useAuth } from '@/components/providers/AuthProvider'
import PovprasevanjeForma from '@/components/shared/PovprasevanjeForma'

function ShareModal({ naziv, onClose }: { naziv: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-[#0c2340]">Deli plovilo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5 truncate">"{naziv}"</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'WhatsApp', ikona: '📱', href: `https://wa.me/?text=${encodeURIComponent(`Poglej to plovilo: ${naziv} ${url}`)}`, barva: 'bg-green-500' },
            { label: 'Facebook', ikona: '👥', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, barva: 'bg-blue-600' },
            { label: 'E-mail', ikona: '📧', href: `mailto:?subject=${encodeURIComponent(`Plovilo: ${naziv}`)}&body=${encodeURIComponent(url)}`, barva: 'bg-gray-600' },
          ].map(({ label, ikona, href, barva }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 p-3 ${barva} text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium`}>
              <span className="text-2xl">{ikona}</span>
              {label}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          <input readOnly value={url} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 bg-gray-50 focus:outline-none truncate" />
          <button onClick={copyLink}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-[#0c2340] text-white hover:bg-[#1e3a5f]'}`}>
            <Copy className="w-4 h-4" />
            {copied ? 'Kopirano!' : 'Kopiraj'}
          </button>
        </div>
      </div>
    </div>
  )
}

const opremaLabele: Record<string, string> = {
  gps: 'GPS / Chartplotter',
  radar: 'Radar',
  vhf: 'VHF radio',
  autopilot: 'Autopilot',
  generator: 'Generator',
  klima: 'Klimatska naprava',
  rib: 'Pnevmatični čoln (RIB)',
  epirb: 'EPIRB',
}

const tipIkone: Record<string, string> = {
  jadrnica: '⛵', motorni: '🚤', gumenjak: '🛟', katamaran: '⛵', jet: '💨', drugo: '⚓',
}

export default function PloviloDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const plovilo = mockPlovila.find(p => p.id === id)
  const [shareOpen, setShareOpen] = useState(false)
  const podobna = mockPlovila.filter(p => p.id !== id && p.tip === plovilo?.tip).slice(0, 3)

  if (!plovilo) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <p className="text-4xl mb-4">⚓</p>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Plovilo ni najdeno</h1>
            <p className="text-gray-500 mb-8">To plovilo ne obstaja ali je bilo odstranjeno.</p>
            <Link href="/plovila" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Nazaj na plovila
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const aktivnaOprema = plovilo.oprema
    ? Object.entries(plovilo.oprema).filter(([, v]) => v).map(([k]) => ({ kljuc: k, label: opremaLabele[k] ?? k }))
    : []

  return (
    <>
      <Navbar />
      {shareOpen && plovilo && <ShareModal naziv={plovilo.naziv} onClose={() => setShareOpen(false)} />}
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/plovila" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Vsa plovila
            </Link>

            {/* Galerija */}
            <div className="grid grid-cols-4 gap-3">
              {/* Glavna slika */}
              <div className="col-span-4 md:col-span-3 h-72 md:h-96 rounded-2xl overflow-hidden relative bg-[#1e3a5f]">
                {plovilo.slike && plovilo.slike[0] ? (
                  <img
                    src={plovilo.slike[0]}
                    alt={plovilo.naziv}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = '' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl opacity-20">{tipIkone[plovilo.tip] ?? '⚓'}</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  📷 {plovilo.slike?.length ?? 0} fotografij
                </div>
              </div>
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 rounded-xl overflow-hidden relative bg-[#1e3a5f]">
                    {plovilo.slike && plovilo.slike[i] ? (
                      <img
                        src={plovilo.slike[i]}
                        alt={`${plovilo.naziv} ${i + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl opacity-20">{tipIkone[plovilo.tip] ?? '⚓'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VSEBINA */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEVA — info */}
              <div className="lg:col-span-2 space-y-6">

                {/* Naslov */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{tipIkone[plovilo.tip]}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          plovilo.tip_oglasa === 'najem' ? 'bg-[#c9a84c]/15 text-[#9a7a2e]' : 'bg-[#0c2340]/10 text-[#0c2340]'
                        }`}>
                          {plovilo.tip_oglasa === 'najem' ? 'Za najem' : 'Za prodajo'}
                        </span>
                      </div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2340]">{plovilo.naziv}</h1>
                    </div>
                    <button onClick={() => setShareOpen(true)} className="p-2 rounded-xl text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors shrink-0" title="Deli plovilo">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => window.print()} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 print:hidden" title="Natisni oglas">
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {plovilo.lokacija && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#c9a84c]" /> {plovilo.lokacija}
                      </span>
                    )}
                    {plovilo.letnik && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#c9a84c]" /> Letnik {plovilo.letnik}
                      </span>
                    )}
                    {plovilo.dolzina_m && (
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-[#c9a84c]" /> {plovilo.dolzina_m} m
                      </span>
                    )}
                  </div>

                  {/* Stanje */}
                  {plovilo.stanje && (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                      plovilo.stanje === 'odlično' ? 'bg-emerald-50 text-emerald-700'
                        : plovilo.stanje === 'dobro' ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      Stanje: {plovilo.stanje}
                    </span>
                  )}
                </div>

                {/* Opis */}
                {plovilo.opis && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-3">Opis</h2>
                    <p className="text-gray-600 leading-relaxed">{plovilo.opis}</p>
                  </div>
                )}

                {/* Oprema */}
                {aktivnaOprema.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-display text-lg font-semibold text-[#0c2340] mb-4">Oprema</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {aktivnaOprema.map(({ kljuc, label }) => (
                        <div key={kljuc} className="flex items-center gap-2 p-3 bg-[#0c2340]/5 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-sm text-[#0c2340] font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Oglaševalski banner placeholder */}
                <div className="w-full h-[90px] bg-[#0c2340] rounded-2xl flex items-center justify-center border border-[#1e3a5f] relative overflow-hidden">
                  <div className="text-center">
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">728 × 90</p>
                    <p className="text-white/50 text-sm">Oglaševalski prostor</p>
                  </div>
                </div>

                {/* Podobna plovila */}
                {podobna.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0c2340] mb-4">Podobna plovila</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {podobna.map(p => <PloviloKartica key={p.id} plovilo={p} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* DESNA — cena + kontakt */}
              <div className="space-y-4">
                {/* Cena kartica */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                  <div className="mb-5">
                    <p className="text-3xl font-display font-bold text-[#0c2340]">
                      {plovilo.cena.toLocaleString('sl-SI')} €
                    </p>
                    {plovilo.tip_oglasa === 'najem' && (
                      <p className="text-sm text-gray-400">/ teden</p>
                    )}
                  </div>

                  {/* Kontaktni gumbi */}
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        href="/chat"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Kontaktiraj prodajalca
                      </Link>
                      {plovilo.kontakt_tel && (
                        <a
                          href={`tel:${plovilo.kontakt_tel}`}
                          className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#0c2340] text-[#0c2340] font-semibold rounded-full hover:bg-[#0c2340] hover:text-white transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          {plovilo.kontakt_tel}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center mb-3">
                        <p className="text-xs text-amber-700 font-medium">Za kontakt se morate prijaviti</p>
                      </div>
                      <Link
                        href="/prijava?redirect=/plovila"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-full transition-all"
                      >
                        Prijava za kontakt
                      </Link>
                    </div>
                  )}
                </div>

                {/* Povpraševanje forma */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-[#0c2340] mb-4 text-sm">Pošlji povpraševanje</h3>
                  <PovprasevanjeForma tip="plovilo" targetId={plovilo.id} />
                </div>

                {/* Prodajalec info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#0c2340] text-sm mb-3">Prodajalec</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-lg">👤</div>
                    <div>
                      <p className="font-medium text-[#0c2340] text-sm">Zasebni prodajalec</p>
                      <p className="text-xs text-gray-400">Član od 2024</p>
                    </div>
                  </div>
                  {plovilo.kontakt_email && (
                    <a href={`mailto:${plovilo.kontakt_email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0c2340] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                      {plovilo.kontakt_email}
                    </a>
                  )}
                </div>

                {/* Banner placeholder 300x250 */}
                <div className="w-full h-[250px] bg-[#0c2340] rounded-2xl flex flex-col items-center justify-center border border-[#1e3a5f]">
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">300 × 250</p>
                  <p className="text-white/50 text-sm">Oglaševalski prostor</p>
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
