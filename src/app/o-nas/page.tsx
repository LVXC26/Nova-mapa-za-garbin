import type { Metadata } from 'next'
import Link from 'next/link'
import { Anchor, Target, Heart, Shield, ArrowRight, Mail, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'O nas | Garbin',
  description: 'Spoznajte ekipo za Garbin — slovenskim tržiščem plovil. Naša misija, vrednote in vizija.',
}

const ekipa = [
  { ime: 'Matej Škulj', vloga: 'Soustanovitelj & CEO', bio: 'Strasten jadralec z vizijo digitalizacije jadranskega trga plovil.', ikona: '👨‍💼' },
  { ime: 'Andrej Marinič', vloga: 'CTO', bio: 'Izkušen razvijalec z ljubeznijo do morja in čiste kode.', ikona: '👨‍💻' },
  { ime: 'Maja Horvat', vloga: 'Head of Partnerships', bio: 'Gradi mostove med charter podjetji in platformo.', ikona: '👩‍💼' },
  { ime: 'Luka Benedičič', vloga: 'Marketing Manager', bio: 'Navdušen marketingaš ki vidi priložnosti v vsakem valu.', ikona: '🎯' },
]

const vrednote = [
  { ikona: '⚓', naslov: 'Zaupanje', opis: 'Vsak oglas preverimo. Vsak prodajalec je odgovoren. Varnost pri transakcijah je naša prioriteta.' },
  { ikona: '🌊', naslov: 'Dostopnost', opis: 'Platforma dostopna vsakomur — od zasebniku z enim čolnom do profesionalnih charter podjetij.' },
  { ikona: '🧭', naslov: 'Skupnost', opis: 'Gradimo skupnost jadralcev, skipperjev in ljubiteljev morja. Skupaj je lažje.' },
  { ikona: '⛵', naslov: 'Strast', opis: 'Sami ljubimo morje. Zato vemo, kaj iščete, in zato naredimo platformo, ki jo sami z veseljem uporabljamo.' },
]

export default function ONasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="bg-[#0c2340] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#1e3a5f]/80 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-6">
              <Anchor className="w-4 h-4" /> O nas
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Gradimo prihodnost<br />
              <span className="text-[#c9a84c]">jadranskega trga plovil</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Garbin je slovensko digitalno tržišče plovil — edina platforma, ki povezuje kupce, prodajalce, charter podjetja in skiperje na enem mestu.
            </p>
          </div>
        </section>

        {/* MISIJA */}
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium mb-4">
                  <Target className="w-4 h-4" /> Naša misija
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-5">
                  Morje dostopno vsakomur
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-5">
                  Naša misija je poenostaviti nakup, prodajo in najem plovil v jadranskem prostoru. Verjamemo, da mora biti morje dostopno vsakomur — ne samo tistim, ki poznajo prave ljudi.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Garbin je nastala iz osebne izkušnje: iskanje plovila je bila frustrirajoča, nepregledna izkušnja. Odločili smo se, da to spremenimo. Z zaupanjem, transparentnostjo in skupnostjo.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { st: '240+', opis: 'Aktivnih oglasov' },
                  { st: '1.200+', opis: 'Zadovoljnih kupcev' },
                  { st: '35+', opis: 'Charter partnerjev' },
                  { st: '6', opis: 'Verificiranih skiperjev' },
                ].map(({ st, opis }) => (
                  <div key={opis} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <p className="font-display text-4xl font-bold text-[#0c2340] mb-1">{st}</p>
                    <p className="text-sm text-gray-500">{opis}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VREDNOTE */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-[#c9a84c] text-sm font-medium mb-3">
                <Heart className="w-4 h-4" /> Naše vrednote
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340]">
                Kar nam je pomembno
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vrednote.map(({ ikona, naslov, opis }) => (
                <div key={naslov} className="text-center p-6 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="text-4xl mb-4">{ikona}</div>
                  <h3 className="font-display text-lg font-bold text-[#0c2340] mb-2">{naslov}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{opis}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EKIPA */}
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0c2340] mb-3">Ekipa za Garbinom</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Majhna ekipa z velikimi ambicijami in še večjo ljubeznijo do morja.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ekipa.map(({ ime, vloga, bio, ikona }) => (
                <div key={ime} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="w-20 h-20 rounded-2xl bg-[#0c2340]/8 flex items-center justify-center text-4xl mx-auto mb-4">{ikona}</div>
                  <h3 className="font-display text-lg font-semibold text-[#0c2340] mb-0.5">{ime}</h3>
                  <p className="text-xs text-[#c9a84c] font-semibold mb-3 uppercase tracking-wide">{vloga}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOKACIJA */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Najdete nas v Portorožu</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <MapPin className="w-4 h-4 text-[#c9a84c]" /> Obala 14, 6320 Portorož, Slovenija
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail className="w-4 h-4 text-[#c9a84c]" /> info@garbin.si
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/kontakt"
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-full transition-all hover:scale-105">
                  Kontaktirajte nas <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/paketi"
                  className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#0c2340] text-[#0c2340] font-semibold rounded-full hover:bg-[#0c2340] hover:text-white transition-all">
                  Paketi
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
