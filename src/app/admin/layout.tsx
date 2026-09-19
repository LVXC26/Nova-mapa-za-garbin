'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Ship, Anchor, Compass, Newspaper, Image, MapPin, Users, LogOut, ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', ikona: LayoutDashboard, exact: true },
  { href: '/admin/plovila', label: 'Plovila', ikona: Ship },
  { href: '/admin/charterji', label: 'Charterji', ikona: Anchor },
  { href: '/admin/skiperji', label: 'Skiperji', ikona: Compass },
  { href: '/admin/novice', label: 'Novice', ikona: Newspaper },
  { href: '/admin/bannerji', label: 'Bannerji', ikona: Image },
  { href: '/admin/zemljevid', label: 'Zemljevid', ikona: MapPin },
  { href: '/admin/uporabniki', label: 'Uporabniki', ikona: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOdprt, setMenuOdprt] = useState(false)

  function jeAktiven(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
  }

  const trenutni = navLinks.find(({ href, exact }) => jeAktiven(href, exact)) ?? navLinks[0]

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* SIDEBAR — samo na večjih zaslonih; na mobitelu ga nadomesti
          spustni meni spodaj (enak vzorec kot dashboard/layout.tsx). */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-gray-900 flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
          <Anchor className="w-5 h-5 text-[#c9a84c]" />
          <span className="font-display text-base font-semibold text-white">Garbin Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map(({ href, label, ikona: Ikona, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                jeAktiven(href, exact)
                  ? 'bg-[#c9a84c] text-[#0c2340]'
                  : 'text-gray-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <Ikona className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <Link href="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
            <LogOut className="w-4 h-4" />
            Nazaj na stran
          </Link>
        </div>
      </aside>

      {/* MOBILNA VRSTICA S SPUSTNIM MENIJEM — nadomesti sidebar pod lg */}
      <div className="lg:hidden sticky top-0 z-40 bg-gray-900">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-1.5 shrink-0">
            <Anchor className="w-5 h-5 text-[#c9a84c]" />
          </Link>

          <button
            onClick={() => setMenuOdprt(o => !o)}
            aria-expanded={menuOdprt}
            className="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/10 text-white text-sm font-medium"
          >
            <span className="flex items-center gap-2 min-w-0">
              <trenutni.ikona className="w-4 h-4 shrink-0 text-[#c9a84c]" />
              <span className="truncate">{trenutni.label}</span>
            </span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${menuOdprt ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {menuOdprt && (
          <>
            <div className="fixed inset-x-0 top-[52px] bottom-0 bg-black/30 z-30" onClick={() => setMenuOdprt(false)} />
            <nav className="absolute left-4 right-4 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 max-h-[70vh] overflow-y-auto">
              {navLinks.map(({ href, label, ikona: Ikona, exact }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOdprt(false)}
                  className={`flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    jeAktiven(href, exact)
                      ? 'bg-[#c9a84c]/15 text-[#0c2340]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Ikona className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setMenuOdprt(false)}
                className="flex items-center gap-3 mx-2 mt-1 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Nazaj na stran
              </Link>
            </nav>
          </>
        )}
      </div>

      <main className="flex-1 lg:ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
