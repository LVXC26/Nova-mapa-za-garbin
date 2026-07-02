import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Tag, Share2, ArrowRight, BookOpen } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockNovice, unsplashNovice } from '@/data/mock'
import { formatDatum } from '@/lib/utils'

const vsebinaMock: Record<string, string> = {
  'kako-izbrati-jadrnico': `
    <p>Nakup prve jadrnice je vznemirljiv, a zahteven korak. Pred odločitvijo je ključno razumeti vaše potrebe, izkušnje in proračun.</p>

    <h2>Velikost plovila</h2>
    <p>Za začetnike priporočamo jadrnice dolžine 8–11 metrov. Takšne jadrnice so dovolj prostorne za udobno potovanje, hkrati pa dovolj majhne za enostavno upravljanje. Večje jadrnice zahtevajo več posadke in izkušenj.</p>

    <h2>Starost in stanje</h2>
    <p>Rabljene jadrnice so pogosto odlična vrednost za denar. Jadrnice iz 90-ih in 2000-ih let so pogosto dobro vzdrževano in imajo dober izkoristek. Ključno je opraviti temeljit pregled pred nakupom — priporočamo najeti poklicnega inšpektorja.</p>

    <h2>Oprema</h2>
    <p>Preverite stanje jader, trupa, motorja in elektronike. GPS, VHF radio in AIS oddajnik so danes standardna oprema za varno plovbo. Autopilot je priporočljiv za dolge rute.</p>

    <h2>Proračun</h2>
    <p>Poleg nakupne cene upoštevajte letne stroške vzdrževanja (5–10% vrednosti plovila), mariniranje, zavarovanje in gorivo. Za dobro jadrnico v vrednosti 50.000 € pričakujte letne stroške 5.000–8.000 €.</p>

    <h2>Priporočeni modeli za začetnike</h2>
    <p>Bavaria 30 Cruiser, Jeanneau Sun Odyssey 34, Beneteau Oceanis 323 — vse so zanesljive in dostopne jadrnice z dobrim razmerjem cena/kakovost.</p>

    <p>Ne pozabite — najboljša jadrnica je tista, ki jo redno uporabljate. Bolje manjša in vedno na morju, kot velika in v marini.</p>
  `,
  'trg-plovil-2024': `
    <p>Leto 2024 prinaša rekordne cene jadrnic in motornih čolnov na slovenskem trgu. Analiza prvega četrtletja kaže 23% rast cen v primerjavi z enakim obdobjem lani.</p>

    <h2>Vzroki za rast cen</h2>
    <p>Glavni vzroki so pomanjkanje novih plovil (dobavne verige se še vedno normalizirajo po pandemiji), povečano povpraševanje po aktivnem preživljanju prostega časa na morju in inflacija, ki je dvignila stroške proizvodnje.</p>

    <h2>Kategorije s prvo rastjo</h2>
    <p>Jadrnice dolžine 10–14 m so zabeležile 28% rast, motorni čolni pa 19%. Gumenjaki ostajajo relativno stabilni (+8%).</p>

    <h2>Napoved za preostali del leta</h2>
    <p>Analitiki pričakujejo umiritev rasti cen v drugi polovici leta, ko bodo novi modeli izpolnili povpraševanje. Kljub temu ostajajo cene bistveno višje kot pred pandemijo.</p>

    <h2>Priložnosti za kupce</h2>
    <p>Kljub visokim cenam ostajajo plovila letnikov 2010–2016 relativno dostopna. Trg najema se razvija hitreje kot prodajni trg, kar odpira priložnosti za investitorje.</p>
  `,
  'vzdrzevanje-plovila-pomlad': `
    <p>Po zimski sezoni je temeljit pregled plovila ključen za varno in udobno plovbo. Sledite našemu praktičnemu kontrolnemu seznamu.</p>

    <h2>Trup in paluba</h2>
    <p>Preglejte trup za razpoke, mehurje in poškodbe. Preverite tesnila lukov, vetrnikov in prehodov skozi trup. Nanesite svežo antifouling barvo pred spustom v vodo.</p>

    <h2>Motor in pogon</h2>
    <p>Zamenjajte olje in filter, preverite hladilni sistem, impeler in transmisijo. Preglejte gumijaste veze in anodo. Motor zaženite in preverite za nenavadne zvoke ali vibracije.</p>

    <h2>Jadra in takelija</h2>
    <p>Preglejte jadra za obrabo in poškodbe. Preverite vse vrvi, šrope in zaponke. Zamenjajte vse sumljive dele — varnost na morju je ključna.</p>

    <h2>Varnostna oprema</h2>
    <p>Preverite datum poteka rešilnih jopičev, pirotehnike in CO2 bombonke v splavu. Preverite EPIRB baterijo in datum kalibracije. Dopolnite komplet prve pomoči.</p>

    <h2>Elektronika in navigacija</h2>
    <p>Testirajte vse navigacijske naprave, posodobite karte, preverite baterije in polnilni sistem. Preverite VHF radio in DSC register.</p>
  `,
}

export default function NovicaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const novica = mockNovice.find(n => n.slug === slug)
  const druge = mockNovice.filter(n => n.slug !== slug).slice(0, 2)

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
  const ikona = ikone[mockNovice.indexOf(novica) % ikone.length]
  const vsebina = vsebinaMock[novica.slug] ?? `<p>${novica.povzetek ?? 'Vsebina novice je v pripravi.'}</p>`
  const berucasMin = Math.ceil(vsebina.replace(/<[^>]+>/g, '').split(' ').length / 200)

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
              {unsplashNovice[novica.slug] ? (
                <img src={unsplashNovice[novica.slug]} alt={novica.naslov} className="w-full h-full object-cover" />
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
                  <div
                    className="prose prose-lg prose-slate max-w-none
                      prose-headings:font-display prose-headings:text-[#0c2340]
                      prose-p:text-gray-600 prose-p:leading-relaxed
                      prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                      prose-a:text-[#c9a84c] prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: vsebina }}
                  />
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

            {/* Komentar forma */}
            <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="font-display text-xl font-bold text-[#0c2340] mb-6">Pustite komentar</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ime *</label>
                    <input required placeholder="Janez Novak"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail *</label>
                    <input required type="email" placeholder="ime@primer.si"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Komentar *</label>
                  <textarea required rows={4} placeholder="Vaše mnenje o prispevku..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                </div>
                <p className="text-xs text-gray-400">Komentar bo viden po moderatorski odobritvi.</p>
                <button type="submit"
                  className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
                  Pošlji komentar
                </button>
              </form>
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
