import Link from 'next/link'
import { CheckCircle, Ship, Compass, Tag, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const paketi = [
  {
    id: 'charter',
    naziv: 'Charter paket',
    ikona: Ship,
    emoji: '⛵',
    cena: 'TBD',
    opis: 'Za charter podjetja in zasebnike, ki oddajajo plovila v najem.',
    barva: 'bg-[#0c2340]',
    besedilo: 'text-white',
    poudarjen: false,
    benefiti: [
      'Neomejena plovila v floti',
      'Verified badge na profilu',
      'Prioritetni prikaz v iskanju',
      'Real-time chat s strankami',
      'Analitika ogledov in povpraševanj',
      'Podpora 7 dni v tednu',
    ],
    cta: 'Izberi Charter paket',
    href: '/registracija?vloga=charter',
  },
  {
    id: 'skipper',
    naziv: 'Skipper paket',
    ikona: Compass,
    emoji: '🧭',
    cena: 'TBD',
    opis: 'Za profesionalne skiperje, ki iščejo stranke na platformi.',
    barva: 'bg-[#c9a84c]',
    besedilo: 'text-[#0c2340]',
    poudarjen: true,
    benefiti: [
      'Profesionalni skipper profil',
      'Prikaz certifikatov in ocen',
      'Verified badge',
      'Real-time chat s strankami',
      'Rating in reviews sistem',
      'Prioriteta v iskalnih rezultatih',
    ],
    cta: 'Izberi Skipper paket',
    href: '/registracija?vloga=skipper',
  },
  {
    id: 'oglas',
    naziv: 'Oglas za plovilo',
    ikona: Tag,
    emoji: '🏷️',
    cena: 'TBD',
    opis: 'Posamičen oglas za prodajo ali najem plovila. Plačilo per oglas.',
    barva: 'bg-white',
    besedilo: 'text-[#0c2340]',
    poudarjen: false,
    benefiti: [
      'Oglas viden 90 dni',
      'Do 20 fotografij',
      'Kontaktna forma za kupce',
      'Delitev na socialnih omrežjih',
      'Osnovna analitika ogledov',
      'Email notifikacije',
    ],
    cta: 'Dodaj oglas',
    href: '/dashboard/dodaj-plovilo',
  },
]

export default function PaketiPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-6">
              💎 Paketi in cenik
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Izberite pravi paket
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Transparentne cene brez skritih stroškov. Plačajte samo za to, kar resnično potrebujete.
            </p>
          </div>
        </section>

        {/* PAKETI */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paketi.map((paket) => {
                const Ikona = paket.ikona
                return (
                  <div
                    key={paket.id}
                    className={`relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      paket.poudarjen
                        ? 'border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20'
                        : 'border-gray-200 shadow-sm'
                    }`}
                  >
                    {paket.poudarjen && (
                      <div className="absolute top-0 left-0 right-0 bg-[#c9a84c] text-[#0c2340] text-xs font-bold text-center py-1.5 tracking-wide uppercase">
                        Priporočeno
                      </div>
                    )}

                    <div className={`${paket.barva} p-8 ${paket.poudarjen ? 'pt-10' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${
                        paket.poudarjen ? 'bg-[#0c2340]/20' : paket.id === 'charter' ? 'bg-white/10' : 'bg-[#0c2340]/5'
                      }`}>
                        {paket.emoji}
                      </div>
                      <h2 className={`font-display text-2xl font-bold mb-2 ${paket.besedilo}`}>{paket.naziv}</h2>
                      <p className={`text-sm mb-6 ${paket.poudarjen ? 'text-[#0c2340]/70' : paket.id === 'charter' ? 'text-white/60' : 'text-gray-500'}`}>
                        {paket.opis}
                      </p>
                      <div className={`text-4xl font-display font-bold mb-1 ${paket.besedilo}`}>
                        {paket.cena}
                      </div>
                      <p className={`text-sm ${paket.poudarjen ? 'text-[#0c2340]/60' : paket.id === 'charter' ? 'text-white/40' : 'text-gray-400'}`}>
                        Cena kmalu na voljo
                      </p>
                    </div>

                    <div className="bg-white p-8 flex-1">
                      <ul className="space-y-3 mb-8">
                        {paket.benefiti.map((b) => (
                          <li key={b} className="flex items-center gap-3 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={paket.href}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 font-semibold rounded-full transition-all hover:scale-[1.02] text-sm ${
                          paket.poudarjen
                            ? 'bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340]'
                            : paket.id === 'charter'
                            ? 'bg-[#0c2340] hover:bg-[#1e3a5f] text-white'
                            : 'border-2 border-[#0c2340] text-[#0c2340] hover:bg-[#0c2340] hover:text-white'
                        }`}
                      >
                        {paket.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Opomba */}
            <p className="text-center text-sm text-gray-400 mt-10">
              Cene so informativne in bodo objavljene ob uradnem zagonu platforme.
              Za vprašanja pišite na <a href="mailto:info@garbin.si" className="text-[#c9a84c] hover:underline">info@garbin.si</a>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-[#0c2340] text-center mb-10">Pogosta vprašanja</h2>
            <div className="space-y-4">
              {[
                { v: 'Ali je registracija brezplačna?', o: 'Da, osnovna registracija in ustvarjanje profila je brezplačno. Plačilni paketi so namenjeni naprednim funkcijam in večji vidnosti.' },
                { v: 'Kdaj bodo cene objavljene?', o: 'Cene bodo objavljene ob uradnem zagonu platforme. Vsi, ki se registrirajo v beta fazi, bodo deležni posebnih pogojev.' },
                { v: 'Ali so moji podatki varni?', o: 'Da. Vse podatke hranimo varno v skladu z GDPR. Za več info si oglejte našo politiko zasebnosti.' },
                { v: 'Ali lahko zamenjam paket?', o: 'Pakete bo možno zamenjati kadarkoli brez dodatnih stroškov.' },
              ].map(({ v, o }) => (
                <div key={v} className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-[#0c2340] mb-2">{v}</h3>
                  <p className="text-gray-500 text-sm">{o}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
