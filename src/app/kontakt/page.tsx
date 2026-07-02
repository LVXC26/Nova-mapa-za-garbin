'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, HelpCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const teme = [
  'Splošno vprašanje',
  'Tehnična težava',
  'Oglaševanje & partnerstva',
  'Reklamacija / napaka na oglas',
  'Registracija podjetja',
  'Drugo',
]

export default function KontaktPage() {
  const [forma, setForma] = useState({ ime: '', email: '', tema: teme[0], sporocilo: '' })
  const [poslano, setPoslano] = useState(false)
  const [nalaga, setNalaga] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNalaga(true)
    await new Promise(r => setTimeout(r, 800))
    setNalaga(false)
    setPoslano(true)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#c9a84c]/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Kontaktirajte nas</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Imate vprašanje, predlog ali težavo? Radi vam pomagamo.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Leva — info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-display text-xl font-bold text-[#0c2340] mb-5">Kontaktni podatki</h2>
                  <div className="space-y-4">
                    {[
                      { ikona: Mail, label: 'E-mail', vrednost: 'info@garbin.si', href: 'mailto:info@garbin.si' },
                      { ikona: Phone, label: 'Telefon', vrednost: '+386 5 123 45 67', href: 'tel:+38651234567' },
                      { ikona: MapPin, label: 'Naslov', vrednost: 'Obala 14, 6320 Portorož', href: undefined },
                    ].map(({ ikona: Ikona, label, vrednost, href }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/15 flex items-center justify-center shrink-0">
                          <Ikona className="w-4 h-4 text-[#c9a84c]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                          {href ? (
                            <a href={href} className="text-sm text-[#0c2340] font-medium hover:text-[#c9a84c] transition-colors">{vrednost}</a>
                          ) : (
                            <p className="text-sm text-[#0c2340] font-medium">{vrednost}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-[#0c2340] mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#c9a84c]" /> Delovni čas
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pon–Pet</span>
                      <span className="font-medium text-[#0c2340]">9:00 – 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sobota</span>
                      <span className="font-medium text-[#0c2340]">10:00 – 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nedelja</span>
                      <span className="text-gray-400">Zaprto</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c2340] rounded-2xl p-6">
                  <HelpCircle className="w-6 h-6 text-[#c9a84c] mb-3" />
                  <h3 className="font-semibold text-white mb-2">Pogosta vprašanja</h3>
                  <p className="text-white/60 text-sm mb-4">Morda že imamo odgovor na vaše vprašanje.</p>
                  <Link href="/faq"
                    className="inline-flex items-center gap-1.5 text-sm text-[#c9a84c] font-medium hover:underline">
                    Poglej FAQ →
                  </Link>
                </div>
              </div>

              {/* Desna — forma */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  {poslano ? (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-[#0c2340]">Sporočilo poslano!</h3>
                      <p className="text-gray-500 max-w-sm">Odgovorili vam bomo v roku 24 ur. Hvala, da ste nas kontaktirali.</p>
                      <button onClick={() => { setPoslano(false); setForma(f => ({...f, sporocilo: '', ime: '', email: ''})) }}
                        className="mt-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-all">
                        Pošlji novo sporočilo
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-display text-xl font-bold text-[#0c2340] mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#c9a84c]" /> Pošljite sporočilo
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ime in priimek *</label>
                            <input required value={forma.ime} onChange={e => setForma(f => ({...f, ime: e.target.value}))}
                              placeholder="Janez Novak"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail *</label>
                            <input required type="email" value={forma.email} onChange={e => setForma(f => ({...f, email: e.target.value}))}
                              placeholder="ime@primer.si"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Tema</label>
                          <select value={forma.tema} onChange={e => setForma(f => ({...f, tema: e.target.value}))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors bg-white">
                            {teme.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Sporočilo *</label>
                          <textarea required rows={6} value={forma.sporocilo} onChange={e => setForma(f => ({...f, sporocilo: e.target.value}))}
                            placeholder="Opišite vaše vprašanje ali težavo čim podrobneje..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400">Z oddajo obrazca se strinjate z našo <Link href="/" className="text-[#c9a84c] hover:underline">politiko zasebnosti</Link>.</p>
                        <button type="submit" disabled={nalaga}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-full transition-all hover:scale-[1.02]">
                          <Send className="w-4 h-4" />
                          {nalaga ? 'Pošiljam...' : 'Pošlji sporočilo'}
                        </button>
                      </form>
                    </>
                  )}
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
