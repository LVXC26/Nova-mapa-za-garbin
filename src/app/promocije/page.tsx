import Link from 'next/link'
import { Calendar, ArrowRight, ChevronRight, Tag, Star, Flame, Package, Anchor } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockPromocije, mockPlovila } from '@/data/mock'
import { formatCena } from '@/lib/utils'

const tipConfig: Record<string, { label: string; ikona: string; barva: string }> = {
  popust: { label: 'Popust', ikona: '🏷️', barva: '#0c2340' },
  featured: { label: 'Izpostavljeno', ikona: '⭐', barva: '#c9a84c' },
  sezonska: { label: 'Sezonska', ikona: '🌊', barva: '#1e3a5f' },
  paket: { label: 'Paket', ikona: '📦', barva: '#2e7d32' },
}

export default function PromoPage() {
  const aktivne = mockPromocije.filter(
    (p) => new Date(p.veljavnost_do) >= new Date()
  )
  const pretekle = mockPromocije.filter(
    (p) => new Date(p.veljavnost_do) < new Date()
  )

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-4">
              <Link href="/" className="hover:text-white transition-colors">Domov</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Promocije</span>
            </div>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-5">
                <Flame className="w-4 h-4" />
                {aktivne.length} aktivnih promocij
              </div>
              <h1 className="font-display text-5xl font-bold text-white mb-4">
                Promocije & posebne ponudbe
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Ekskluzivne ponudbe, sezonski popusti in posebne akcije na plovila in rezervne dele. Ne zamudite priložnosti.
              </p>
            </div>
          </div>
        </section>

        {/* TYPES LEGEND */}
        <section className="bg-white border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              {Object.entries(tipConfig).map(([tip, cfg]) => (
                <div key={tip} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600">
                  <span>{cfg.ikona}</span>
                  {cfg.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AKTIVNE PROMOCIJE */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-display text-2xl font-bold text-[#0c2340]">Aktivne promocije</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPromocije.map((promo) => {
                const plovilo = mockPlovila.find((p) => p.id === promo.plovilo_id)
                const cfg = tipConfig[promo.tip]
                const stevilDni = Math.ceil(
                  (new Date(promo.veljavnost_do).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                const jeAktivna = stevilDni >= 0

                return (
                  <div
                    key={promo.id}
                    className={`relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
                      jeAktivna
                        ? 'border-gray-100 hover:shadow-xl hover:-translate-y-1'
                        : 'border-gray-200 opacity-60'
                    }`}
                  >
                    {!jeAktivna && (
                      <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <span className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-full">
                          Potekla
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row">
                      {/* Levi panel */}
                      <div
                        className="sm:w-48 flex-shrink-0 p-6 flex flex-col items-center justify-center gap-3 text-white relative"
                        style={{ backgroundColor: promo.barva }}
                      >
                        <span className="text-4xl">{cfg.ikona}</span>
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">{cfg.label}</span>
                        {promo.popust && (
                          <div className="text-center">
                            <div className="font-display text-4xl font-bold text-[#c9a84c]">-{promo.popust}%</div>
                            <div className="text-xs opacity-70 mt-1">popust</div>
                          </div>
                        )}
                        {!promo.popust && promo.tip === 'paket' && (
                          <div className="text-center">
                            <Package className="w-8 h-8 text-[#c9a84c] mx-auto" />
                            <div className="text-xs opacity-70 mt-1">paketna ponudba</div>
                          </div>
                        )}
                        {!promo.popust && promo.tip === 'featured' && (
                          <div className="text-center">
                            <Star className="w-8 h-8 text-[#c9a84c] mx-auto" />
                            <div className="text-xs opacity-70 mt-1">izpostavljeno</div>
                          </div>
                        )}
                      </div>

                      {/* Desni panel */}
                      <div className="flex-1 p-6">
                        <h3 className="font-display text-xl font-bold text-[#0c2340] mb-2">
                          {promo.naziv}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{promo.opis}</p>

                        {plovilo && (
                          <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl mb-4 border border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center">
                              <Anchor className="w-5 h-5 text-[#c9a84c]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#0c2340] truncate">{plovilo.naziv}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span>{formatCena(plovilo.cena)}</span>
                                {promo.popust && (
                                  <>
                                    <span>→</span>
                                    <span className="text-emerald-600 font-semibold">
                                      {formatCena(plovilo.cena * (1 - promo.popust / 100))}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {jeAktivna
                                ? stevilDni === 0
                                  ? 'Poteče danes!'
                                  : `Še ${stevilDni} ${stevilDni === 1 ? 'dan' : stevilDni < 5 ? 'dnevi' : 'dni'}`
                                : `Potekla ${new Date(promo.veljavnost_do).toLocaleDateString('sl-SI')}`
                              }
                            </span>
                          </div>

                          {jeAktivna && plovilo && (
                            <Link
                              href={`/plovila/${plovilo.id}`}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0c2340] bg-[#c9a84c] hover:bg-[#e8c76d] rounded-full transition-colors"
                            >
                              Oglej si <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {jeAktivna && stevilDni <= 7 && (
                      <div className="bg-amber-50 border-t border-amber-100 px-6 py-2 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-700 font-medium">
                          Časovno omejena ponudba — ukrepi takoj!
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* KAKO DELUJE */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-[#0c2340] mb-3">Kako izkoristiti promocijo?</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">Promocije so časovno omejene. Sledite tem korakom za hitro in varno rezervacijo.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { st: '01', naslov: 'Izberite promocijo', opis: 'Preglejte aktivne promocije in poiščite tisto, ki ustreza vašim potrebam.', ikona: '🔍' },
                { st: '02', naslov: 'Kontaktirajte prodajalca', opis: 'Kliknite na plovilo in vzpostavite stik z lastnikom za več informacij.', ikona: '📞' },
                { st: '03', naslov: 'Zaključite nakup', opis: 'Dogovorite se za ogled in varno zaključite transakcijo.', ikona: '✅' },
              ].map(({ st, naslov, opis, ikona }) => (
                <div key={st} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0c2340]/5 flex items-center justify-center text-2xl mb-4">
                    {ikona}
                  </div>
                  <div className="text-xs font-bold text-[#c9a84c] mb-2 tracking-widest">{st}</div>
                  <h3 className="font-display text-lg font-semibold text-[#0c2340] mb-2">{naslov}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{opis}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0c2340] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/10 blur-3xl -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <Tag className="w-8 h-8 text-[#c9a84c] mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Imate posebno ponudbo?
            </h2>
            <p className="text-white/70 mb-6">
              Oglasite vašo akcijo na Garbin in dosežite tisoče zainteresiranih kupcev.
            </p>
            <Link
              href="/oglas/novo"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#0c2340] bg-[#c9a84c] hover:bg-[#e8c76d] rounded-full transition-all duration-200 hover:scale-105"
            >
              Oddaj oglas <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
