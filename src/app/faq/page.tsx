'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Ship, Anchor, Compass, ShoppingBag, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

type Kategorija = 'kupci' | 'charterji' | 'skiperji' | 'splosno'

const faqData: Record<Kategorija, { v: string; o: string }[]> = {
  kupci: [
    { v: 'Kako poiščem plovilo?', o: 'Obiščite /plovila in uporabite filtre po tipu, ceni in dolžini. Vsak oglas ima kontaktne podatke prodajalca — pišite direktno ali pa se prijavite za chat.' },
    { v: 'Ali je objava oglasa brezplačna?', o: 'Osnovna objava je brezplačna. Za promoted/featured oglas in dodatne ugodnosti so na voljo plačljivi paketi. Cene bodo objavljene ob zagonu platforme.' },
    { v: 'Kako kontaktiram prodajalca?', o: 'Na vsaki detail strani plovila so kontaktni podatki (email, telefon). Za chat morate biti prijavljeni. Charter podjetja imajo javne kontakte, zasebniki prav tako.' },
    { v: 'Ali je platforma varna?', o: 'Plovila pregledujemo pred objavo. Priporočamo ogled plovila v živo pred nakupom. Garbin ne izvaja finančnih transakcij — dogovor je direktno med kupcem in prodajalcem.' },
    { v: 'Kako dodam plovilo v priljubljene?', o: 'Kliknite ❤️ ikono na kartici plovila. Priljubljenike najdete v svojem dashboardu pod "Priljubljena plovila". Zahteva registracijo in prijavo.' },
    { v: 'Ali lahko primerjam več plovil?', o: 'Da! Kliknite ikono "Primerjaj" na karticah (do 3 plovil). Ko imate izbrano vsaj 2, se prikaže gumb za primerjavo, ki odpre side-by-side pregled.' },
  ],
  charterji: [
    { v: 'Kako se registriram kot charter podjetje?', o: 'Obiščite /registracija in izberite vlogo "Charter". Po registraciji sledite onboarding procesu: profil → plovila → paket.' },
    { v: 'Koliko plovil lahko dodam?', o: 'Z Charter paketom neomejeno plovil v floti. Cene paketa bodo objavljene ob zagonu.' },
    { v: 'Kaj je "Verified badge"?', o: 'Verified badge potrjuje pristnost in zaupanje profila. Dodelimo ga po pregledu vašega profila in dokumentacije. Pospešuje zaupanje potencialnih strank.' },
    { v: 'Kako prejmem povpraševanja?', o: 'Stranke vas kontaktirajo direktno prek email/telefona ali prek chat sistema v aplikaciji (zahteva prijavo stranke).' },
    { v: 'Ali lahko objavim promocije?', o: 'Da. Pišite nam na info@garbin.si in skupaj pripravimo promocijsko kampanjo. Promocije so prikazane na /promocije in homepage-u.' },
  ],
  skiperji: [
    { v: 'Kako se registriram kot skipper?', o: 'Obiščite /registracija → "Skipper" → izberite tip (Samostojni skipper / Skipper agencija) → izpolnite profil.' },
    { v: 'Kaj je razlika med Samostojnim skipperjem in Skipper agencijo?', o: 'Samostojni skipper ima osebni profil z bio in feed-om. Skipper agencija ima firmski profil z ekipo skiperjev, JAVNIM kontaktom in broader presence. Kontakt Samostojnega je dostopen samo prijavljenim.' },
    { v: 'Kako objavim sliko v moj feed?', o: 'V dashboardu pod "Social feed" dodajte sliko in opis. Objava je vidna na vašem javnem profilu. Tuje objave na vašem profilu morate najprej odobriti.' },
    { v: 'Kako pridem do "Verified" statusa?', o: 'Po registraciji pošljite kopijo certifikatov (ICC, VHF, STCW...) na info@garbin.si. Preverimo in dodelimo badge v 2 delovnih dneh.' },
    { v: 'Ali je kontakt z mano javen?', o: 'Odvisno od tipa: Samostojni skipper — kontakt viden SAMO prijavljenim. Skipper agencija — kontakt JAVEN (email + telefon).' },
  ],
  splosno: [
    { v: 'V katerih jezikih je platforma?', o: 'Platforma je v slovenščini. V pripravi sta hrvaška in italijanska verzija. Jezik switcher je v navbaru (SLO / HR / IT) — ko bodo prevodi ready.' },
    { v: 'Ali ima Garbin mobilno aplikacijo?', o: 'Spletna stran je optimizirana za mobilne naprave. PWA (Progressive Web App) podpora pride kmalu — namestljiva na telefon brez App Store.' },
    { v: 'Kako prijavim napačen oglas?', o: 'Na vsaki detail strani je gumb za prijavo. Vse prijave pregledamo v 24 urah.' },
    { v: 'Kako izbrišem račun?', o: 'V nastavitvah računa (/dashboard/nastavitve) je opcija "Izbriši račun". Vse vaše podatke izbrišemo v skladu z GDPR v 30 dneh.' },
    { v: 'Kako ste v skladu z GDPR?', o: 'Hranimo samo nujne podatke. Nikoli ne prodajamo podatkov tretjim. Naša privacy policy je dostopna na dnu strani. Za vprašanja: info@garbin.si.' },
  ],
}

const kategorije: { id: Kategorija; label: string; ikona: React.ElementType; opis: string }[] = [
  { id: 'kupci', label: 'Za kupce', ikona: ShoppingBag, opis: 'Nakup in najem plovil' },
  { id: 'charterji', label: 'Za charterje', ikona: Ship, opis: 'Registracija, paketi, plovila' },
  { id: 'skiperji', label: 'Za skiperje', ikona: Compass, opis: 'Profil, feed, certifikati' },
  { id: 'splosno', label: 'Splošno', ikona: Anchor, opis: 'Jeziki, GDPR, aplikacija' },
]

function FaqItem({ v, o }: { v: string; o: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left bg-white hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-[#0c2340] text-sm leading-relaxed">{v}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#c9a84c] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-gray-50">
          <p className="text-gray-600 text-sm leading-relaxed pt-3">{o}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [aktivna, setAktivna] = useState<Kategorija>('kupci')

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[#0c2340] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Pogosta vprašanja</h1>
            <p className="text-white/70 text-lg">Odgovori na najpogostejša vprašanja kupcev, charterjev in skiperjev.</p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Kategorije */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {kategorije.map(({ id, label, ikona: Ikona, opis }) => (
                <button
                  key={id}
                  onClick={() => setAktivna(id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                    aktivna === id
                      ? 'border-[#c9a84c] bg-[#c9a84c]/8 text-[#0c2340]'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${aktivna === id ? 'bg-[#c9a84c]' : 'bg-gray-100'}`}>
                    <Ikona className={`w-5 h-5 ${aktivna === id ? 'text-[#0c2340]' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs opacity-60 mt-0.5">{opis}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* FAQ items */}
            <div className="space-y-3 mb-12">
              {faqData[aktivna].map(({ v, o }) => (
                <FaqItem key={v} v={v} o={o} />
              ))}
            </div>

            {/* CTA */}
            <div className="bg-[#0c2340] rounded-2xl p-8 text-center">
              <h3 className="font-display text-xl font-bold text-white mb-2">Niste našli odgovora?</h3>
              <p className="text-white/60 text-sm mb-5">Kontaktirajte nas direktno — odgovorili vam bomo v 24 urah.</p>
              <Link href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105">
                Pišite nam <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
