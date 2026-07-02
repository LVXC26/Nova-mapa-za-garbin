'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Anchor, Mail, Phone, ArrowRight, CheckCircle, Globe, Link2 } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer className="bg-[#0c2340] text-white/70 mt-auto">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-white mb-1">
                Bodite na tekočem z morskimi novostmi
              </h3>
              <p className="text-sm text-white/60">Tedenske novice, novi oglasi in promocije — direktno v vaš nabiralnik.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-5 h-5" /> Uspešno naročeni! Hvala.
              </div>
            ) : (
              <form className="flex gap-2 w-full md:w-auto" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Vaš e-mail naslov"
                  className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-xl transition-all hover:scale-[1.02] shrink-0"
                >
                  Naroči se <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main 4-column footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Kolona 1 — Logo + opis + social */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Anchor className="w-6 h-6 text-[#c9a84c]" />
              <span className="font-display text-xl font-semibold text-white">Garbin</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Slovensko tržišče plovil. Kupite ali prodajte jadrnico, motorni čoln ali gumenjak z zaupanjem.
            </p>
            <div className="flex flex-col gap-2.5 text-sm mb-6">
              <a href="mailto:info@garbin.si" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <Mail className="w-4 h-4 text-[#c9a84c]" /> info@garbin.si
              </a>
              <a href="tel:+38651234567" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <Phone className="w-4 h-4 text-[#c9a84c]" /> +386 5 123 45 67
              </a>
            </div>
            {/* Social icons — placeholder links */}
            <div className="flex items-center gap-2">
              {[
                { label: 'Instagram', icon: '📸' },
                { label: 'Facebook', icon: '👥' },
                { label: 'LinkedIn', icon: '💼' },
                { label: 'TikTok', icon: '🎵' },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  title={label}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#c9a84c]/20 border border-white/10 hover:border-[#c9a84c]/40 flex items-center justify-center text-sm transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Jezik switcher */}
            <div className="mt-5 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              {['🇸🇮 SLO', '🇭🇷 HR', '🇮🇹 IT'].map(j => (
                <button
                  key={j}
                  className="text-xs text-white/50 hover:text-white transition-colors"
                >
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Kolona 2 — Navigacija */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Navigacija</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Plovila', href: '/plovila' },
                { label: 'Charter', href: '/charterji' },
                { label: 'Skiperji', href: '/skiperji' },
                { label: 'Rezervni deli', href: '/rezervni-deli' },
                { label: 'Promocije', href: '/promocije' },
                { label: 'Novice', href: '/novice' },
                { label: 'Jadranski zemljevid', href: '/zemljevid' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#c9a84c] hover:pl-1 transition-all duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolona 3 — Za podjetja */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Za podjetja</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Registracija charterja', href: '/registracija?vloga=charter' },
                { label: 'Skipper profil', href: '/registracija?vloga=skipper' },
                { label: 'Objavi plovilo', href: '/dashboard/dodaj-plovilo' },
                { label: 'Paketi & cenik', href: '/paketi' },
                { label: 'Oglaševanje', href: '/paketi' },
                { label: 'O nas', href: '/' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#c9a84c] hover:pl-1 transition-all duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolona 4 — Pravno */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Informacije</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Pogoji uporabe', href: '/' },
                { label: 'Politika zasebnosti', href: '/' },
                { label: 'Politika piškotkov', href: '/' },
                { label: 'Kontakt', href: '/' },
                { label: 'GDPR', href: '/' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#c9a84c] hover:pl-1 transition-all duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Garbin d.o.o. Vse pravice pridržane.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white/70 transition-colors">Pogoji</Link>
            <Link href="/" className="hover:text-white/70 transition-colors">Zasebnost</Link>
            <Link href="/" className="hover:text-white/70 transition-colors">Piškotki</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
