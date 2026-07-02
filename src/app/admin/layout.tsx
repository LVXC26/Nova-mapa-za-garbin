'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Ship, Anchor, Compass, Tag, Newspaper, Image, MapPin, Users, LogOut } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-56 shrink-0 bg-gray-900 flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
          <Anchor className="w-5 h-5 text-[#c9a84c]" />
          <span className="font-display text-base font-semibold text-white">Garbin Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map(({ href, label, ikona: Ikona, exact }) => {
            const aktiven = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
            const jeExact = exact && pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  aktiven || jeExact
                    ? 'bg-[#c9a84c] text-[#0c2340]'
                    : 'text-gray-400 hover:text-white hover:bg-white/8'
                }`}
              >
                <Ikona className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-5">
          <Link href="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
            <LogOut className="w-4 h-4" />
            Nazaj na stran
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
