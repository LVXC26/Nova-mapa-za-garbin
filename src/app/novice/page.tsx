import Link from 'next/link'
import { Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockNovice, unsplashNovice } from '@/data/mock'
import { formatDatum } from '@/lib/utils'

export default function NovicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[#0c2340] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Novice & Blog</h1>
            <p className="text-white/70 text-lg">Nasveti, trendi in novosti s slovenskega trga plovil.</p>
          </div>
        </section>
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockNovice.map((novica, i) => (
                <Link key={novica.id} href={`/novice/${novica.slug}`} className="group block">
                  <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="h-44 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center relative overflow-hidden">
                      {unsplashNovice[novica.slug] ? (
                        <img src={unsplashNovice[novica.slug]} alt={novica.naslov} className="w-full h-full object-cover absolute inset-0" />
                      ) : (
                        <span className="text-5xl opacity-20">{i === 0 ? '⛵' : i === 1 ? '📈' : '🔧'}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/60 to-transparent" />
                      {novica.kategorija && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: novica.kategorija.barva ?? '#0c2340' }}>
                            {novica.kategorija.naziv}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-2 mb-2">
                        {novica.naslov}
                      </h3>
                      {novica.povzetek && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{novica.povzetek}</p>}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{novica.avtor}</span>
                        {novica.published_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDatum(novica.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
