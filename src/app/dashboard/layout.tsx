'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Anchor, LayoutDashboard, Ship, PlusCircle, List, Settings, LogOut, ChevronRight, ChevronDown,
  UserCircle, MessageCircle, Star, Heart, Zap, Image
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'

type NavItem = { href: string; label: string; ikona: React.ElementType; exact?: boolean }

function getNavLinks(vloga: string | null): NavItem[] {
  switch (vloga) {
    case 'charter':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/moja-plovila', label: 'Moja plovila', ikona: Ship },
        { href: '/dashboard/dodaj-plovilo?tip=najem', label: 'Dodaj plovilo', ikona: PlusCircle },
        { href: '/dashboard/profil', label: 'Moj profil', ikona: UserCircle },
        { href: '/dashboard/feed', label: 'Feed & objave', ikona: Image },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    case 'skipper':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/profil', label: 'Moj profil', ikona: UserCircle },
        { href: '/dashboard/feed', label: 'Feed & objave', ikona: Image },
        { href: '/dashboard/ocene', label: 'Moje ocene', ikona: Star },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    case 'kupec':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/priljubljeni', label: 'Priljubljeni', ikona: Heart },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    default: // prodajalec
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/moja-plovila', label: 'Moji oglasi', ikona: List },
        { href: '/dashboard/dodaj-plovilo', label: 'Dodaj oglas', ikona: PlusCircle },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
  }
}

const vlogaLabele: Record<string, { label: string; barva: string }> = {
  charter: { label: 'Charter', barva: 'bg-blue-500' },
  skipper: { label: 'Skipper', barva: 'bg-[#c9a84c]' },
  prodajalec: { label: 'Prodajalec', barva: 'bg-emerald-500' },
  kupec: { label: 'Kupec', barva: 'bg-purple-500' },
  oba: { label: 'Charter & Prodajalec', barva: 'bg-[#c9a84c]' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, vloga, demoMode, odjavaDemo } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOdprt, setMenuOdprt] = useState(false)

  useEffect(() => {
    if (!user) router.push('/prijava')
  }, [user, router])

  async function odjava() {
    if (demoMode) {
      odjavaDemo()
    } else {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.refresh()
    }
    router.push('/')
  }

  const navLinks = getNavLinks(vloga)
  const ime = user?.user_metadata?.ime ?? user?.email ?? 'Uporabnik'
  const inicialke = ime.split(' ').map((d: string) => d[0]).slice(0, 2).join('').toUpperCase()
  const vlogaInfo = vlogaLabele[vloga ?? 'prodajalec'] ?? vlogaLabele.prodajalec
  const trenutni = navLinks.find(({ href, exact }) =>
    exact ? pathname === href : pathname.startsWith(href.split('?')[0]) && href !== '/dashboard'
  ) ?? navLinks[0]

  return (
    <div className="min-h-screen bg-[#f8fafc] lg:flex">
      {/* SIDEBAR — samo na večjih zaslonih; na mobitelu ga nadomesti spustni meni spodaj */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#0c2340] flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-white/10 group">
          <Anchor className="w-5 h-5 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-lg font-semibold text-white">Garbin</span>
        </Link>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-sm font-bold shrink-0">
              {inicialke || <UserCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{ime}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${vlogaInfo.barva}`} />
                <span className="text-xs text-white/50">{vlogaInfo.label}</span>
                {demoMode && (
                  <span className="text-xs text-amber-400 font-medium">DEMO</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigacija */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label, ikona: Ikona, exact }) => {
            const aktiven = exact ? pathname === href : pathname.startsWith(href) && href !== '/dashboard'
            const jeExact = exact && pathname === href
            const isAktiven = aktiven || jeExact

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isAktiven
                    ? 'bg-[#c9a84c] text-[#0c2340]'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                <Ikona className="w-4 h-4 shrink-0" />
                {label}
                {isAktiven && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Odjava */}
        <div className="px-3 pb-5">
          <button
            onClick={odjava}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {demoMode ? 'Izhod iz demo' : 'Odjava'}
          </button>
        </div>
      </aside>

      {/* MOBILNA VRSTICA S SPUSTNIM MENIJEM — nadomesti sidebar pod lg */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0c2340]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
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

          <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-xs font-bold shrink-0">
            {inicialke || <UserCircle className="w-4 h-4" />}
          </div>
        </div>

        {menuOdprt && (
          <>
            {/* Backdrop za zapiranje ob kliku izven menija */}
            <div className="absolute inset-x-0 top-full h-screen bg-black/30 z-30" onClick={() => setMenuOdprt(false)} />
            <nav className="absolute left-4 right-4 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 max-h-[70vh] overflow-y-auto">
              <div className="px-3 pb-2 mb-1 border-b border-gray-100 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${vlogaInfo.barva}`} />
                <span className="text-xs text-gray-500 font-medium">{ime} · {vlogaInfo.label}</span>
                {demoMode && <span className="text-xs text-amber-500 font-medium">DEMO</span>}
              </div>
              {navLinks.map(({ href, label, ikona: Ikona, exact }) => {
                const aktiven = exact ? pathname === href : pathname.startsWith(href) && href !== '/dashboard'
                const jeExact = exact && pathname === href
                const isAktiven = aktiven || jeExact

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOdprt(false)}
                    className={`flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isAktiven
                        ? 'bg-[#c9a84c]/15 text-[#0c2340]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Ikona className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                )
              })}
              <button
                onClick={() => { setMenuOdprt(false); odjava() }}
                className="w-full flex items-center gap-3 mx-2 mt-1 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {demoMode ? 'Izhod iz demo' : 'Odjava'}
              </button>
            </nav>
          </>
        )}
      </div>

      {/* VSEBINA */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {demoMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs text-amber-700 font-medium">Demo način — prijavljen kot {vlogaInfo.label}</span>
            <button onClick={() => router.push('/prijava')} className="ml-auto text-xs text-amber-600 underline hover:text-amber-800 shrink-0">
              Zamenjaj vlogo
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
